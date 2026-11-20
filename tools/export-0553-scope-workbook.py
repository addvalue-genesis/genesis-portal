#!/usr/bin/env python3
"""PJ2608-0553: populate a COPY of the original customer Excel template.
Requires artifact_tool. Only approved, explicit sheet/cell commercial mappings can write.
No BOM cost or historical Rev08 amount is automatically promoted to customer sell.
Usage:
 python tools/export-0553-scope-workbook.py --template "4-Scope of Supply.xlsx" --output "0553-Working-Preview.xlsx"
 python tools/export-0553-scope-workbook.py --template ... --output ... --approved-payload approved.json
Payload format: {"revision":"...","approved":true,"currency":"USD","cells":[{"sheet":"Scope of supply","cell":"G24","value":123.45,"source":"approved sell mapping ID"}]}
"""
import argparse
import json
from pathlib import Path
from artifact_tool import Blob, SpreadsheetFile

EXPECTED = ("Scope of supply", "B10 CommSpares", "B11 SpecialTool",
            "B13 Consumerables", "C1 CapitalSpares", "C2 2Y-Spares")
RESERVED = {"A1","A2","A3","A4","A5","A6","A23","A38","A39","A40",
            "B19","I19","B20","B21"}
SELL_COLUMNS = {"Scope of supply": {"F","G"},
                "B10 CommSpares":{"H","I"}, "B11 SpecialTool":{"H","I"},
                "B13 Consumerables":{"H","I"},
                "C1 CapitalSpares":{"H","I"}, "C2 2Y-Spares":{"H","I"}}

def export(template, output, payload_path=None):
    source=Path(template).resolve()
    destination=Path(output).resolve()
    if source==destination: raise ValueError("Refusing to overwrite master template")
    if not source.is_file(): raise FileNotFoundError(source)
    wb=SpreadsheetFile.import_xlsx(Blob.load(str(source)))
    actual=[wb.worksheets.get_item_at(i).name for i in range(6)]
    if tuple(actual)!=EXPECTED: raise ValueError(f"Unexpected sheet sequence: {actual}")
    writes=0
    if payload_path:
        payload=json.loads(Path(payload_path).read_text(encoding="utf-8"))
        if payload.get("approved") is not True or not payload.get("revision"):
            raise ValueError("Approved commercial revision is required")
        if payload.get("currency")!="USD":
            raise ValueError("Original workbook export currency USD; validated FX conversion must precede export")
        seen=set()
        for item in payload.get("cells",[]):
            sheet=item["sheet"]; address=item["cell"].upper().strip()
            if sheet not in SELL_COLUMNS:raise ValueError(f"Unknown sheet {sheet}")
            column="".join(x for x in address if x.isalpha())
            rowpart="".join(x for x in address if x.isdigit())
            if not rowpart or column not in SELL_COLUMNS[sheet] or address in RESERVED:
                raise ValueError(f"Cell not permitted: {sheet}!{address}")
            if not item.get("source") or not isinstance(item.get("value"),(int,float)):
                raise ValueError(f"Source-backed numeric selling amount required: {sheet}!{address}")
            key=(sheet,address)
            if key in seen: raise ValueError(f"Duplicate cell mapping {key}")
            seen.add(key)
            ws=wb.worksheets.get_item(sheet)
            ws.get_range(address).values=[[float(item["value"])]]
            writes+=1
    destination.parent.mkdir(parents=True,exist_ok=True)
    SpreadsheetFile.export_xlsx(wb).save(str(destination))
    print(json.dumps({"output":str(destination),"sheets":actual,"mapped_cells":writes,
                      "state":"APPROVED_MAPPING" if payload_path else "UNPRICED_TEMPLATE_COPY"},
                     ensure_ascii=False))
if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--template",required=True)
    parser.add_argument("--output",required=True)
    parser.add_argument("--approved-payload")
    args=parser.parse_args()
    export(args.template,args.output,args.approved_payload)
