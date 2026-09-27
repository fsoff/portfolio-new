(()=>{
const siteBase=new URL('.',document.currentScript.src);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches&&'IntersectionObserver'in window){document.documentElement.classList.add('motion-ready');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));}
const cursor=document.querySelector('.hand-cursor');
if(cursor&&matchMedia('(hover:hover) and (pointer:fine)').matches){
 const hand=new Image();hand.src=new URL('assets/hand-open.webp',siteBase).href;hand.onload=()=>document.body.classList.add('custom-cursor');
 document.addEventListener('pointermove',e=>{cursor.classList.add('visible');cursor.style.transform=`translate3d(${e.clientX-8}px,${e.clientY-18}px,0)`;const target=e.target.closest('[data-cursor],a,button');cursor.querySelector('span').textContent=target?.dataset.cursor||(target?.tagName==='A'?'Open':target?'Select':'');},{passive:true});
 document.addEventListener('pointerdown',e=>{if(e.target.closest('.drag-gallery,.landscape-drag,.turntable,.model-viewer'))cursor.classList.add('grabbing')});
 for(const event of ['pointerup','pointercancel','blur'])window.addEventListener(event,()=>cursor.classList.remove('grabbing'));
 document.documentElement.addEventListener('pointerleave',()=>cursor.classList.remove('visible'));
 document.addEventListener('keydown',e=>{if(e.key==='Tab')cursor.classList.remove('visible')});
}
const stage=document.querySelector('.image-stage');
if(stage){let sequence=0;let current='';const layers=[...stage.querySelectorAll('img')];let active=0;
 const change=async(el)=>{const src=el.dataset.image;if(!src||src===current)return;current=src;const n=++sequence;const next=layers[1-active];next.src=src;next.alt=el.dataset.title||'';try{await next.decode()}catch{}if(n!==sequence)return;layers[active].classList.remove('active');next.classList.add('active');active=1-active;stage.classList.toggle('dark',el.dataset.dark==='true');document.querySelector('#preview-title').textContent=el.dataset.title||'';document.querySelector('#preview-kind').textContent=el.dataset.kind||'';document.querySelector('#preview-link').href=el.getAttribute('href')||el.dataset.href||'#';};
 document.querySelectorAll('.project-row').forEach(el=>{el.addEventListener('pointerenter',()=>change(el));el.addEventListener('focus',()=>change(el));});
 const chapters=new IntersectionObserver(es=>{const visible=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);if(visible.length)change(visible[0].target.querySelector('.project-row'))},{rootMargin:'-15% 0px -35% 0px',threshold:[0,.2,.5]});document.querySelectorAll('.chapter').forEach(el=>chapters.observe(el));
}
const gallery=document.querySelector('.drag-gallery');
if(gallery){let startX=0,startScroll=0,dragging=false,moved=false;const prev=document.querySelector('[data-gallery-prev]'),next=document.querySelector('[data-gallery-next]');
 const controls=()=>{prev.disabled=gallery.scrollLeft<5;next.disabled=gallery.scrollLeft>=gallery.scrollWidth-gallery.clientWidth-5;};
 gallery.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;dragging=true;moved=false;startX=e.clientX;startScroll=gallery.scrollLeft;});
 window.addEventListener('pointermove',e=>{if(!dragging)return;let d=e.clientX-startX;if(Math.abs(d)>5)moved=true;if(moved){gallery.scrollLeft=startScroll-d;e.preventDefault();}},{passive:false});
 window.addEventListener('pointerup',()=>{dragging=false;});window.addEventListener('pointercancel',()=>{dragging=false;moved=false;});window.addEventListener('blur',()=>dragging=false);
 gallery.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);gallery.addEventListener('dragstart',e=>e.preventDefault());
 const move=d=>{moved=false;gallery.scrollBy({left:d*gallery.clientWidth*.75,behavior:reduced.matches?'instant':'smooth'})};prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});gallery.addEventListener('scroll',controls,{passive:true});window.addEventListener('resize',controls);controls();
}
const reader=document.querySelector('[data-reader]');
if(reader){const pages=JSON.parse(reader.dataset.pages);let page=0;const img=reader.querySelector('img'),label=reader.querySelector('.reader-progress'),prev=reader.querySelector('[data-prev]'),next=reader.querySelector('[data-next]');function show(delta){page=Math.max(0,Math.min(pages.length-1,page+delta));img.src=pages[page];img.alt=`${reader.dataset.title}, page ${page+1}`;label.textContent=`${String(page+1).padStart(2,'0')} / ${pages.length}`;prev.disabled=page===0;next.disabled=page===pages.length-1;}prev.addEventListener('click',()=>show(-1));next.addEventListener('click',()=>show(1));reader.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();show(e.key==='ArrowLeft'?-1:1)}});show(0);}
const dialog=document.querySelector('dialog.lightbox');if(dialog){document.querySelectorAll('.image-open').forEach(b=>b.addEventListener('click',()=>{const original=b.querySelector('img');dialog.querySelector('img').src=original.src;dialog.querySelector('img').alt=original.alt;dialog.querySelector('.lightbox-caption').textContent=original.alt;dialog.showModal();}));dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});}
// The landscape is moved by the visitor, never by scroll position.
const landscape=document.querySelector('.landscape-drag');
if(landscape){const art=landscape.querySelector('img');let x=0,y=0,originX=0,originY=0,startX=0,startY=0,held=false;
 const apply=()=>{const limit=innerWidth<681?28:55;x=Math.max(-limit,Math.min(limit,x));y=Math.max(-32,Math.min(32,y));art.style.transform=`translate(${x}px,${y}px)`};
 landscape.addEventListener('pointerdown',e=>{if(e.button!==0)return;held=true;startX=e.clientX;startY=e.clientY;originX=x;originY=y;landscape.setPointerCapture(e.pointerId);});
 landscape.addEventListener('pointermove',e=>{if(!held)return;x=originX+e.clientX-startX;y=originY+e.clientY-startY;apply();});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])landscape.addEventListener(event,()=>held=false);
 landscape.addEventListener('dragstart',e=>e.preventDefault());
 const reset=()=>{x=0;y=0;apply()};document.querySelector('[data-reset-landscape]').addEventListener('click',reset);
 landscape.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home')reset();else{if(e.key==='ArrowLeft')x-=8;if(e.key==='ArrowRight')x+=8;if(e.key==='ArrowUp')y-=8;if(e.key==='ArrowDown')y+=8;apply();}}});
}
const table=document.querySelector('[data-turntable]');
if(table){const frames=JSON.parse(table.dataset.frames);const img=table.querySelector('img');const range=document.querySelector('[data-turn-range]'),label=document.querySelector('[data-turn-count]');let index=0,held=false,startX=0,startIndex=0;const loaded=new Map();
 const show=i=>{index=((i%frames.length)+frames.length)%frames.length;img.src=frames[index];img.alt=`Clay sculpture, view ${index+1} of ${frames.length}`;range.value=String(index);label.textContent=`${String(index+1).padStart(2,'0')} / ${frames.length}`};
 const preload=()=>frames.forEach(src=>{if(!loaded.has(src)){let im=new Image();im.src=src;loaded.set(src,im)}});
 table.addEventListener('pointerenter',preload,{once:true});table.addEventListener('focus',preload,{once:true});
 table.addEventListener('pointerdown',e=>{if(e.button!==0)return;preload();held=true;startX=e.clientX;startIndex=index;table.setPointerCapture(e.pointerId)});
 table.addEventListener('pointermove',e=>{if(held)show(startIndex+Math.round((e.clientX-startX)/22))});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])table.addEventListener(event,()=>held=false);
 table.addEventListener('dragstart',e=>e.preventDefault());range.addEventListener('input',()=>show(Number(range.value)));document.querySelector('[data-turn-prev]').addEventListener('click',()=>show(index-1));document.querySelector('[data-turn-next]').addEventListener('click',()=>show(index+1));
 table.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home'].includes(e.key)){e.preventDefault();show(e.key==='Home'?0:index+(e.key==='ArrowLeft'?-1:1))}});
}
if(!reduced.matches&&'IntersectionObserver'in window){const pictures=[...document.querySelectorAll('img')].filter(im=>!im.closest('.hand-cursor,.image-stage,.turntable,.model-viewer,dialog'));const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.05});pictures.forEach(im=>{im.classList.add('image-reveal');if(im.complete)im.classList.add('is-loaded');else{im.addEventListener('load',()=>im.classList.add('is-loaded'),{once:true});im.addEventListener('error',()=>im.classList.add('is-loaded'),{once:true})}observer.observe(im)});}
document.querySelectorAll('iframe').forEach(frame=>frame.addEventListener('pointerenter',()=>cursor?.classList.remove('visible')));
})();
