"""Compile the supplied Exhibit C rev-0 into matching HTML/OOXML templates.

Read-only source; generated file is repository data, not project workspace state.
Usage: primary-runtime-python this-script.py path/to/Exhibit-C.docx
"""
import base64
import copy
import hashlib
import html
import json
import re
import sys
import zipfile
from pathlib import Path
from lxml import etree as E

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
NS = {'w': W}
q = lambda n: '{' + W + '}' + n
text = lambda e: ''.join(e.itertext()) if False else ''.join(e.xpath('.//w:t/text()', namespaces=NS))
source = Path(sys.argv[1])
archive = zipfile.ZipFile(source)
root = E.fromstring(archive.read('word/document.xml'))
body = root.find(q('body'))
starts = {'A':76,'A1':84,'A2':98,'B':103,'C':128,'C1':130,'C2':136,'C3':141,'C4':147,'C5':152,'C6':157,'C7':161,'C8':172}
tables = {'A1':87,'A2':100,'B':110,'C1':132,'C2':138,'C3':143,'C4':149,'C5':154,'C6':159,'C7':165,'C8':174}
heads = {'A1':2,'A2':3,'B':1,'C1':2,'C2':4,'C3':4,'C4':4,'C5':2,'C6':2,'C7':1,'C8':1}
data_rows = {'A1':range(2,12),'A2':range(3,8),'C1':range(2,34),'C2':range(4,11),'C3':range(4,11),'C4':range(4,11),'C5':range(2,9),'C6':range(2,9),'C7':[1,2,3,4,6,7,8,9],'C8':range(1,6)}
pages = {'A':4,'A1':5,'A2':7,'B':8,'C':10,'C1':10,'C2':12,'C3':13,'C4':14,'C5':15,'C6':16,'C7':17,'C8':18}
defaults = {}
note_numbers = {}
for sid,index in starts.items():
    assert text(body[index]).strip().startswith('SCHEDULE '+sid), 'Source layout changed: '+sid
for sid,index in tables.items():
    assert body[index].tag==q('tbl'), 'Source table changed: '+sid

def token_cell(tc, key, prefix=''):
    defaults[key] = text(tc)
    p = tc.find(q('p'))
    old_r = p.find(q('r')) if p is not None else None
    ppr = copy.deepcopy(p.find(q('pPr'))) if p is not None and p.find(q('pPr')) is not None else None
    rpr = copy.deepcopy(old_r.find(q('rPr'))) if old_r is not None and old_r.find(q('rPr')) is not None else None
    for child in list(tc):
        if child.tag != q('tcPr'): tc.remove(child)
    p = E.SubElement(tc,q('p'))
    if ppr is not None: p.append(ppr)
    r = E.SubElement(p,q('r'))
    if rpr is not None: r.append(rpr)
    t = E.SubElement(r,q('t')); t.set('{http://www.w3.org/XML/1998/namespace}space','preserve')
    t.text = prefix + '{{' + key + '}}'

def run_html(r):
    bits=[]
    for e in r.iter():
        if e.tag==q('t'): bits.append(html.escape(e.text or ''))
        elif e.tag==q('br') and e.get(q('type'))!='page': bits.append('<br>')
        elif e.tag==q('tab'): bits.append(' ')
    s=''.join(bits)
    if r.find('.//'+q('b')) is not None: s='<b>'+s+'</b>'
    if r.find('.//'+q('i')) is not None: s='<i>'+s+'</i>'
    styles=[]
    color=r.find('./w:rPr/w:color',NS)
    if color is not None and re.fullmatch('[0-9A-Fa-f]{6}',color.get(q('val')) or ''):styles.append('color:#'+color.get(q('val')))
    underline=r.find('./w:rPr/w:u',NS)
    if underline is not None and underline.get(q('val')) not in ['none','0']:styles.append('text-decoration:underline')
    highlight=r.find('./w:rPr/w:highlight',NS)
    if highlight is not None and highlight.get(q('val'))=='yellow':styles.append('background:#ffff00')
    if styles:s='<span style="'+';'.join(styles)+'">'+s+'</span>'
    return s

def paragraph(p):
    s=''.join(run_html(r) for r in p.findall(q('r')))
    if not s.strip(): return ''
    if text(p).strip().startswith('SCHEDULE '): return '<h2>'+s+'</h2>'
    num=p.find('./w:pPr/w:numPr/w:numId',NS)
    if num is not None:
        nid=num.get(q('val'))
        if nid in ['11','12']:
            note_numbers[nid]=note_numbers.get(nid,0)+1
            s=str(note_numbers[nid])+') '+s
        elif nid=='4': s='• '+s
    jc=p.find('./w:pPr/w:jc',NS)
    align=jc.get(q('val')) if jc is not None else ''
    style=' style="text-align:'+align+'"' if align in ['center','right'] else ''
    return '<p'+style+'>'+s+'</p>'

def table_html(tb, sid):
    widths=[int(e.get(q('w'))) for e in tb.findall('./w:tblGrid/w:gridCol',NS)]
    total=sum(widths); rows=[]; active={}
    for ri,tr in enumerate(tb.findall(q('tr'))):
        cells=[]; ci=0
        for tc in tr.findall(q('tc')):
            span=tc.find('./w:tcPr/w:gridSpan',NS); span=int(span.get(q('val'))) if span is not None else 1
            vm=tc.find('./w:tcPr/w:vMerge',NS)
            if vm is not None and vm.get(q('val'))!='restart':
                if ci in active: active[ci]['rowspan']+=1
            else:
                c={'span':span,'rowspan':1,'html':''.join(paragraph(p) for p in tc.findall(q('p')))}
                cells.append(c)
                if vm is not None: active[ci]=c
                else: active.pop(ci,None)
            ci+=span
        rows.append(cells)
    def row(cells):
        return '<tr>'+''.join('<td'+(' colspan="'+str(c['span'])+'"' if c['span']>1 else '')+(' rowspan="'+str(c['rowspan'])+'"' if c['rowspan']>1 else '')+'>'+c['html']+'</td>' for c in cells)+'</tr>'
    n=heads[sid]
    return '<table aria-label="Schedule '+sid+' preview"><colgroup>'+''.join('<col style="width:'+str(round(x/total*100,4))+'%">' for x in widths)+'</colgroup><thead>'+''.join(row(r) for r in rows[:n])+'</thead><tbody>'+''.join(row(r) for r in rows[n:])+'</tbody></table>'

schedule_templates={}
ids=list(starts)
for ix,sid in enumerate(ids):
    note_numbers.clear()
    start=starts[sid]; end=starts[ids[ix+1]] if ix+1<len(ids) else len(body)-1
    nodes=[copy.deepcopy(e) for e in list(body)[start:end]]
    if sid in tables:
        tb=nodes[tables[sid]-start]
        trs=tb.findall(q('tr'))
        for ri in data_rows.get(sid,[]):
            for ci,tc in enumerate(trs[ri].findall(q('tc'))):
                # Preserve fixed row labels/numbers; dynamic descriptions in C1/C5/C6 are replaced.
                if sid in ['A1','A2','C8'] and ci<3 and not(sid=='A2' and ri in [6,7] and ci==1): continue
                if sid=='C7' and ci in [0,1,6]: continue
                token_cell(tc,f'{sid}_{ri}_{ci}')
        if sid in ['A1','A2','C1','C7','C8']:
            targets={'A1':[(12,1)],'A2':[(8,2),(9,2)],'C1':[(34,1)],'C7':[(5,1),(10,1),(11,1),(1,6),(6,6)],'C8':[(6,1)]}[sid]
            for ri,ci in targets: token_cell(trs[ri].findall(q('tc'))[ci],f'{sid}_{ri}_{ci}')
        if sid in ['C2','C3','C4']:
            for ri,ci in [(0,0),(0,1),(0,2),(0,3),(1,1)]:
                tc=trs[ri].findall(q('tc'))[ci]; prefix=text(tc)+'\n'
                token_cell(tc,f'{sid}_{ri}_{ci}',prefix)
    # Extra narrative response remains outside the contractual table.
    last_content=max(i for i,e in enumerate(nodes) if text(e).strip() or e.tag==q('tbl'))
    raw=''.join(E.tostring(e,encoding='unicode')+('{{NATIVE_RESPONSE}}' if i==last_content else '') for i,e in enumerate(nodes))
    rendered=''.join(table_html(e,sid) if e.tag==q('tbl') else paragraph(e) for e in nodes)
    schedule_templates[sid]={'xml':raw,'html':rendered,'page':pages[sid]}

# Replace each source schedule with a single block token. Legal introductory
# content, section properties, logo, styles, numbering and headers remain native.
prefix=''.join(E.tostring(e,encoding='unicode') for e in list(body)[:starts['A']])
suffix=E.tostring(body[-1],encoding='unicode')
doc_start=archive.read('word/document.xml').decode().split('<w:body>')[0]+'<w:body>'
document=doc_start+prefix+''.join('{{SCHEDULE_'+s+'_XML}}' for s in ids)+suffix+'</w:body></w:document>'
parts={}; binary={}
for name in archive.namelist():
    if name=='word/document.xml': continue
    b=archive.read(name)
    if name.endswith(('.xml','.rels')):parts[name]=b.decode('utf-8-sig')
    else:binary[name]=base64.b64encode(b).decode()
# The supplied footer has a hard-coded total (18/19), which becomes false for
# individual/continued forms. Keep typography and reference the last numbered
# page, so front matter/virtual blank pages do not inflate the commercial total.
for name in ['word/footer5.xml','word/footer6.xml']:
    footer=E.fromstring(parts[name].encode())
    ts=footer.findall('.//'+q('t')); of=next(i for i,t in enumerate(ts) if (t.text or '').strip()=='of')
    runs=[t.getparent() for t in ts[of+1:]]
    if runs:
        first=runs[0]; parent=first.getparent(); field=E.Element(q('fldSimple'));field.set(q('instr'),'PAGEREF PJ0550_EXHIBIT_END')
        run=copy.deepcopy(first)
        for t in run.findall(q('t')):t.text='18'
        field.append(run);parent.insert(parent.index(first),field)
        for run in runs:run.getparent().remove(run)
    parts[name]=E.tostring(footer,encoding='unicode')
parts['word/settings.xml']=parts['word/settings.xml'].replace('</w:settings>','<w:updateFields w:val="true"/></w:settings>')
result={'source':'3 Exhibit C-Commercial Terms rev-0.docx','sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'document':document,'parts':parts,'binary':binary,'schedules':schedule_templates,'defaults':defaults}
dest=Path(__file__).resolve().parents[1]/'src/project0550/data/exhibitCNativeTemplate0550.json'
dest.write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n')
print('Prepared native Exhibit C:',len(schedule_templates),'schedules;',dest.stat().st_size,'bytes')
