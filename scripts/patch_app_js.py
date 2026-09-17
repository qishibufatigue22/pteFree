# -*- coding: utf-8 -*-
"""app.js 改造：WFD 真实音频播放 + 答案译文展示"""
import io

p = r"E:\code\pte_doubao\js\app.js"
s = io.open(p, encoding="utf-8").read()
had_crlf = ("\r\n" in s)
s = s.replace("\r\n", "\n")

def rep(old, new, required=True):
    global s
    n = s.count(old)
    if n == 0 and required:
        raise SystemExit("NOT FOUND: %r" % old[:90])
    s = s.replace(old, new, 1)

# 1) play() 支持真实音频
old_play = """function play(){if(P.playing){stopPlay();return;}
  P.playing=true;P.playStart=Date.now();
  $('#playBtn').classList.add('playing');$('#wave').classList.add('playing');$('#playIcon').innerHTML=IC.stop;
  $('#playState').textContent=T('practice.player.playing');
  P.playTimer=setInterval(()=>{
    const el=Math.min(4200,Date.now()-P.playStart),s=Math.round(el/1000);
    $('#playTime').textContent='0'+Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
    if(el>=4200){stopPlay();toast(T('toast.play'));}
  },100);toast(T('toast.play'));}"""
new_play = """let wfdAudio=null;
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
  },100);toast(T('toast.play'));}"""
rep(old_play, new_play)

# 2) stopPlay() 停止真实音频
old_stop = """function stopPlay(){P.playing=false;clearInterval(P.playTimer);
  $('#playBtn').classList.remove('playing');$('#wave').classList.remove('playing');
  $('#playIcon').innerHTML=IC.play;$('#playTime').textContent='00:00';
  $('#playState').textContent=T('practice.player.idle');}"""
new_stop = """function stopPlay(){if(wfdAudio){try{wfdAudio.pause();}catch(e){}wfdAudio=null;}
  P.playing=false;clearInterval(P.playTimer);
  $('#playBtn').classList.remove('playing');$('#wave').classList.remove('playing');
  $('#playIcon').innerHTML=IC.play;$('#playTime').textContent='00:00';
  $('#playState').textContent=T('practice.player.idle');}"""
rep(old_stop, new_stop)

# 3) 提交后展示中文译文
old_res = """      '<div class="result-answer">'+esc(isRec?(t.mode==='di'?q.a:q.a):(q.a))+'</div>';
    if(t.mode!=='di'){"""
new_res = """      '<div class="result-answer">'+esc(isRec?(t.mode==='di'?q.a:q.a):(q.a))+'</div>';
    if(q.tr)body+='<div class="result-tr">'+esc(q.tr)+'</div>';
    if(t.mode!=='di'){"""
rep(old_res, new_res)

if had_crlf:
    s = s.replace("\n", "\r\n")
io.open(p, "w", encoding="utf-8", newline="").write(s)
print("OK app.js patched")
