# -*- coding: utf-8 -*-
"""app.js 改造：自动判分（单词无序匹配）+ 彩色对比 + Overall 分数替换自我评分"""
import io

p = r"E:\code\pte_doubao\js\app.js"
s = io.open(p, encoding="utf-8").read()
had_crlf = ("\r\n" in s)
s = s.replace("\r\n", "\n")

def rep(old, new):
    global s
    if s.count(old) == 0:
        raise SystemExit("NOT FOUND: %r" % old[:100])
    s = s.replace(old, new, 1)

# 1) 插入 gradeWords / updateSideStats（放在 renderResult 之前）
anchor = "function renderResult(){"
grade_fn = """function gradeWords(ref,ans){
  /* 单词无序匹配：忽略大小写与首尾标点，按词频取交集 */
  const norm=w=>w.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g,'');
  const rt=(ref||'').trim().split(/\\s+/).filter(Boolean);
  const at=(ans||'').trim().split(/\\s+/).filter(Boolean);
  const rn=rt.map(norm),an=at.map(norm);
  const rc={},ac={};
  rn.forEach(w=>rc[w]=(rc[w]||0)+1);
  an.forEach(w=>ac[w]=(ac[w]||0)+1);
  const mc={};
  Object.keys(rc).forEach(w=>{if(ac[w])mc[w]=Math.min(rc[w],ac[w]);});
  let matched=0;Object.keys(mc).forEach(w=>matched+=mc[w]);
  const rseen={},aseen={},rcls=[],acls=[];
  rn.forEach(w=>{const hit=!!(mc[w]&&rseen[w]<mc[w]);rcls.push(hit);if(hit)rseen[w]=(rseen[w]||0)+1;});
  an.forEach(w=>{const hit=!!(mc[w]&&aseen[w]<mc[w]);acls.push(hit);if(hit)aseen[w]=(aseen[w]||0)+1;});
  return {matched,total:rt.length,rt,at,rcls,acls};
}
function updateSideStats(){
  const st=stats();
  $('#stDone').textContent=st.done;$('#stC').textContent=st.c;$('#stP').textContent=st.p;$('#stW').textContent=st.w;
  const pct=st.total?Math.round(st.done/st.total*100):0;
  $('#stDoneBar').style.width=pct+'%';
}
function renderResult(){"""
rep(anchor, grade_fn)

# 2) renderPractice 中统计行改为调用 updateSideStats
old_stat = """  $('#stDone').textContent=st.done;$('#stC').textContent=st.c;$('#stP').textContent=st.p;$('#stW').textContent=st.w;
  $('#stDoneBar').style.width=donePct+'%';"""
rep(old_stat, "  updateSideStats();")

# 3) renderResult 主体：typed 题型走自动判分
old_res = """  const isRec=(t.mode==='record'||t.mode==='read'||t.mode==='di');
  let body='';
  if(t.mode==='read'){
    body='<div class="result-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>'+(lang==='zh'?'朗读题无标准答案，提交即记录完成':'No reference answer — submitted and recorded')+'</div>';
  }else{
    body='<div class="result-label">'+IC.star+' '+(lang==='zh'?'参考答案':'Reference answer')+'</div>'+
      '<div class="result-answer">'+esc(isRec?(t.mode==='di'?q.a:q.a):(q.a))+'</div>';
    if(q.tr)body+='<div class="result-tr">'+esc(q.tr)+'</div>';
    if(t.mode!=='di'){
      body+='<div class="your-answer">'+(lang==='zh'?'你的作答：':'Your answer: ')+'<br>'+esc(P.answer||'—')+'</div>';
    }
  }
  const s=q.s;"""
new_res = """  const isRec=(t.mode==='record'||t.mode==='read'||t.mode==='di');
  const isTyped=(t.mode==='dictation'||t.mode==='short'||t.mode==='summarize');
  let body='';
  if(t.mode==='read'){
    body='<div class="result-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>'+(lang==='zh'?'朗读题无标准答案，提交即记录完成':'No reference answer — submitted and recorded')+'</div>';
  }else if(isTyped){
    /* 自动判分：单词无序匹配，提交即出 Overall */
    const g=gradeWords(q.a,P.answer||'');
    const ratio=g.total?(g.matched/g.total):0;
    q.s=ratio>=0.9?'c':ratio>=0.5?'p':'w';
    const refHtml=g.rt.map((w,i)=>'<span class="'+(g.rcls[i]?'w-ok':'w-miss')+'">'+esc(w)+'</span>').join(' ');
    const ansHtml=g.at.length?g.at.map((w,i)=>'<span class="'+(g.acls[i]?'w-ok':'w-extra')+'">'+esc(w)+'</span>').join(' '):esc(P.answer||'—');
    body='<div class="result-label">'+IC.star+' '+(lang==='zh'?'参考答案':'Reference answer')+'</div>'+
      '<div class="result-answer">'+refHtml+'</div>';
    if(q.tr)body+='<div class="result-tr">'+esc(q.tr)+'</div>';
    body+='<div class="your-answer"><span class="ya-label">'+(lang==='zh'?'你的作答':'Your answer')+'</span><br>'+ansHtml+'</div>'+
      '<div class="overall">Overall: <b>'+g.matched+'</b>/'+g.total+'</div>';
    updateSideStats();
  }else{
    body='<div class="result-label">'+IC.star+' '+(lang==='zh'?'参考答案':'Reference answer')+'</div>'+
      '<div class="result-answer">'+esc(isRec?(t.mode==='di'?q.a:q.a):(q.a))+'</div>';
    if(q.tr)body+='<div class="result-tr">'+esc(q.tr)+'</div>';
    if(t.mode!=='di'){
      body+='<div class="your-answer"><span class="ya-label">'+(lang==='zh'?'你的作答':'Your answer')+'</span><br>'+esc(P.answer||'—')+'</div>';
    }
  }
  const s=q.s;"""
rep(old_res, new_res)

# 4) 自我评分/已标记：typed 题型不渲染
old_mark = """  if(s){
    const label=s==='c'?(lang==='zh'?'已标记：完全正确':'Marked: correct'):s==='p'?(lang==='zh'?'已标记：部分正确':'Marked: partial'):(lang==='zh'?'已标记：错误':'Marked: wrong');
    body+='<div class="marked-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>'+esc(label)+'</div>';
  }else if(t.mode==='read'){
    body+='<div class="mark-row"><button class="btn btn-primary btn-sm" onclick="mark(\\'c\\')">'+(lang==='zh'?'记录完成':'Done')+'</button></div>';
  }else{
    body+='<div class="mark-row"><span class="mark-title">'+(lang==='zh'?'自我评分：':'Self-mark: ')+'</span>'+
      '<button class="mark-btn m-c" onclick="mark(\\'c\\')">'+(lang==='zh'?'完全正确':'Correct')+'</button>'+
      '<button class="mark-btn m-p" onclick="mark(\\'p\\')">'+(lang==='zh'?'部分正确':'Partial')+'</button>'+
      '<button class="mark-btn m-w" onclick="mark(\\'w\\')">'+(lang==='zh'?'错误':'Wrong')+'</button></div>';
  }"""
new_mark = """  if(s&&!isTyped){
    const label=s==='c'?(lang==='zh'?'已标记：完全正确':'Marked: correct'):s==='p'?(lang==='zh'?'已标记：部分正确':'Marked: partial'):(lang==='zh'?'已标记：错误':'Marked: wrong');
    body+='<div class="marked-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>'+esc(label)+'</div>';
  }else if(t.mode==='read'){
    body+='<div class="mark-row"><button class="btn btn-primary btn-sm" onclick="mark(\\'c\\')">'+(lang==='zh'?'记录完成':'Done')+'</button></div>';
  }else if(!isTyped){
    body+='<div class="mark-row"><span class="mark-title">'+(lang==='zh'?'自我评分：':'Self-mark: ')+'</span>'+
      '<button class="mark-btn m-c" onclick="mark(\\'c\\')">'+(lang==='zh'?'完全正确':'Correct')+'</button>'+
      '<button class="mark-btn m-p" onclick="mark(\\'p\\')">'+(lang==='zh'?'部分正确':'Partial')+'</button>'+
      '<button class="mark-btn m-w" onclick="mark(\\'w\\')">'+(lang==='zh'?'错误':'Wrong')+'</button></div>';
  }"""
rep(old_mark, new_mark)

if had_crlf:
    s = s.replace("\n", "\r\n")
io.open(p, "w", encoding="utf-8", newline="").write(s)
print("OK app.js graded")
