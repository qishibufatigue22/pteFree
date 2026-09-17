# -*- coding: utf-8 -*-
"""生成 js/wfd-data.js —— 把 server/data/wfd-questions.json 内嵌为 window.WFD_VIDEO_DATA"""
import json, io, os

qs_path = r"E:\code\pte_doubao\server\data\wfd-questions.json"
out_path = r"E:\code\pte_doubao\js\wfd-data.js"

data = json.load(io.open(qs_path, encoding="utf-8-sig"))
qs = data["questions"]

lines = []
lines.append("/* 由 scripts/build_wfd_data.py 自动生成 —— 请勿手改；")
lines.append("   数据源：wfd_vedio/40283604348-1-160.mp4（羊驼PTE WFD 机经视频，OCR+ASR 切分） */")
lines.append("(function(){")
lines.append("window.WFD_VIDEO_DATA = {")
lines.append("  meta: " + json.dumps(data["meta"], ensure_ascii=False) + ",")
lines.append("  questions: [")
for q in qs:
    q2 = dict(q)
    q2["audio"] = "assets/audio/" + q["audio"]  # 前端资源相对路径
    lines.append("    " + json.dumps(q2, ensure_ascii=False) + ",")
lines.append("  ]")
lines.append("};")
lines.append("})();")

with io.open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("written:", out_path, "questions:", len(qs))
