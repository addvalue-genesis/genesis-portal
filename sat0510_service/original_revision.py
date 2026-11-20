"""PTTEP SAT existing-document preservation pipeline.
No recreation of text, tables, or drawings. Retains original DOCX relationships.
The input master is a local file from the customer's SAT, never overwritten.
"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree
import subprocess, shutil, os, uuid

ROOT=Path(__file__).resolve().parent
WORD_NS="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS={"w":WORD_NS}
OUT=ROOT/"output"

def replace_preserving_runs(paragraph, old, new):
    nodes=paragraph.xpath(".//w:t",namespaces=NS)
    if not nodes:return False
    contents=[n.text or "" for n in nodes]
    full="".join(contents)
    if old not in full:return False
    # Only mutate the exact character spans; retain text-run formatting outside replacement.
    start=0
    while True:
        pos=full.find(old,start)
        if pos<0:break
        end=pos+len(old)
        offsets=[]
        p=0
        for text in contents:
            offsets.append((p,p+len(text)));p+=len(text)
        first=next(i for i,(a,b) in enumerate(offsets) if a<=pos<b)
        last=next(i for i,(a,b) in enumerate(offsets) if a<end<=b)
        a=offsets[first][0]; b=offsets[last][0]
        contents[first]=contents[first][:pos-a]+new+(contents[last][end-b:] if first==last else "")
        for i in range(first+1,last):contents[i]=""
        if last!=first:contents[last]=contents[last][end-b:]
        full="".join(contents)
        start=pos+len(new)
    for node,value in zip(nodes,contents):node.text=value
    return True

def modify_docx(source, destination, image):
    with ZipFile(source) as z:
        entries={x.filename:z.read(x.filename) for x in z.infolist()}
    # Section data is retained. Avoid reconstruction of pre-existing header tables,
    # which are actually body content in the submitted document.
    substitutions=[
        ("RFQ No. 13005416301 - Provision of Wi-Max communication system between ZMS and MS",
         "Service Order No. 3450075822 - Provision of Wi-Max Communication System for the ZMS-MS Point-to-Point Wireless Communication Link Upgrade"),
        ("RFQ No. 13005416301 - Provision of Wi-Max communication system between ZOC and ZMS",
         "Service Order No. 3450075822 - Provision of Wi-Max Communication System for the ZMS-MS Point-to-Point Wireless Communication Link Upgrade"),
        ("P.O. NO. MM-ZTK-1A-ONEP-SAT-001","P.O. NO. 3450075822"),
        ("PTP1 ZOC-ZMS","PTP1 ZMS-MS"),
        ("ZOC and ZMS","ZMS and MS"),
        ("ZMS and ZMS","ZMS and MS"),
        ("SITE ACCEPTANCE TEST(FAT)","SITE ACCEPTANCE TEST(SAT)")
    ]
    for name,raw in list(entries.items()):
        if not name.startswith("word/") or not name.endswith(".xml"):continue
        try:xml=etree.fromstring(raw)
        except etree.XMLSyntaxError:continue
        dirty=False
        for p in xml.xpath("//w:p",namespaces=NS):
            for old,new in substitutions:
                dirty=replace_preserving_runs(p,old,new) or dirty
        if dirty:entries[name]=etree.tostring(xml,encoding="UTF-8",xml_declaration=True,standalone=True)
    # image7.png is the old ZOC-ZMS network topology in SAT source revision.
    # Keep the exact DrawingML dimensions & placement; change only the image bytes.
    if "word/media/image7.png" not in entries:raise RuntimeError("Original Network Diagram image mapping changed; aborting replacement")
    entries["word/media/image7.png"]=image.read_bytes()
    with ZipFile(destination,"w",ZIP_DEFLATED) as z:
        for name,raw in entries.items():z.writestr(name,raw)
    return {"preservedParts":len(entries),"diagram":"word/media/image7.png"}

def render(data):
    master=ROOT/"templates"/"PTTEP_SAT_original.docx"
    diagram=ROOT/"assets"/"network_zms_ms.png"
    if not master.exists():raise FileNotFoundError("Copy original 15-10-26 SAT to sat0510_service/templates/PTTEP_SAT_original.docx")
    if not diagram.exists():raise FileNotFoundError("Missing sat0510_service/assets/network_zms_ms.png")
    OUT.mkdir(exist_ok=True)
    target=OUT/"PJ2601-0510_SAT_WORKING.docx"
    detail=modify_docx(master,target,diagram)
    exe=shutil.which("soffice")
    if not exe:
        possible=Path(os.environ.get("PROGRAMFILES",r"C:\Program Files"))/"LibreOffice"/"program"/"soffice.exe"
        if possible.exists():exe=str(possible)
    if not exe:raise RuntimeError("DOCX created but LibreOffice could not be located")
    profile=(OUT/("lo_profile_"+uuid.uuid4().hex)).resolve().as_uri()
    cp=subprocess.run([exe,"-env:UserInstallation="+profile,"--headless","--convert-to","pdf","--outdir",str(OUT),str(target)],capture_output=True,text=True,timeout=120)
    if cp.returncode or not target.with_suffix(".pdf").exists():raise RuntimeError("PDF conversion failed: "+cp.stderr[-500:])
    return {"docx":str(target),"pdf":str(target.with_suffix(".pdf")),"mode":"preserve-original-docx",**detail}
