// ヒーローの波形デモ（音は出ません）。Space か GO ボタンで再生ヘッドが進む。
(function(){
  var wave=document.querySelector('.wave'); if(!wave) return;
  var svg=wave.querySelector('svg'), head=wave.querySelector('.head'), btn=document.querySelector('.go');
  var tc=document.querySelector('[data-tc]'), N=72, bars=[], DUR=6000, t0=0, raf=0, pos=0;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ns='http://www.w3.org/2000/svg';
  svg.setAttribute('viewBox','0 0 '+(N*10)+' 100'); svg.setAttribute('preserveAspectRatio','none');
  for(var i=0;i<N;i++){
    var x=i/(N-1), env=Math.sin(Math.PI*Math.min(1,x*1.15))*0.75+0.2;
    var h=Math.max(8,Math.min(96,(env*(0.62+0.38*Math.abs(Math.sin(i*1.7)*Math.cos(i*0.43))))*100));
    var r=document.createElementNS(ns,'rect');
    r.setAttribute('x',i*10+2); r.setAttribute('width',6); r.setAttribute('rx',3);
    r.setAttribute('y',(100-h)/2); r.setAttribute('height',h); r.setAttribute('class','bar');
    svg.appendChild(r); bars.push(r);
  }
  function fmt(ms){var s=Math.floor(ms/1000),f=Math.floor((ms%1000)/10);return '00:00:0'+s+'.'+(f<10?'0':'')+f;}
  function draw(p){
    pos=p; var k=Math.floor(p*N);
    for(var i=0;i<N;i++) bars[i].classList.toggle('done',i<k);
    head.style.left=(p*100)+'%';
    if(tc) tc.textContent=fmt(p*DUR);
  }
  function stop(){cancelAnimationFrame(raf);raf=0;btn.setAttribute('aria-pressed','false');}
  function tick(now){
    var p=(now-t0)/DUR;
    if(p>=1){draw(1);stop();return;}
    draw(p); raf=requestAnimationFrame(tick);
  }
  function go(){
    if(raf){stop();return;}
    btn.setAttribute('aria-pressed','true');
    if(reduce){draw(1);stop();return;}
    var start=pos>=1?0:pos; t0=performance.now()-start*DUR; raf=requestAnimationFrame(tick);
  }
  btn.addEventListener('click',go);
  document.addEventListener('keydown',function(e){
    if(e.code!=='Space'||e.target!==document.body) return;
    e.preventDefault(); go();
  });
  draw(0.32);
})();
