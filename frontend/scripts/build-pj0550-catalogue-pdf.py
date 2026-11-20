"""
Canonical builder for PJ2608-0550 Volume II — Catalogues & Brochures (SDRL B11, Appendix 1.1–1.8).
Reads official 4-logo assets from src/project0550/data/dtsFormLogos0550.js,
compiles vendor datasheets from Catalog Rev01 + Telecom Tower spec,
writes the compiled A4 PDF and updates src/project0550/data/catalogueBook0550.json.

Usage:
  python scripts/build-pj0550-catalogue-pdf.py [--rev 00] [--out <path>]
"""
import argparse
import base64
import datetime
import json
import os
import re
import fitz  # PyMuPDF

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.dirname(SCRIPT_DIR)
LOGOS_JS_PATH = os.path.join(FRONTEND_DIR, "src", "project0550", "data", "dtsFormLogos0550.js")
MANIFEST_JSON_PATH = os.path.join(FRONTEND_DIR, "src", "project0550", "data", "catalogueBook0550.json")

DEFAULT_CATALOG_BASE = r"H:\.shortcut-targets-by-id\1lG8jqDcz4fIU425V4xqiWPc2HdxrndAt\PJ2608-0550 SAM PTTEPI MY ASK TEL\10_PRE_AWARD\05_VENDOR\by company\Volumn II Cataloge\Catalog Rev01"
DEFAULT_LOCAL_DOWNLOADS = r"C:\Users\acer suriyapong\Downloads\0550"

A4_W, A4_H = 595.28, 841.89
C_NAVY = (0.06, 0.23, 0.36)
C_MUTED = (0.35, 0.42, 0.48)
C_LINE = (0.75, 0.80, 0.85)


def load_logos_from_js():
    with open(LOGOS_JS_PATH, "r", encoding="utf-8") as f:
        text = f.read()
    keys = [
        ("PTTEP", "PTTEP_LOGO_DATA_URI", 225, 225),
        ("CNEEC", "CNEEC_LOGO_DATA_URI", 167, 33),
        ("SAMTEL", "SAMTEL_LOGO_DATA_URI", 663, 340),
        ("ADDVALUE", "AVS_LOGO_DATA_URI", 1024, 331),
    ]
    out = []
    for name, key, pw, ph in keys:
        m = re.search(rf"export const {key}\s*=\s*'data:image/[^;]+;base64,([^']+)';", text)
        if not m:
            raise RuntimeError(f"Could not find {key} in {LOGOS_JS_PATH}")
        out.append((name, base64.b64decode(m.group(1)), pw, ph))
    return out


def build_sections(catalog_base, local_downloads):
    def cat(rel_path):
        return os.path.join(catalog_base, rel_path)

    def list_dir_pdfs(rel_dir, exclude=()):
        d = cat(rel_dir)
        if not os.path.isdir(d):
            return []
        out = []
        for f in sorted(os.listdir(d)):
            if f.lower().endswith(".pdf") and f not in exclude:
                out.append((os.path.splitext(f)[0], os.path.join(d, f), os.path.join(rel_dir, f)))
        return out

    tower_pdf = os.path.join(local_downloads, r"VENDOR\Telecom Tower\RQ2609-1204_Telecom_Mast_Specification_RevA1.pdf")
    return [
        (
            "1.1",
            "Appendix 1.1 — VHF and MF/HF (incl. Telecom Towers & Antenna Cables)",
            [
                ("1.1.1 VHF DMR Radio System", list_dir_pdfs(r"Marine Radio\VHF DMR RADIO")),
                ("1.1.2 VHF-FM Marine Radio", list_dir_pdfs(r"Marine Radio\VHF-FM MARINE RADIO")),
                ("1.1.3 MF/HF SSB Radio", list_dir_pdfs(r"Marine Radio\MF HF")),
                ("1.1.4 VHF-AM Aeronautical Radio", list_dir_pdfs(r"Marine Radio\VHF-AM AERONAUTICAL RADIO")),
                (
                    "1.1.5 Telecom Towers",
                    [("RQ2609-1204 Telecom Mast Specification RevA1", tower_pdf, r"VENDOR\Telecom Tower\RQ2609-1204_Telecom_Mast_Specification_RevA1.pdf")],
                ),
                (
                    "1.1.6 Antenna Feeder Cable",
                    [(
                        "RF LLF 1-2 UFL SHF1 (HYR0211I025)-(A03)",
                        cat(r"Bulk Material Datasheet\RF LLF 1-2 UFL SHF1 (HYR0211I025)-(A03).pdf"),
                        r"Bulk Material Datasheet\RF LLF 1-2 UFL SHF1 (HYR0211I025)-(A03).pdf",
                    )],
                ),
            ],
        ),
        (
            "1.2",
            "Appendix 1.2 — Satellite Communication System (VSAT)",
            [
                (
                    "1.2.1 VSAT Cabinet & Rack",
                    [
                        ("Rittal 5307114 Network/Server Rack VX IT", cat("5307114-Network_server rack VX IT.pdf"), "5307114-Network_server rack VX IT.pdf"),
                        ("Rittal 5311116 Network/Server Rack VX IT", cat("5311116-Network_server rack VX IT.pdf"), "5311116-Network_server rack VX IT.pdf"),
                    ],
                ),
                (
                    "1.2.2 VSAT L3 Switch",
                    [("VSAT L3 Switch — Cisco C9200-24P-A", cat(r"LAN\11. Vsat L3 Switch_Cisco C9200-24P-A.pdf"), r"LAN\11. Vsat L3 Switch_Cisco C9200-24P-A.pdf")],
                ),
            ],
        ),
        (
            "1.3",
            "Appendix 1.3 — Network System, PABX, CCTV and MET",
            [
                ("1.3.1 Network System (LAN / WLAN / Firewall)", list_dir_pdfs("LAN", exclude=("11. Vsat L3 Switch_Cisco C9200-24P-A.pdf",))),
                ("1.3.2 PABX & IP Telephone System", list_dir_pdfs("PABX")),
                ("1.3.3 CCTV System", list_dir_pdfs("CCTV")),
                ("1.3.4 Meteorological System (MET)", list_dir_pdfs(r"MET\1 DATASHEET")),
            ],
        ),
        (
            "1.4",
            "Appendix 1.4 — Public Address and General Alarm (PAGA) System",
            [("1.4.1 INDUSTRONIC INTRON-X PAGA Datasheets", list_dir_pdfs(r"PAGA\Datasheets A20261632", exclude=("Agenda-O&M-R0-Draft.pdf",)))],
        ),
        (
            "1.5",
            "Appendix 1.5 — Microwave Communication System (DMR)",
            [(
                "1.5.1 Ceragon IP-50CX & 4ft Dual-Pol Antenna",
                [
                    ("Ceragon FibeAir IP-50CX Datasheet Rev F", cat("IP50CX_Datasheet_Rev_F.pdf"), "IP50CX_Datasheet_Rev_F.pdf"),
                    ("ANT 4FT 7.125-8.500GHz DP RFU-C Circular", cat("ANT,4FT,7.125-8.500GHz,DP,RFU-C TYPE CIRCULAR.pdf"), "ANT,4FT,7.125-8.500GHz,DP,RFU-C TYPE CIRCULAR.pdf"),
                ],
            )],
        ),
        (
            "1.6",
            "Appendix 1.6 — Entertainment System & Conferencing",
            [("1.6.1 Entertainment & AV Equipment", list_dir_pdfs("ENTERTAINMENT"))],
        ),
        (
            "1.7",
            "Appendix 1.7 — Non-Directional Beacon (NDB)",
            [("1.7.1 Nautel NDB System Datasheets", list_dir_pdfs(r"NDB\1 DATASHEET"))],
        ),
        (
            "1.8",
            "Appendix 1.8 — FOC and Cables",
            [
                ("1.8.1 Fiber Optic Termination & Management", list_dir_pdfs("FO")),
                ("1.8.2 Bulk Cables (FOC, CAT6A, RG59, RS485, Power)", list_dir_pdfs("Bulk Material Datasheet", exclude=("RF LLF 1-2 UFL SHF1 (HYR0211I025)-(A03).pdf",))),
            ],
        ),
    ]


def draw_4_logos(page, logos, x_right, y_center, heights_pt):
    gap = 8.0
    items = []
    total_w = 0.0
    for (_, img_bytes, pw, ph), h_pt in zip(logos, heights_pt):
        w_pt = h_pt * (pw / ph)
        items.append((img_bytes, w_pt, h_pt))
        total_w += w_pt
    total_w += gap * (len(items) - 1)
    x = x_right - total_w
    for img_bytes, w_pt, h_pt in items:
        rect = fitz.Rect(x, y_center - h_pt / 2.0, x + w_pt, y_center + h_pt / 2.0)
        page.insert_image(rect, stream=img_bytes, keep_proportion=True)
        x += w_pt + gap


def draw_header_footer(page, logos, app_title, sub_title, item_title, page_num, total_pages):
    page.insert_text((28, 28), "Technical Proposal — PJ2608-0550 (MM-ASK)", fontsize=8.5, fontname="helv", color=C_MUTED)
    page.insert_text((28, 41), app_title[:72], fontsize=9.5, fontname="hebo", color=C_NAVY)
    page.insert_text((28, 53), f"{sub_title}  |  {item_title}"[:82], fontsize=8, fontname="helv", color=(0.15, 0.15, 0.15))
    draw_4_logos(page, logos, A4_W - 28, 38, [18.0, 11.0, 15.0, 13.0])
    page.draw_line((28, 62), (A4_W - 28, 62), color=C_LINE, width=0.7)
    page.draw_line((28, A4_H - 32), (A4_W - 28, A4_H - 32), color=C_LINE, width=0.5)
    page.insert_text((28, A4_H - 20), "PJ2608-0550 · Volume II — Catalogues & Brochures (SDRL B11) · Appendix 1.1–1.8", fontsize=7.5, fontname="helv", color=C_MUTED)
    page.insert_text((A4_W - 95, A4_H - 20), f"Page {page_num} of {total_pages}", fontsize=8, fontname="hebo", color=C_NAVY)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--rev", default="00")
    parser.add_argument("--out", default=os.path.join(DEFAULT_LOCAL_DOWNLOADS, "PJ2608-0550_Volume-II_Catalogues-and-Brochures_Appendix-1.1-1.8_Rev00.pdf"))
    args = parser.parse_args()

    logos = load_logos_from_js()
    sections = build_sections(DEFAULT_CATALOG_BASE, DEFAULT_LOCAL_DOWNLOADS)

    entries = []
    missing = []
    for app_id, app_title, sub_groups in sections:
        for sub_title, items in sub_groups:
            for item_title, fpath, rel_path in items:
                if not os.path.isfile(fpath):
                    missing.append((app_id, item_title, fpath))
                    continue
                src = fitz.open(fpath)
                entries.append((app_id, app_title, sub_title, item_title, fpath, rel_path, len(src)))
                src.close()

    total_content_pages = sum(e[6] for e in entries)
    toc_rows = []
    last_app = None
    for app_id, app_title, sub_title, item_title, _, _, n_pages in entries:
        if app_title != last_app:
            toc_rows.append(("APP", app_title, None))
            last_app = app_title
        toc_rows.append(("ITEM", f"  {sub_title} — {item_title}", n_pages))

    rows_per_toc = 34
    toc_page_count = max(1, (len(toc_rows) + rows_per_toc - 1) // rows_per_toc)
    total_pages = 1 + toc_page_count + total_content_pages

    out = fitz.open()
    cov = out.new_page(width=A4_W, height=A4_H)
    cov.draw_rect(fitz.Rect(28, 28, A4_W - 28, A4_H - 28), color=C_NAVY, width=1.2)
    draw_4_logos(cov, logos, A4_W - 44, 68, [26.0, 15.0, 22.0, 19.0])
    cov.draw_line((44, 96), (A4_W - 44, 96), color=C_LINE, width=0.8)
    cov.insert_text((44, 170), "PTTEP INTERNATIONAL LIMITED (MYANMAR)", fontsize=12, fontname="hebo", color=C_NAVY)
    cov.insert_text((44, 194), "PROJECT: MM-ASK TELECOMMUNICATION & SECURITY SYSTEM (PJ2608-0550)", fontsize=10.5, fontname="hebo", color=C_MUTED)
    cov.insert_text((44, 285), "VOLUME II — TECHNICAL PROPOSAL", fontsize=14, fontname="hebo", color=C_MUTED)
    cov.insert_text((44, 320), "EQUIPMENT CATALOGUES & BROCHURES", fontsize=22, fontname="hebo", color=C_NAVY)
    cov.insert_text((44, 350), "SDRL B11 · Compiled Vendor Datasheets (Appendix 1.1 – 1.8)", fontsize=13, fontname="hebo", color=(0.15, 0.35, 0.50))
    cov.draw_rect(fitz.Rect(44, 420, A4_W - 44, 585), color=C_LINE, width=0.8)
    for i, line in enumerate([
        "Document Reference :  PJ2608-0550 Volume II — SDRL B11 (Catalogues & Brochures)",
        "Basis / Mapping    :  CUS Schedule C1 (MR Appendix 1.1 – 1.8)",
        f"Included Datasheets:  {len(entries)} Vendor Catalogues / Brochures ({total_content_pages} datasheet pages)",
        f"Total Pages        :  {total_pages} Pages (Cover + TOC + Datasheets)",
        f"Revision / Status  :  Rev.{args.rev} — Issued for Bidding (WITH BID)",
        "Stakeholders       :  PTTEP (Company) · CNEEC (EPCIC) · SAMTEL (SI) · ADDVALUE (Subcontractor)",
    ]):
        cov.insert_text((58, 445 + i * 23), line, fontsize=9.5, fontname="helv", color=(0.1, 0.1, 0.1))
    cov.insert_text((44, A4_H - 48), f"Page 1 of {total_pages}", fontsize=8.5, fontname="hebo", color=C_NAVY)

    for _ in range(toc_page_count):
        out.new_page(width=A4_W, height=A4_H)

    toc_outline = [[1, "Cover Page", 1], [1, "Table of Contents", 2]]
    item_start_pages = []
    manifest_items = []
    cur_app = None
    cur_page = 1 + toc_page_count + 1

    for app_id, app_title, sub_title, item_title, fpath, rel_path, n_pages in entries:
        if app_title != cur_app:
            toc_outline.append([1, app_title, cur_page])
            cur_app = app_title
        toc_outline.append([2, f"{sub_title} — {item_title}", cur_page])
        item_start_pages.append(cur_page)
        manifest_items.append({
            "appendix": app_id,
            "appendixTitle": app_title,
            "subSection": sub_title,
            "title": item_title,
            "sourceRelPath": rel_path.replace("\\", "/"),
            "startPage": cur_page,
            "pageCount": n_pages,
        })
        src = fitz.open(fpath)
        target_box = fitz.Rect(28, 70, A4_W - 28, A4_H - 38)
        for p_idx in range(len(src)):
            pg = out.new_page(width=A4_W, height=A4_H)
            draw_header_footer(pg, logos, app_title, sub_title, item_title, cur_page, total_pages)
            pg.show_pdf_page(target_box, src, p_idx, keep_proportion=True)
            cur_page += 1
        src.close()

    item_ptr = 0
    for t_idx in range(toc_page_count):
        t_pg = out[1 + t_idx]
        draw_header_footer(t_pg, logos, "TABLE OF CONTENTS — APPENDIX 1.1 – 1.8", "SDRL B11", "Equipment Catalogue Index", 2 + t_idx, total_pages)
        chunk = toc_rows[t_idx * rows_per_toc : (t_idx + 1) * rows_per_toc]
        y = 84
        for kind, label, n_pg in chunk:
            if kind == "APP":
                t_pg.draw_rect(fitz.Rect(28, y - 11, A4_W - 28, y + 5), color=None, fill=(0.91, 0.95, 0.97))
                t_pg.insert_text((32, y), label[:88], fontsize=8.5, fontname="hebo", color=C_NAVY)
            else:
                sp = item_start_pages[item_ptr]
                item_ptr += 1
                t_pg.insert_text((34, y), label[:78], fontsize=7.8, fontname="helv", color=(0.12, 0.12, 0.12))
                t_pg.insert_text((A4_W - 85, y), f"p.{sp} ({n_pg}p)", fontsize=7.8, fontname="hebo", color=C_NAVY)
            y += 20

    out.set_toc(toc_outline)
    out.save(args.out, garbage=4, deflate=True)
    out.close()

    manifest = {
        "sdrlCode": "B11",
        "title": "Catalogues and brochures (Appendix 1.1 – 1.8)",
        "revision": f"Rev.{args.rev}",
        "generatedDate": datetime.date.today().isoformat(),
        "outputFileName": os.path.basename(args.out),
        "sourceCatalogRoot": "10_PRE_AWARD/05_VENDOR/by company/Volumn II Cataloge/Catalog Rev01",
        "builderScript": "frontend/scripts/build-pj0550-catalogue-pdf.py",
        "totalCatalogues": len(entries),
        "totalDatasheetPages": total_content_pages,
        "totalPages": total_pages,
        "missingCount": len(missing),
        "items": manifest_items,
    }
    with open(MANIFEST_JSON_PATH, "w", encoding="utf-8") as mf:
        json.dump(manifest, mf, indent=2, ensure_ascii=False)

    print(f"SAVED PDF: {args.out} ({total_pages} pages)")
    print(f"SAVED MANIFEST: {MANIFEST_JSON_PATH} ({len(manifest_items)} items)")


if __name__ == "__main__":
    main()
