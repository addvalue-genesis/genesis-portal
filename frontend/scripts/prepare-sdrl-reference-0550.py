"""Read-only compilation of visually checked MR B1 Appendix 3 source tables.
Run with the supplied 853560-byte native PDF, never a different revision.
"""
import hashlib,json,re,sys
from pathlib import Path
import pdfplumber

source=Path(sys.argv[1]);assert hashlib.sha256(source.read_bytes()).hexdigest()=='5199bb61c01db86f7c971117ad5e54b7d04e70061d6ad999b72f858122a0de5a','Native MR B1 changed; inspect before recompiling'
pdf=pdfplumber.open(source);rows=[];group=''
for page_index in range(38,42):
    page=pdf.pages[page_index];table=max(page.find_tables(),key=lambda t:len(t.rows));cells=table.extract()
    bid=next(i for r in cells for i,v in enumerate(r) if v=='WITH BID')
    for index,c in enumerate(cells):
        code=(c[0] or '').strip();description=' '.join(str(x).replace('\n',' ') for x in c[1:bid] if x).strip()
        if re.fullmatch('[A-D]',code):group=description;continue
        if re.fullmatch(r'[A-D][0-9]{2}(?:\.[0-9]+)?',code):
            bbox=table.rows[index].bbox
            red=any(isinstance(ch.get('non_stroking_color'),(tuple,list)) and len(ch['non_stroking_color'])>=3 and ch['non_stroking_color'][0]>.8 and max(ch['non_stroking_color'][1:3])<.3 for ch in page.chars if bbox[1]<=ch['top']<bbox[3])
            rows.append({'code':code,'title':description,'group':group,'withBid':c[bid] or '', 'review':c[-2] or '', 'submission':(c[-1] or '').replace('\n',' '),'pdfPage':page_index+1,'printedPage':page_index-1,'redText':red})
        elif rows and not code and description and 'SDRL' not in description and description!='including, but not limited to:':
            # Continuation lines share their preceding code; duplicate R/P+4
            # marks in the printed source remain in the preceding record.
            if index>7:rows[-1]['title']+=' '+description
assert rows[0]['code']=='A01' and rows[-1]['code']=='D09'
assert len({r['code'] for r in rows})==len(rows)
assert all(not r['withBid'] for r in rows),'With Bid markings changed; inspect new source'
result={'source':{'documentNo':'MM-ASK-1A-APF-TEL-MR-0001','revision':'B1','sourceUrl':'https://drive.google.com/file/d/1KFCSSo3D50fAS6LUBz0IYKPG4NjGVcDS/view','sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'pdfPages':[39,40,41,42],'printedPages':[37,38,39,40],'scope':'Appendix 3 native reference, not workspace authority selection','withBidNote':'With Bid column is unmarked in all extracted rows; Invitation section 4 remains a separate bid obligation.'},'rows':rows}
dest=Path(__file__).resolve().parents[1]/'src/project0550/data/sdrlReference0550.json';dest.write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
print('Prepared',len(rows),'native SDRL codes; With Bid unmarked:',sum(not r['withBid'] for r in rows))
