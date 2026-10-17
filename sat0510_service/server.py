"""Local export API for PJ2601-0510 SAT Workspace."""
from fastapi import FastAPI,HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from .generate import ROOT,render
import json
app=FastAPI(title="PJ2601-0510 SAT service")
app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:3002","http://127.0.0.1:3002"],allow_methods=["GET","POST","PUT"],allow_headers=["*"])
datafile=ROOT/"config"/"project.json"
@app.put("/api/project")
def save(body:dict):
    if not all(x in body for x in ["project_title","po_number","sites","network","tests","sections"]):raise HTTPException(400,"Missing required fields")
    if len(body["sites"])!=2 or any(not x.get("radio_ip") for x in body["sites"]):raise HTTPException(400,"Expected ZMS and MS radio addresses")
    datafile.parent.mkdir(exist_ok=True)
    datafile.write_text(json.dumps(body,ensure_ascii=False,indent=2),encoding="utf-8")
    return {"saved":True}
@app.post("/api/render")
def generate():
    if not datafile.exists():raise HTTPException(400,"Save project first")
    try:return render(json.loads(datafile.read_text(encoding="utf-8")))
    except Exception as e:raise HTTPException(422,str(e))
@app.get("/api/download/{ext}")
def download(ext:str):
    if ext not in ["docx","pdf"]:raise HTTPException(400,"Invalid format")
    path=ROOT/"output"/("PJ2601-0510_SAT_WORKING."+ext)
    if not path.is_file():raise HTTPException(404,"Generate first")
    return FileResponse(path,media_type="application/pdf" if ext=="pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document",filename=path.name)

@app.get("/api/preview/pdf")
def preview():
    path=ROOT/"output"/"PJ2601-0510_SAT_WORKING.pdf"
    if not path.is_file():raise HTTPException(404,"Generate first")
    return FileResponse(path,media_type="application/pdf",headers={"Content-Disposition":"inline"})
