/* WattSettle explainer — motion, simulator, sound. Vanilla + GSAP. */
(function(){
"use strict";
const REDUCE = matchMedia("(prefers-reduced-motion:reduce)").matches;
const $ = (s,c)=> (c||document).querySelector(s);
const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));
const sleep = ms => new Promise(r=>setTimeout(r, REDUCE?0:ms));

/* ---------- reveals via IntersectionObserver (robust) ---------- */
if(!REDUCE){
  const io=new IntersectionObserver((es)=>es.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
  }),{rootMargin:"0px 0px -7% 0px",threshold:.05});
  $$(".rv").forEach(el=>{ if(!el.closest(".hero")) io.observe(el); });
}

/* ---------- GSAP hero + counters + bars ---------- */
if(window.gsap && window.ScrollTrigger && !REDUCE){
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".hero .rv",{opacity:1,y:0,filter:"blur(0px)",duration:1,ease:"power3.out",stagger:.12,delay:.15});
  // score bars grow
  $$(".tbl .bar i").forEach(bar=>{
    const w=bar.style.width; bar.style.width="0%";
    ScrollTrigger.create({trigger:bar,start:"top 92%",once:true,onEnter:()=>gsap.to(bar,{width:w,duration:1.1,ease:"power2.out"})});
  });
  // stat count-up
  $$(".stat .big").forEach(el=>{
    const txt=el.textContent, m=txt.match(/^(\d+)/);
    if(m){ const end=+m[1], rest=txt.slice(m[1].length);
      ScrollTrigger.create({trigger:el,start:"top 92%",once:true,onEnter:()=>{
        const o={v:0}; gsap.to(o,{v:end,duration:1.3,ease:"power2.out",onUpdate:()=>el.textContent=Math.round(o.v)+rest});
      }});
    }
  });
} else {
  $$(".rv").forEach(e=>{e.style.opacity=1;e.style.transform="none";e.style.filter="none";});
}

/* ---------- hero energy canvas ---------- */
(function(){
  const cv=$("#flowCanvas"); if(!cv||REDUCE) return;
  const ctx=cv.getContext("2d"); let w,h,parts=[],raf;
  const COL=["#B8F23A","#35E0D2","#9B8CFF"];
  function size(){ w=cv.width=cv.offsetWidth*devicePixelRatio; h=cv.height=cv.offsetHeight*devicePixelRatio; }
  function seed(){ parts=[]; const n=Math.min(70,Math.floor(w/26));
    for(let i=0;i<n;i++)parts.push({x:Math.random()*w,y:Math.random()*h,s:.3+Math.random()*.9,r:(Math.random()*1.6+.5)*devicePixelRatio,c:COL[i%3],a:.15+Math.random()*.4}); }
  function tick(){ ctx.clearRect(0,0,w,h);
    for(const p of parts){ p.x+=p.s*devicePixelRatio; if(p.x>w+20){p.x=-20;p.y=Math.random()*h;}
      ctx.globalAlpha=p.a; ctx.fillStyle=p.c; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill();
      ctx.globalAlpha=p.a*.25; ctx.fillRect(p.x-14*devicePixelRatio,p.y-p.r/2,14*devicePixelRatio,p.r);
    } ctx.globalAlpha=1; raf=requestAnimationFrame(tick); }
  size();seed();tick();
  addEventListener("resize",()=>{cancelAnimationFrame(raf);size();seed();tick();});
})();

/* ---------- sound (Web Audio) ---------- */
let AC=null, soundOn=false;
const soundBtn=$("#soundBtn");
soundBtn.addEventListener("click",()=>{
  soundOn=!soundOn; soundBtn.classList.toggle("on",soundOn);
  soundBtn.title=soundOn?"Matikan suara":"Nyalakan suara";
  if(soundOn && !AC){ try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){} }
  if(soundOn) beep([[660,0],[880,.08]],.12,"sine",.05);
});
function beep(notes,dur,type,vol){
  if(!soundOn||!AC) return;
  notes.forEach(([f,t])=>{
    const o=AC.createOscillator(),g=AC.createGain(); o.type=type||"sine"; o.frequency.value=f;
    o.connect(g); g.connect(AC.destination); const now=AC.currentTime+(t||0);
    g.gain.setValueAtTime(0,now); g.gain.linearRampToValueAtTime(vol||.06,now+.02);
    g.gain.exponentialRampToValueAtTime(.0001,now+dur); o.start(now); o.stop(now+dur+.02);
  });
}
const sndApprove=()=>beep([[523,0],[659,.09],[784,.18]],.5,"triangle",.07);
const sndReject =()=>beep([[180,0],[120,.12]],.4,"sawtooth",.06);
const sndStep   =()=>beep([[420,0]],.09,"sine",.03);

/* ---------- option toggle ---------- */
$$(".opt-switch button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const opt=btn.dataset.opt;
    $$(".opt-switch button").forEach(b=>b.classList.remove("on","six"));
    btn.classList.add("on"); if(opt==="6")btn.classList.add("six");
    $("#panel5").classList.toggle("show",opt==="5");
    $("#panel6").classList.toggle("show",opt==="6");
    sndStep();
  });
});

/* ---------- connectors placement ---------- */
function placeConns(){
  const stage=$("#simStage"); if(!stage) return;
  const nodes=$$(".node",stage), sr=stage.getBoundingClientRect();
  for(let i=0;i<3;i++){
    const c=$("#c"+(i+1)); if(!c||!nodes[i]||!nodes[i+1])continue;
    const a=nodes[i].getBoundingClientRect(), b=nodes[i+1].getBoundingClientRect();
    if(getComputedStyle(c).display==="none")continue;
    c.style.left=(a.right-sr.left)+"px";
    c.style.width=(b.left-a.right)+"px";
  }
}
addEventListener("resize",placeConns); setTimeout(placeConns,60);

/* ---------- simulator ---------- */
let running=false;
const nodes=()=>$$("#simStage .node");
const conns=["#c1","#c2","#c3"].map(s=>$(s));
function resetSim(){
  nodes().forEach(n=>{n.classList.remove("active","approve","reject");});
  conns.forEach(c=>{const i=$("i",c); if(i)i.style.width="0";});
  ["v0","v1","v2","v3"].forEach(id=>$("#"+id).textContent="");
}
function rand(n){let s="0x";const h="0123456789abcdef";for(let i=0;i<n;i++)s+=h[Math.floor(Math.random()*16)];return s;}

async function runSim(real){
  if(running)return; running=true; resetSim();
  const N=nodes(), st=$("#simStatus"), vd=$("#verdict");
  vd.className="sim-verdict mono"; vd.textContent="Memproses…"; st.textContent="mengirim…";
  placeConns();

  // node 0 — meter
  N[0].classList.add("active"); sndStep();
  $("#v0").textContent = real ? "512.4 kWh · EIP-712 ✓" : "5000 kWh @ 02:14 · signed";
  await sleep(700);
  // conn 0 -> node1
  if($("i",conns[0]))$("i",conns[0]).style.width="100%"; await sleep(500);
  N[1].classList.add("active"); sndStep(); st.textContent="on-chain";
  $("#v1").textContent="nonce 1187 · anti-replay ✓";
  await sleep(700);
  // conn 1 -> node2 (AI)
  if($("i",conns[1]))$("i",conns[1]).style.width="100%"; await sleep(500);
  N[2].classList.add("active"); st.textContent="AI verifier menilai…";
  $("#v2").textContent="bounds · z-score · cross-source";
  await sleep(900);

  if(real){
    N[2].classList.remove("active"); N[2].classList.add("approve");
    $("#v2").textContent="anomaly 0.02 · LOLOS";
    if($("i",conns[2]))$("i",conns[2]).style.width="100%"; await sleep(500);
    N[3].classList.add("approve"); $("#v3").textContent="+512 suriota · fee 5";
    st.textContent="settled ✓"; sndApprove();
    vd.className="sim-verdict mono ok";
    vd.innerHTML='<b>APPROVE</b> — pembacaan wajar. AI attestation: <span style="color:var(--muted)">{approved:true, anomalyScore:0.02, crossCheck:"irradiance OK", modelHash:'+rand(6)+'}</span><br>Settlement: <b>+512 suriota</b> → produsen · fee 1% → treasury<br>tx: <span class="tx">'+rand(40)+'</span> ✓ confirmed';
  } else {
    N[2].classList.remove("active"); N[2].classList.add("reject");
    $("#v2").textContent="malam · irradiance=0 · TOLAK";
    if($("i",conns[2])){$("i",conns[2]).style.background="linear-gradient(90deg,transparent,var(--heat))";$("i",conns[2]).style.width="100%";} await sleep(500);
    N[3].classList.add("reject"); $("#v3").textContent="0 dibayar · refund";
    st.textContent="rejected ✕"; sndReject();
    vd.className="sim-verdict mono no";
    vd.innerHTML='<b>REJECT</b> — kontradiksi cross-source. AI attestation: <span style="color:var(--muted)">{approved:false, reason:"generation at night, irradiance=0, exceeds nameplate"}</span><br>Settlement: <b>0 suriota</b> · penolakan tercatat permanen on-chain<br>Signature valid, tapi data tak lolos plausibilitas → <b>garbage-in ditolak.</b>';
    // restore conn color for next run
    setTimeout(()=>{if($("i",conns[2]))$("i",conns[2]).style.background="";},1200);
  }
  running=false;
}
$("#btnReal") && $("#btnReal").addEventListener("click",()=>runSim(true));
$("#btnFake") && $("#btnFake").addEventListener("click",()=>runSim(false));

/* ---------- nav shrink ---------- */
let last=0;
addEventListener("scroll",()=>{
  const y=scrollY; const n=$(".nav");
  if(n) n.style.transform = (y>last && y>200)?"translateY(-120%)":"translateY(0)";
  last=y;
},{passive:true});
})();
