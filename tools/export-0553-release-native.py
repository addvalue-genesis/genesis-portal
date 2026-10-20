#!/usr/bin/env python3
"""PJ2608-0553 / 10.3: GATED customer release onto a COPY of original XLSX.
Never write to the source. Uses artifact_tool to edit, verifies geometry via
read-only native XLSX XML inspection. No extra worksheet/cell/format changes.
No 10.2 Working SELL -> C cost promotion, no historical Rev08 auto-pricing.

Example:
 python tools/export-0553-release-native.py --template "4-Scope of Supply.xlsx" \\
   --approved-payload "signed_release_cell_mapping.json" --output "customer-approved.xlsx"
"""
import argparse
import hashlib
import json
import math
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
from artifact_tool import Blob, SpreadsheetFile

SHEETS=("Scope of supply","B10 CommSpares","B11 SpecialTool",
        "B13 Consumerables","C1 CapitalSpares","C2 2Y-Spares")
NS="{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
SCOPE_ANNEX={"B10":33,"B11":34,"B13":36,"C1":41,"C2":42}
SHEET_BY_CODE={"B10":"B10 CommSpares","B11":"B11 SpecialTool",
               "B13":"B13 Consumerables","C1":"C1 CapitalSpares","C2":"C2 2Y-Spares"}
CELL_RE=re.compile(r"^([A-J])([1-9][0-9]*)$")

def sha256(p):
    hash_object=hashlib.sha256()
    with p.open("rb") as stream:
        for chunk in iter(lambda:stream.read(1024*1024),b""):
            hash_object.update(chunk)
    return hash_object.hexdigest()

def geometry(path):
    """Read-only geometry comparison. Formatting is owned by native input."""
    result={}
    with zipfile.ZipFile(path) as z:
        for i,name in enumerate(SHEETS,1):
            root=ET.fromstring(z.read(f"xl/worksheets/sheet{i}.xml"))
            merges=root.find(NS+"mergeCells")
            columns=root.find(NS+"cols")
            row_data=root.find(NS+"sheetData")
            result[name]={
             "merges":sorted(x.get("ref") for x in merges) if merges is not None else [],
             "columns":[(x.get("min"),x.get("max"),float(x.get("width") or 0),
                         x.get("hidden")) for x in columns] if columns is not None else [],
             "rows":[(r.get("r"),float(r.get("ht") or 0),r.get("hidden"))
                     for r in row_data] if row_data is not None else []
            }
    return result

def assert_native_geometry(template,output):
    a,b=geometry(template),geometry(output)
    for sheet in SHEETS:
        original,exported=a[sheet],b[sheet]
        if original["merges"]!=exported["merges"]:
            raise ValueError("Merged range fidelity broken: "+sheet)
        if len(original["columns"])!=len(exported["columns"]):
            raise ValueError("Column geometry count modified: "+sheet)
        if len(original["rows"])!=len(exported["rows"]):
            raise ValueError("Row geometry count modified: "+sheet)
        for x,y in zip(original["columns"],exported["columns"]):
            if x[:2]!=y[:2] or abs(x[2]-y[2])>0.001 or x[3]!=y[3]:
                raise ValueError("Column width changed: "+sheet+str((x,y)))
        for x,y in zip(original["rows"],exported["rows"]):
            if x[0]!=y[0] or abs(x[1]-y[1])>0.001 or x[2]!=y[2]:
                raise ValueError("Row height changed: "+sheet+str((x,y)))

def allowed(sheet,cell):
    m=CELL_RE.fullmatch(cell)
    if not m:return False
    col,row=m.group(1),int(m.group(2))
    if sheet=="Scope of supply":
        if 8<=row<=22:return col in "ABCDEFG"
        if row in (24,25,26,27,28,29,30,31,32,37):return col in "FG"
        if row in (33,34,35,36,41,42):return col=="G"  # F keeps "refer to Annex"
        return False
    if sheet in SHEETS[1:]:
        if 6<=row<=18:return col in ("BCDEFGHIJ" if sheet.startswith("C") else "BCDEFGHI")
        if row==19:return col=="I"
        return False
    return False

def value_allowed(v):
    if isinstance(v,bool) or v is None:return False
    if isinstance(v,(int,float)):
        return math.isfinite(v) and v>=0
    return isinstance(v,str) and bool(v.strip()) and len(v)<=800

def validate_payload(wb,payload,template):
    if payload.get("approved") is not True or payload.get("releaseAllowed") is not True:
        raise ValueError("Not a management-approved release snapshot")
    for required in ("revision","snapshotId","approvedBy","approvedAt","verifiedFxSource",
                     "verifiedFxDate","sourceTemplateSha256"):
        if not isinstance(payload.get(required),str) or not payload[required].strip():
            raise ValueError("Missing signed release field: "+required)
    if payload.get("sourceTemplateSha256")!=sha256(template):
        raise ValueError("Original template SHA256 does not match approved snapshot")
    if payload.get("currency") not in ("THB","USD"):
        raise ValueError("Explicit THB/USD approved currency required")
    if payload.get("project")!="PJ2608-0553":
        raise ValueError("Wrong project mapping")
    if payload.get("noDoubleCountVerified") is not True or payload.get("tagQuantityVerified") is not True:
        raise ValueError("TAG, stock owner and no-double-count sign-off missing")
    if payload.get("sourceCostVerified") is not True or payload.get("sheetCapacityVerified") is not True:
        raise ValueError("10.1 / 10.2 source cost or 15/13 row-capacity check not signed off")
    if not isinstance(payload.get("cells"),list) or not payload["cells"]:
        raise ValueError("No source-linked approved cell entries")
    seen=set()
    valid=[]
    for item in payload["cells"]:
        sheet=item.get("sheet");cell=str(item.get("cell","")).strip().upper()
        if sheet not in SHEETS or not allowed(sheet,cell):
            raise ValueError(f"Forbidden customer-format cell: {sheet}!{cell}")
        if (sheet,cell) in seen:raise ValueError(f"Duplicate cell mapping: {sheet}!{cell}")
        seen.add((sheet,cell))
        val=item.get("value")
        if not value_allowed(val):raise ValueError(f"Non-finite, blank, invalid value: {sheet}!{cell}")
        src=item.get("sourceModuleId")
        if not isinstance(src,str) or not src.startswith(
            "bid.budget.bom" if sheet=="Scope of supply" and int(CELL_RE.fullmatch(cell)[2])<=22
            else "bid.budget.working.bc" ):
            raise ValueError(f"Unrelated or missing source module: {sheet}!{cell}")
        if not item.get("sourceLineId"):
            raise ValueError(f"Source Line ID required: {sheet}!{cell}")
        ws=wb.worksheets.get_item(sheet)
        before=ws.get_range(cell).values[0][0]
        # Allow changing an explicitly empty bid-price field or a native placeholder,
        # not the customer's header, annex pointer, contractual text or fixed numbers.
        if before not in (None,"","Not quote","xxx") and before!=val:
            raise ValueError(f"Original nonblank customer content cannot be replaced: {sheet}!{cell}={before!r}")
        valid.append((sheet,cell,val))
    # Price totals and detail sheets must reconcile before native output.
    for code,summaryrow in SCOPE_ANNEX.items():
        sheet=SHEET_BY_CODE[code]
        line_total=sum(float(item["value"]) for item in payload["cells"]
            if item["sheet"]==sheet and re.fullmatch(r"I(?:[6-9]|1[0-8])",item["cell"]))
        total_cell=next((item["value"] for item in payload["cells"] if item["sheet"]==sheet and item["cell"]=="I19"),None)
        summary_cell=next((item["value"] for item in payload["cells"] if item["sheet"]=="Scope of supply" and item["cell"]=="G"+str(summaryrow)),None)
        if not all(isinstance(x,(float,int)) for x in (total_cell,summary_cell)):
            raise ValueError(code+": summary and detail Annex total cells are required")
        if abs(line_total-total_cell)>0.01 or abs(total_cell-summary_cell)>0.01:
            raise ValueError(code+": 10.5 Summary ↔ Annex native-cell price mismatch")
    return valid

def run(template,output,payload_file):
    original=Path(template).resolve()
    destination=Path(output).resolve()
    if original==destination:raise ValueError("Master overwrite prohibited")
    if not original.is_file():raise FileNotFoundError(original)
    payload=json.loads(Path(payload_file).read_text(encoding="utf8"))
    wb=SpreadsheetFile.import_xlsx(Blob.load(str(original)))
    actual=tuple(wb.worksheets.get_item_at(i).name for i in range(6))
    if actual!=SHEETS:raise ValueError("Original six worksheet names/order changed")
    writes=validate_payload(wb,payload,original)
    for sheet,cell,value in writes:
        wb.worksheets.get_item(sheet).get_range(cell).values=[[value]]
    destination.parent.mkdir(parents=True,exist_ok=True)
    # Use only artifact_tool for modifications (preserves native workbook structure).
    SpreadsheetFile.export_xlsx(wb).save(str(destination))
    try:assert_native_geometry(original,destination)
    except Exception:
        destination.unlink(missing_ok=True)
        raise
    print(json.dumps({"state":"RELEASE_EXPORT_COMMERCIALLY_SIGNED",
                      "output":str(destination),"source_sha256":sha256(original),
                      "mapped_cells":len(writes),"original_modified":False,
                      "geometry_verified":True,"sheets":SHEETS},ensure_ascii=False))

if __name__=="__main__":
    a=argparse.ArgumentParser()
    a.add_argument("--template",required=True)
    a.add_argument("--approved-payload",required=True)
    a.add_argument("--output",required=True)
    x=a.parse_args()
    run(x.template,x.output,x.approved_payload)
