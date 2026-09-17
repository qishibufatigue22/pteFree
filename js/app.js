/* Free PTE 原型 - 交互引擎：路由 / 主题语言 / 练习模块 / 社区 / 弹窗 */
"use strict";
"use strict";
const $ = s=>document.querySelector(s), $$ = s=>[...document.querySelectorAll(s)];
const esc = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const IC = {
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3.5l2.7 5.5 6 .9-4.35 4.2 1.05 6L12 17.4l-5.4 2.7 1.05-6L3.3 9.9l6-.9z"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
  stop:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10a7 7 0 0 1-14 0M12 17v4M8 21h8"/></svg>'
};
/* ================= 通用：Toast / Modal ================= */
let toastTimer=null;
function toast(msg){const w=$('#toastWrap'),t=$('#toastTxt');t.textContent=msg;w.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>w.classList.remove('show'),2200);}
function openModal(html){$('#modalBox').innerHTML=html;$('#modalOverlay').classList.add('show');}
function closeModal(){$('#modalOverlay').classList.remove('show');}
function modalShell(title,body,foot){
  return '<div class="modal-head"><h3>'+esc(title)+'</h3><button class="modal-close" onclick="closeModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
    '<div class="modal-body">'+body+'</div>'+'<div class="modal-foot">'+foot+'</div>';
}
document.addEventListener('click',e=>{if(e.target.id==='modalOverlay')closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

/* ================= 主题 / 语言 ================= */
function applyTheme(){
  document.documentElement.dataset.theme=theme;
  $('#themeIcon').innerHTML = theme==='dark'
    ? '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  $('#themeTxt').textContent=T('theme.'+(theme==='dark'?'dark':'light'));
}
function applyLang(){
  $$('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(I18N[k])el.textContent=T(k);});
  $$('[data-i18n-ph]').forEach(el=>{el.placeholder=T(el.dataset.i18nPh);});
  $('#langTxt').textContent=lang==='zh'?'中文':'EN';
  renderTypeGrid();renderPractice();renderClbRows();renderThreads();renderTagCloud();buildWmSelects();renderWalkman();
}
$('#themeBtn').onclick=()=>{theme=theme==='dark'?'light':'dark';applyTheme();};
$('#langBtn').onclick=()=>{lang=lang==='zh'?'en':'zh';applyLang();};
$('#mascotBtn').onclick=()=>toast(T('toast.mascot'));
$('#footDisc').onclick=()=>openModal(modalShell(T('disc.title'),'<p>'+esc(T('disc.body'))+'</p>','<button class="btn btn-primary" onclick="closeModal()">'+esc(T('btn.ok'))+'</button>'));
$('#footPriv').onclick=()=>openModal(modalShell(T('priv.title'),'<p>'+esc(T('priv.body'))+'</p>','<button class="btn btn-primary" onclick="closeModal()">'+esc(T('btn.ok'))+'</button>'));

/* ================= 路由 ================= */
const VIEWS=['home','practice','clb','community','walkman'];
function router(){
  let h=location.hash.replace('#/','')||'home';
  const m=h.match(/^walkman\/(\w+)/i);
  if(m){h='walkman';WM.type=m[1].toUpperCase();}
  if(!VIEWS.includes(h))h='home';
  VIEWS.forEach(v=>{$('#view-'+v).classList.toggle('active',v===h);});
  $$('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.nav===h));
  if(h==='practice')renderPractice();
  if(h==='home')renderTypeGrid();
  if(h==='clb')renderClbRows();
  if(h==='community')renderThreads();
  if(h==='walkman')renderWalkman();
  window.scrollTo({top:0});
}
window.addEventListener('hashchange',router);

/* ================= 随身听 ================= */
let WM={type:'WFD',idx:0,playing:false,timer:null,rate:1};
let wmAudio=null;
function buildWmSelects(){
  const rep=$('#wmRepeat');if(rep){rep.innerHTML='';
    for(let i=1;i<=10;i++){const o=document.createElement('option');o.value=i;o.textContent=i+' '+T('wm.times');if(i===2)o.selected=true;rep.appendChild(o);}}
  const gap=$('#wmGap');if(gap){gap.innerHTML='';
    for(let i=1;i<=5;i++){const o=document.createElement('option');o.value=i;o.textContent=i+' '+T('wm.secs');if(i===2)o.selected=true;gap.appendChild(o);}}
}
function wmList(){return BANK[WM.type].list;}
function wmQ(){const l=wmList();return l[Math.min(WM.idx,l.length-1)]||null;}
function wmStop(){
  if(wmAudio){try{wmAudio.pause();}catch(e){}wmAudio=null;}
  clearTimeout(WM.timer);clearInterval(WM.timer);WM.playing=false;
  const b=$('#wmPlay');if(b){b.classList.remove('playing');$('#wmPlayTxt').textContent=T('wm.play');}
}
function wmPlayBtn(){const b=$('#wmPlay');if(!b)return;b.classList.toggle('playing',WM.playing);$('#wmPlayTxt').textContent=WM.playing?T('wm.stop'):T('wm.play');}
function renderWalkman(){
  wmStop();
  const l=wmList(),q=wmQ(),t=TYPES.find(t=>t.k===WM.type);
  $('#wmTitle').textContent=WM.type==='WFD'?T('wm.wfd'):T('wm.rs');
  $('#wmTypePill').textContent=WM.type+' · '+l.length+' 题';
  $('#wmSentence').textContent=q?(q.a||q.q||''):'—';
  $('#wmTrans').textContent=(WM.type==='WFD'&&q&&q.tr)?q.tr:'';
  $('#wmProgress').innerHTML=T('wm.now')+': <b>'+(WM.idx+1)+'</b>/'+l.length;
  wmPlayBtn();
}
function wmNext(){
  wmStop();
  const l=wmList();if(!l.length)return;
  if($('#wmMode').value==='rand'){let n;do{n=Math.floor(Math.random()*l.length);}while(n===WM.idx&&l.length>1);WM.idx=n;}
  else{WM.idx=(WM.idx+1)%l.length;}
  renderWalkman();wmPlay();
}
function wmPrev(){
  wmStop();
  const l=wmList();if(!l.length)return;
  WM.idx=(WM.idx-1+l.length)%l.length;
  renderWalkman();wmPlay();
}
function wmAutoNext(){
  /* 当前句播完（含重复）后，间隔 gap 秒自动切下一题并播放 */
  const gap=+($('#wmGap').value)||2;
  WM.timer=setTimeout(()=>{wmStop();wmNext();},gap*1000);
}
function wmPlay(){
  const q=wmQ();if(!q)return;
  if(WM.playing){wmStop();return;}
  if(WM.type==='WFD'){
    const reps=+($('#wmRepeat').value)||2,gap=+($('#wmGap').value)||2;
    let n=0;
    const once=()=>{
      n++;
      try{
        wmAudio=new Audio(q.audio);
        const wmV=+($('#wmVol').value);wmAudio.volume=(Number.isFinite(wmV)?wmV:80)/100;
        wmAudio.playbackRate=WM.rate;
        wmAudio.play().catch(()=>{});
      }catch(e){}
      wmAudio.addEventListener('ended',()=>{
        if(n<reps){WM.timer=setTimeout(once,gap*1000);}
        else wmAutoNext();
      });
    };
    WM.playing=true;wmPlayBtn();once();
  }else{
    /* RS/其他：模拟播放，结束后同样连续切题 */
    WM.playing=true;wmPlayBtn();
    const gap=+($('#wmGap').value)||2;
    let remain=2600;
    const step=()=>{
      if(remain<=0){wmAutoNext();return;}
      remain-=100;
      WM.timer=setTimeout(step,100);
    };
    step();
  }
}
$('#wmPrev').onclick=wmPrev;
$('#wmNext').onclick=wmNext;
$('#wmPlay').onclick=wmPlay;
$('#wmVol').oninput=e=>{$('#wmVolTxt').textContent=e.target.value+'%';if(wmAudio)wmAudio.volume=e.target.value/100;};
function wmRateSet(v){
  WM.rate=v;$('#wmRateVal').textContent=v.toFixed(2)+'x';
  if(wmAudio)wmAudio.playbackRate=v;
  markRateCur();
}
function wmRateAdj(d){
  WM.rate=Math.min(16,Math.max(0.25,Math.round((WM.rate+d)*100)/100));
  $('#wmRateVal').textContent=WM.rate.toFixed(2)+'x';
  if(wmAudio)wmAudio.playbackRate=WM.rate;
  markRateCur();
}
function markRateCur(){$$('#wmRateGrid button').forEach(b=>b.classList.toggle('cur',Math.abs(+b.dataset.r-WM.rate)<0.001));}
$$('.stp').forEach(b=>b.onclick=()=>wmRateAdj(+b.dataset.step));
$('#wmRateVal').onclick=e=>{e.stopPropagation();$('#wmRateGrid').classList.toggle('open');markRateCur();};
$$('#wmRateGrid button').forEach(b=>b.onclick=()=>{wmRateSet(+b.dataset.r);$('#wmRateGrid').classList.remove('open');});
document.addEventListener('click',e=>{if(!e.target.closest('.wm-rate'))$('#wmRateGrid').classList.remove('open');});
window.addEventListener('keydown',e=>{
  const wmActive=$('#view-walkman').classList.contains('active');
  if(!wmActive)return;
  if(e.key==='ArrowLeft')wmPrev();
  if(e.key==='ArrowRight')wmNext();
  if(e.key===' ') {e.preventDefault();wmPlay();}
});

/* ================= 首页：题型卡片 ================= */
function typeIcon(k){
  const p={WFD:'<path d="M4 5h16M4 12h10M4 19h7"/><circle cx="17" cy="17" r="3"/>',
    RS:'<path d="M3 11v2m4-4v8m4-12v16m4-13v10m4-15v20"/>',
    RA:'<path d="M4 12V8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v4"/><path d="M4 12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2"/><path d="M4 8H3a6 6 0 0 0 0 12h1"/>',
    SST:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h6M8 16h4"/>',
    DI:'<circle cx="8" cy="14" r="3"/><circle cx="16" cy="9" r="4"/><path d="M8 6v2M4 14h2M12 9h4M18 5v3"/>',
    RL:'<path d="M4 20V8a8 8 0 0 1 16 0v12"/><path d="M4 14h16"/><path d="M7 17h.01M17 17h.01"/>',
    ASQ:'<circle cx="12" cy="12" r="9"/><path d="M9 9.5a3 3 0 0 1 6 0c0 2-3 2.5-3 4"/><path d="M12 17h.01"/>'};
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(p[k]||p.WFD)+'</svg>';
}
function renderTypeGrid(){
  $('#typeGrid').innerHTML=TYPES.map(t=>{
    const n=BANK[t.k].list.length;
    return '<div class="type-card" onclick="location.hash=\'#/practice\';switchType(\''+t.k+'\')">'+
      '<div class="tc-top"><span class="type-icon">'+typeIcon(t.k)+'</span><span class="tc-count">'+n+' 题</span></div>'+
      '<h3>'+esc(t.k)+' · '+esc(lang==='zh'?t.cn:t.en)+'</h3><p>'+esc(lang==='zh'?t.ins_cn.slice(0,24)+'…':t.ins_en.slice(0,44)+'…')+'</p>'+
      '<span class="tc-go">'+(lang==='zh'?'去练习':'Practice')+'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span></div>';
  }).join('');
}

/* ================= 机经练习 ================= */
let P={type:'WFD',idx:0,filter:'all',playing:false,playTimer:null,playStart:0,record:false,recorded:false,recTimer:null,recStart:0,submitted:false,answer:''};
function pList(){return BANK[P.type].list.filter(q=>P.filter==='all'||q.f);}
function pQ(){const l=pList();return l[Math.min(P.idx,l.length-1)]||null;}
function curDone(){const l=pList();return l.filter(q=>q.s).length;}
function stats(){const l=BANK[P.type].list;const c=l.filter(q=>q.s==='c').length,p=l.filter(q=>q.s==='p').length,w=l.filter(q=>q.s==='w').length;return{done:c+p+w,c,p,w,total:l.length};}
function switchType(k){
  P.type=k;P.idx=0;P.filter='all';stopPlay();stopRec();P.submitted=false;P.answer='';P.recorded=false;
  $$('#filterSeg button').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
  renderPractice();
}
function renderPractice(){
  const t=TYPES.find(t=>t.k===P.type);
  if(P.playing)stopPlay();
  if(P.record){P.record=false;P.recorded=false;clearInterval(P.recTimer);}
  const l=pList();if(!l.length){P.idx=0;P.filter='all';toast(T('toast.noFav'));}
  /* tabs */
  $('#typeTabs').innerHTML=TYPES.map(t2=>{
    const n=BANK[t2.k].list.length,act=t2.k===P.type;
    return '<button class="tab'+(act?' active':'')+'" onclick="switchType(\''+t2.k+'\')">'+t2.k+'<span class="n">'+n+'</span></button>';
  }).join('');
  /* module head */
  const tb=lang==='zh'?t.cn:t.en;
  $('#typeBadge').innerHTML=P.type+' <small>'+esc(tb)+'</small>';
  const q=pQ(),st=stats();
  $('#qNoCur').textContent='#'+(q?BANK[P.type].list.indexOf(q)+1:'-');
  $('#qNoPos').textContent=P.idx+1;$('#qNoTotal').textContent=l.length;
  $('#favBtn').classList.toggle('on',!!(q&&q.f));
  /* instruction */
  renderAnswerArea();
  renderResult();
  /* controls */
  $('#qSelect').innerHTML=l.map((q2,i)=>'<option value="'+i+'"'+(i===P.idx?' selected':'')+'>'+(lang==='zh'?'题目':'Q')+' '+(BANK[P.type].list.indexOf(q2)+1)+'</option>').join('');
  /* 右侧题号网格 */
  const qg=$('#qGrid');
  if(qg){
    qg.innerHTML=BANK[P.type].list.map((q2,i)=>{
      const cls=q2.s==='c'?' c':q2.s==='p'?' p':q2.s==='w'?' w':'';
      const cur=i===P.idx?' cur':'';
      return '<div class="q-cell'+cls+cur+'" onclick="jumpQ('+i+')">'+(i+1)+'</div>';
    }).join('');
  }
  $('#prevBtn').disabled=P.idx<=0;$('#nextBtn').disabled=P.idx>=l.length-1;
  /* stats */
  updateSideStats();
  updatePlayUI();
}
function renderAnswerArea(){
  const t=TYPES.find(t=>t.k===P.type),q=pQ(),area=$('#answerArea');
  let inner='';
  if(t.mode==='read'){inner+='<div class="ra-text">'+esc(q.a)+'</div>';}
  if(t.mode==='di'){inner+='<div class="di-figure">'+diChart(q)+'<div style="text-align:center;font-size:12px;color:var(--text-3);font-weight:600;margin-top:8px">'+esc(q.t)+'</div></div>';}
  if(t.mode==='record'||t.mode==='read'||t.mode==='di'){
    const recTxt=P.record?(lang==='zh'?'录音中…':'Recording…'):(P.recorded?(lang==='zh'?'录音完成，可提交作答':'Recorded — ready to submit'):(lang==='zh'?'录音后即可提交':'Ready after recording'));
    const recTime=P.record?'<b id="recTime">00:00</b>':'<b>'+(P.recorded?(lang==='zh'?'已录音':'Recorded'):(lang==='zh'?'点击开始录音':'Click to record'))+'</b>';
    inner+='<div class="record-zone"><button class="rec-btn'+(P.record?' recording':'')+'" id="recBtn" onclick="toggleRec()" title="录音">'+IC.mic+'</button>'+
      '<div><div class="rec-info">'+recTime+'</div>'+
      '<div class="rec-state" id="recState">'+esc(recTxt)+'</div></div></div>';
  }
  if(t.mode==='dictation'){
    inner+='<textarea id="ansInput" placeholder="'+esc(lang==='zh'?'在此输入你听到的句子…':'Type the sentence you hear…')+'"></textarea>';
  }else if(t.mode==='short'){
    inner+='<input type="text" id="ansInput" placeholder="'+esc(lang==='zh'?'输入你的简短答案…':'Type your short answer…')+'">';
  }else if(t.mode==='summarize'){
    inner+='<textarea id="ansInput" placeholder="'+esc(lang==='zh'?'在此输入你的总结…（建议 50–70 词）':'Type your summary here… (50–70 words)')+'"></textarea>'+
      '<div class="wc"><span>'+(lang==='zh'?'字数统计':'Word count')+'：<b id="wcNum">0</b></span><span id="wcHint"></span></div>';
  }
  area.innerHTML=inner;
  const ai=$('#ansInput');
  if(ai)ai.addEventListener('input',()=>{if(t.mode==='summarize')updateWc();});
  updateWc();
  if(P.record&&!inner.includes('recBtn')){/* n/a */}
}
function updateWc(){
  const ai=$('#ansInput'),w=ai?ai.value.trim().split(/\s+/).filter(Boolean).length:0;
  const num=$('#wcNum'),hint=$('#wcHint');
  if(!num)return;
  num.textContent=w;
  if(hint){const ok=w>=50&&w<=70;hint.textContent=ok?(lang==='zh'?'达标 ✓':'On target'):(w>70?(lang==='zh'?'超过 70 词，建议精简':'Over 70 words'):(lang==='zh'?'不足 50 词':'Under 50 words'));
    hint.className=ok?'wc-ok':(w>70?'wc-warn':'wc-warn');}
}
function diChart(q){
  if(q.c==='bar'){const v=[120,160,210,260],m=Math.max(...v);
    return '<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg"><line x1="40" y1="170" x2="330" y2="170" stroke="var(--border)" stroke-width="1.5"/><line x1="40" y1="170" x2="40" y2="20" stroke="var(--border)" stroke-width="1.5"/>'+
      v.map((x,i)=>{const h=Math.round(x/m*130),X=70+i*70;return '<rect x="'+X+'" y="'+(170-h)+'" width="36" height="'+h+'" rx="4" fill="var(--brand)"/><text x="'+(X+18)+'" y="'+(182)+'" font-size="11" text-anchor="middle" fill="var(--text-3)">Q'+(i+1)+'</text><text x="'+(X+18)+'" y="'+(165-h)+'" font-size="11" text-anchor="middle" fill="var(--text-2)">'+x+'</text>';}).join('')+'</svg>';
  }
  if(q.c==='line'){const pts=[[50,140],[120,110],[190,75],[260,45],[330,30]];
    return '<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg"><line x1="40" y1="170" x2="330" y2="170" stroke="var(--border)"/><line x1="40" y1="170" x2="40" y2="20" stroke="var(--border)"/>'+
      '<polyline points="'+pts.map(p=>p[0]+','+p[1]).join(' ')+'" fill="none" stroke="var(--brand)" stroke-width="3"/>'+
      pts.map((p,i)=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="var(--brand)"/><text x="'+(p[0]-8)+'" y="'+(p[1]-10)+'" font-size="11" fill="var(--text-2)">'+['1990','2000','2010','2015','2020'][i]+'</text>').join('')+'</svg>';
  }
  const seg=[[38,'var(--brand)'],[27,'var(--warn)'],[20,'var(--ok)'],[15,'var(--text-3)']];
  let off=0;
  return '<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="100" r="70" fill="none" stroke="var(--surface-2)" stroke-width="38"/>'+
    seg.map(([v,c])=>{const a=v*3.6*3.14159/180,el='<circle cx="150" cy="100" r="70" fill="none" stroke="'+c+'" stroke-width="38" stroke-dasharray="'+v*4.396+' 439.6" stroke-dashoffset="'+(439.6-off)+'"/>';off+=v*4.396;return el;}).join('')+
    '<text x="150" y="105" font-size="16" font-weight="700" text-anchor="middle" fill="var(--text)">2025</text></svg>';
}
function gradeWords(ref,ans){
  /* 精确单词无序匹配：忽略大小写；按空白/标点分词（粘连词如 life.uniform 拆开）；不做词形归一，单复数不一致判为不匹配 */
  const tok=s=>(s||'').split(/[^a-z0-9']+/i).filter(Boolean);
  const norm=w=>w.toLowerCase().replace(/^[^a-z0-9']+|[^a-z0-9']+$/g,'');
  const rt=tok(ref),at=tok(ans);
  const rn=rt.map(norm),an=at.map(norm);
  const rc={},ac={};
  rn.forEach(w=>rc[w]=(rc[w]||0)+1);
  an.forEach(w=>ac[w]=(ac[w]||0)+1);
  const mc={};
  Object.keys(rc).forEach(w=>{if(ac[w])mc[w]=Math.min(rc[w],ac[w]);});
  let matched=0;Object.keys(mc).forEach(w=>matched+=mc[w]);
  const rseen={},aseen={},rcls=[],acls=[];
  rn.forEach(w=>{const cnt=rseen[w]||0,hit=!!(mc[w]&&cnt<mc[w]);rcls.push(hit);if(hit)rseen[w]=cnt+1;});
  an.forEach(w=>{const cnt=aseen[w]||0,hit=!!(mc[w]&&cnt<mc[w]);acls.push(hit);if(hit)aseen[w]=cnt+1;});
  return {matched,total:rt.length,rt,at,rcls,acls};
}
function updateSideStats(){
  const st=stats();
  $('#stDone').textContent=st.done+'/'+st.total;$('#stC').textContent=st.c;$('#stP').textContent=st.p;$('#stW').textContent=st.w;
  const pct=st.total?Math.round(st.done/st.total*100):0;
  $('#stDoneBar').style.width=pct+'%';
}
function renderResult(){
  const rp=$('#resultPanel'),t=TYPES.find(t=>t.k===P.type),q=pQ();
  if(!rp)return;
  if(!P.submitted){rp.classList.remove('show');rp.innerHTML='';return;}
  const isRec=(t.mode==='record'||t.mode==='read'||t.mode==='di');
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
    body='<div class="result-line"><span class="rl-label">Answer:</span> '+refHtml+
      (q.tr?' <span class="ref-tr">'+esc(q.tr)+'</span>':'')+'</div>'+
      '<div class="result-line"><span class="rl-label">Submitted:</span> '+ansHtml+'</div>'+
      '<div class="overall">Overall: <b>'+g.matched+'</b>/'+g.total+'</div>';
    updateSideStats();
  }else{
    body='<div class="result-line"><span class="rl-label">Answer:</span> '+esc(q.a)+
      (q.tr?' <span class="ref-tr">'+esc(q.tr)+'</span>':'')+'</div>';
    if(t.mode!=='di'){
      body+='<div class="result-line"><span class="rl-label">Submitted:</span> '+esc(P.answer||'—')+'</div>';
    }
  }
  const s=q.s;
  if(s&&!isTyped){
    const label=s==='c'?(lang==='zh'?'已标记：完全正确':'Marked: correct'):s==='p'?(lang==='zh'?'已标记：部分正确':'Marked: partial'):(lang==='zh'?'已标记：错误':'Marked: wrong');
    body+='<div class="marked-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>'+esc(label)+'</div>';
  }else if(t.mode==='read'){
    body+='<div class="mark-row"><button class="btn btn-primary btn-sm" onclick="mark(\'c\')">'+(lang==='zh'?'记录完成':'Done')+'</button></div>';
  }else if(!isTyped){
    body+='<div class="mark-row"><span class="mark-title">'+(lang==='zh'?'自我评分：':'Self-mark: ')+'</span>'+
      '<button class="mark-btn m-c" onclick="mark(\'c\')">'+(lang==='zh'?'完全正确':'Correct')+'</button>'+
      '<button class="mark-btn m-p" onclick="mark(\'p\')">'+(lang==='zh'?'部分正确':'Partial')+'</button>'+
      '<button class="mark-btn m-w" onclick="mark(\'w\')">'+(lang==='zh'?'错误':'Wrong')+'</button></div>';
  }
  rp.innerHTML='<div class="result-body">'+body+'</div>';
  rp.classList.add('show');
}
function jumpQ(i){
  P.filter='all';P.idx=i;P.submitted=false;P.answer='';P.recorded=false;
  $$('#filterSeg button').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
  renderPractice();play();
}
function goNext(){if(P.idx<pList().length-1){P.idx++;P.submitted=false;P.answer='';P.recorded=false;renderPractice();play();}}
function mark(s){
  const q=pQ();if(!q)return;q.s=s;P.submitted=true;renderPractice();toast(T('toast.marked'));
}
function submitQ(){
  const t=TYPES.find(t=>t.k===P.type),q=pQ(),ai=$('#ansInput');
  const isRec=(t.mode==='record'||t.mode==='read'||t.mode==='di');
  if(isRec&&!P.recorded){toast(T('toast.empty'));return;}
  if(!isRec&&(!ai||!ai.value.trim())){toast(T('toast.empty'));return;}
  P.answer=isRec?'':(ai.value.trim());
  P.submitted=true;renderResult();toast(T('toast.submitted'));
}
function resetQ(){stopPlay();stopRec();P.submitted=false;P.recorded=false;P.answer='';
  renderPractice();toast(T('toast.reset'));}
$('#submitBtn').onclick=submitQ;
$('#resetBtn').onclick=resetQ;
$('#prevBtn').onclick=()=>{if(P.idx>0){P.idx--;P.submitted=false;P.answer='';P.recorded=false;renderPractice();play();}};
$('#nextBtn').onclick=goNext;
$('#qSelect').onchange=e=>{P.idx=+e.target.value;P.submitted=false;P.answer='';P.recorded=false;renderPractice();};
$('#favBtn').onclick=()=>{const q=pQ();if(!q)return;q.f=q.f?0:1;renderPractice();
  if(P.filter==='fav'&&!q.f&&!pList().length){P.filter='all';$$('#filterSeg button').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));toast(T('toast.noFav'));}};
$('#filterSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  P.filter=b.dataset.filter;P.idx=0;P.submitted=false;P.answer='';
  $$('#filterSeg button').forEach(x=>x.classList.toggle('active',x.dataset.filter===P.filter));
  renderPractice();});
/* 播放模拟 */
function stopPlay(){if(wfdAudio){try{wfdAudio.pause();}catch(e){}wfdAudio=null;}
  P.playing=false;clearInterval(P.playTimer);
  $('#playBtn').classList.remove('playing');$('#wave').classList.remove('playing');
  $('#playIcon').innerHTML=IC.play;$('#playTime').textContent='00:00';
  $('#playState').textContent=T('practice.player.idle');}
function updatePlayUI(){if(!P.playing){$('#playBtn').classList.remove('playing');$('#wave').classList.remove('playing');$('#playIcon').innerHTML=IC.play;$('#playState').textContent=T('practice.player.idle');}}
let wfdAudio=null;
function play(){if(P.playing){stopPlay();return;}
  const q=pQ();
  /* WFD 真实音频（来自视频切分） */
  if(P.type==='WFD'&&q&&q.audio){
    const a=new Audio(q.audio);
    wfdAudio=a;
    a.addEventListener('timeupdate',()=>{const sec=Math.round(a.currentTime||0);$('#playTime').textContent='0'+Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');});
    a.addEventListener('ended',()=>stopPlay());
    a.addEventListener('error',()=>{stopPlay();toast(lang==='zh'?'音频加载失败，请确认 assets/audio 目录完整':'Audio failed to load');});
    P.playStart=Date.now();
    a.play().then(()=>{
      P.playing=true;
      $('#playBtn').classList.add('playing');$('#wave').classList.add('playing');$('#playIcon').innerHTML=IC.stop;
      $('#playState').textContent=T('practice.player.playing');
    }).catch(()=>{stopPlay();toast(lang==='zh'?'音频播放失败':'Playback failed');});
    return;
  }
  /* 其他题型：模拟播放 */
  P.playing=true;P.playStart=Date.now();
  $('#playBtn').classList.add('playing');$('#wave').classList.add('playing');$('#playIcon').innerHTML=IC.stop;
  $('#playState').textContent=T('practice.player.playing');
  P.playTimer=setInterval(()=>{
    const el=Math.min(4200,Date.now()-P.playStart),s=Math.round(el/1000);
    $('#playTime').textContent='0'+Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
    if(el>=4200){stopPlay();toast(T('toast.play'));}
  },100);toast(T('toast.play'));}
$('#playBtn').onclick=play;$('#playCtl').onclick=play;
/* 录音模拟 */
function stopRec(){
  if(P.record){P.record=false;P.recorded=true;clearInterval(P.recTimer);}
  const rb=$('#recBtn'),rs=$('#recState'),rt=$('#recTime');
  if(rb)rb.classList.remove('recording');
  if(rs)rs.textContent=lang==='zh'?'录音完成，可提交作答':'Recorded — ready to submit';
  if(rt)rt.textContent='00:00';}
function toggleRec(){
  if(P.record){stopRec();return;}
  P.record=true;P.recorded=false;P.recStart=Date.now();const rb=$('#recBtn'),rs=$('#recState'),rt=$('#recTime');
  if(rb)rb.classList.add('recording');
  if(rs)rs.textContent=lang==='zh'?'录音中…（原型演示）':'Recording… (demo)';
  P.recTimer=setInterval(()=>{if(rt){const s=Math.round((Date.now()-P.recStart)/1000);rt.textContent='0'+Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}},200);
  toast(T('toast.record'));}

/* ================= CLB 表格 ================= */
const CLB=[
 [10,'89–90','88–90','89–90','90',''],
 [9,'82–88','78–87','84–88','88–89',''],
 [8,'71–81','69–77','76–83','79–87',''],
 [7,'60–70','60–68','68–75','69–78','常见门槛'],
 [6,'50–59','51–59','59–67','60–68',''],
 [5,'39–49','42–50','51–58','51–59',''],
 [4,'28–38','33–41','42–50','41–50',''],
 [3,'18–27','24–32','34–41','32–40','']];
function renderClbRows(){
  $('#clbRows').innerHTML=CLB.map(r=>{
    const lv=r[5]?'<span class="clb-lv">'+r[0]+'<i>'+esc(lang==='zh'?r[5]:(r[0]===7?'Common target':''))+'</i></span>':'<span class="clb-lv">'+r[0]+'</span>';
    return '<tr'+(r[5]?' class="hl"':'')+'><td>'+lv+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td></tr>';
  }).join('');
}

/* ================= 社区 ================= */
let tagFilter='';
function renderTagCloud(){
  $('#tagCloud').innerHTML=TAGS.map(t=>'<button class="'+(tagFilter===t?'on':'')+'" onclick="setTag(\''+t+'\')">'+t+'</button>').join('');
}
function setTag(t){tagFilter=tagFilter===t?'':t;renderTagCloud();renderThreads();}
function renderThreads(){
  const kw=$('#commSearch').value.trim().toLowerCase();
  const list=THREADS.filter(th=>(!tagFilter||th.tag===tagFilter)&&(!kw||(th.t+' '+th.ex).toLowerCase().includes(kw)));
  const el=$('#threadList');
  if(!list.length){el.innerHTML='<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M8 11h6"/></svg><p>'+esc(T('thread.empty'))+'</p></div>';return;}
  el.innerHTML=list.map((th,i)=>{
    const gi=THREADS.indexOf(th);
    return '<article class="thread" onclick="openThread('+gi+')">'+
      '<div class="th-top"><span class="tag-chip '+th.tagCls+'">'+th.tag+'</span><span style="margin-left:auto;font-size:12px;color:var(--text-3)">'+th.time+'</span></div>'+
      '<h3>'+esc(th.t)+'</h3><p class="th-ex">'+esc(th.ex)+'</p>'+
      '<div class="th-foot"><span class="mini-ava">'+th.u[0]+'</span><span class="name">'+th.u+'</span>'+
      '<span class="act"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.6-.7L3 21l1.8-5A8.4 8.4 0 1 1 21 11.5z"/></svg>'+th.reply+'</span>'+
      '<span class="act"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11M3 10h4l3-7h4l-1 5h6l-7 13h-5"/></svg>'+th.like+'</span></div></article>';
  }).join('');
}
function openThread(i){
  const th=THREADS[i];
  const body='<div class="thread-detail"><div class="td-meta"><span class="tag-chip '+th.tagCls+'">'+th.tag+'</span><span class="mini-ava">'+th.u[0]+'</span><b>'+esc(th.u)+'</b><span>'+th.time+'</span></div>'+
    '<h3 style="font-size:18px;font-weight:800;margin-bottom:10px">'+esc(th.t)+'</h3>'+
    '<p>'+esc(th.ex)+'</p>'+
    '<p>'+(lang==='zh'?'（本帖为原型演示内容，正文为示例。真实社区支持回复、点赞与楼层展开等交互。）':'(Prototype demo content. A real community supports replies, likes and threaded views.)')+'</p></div>';
  openModal(modalShell(lang==='zh'?'帖子详情':'Thread',body,
    '<span class="act" style="margin-right:auto;display:inline-flex;align-items:center;gap:4px;font-size:13px;color:var(--text-3)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.6-.7L3 21l1.8-5A8.4 8.4 0 1 1 21 11.5z"/></svg>'+th.reply+' '+esc(T('detail.reply'))+'</span>'+
    '<button class="btn btn-primary" onclick="closeModal()">'+esc(T('btn.ok'))+'</button>'));
}
function openPostModal(){
  const tags=TAGS.slice(0,6).map(t=>'<option>'+t+'</option>').join('');
  openModal(modalShell(T('post.title'),
    '<div class="field"><label>'+esc(T('post.f.title'))+'</label><input id="postTitle" maxlength="40" placeholder="'+(lang==='zh'?'一句话说清你的主题':'Summarize your topic in one line')+'"></div>'+
    '<div class="field"><label>'+esc(T('post.f.tag'))+'</label><select id="postTag">'+tags+'</select></div>'+
    '<div class="field"><label>'+esc(T('post.f.content'))+'</label><textarea id="postBody" placeholder="'+(lang==='zh'?'写下你的经验或问题…':'Share your experience or question…')+'"></textarea></div>',
    '<button class="btn btn-ghost" onclick="closeModal()">'+esc(T('btn.cancel'))+'</button><button class="btn btn-primary" onclick="doPost()">'+esc(T('btn.post'))+'</button>'));
}
function doPost(){
  const t=$('#postTitle').value.trim(),b=$('#postBody').value.trim();
  if(!t||!b){toast(T('toast.postEmpty'));return;}
  const tg=$('#postTag').value;
  const cls={WFD:'tag-wfd',RS:'tag-rs',SST:'tag-sst',DI:'tag-general',RL:'tag-general',ASQ:'tag-general'}[tg]||'tag-general';
  THREADS.unshift({tag:tg,tagCls:cls,t:t,ex:b.slice(0,80)+(b.length>80?'…':''),u:'我',time:lang==='zh'?'刚刚':'Just now',reply:0,like:0});
  closeModal();renderThreads();toast(T('toast.posted'));
}
$('#postBtn').onclick=openPostModal;
$('#commSearch').addEventListener('input',renderThreads);

/* ================= 初始化 ================= */
applyTheme();applyLang();router();