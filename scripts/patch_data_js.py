# -*- coding: utf-8 -*-
"""data.js 改造：接入 WFD_VIDEO 真实题库"""
import io, os

p = r"E:\code\pte_doubao\js\data.js"
s = io.open(p, encoding="utf-8").read()
orig_len = len(s)
had_crlf = ("\r\n" in s)
s = s.replace("\r\n", "\n")  # 统一为 LF 便于替换

def rep(old, new, count=1):
    global s
    n = s.count(old)
    if n < count:
        raise SystemExit("NOT FOUND (%d): %r" % (n, old[:80]))
    s = s.replace(old, new, count)

# 1) WFD_Q 之后插入真实题库解析
anchor = '"The speaker emphasized the importance of lifelong learning."\n];'
insert = ('"The speaker emphasized the importance of lifelong learning."\n];\n\n'
          '/* WFD 真实题库：来自视频切分（js/wfd-data.js 注入 window.WFD_VIDEO_DATA） */\n'
          'const WFD_VIDEO = (typeof window!==\'undefined\' && window.WFD_VIDEO_DATA\n'
          '  && Array.isArray(window.WFD_VIDEO_DATA.questions) && window.WFD_VIDEO_DATA.questions.length)\n'
          '  ? window.WFD_VIDEO_DATA.questions.map(q=>({id:q.id,a:q.answer,tr:q.translation,audio:q.audio,f:0,s:\'\'}))\n'
          '  : null;\n')
rep(anchor, insert)

# 2) BANK WFD 行
rep('  WFD:{list:WFD_Q.map(a=>({a,f:0,s:\'\'}))},',
    '  WFD:{list:WFD_VIDEO||WFD_Q.map(a=>({a,f:0,s:\'\'}))},')

# 3) 演示预置数据：仅在示例题库时生效
rep('[2,7,11,17,24,30,43,49,56,62,69,75].forEach(i=>BANK.WFD.list[i].f=1);',
    'if(!WFD_VIDEO){[2,7,11,17,24,30,43,49,56,62,69,75].forEach(i=>BANK.WFD.list[i].f=1);')
rep('[[0,\'c\'],[1,\'p\'],[2,\'w\'],[3,\'c\'],[4,\'p\']].forEach(([i,s])=>{BANK.WFD.list[i].s=s;});',
    '[[0,\'c\'],[1,\'p\'],[2,\'w\'],[3,\'c\'],[4,\'p\']].forEach(([i,s])=>{BANK.WFD.list[i].s=s;});}')

# 4) 社区公告文案
rep('"comm.ann1":["2026-09 WFD 机经已更新至 77 题，新增 6 月–8 月考场原题。","Sep 2026: WFD bank updated to 77 items with new real questions."],',
    '"comm.ann1":["2026-09 WFD 题库已接入视频机经（61 题，来自羊驼PTE 视频切分）。","Sep 2026: WFD bank now has 61 items split from the Alpaca PTE video."],')

if had_crlf:
    s = s.replace("\n", "\r\n")
io.open(p, "w", encoding="utf-8", newline="").write(s)
print("OK len %d -> %d" % (orig_len, len(s)))
