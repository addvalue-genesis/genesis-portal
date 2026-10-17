"""PJ2601-0510: template-preserving SAT document service. Run from repository root.
Requires local master DOCX and approved diagram copied to the paths in README.
"""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree
import json,subprocess,shutil,os
ROOT=Path(__file__).resolve().parent
NS={"w":"http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
def paragraph_replace(p,old,new):
    nodes=p.xpath(".//w:t",namespaces=NS)
    if not nodes:return False
    txt="".join(n.text or "" for n in nodes)
    if old not in txt:return False
    # Run-safe: keep style of first run; do not rebuild table or paragraph objects.
    txt=txt.replace(old,str(new))
    nodes[0].text=txt
    for n in nodes[1:]:n.text=""
    return True
def render(data):
    template=ROOT/"templates"/"PTTEP_SAT_project_references.docx"
    pic=ROOT/"assets"/"network_zms_ms.png"
    for p in [template,pic]:
        if not p.is_file():raise FileNotFoundError("Required PTTEP master asset missing: "+str(p))
    out=ROOT/"output";out.mkdir(exist_ok=True)
    target=out/"PJ2601-0510_SAT_WORKING.docx"
    sites=data["sites"]
    swap={
       "10.15.160.224":sites[0]["radio_ip"],
       "10.15.160.225":sites[1]["radio_ip"],
       "PTP1 ZOC-ZMS":"PTP1 ZMS-MS",
       "PTP1 ZOC - ZMS":"PTP1 ZMS-MS",
       "ZOC and ZMS":"ZMS and MS",
       "ZOC-ZMS":"ZMS-MS",
       "ZMS and ZMS":"ZMS and MS",
       "13005416301":data["po_number"]
    }
    with ZipFile(template) as src:
        files={info.filename:src.read(info.filename) for info in src.infolist()}
    for name,raw in list(files.items()):
        if not(name.startswith("word/") and name.endswith(".xml")):continue
        try:root=etree.fromstring(raw)
        except etree.XMLSyntaxError:continue
        dirty=False
        for p in root.xpath("//w:p",namespaces=NS):
            for old,new in swap.items():
                if paragraph_replace(p,old,new):dirty=True
            nodes=p.xpath(".//w:t",namespaces=NS)
            if nodes and "".join(n.text or "" for n in nodes).strip().lower()=="pass":
                nodes[0].text="NOT TESTED"
                for n in nodes[1:]:n.text=""
                dirty=True
        if dirty:files[name]=etree.tostring(root,xml_declaration=True,encoding="UTF-8",standalone=True)
    # The selected figure replaces the source embedded diagram without changing its
    # OOXML extent or the existing table geometry.
    if "word/media/image7.png" not in files:raise RuntimeError("Master document figure mapping changed")
    files["word/media/image7.png"]=pic.read_bytes()
    with ZipFile(target,"w",ZIP_DEFLATED) as z:
        for name,raw in files.items():z.writestr(name,raw)
    pdf=target.with_suffix(".pdf")
    exe=shutil.which("soffice") or shutil.which("libreoffice")
    if not exe:raise RuntimeError("DOCX generated but LibreOffice (soffice) is not available for page preview")
    r=subprocess.run([exe,"-env:UserInstallation=file:///tmp/sat0510_"+str(os.getpid()),"--headless","--convert-to","pdf","--outdir",str(out),str(target)],capture_output=True,text=True,timeout=120)
    if r.returncode or not pdf.is_file():raise RuntimeError("DOCX generated; PDF conversion failed: "+r.stderr[-300:])
    return {"pages":"inspect PDF for actual count","docx":str(target),"pdf":str(pdf)}
