"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

const isReal=(url:string)=>!!url && !url.startsWith('/vehicles/');

export function VehicleGallery({ images, title, locale="pl" }: { images: string[]; title: string; locale?:Locale }) {
  const safeImages=images.filter(isReal); const en=locale==='en';
  const [active,setActive]=useState(0); const [open,setOpen]=useState(false); const touchStart=useRef<number|null>(null);
  const prev=()=>setActive(i=>(i-1+safeImages.length)%safeImages.length);
  const next=()=>setActive(i=>(i+1)%safeImages.length);
  const openAt=(index:number)=>{setActive(index);setOpen(true)};
  useEffect(()=>{
    if(!open)return;
    const y=window.scrollY; document.body.style.position='fixed';document.body.style.top=`-${y}px`;document.body.style.width='100%';
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false);if(e.key==='ArrowLeft'&&safeImages.length>1)prev();if(e.key==='ArrowRight'&&safeImages.length>1)next();};
    window.addEventListener('keydown',key);
    return()=>{window.removeEventListener('keydown',key);const top=document.body.style.top;document.body.style.position='';document.body.style.top='';document.body.style.width='';window.scrollTo(0,Math.abs(parseInt(top||'0',10)));};
  },[open,safeImages.length]);
  const swipeEnd=(x:number)=>{if(touchStart.current===null)return;const d=x-touchStart.current;if(Math.abs(d)>45){d>0?prev():next();}touchStart.current=null;};

  if(!safeImages.length)return <div className="detail-image vehicle-gallery-empty"><strong>COOL CARS</strong><span>{en?'Photos coming soon':'Zdjęcia wkrótce'}</span></div>;
  const side=safeImages.slice(1,3);
  return <div className="vehicle-gallery premium-gallery">
    <div className={`vehicle-gallery-mosaic ${safeImages.length===1?'single':''}`}>
      <button type="button" className="gallery-tile gallery-tile-main" onClick={()=>openAt(0)} aria-label={en?'Open fullscreen gallery':'Otwórz galerię pełnoekranową'}><img src={safeImages[0]} alt={`${title} — ${en?'photo':'zdjęcie'} 1`}/><span className="gallery-count">1 / {safeImages.length}</span></button>
      {side.map((src,index)=><button type="button" className="gallery-tile gallery-tile-side" key={src} onClick={()=>openAt(index+1)} aria-label={`${en?'Open photo':'Otwórz zdjęcie'} ${index+2}`}><img src={src} alt={`${title} — ${en?'photo':'zdjęcie'} ${index+2}`}/>{index===side.length-1&&<span className="gallery-all-label">{en?`View all ${safeImages.length} photos`:`Zobacz wszystkie ${safeImages.length} zdjęć`}</span>}</button>)}
      {safeImages.length===2&&<button type="button" className="gallery-tile gallery-tile-side gallery-more-tile" onClick={()=>openAt(0)}><strong>{safeImages.length}</strong><span>{en?'photos':'zdjęcia'}</span></button>}
    </div>
    {safeImages.length>1&&<div className="vehicle-thumbs premium-thumbs">{safeImages.map((src,index)=><button type="button" className={`vehicle-thumb ${index===active?'active':''}`} key={`${src}-${index}`} onClick={()=>openAt(index)} aria-label={`${en?'Show photo':'Pokaż zdjęcie'} ${index+1}`}><img src={src} alt=""/></button>)}</div>}
    {open&&<div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={en?'Vehicle photo gallery':'Galeria zdjęć pojazdu'} onTouchStart={e=>touchStart.current=e.touches[0]?.clientX??null} onTouchEnd={e=>swipeEnd(e.changedTouches[0]?.clientX??0)}>
      <button className="gallery-lightbox-backdrop" type="button" onClick={()=>setOpen(false)} aria-label={en?'Close':'Zamknij'}/>
      <div className="gallery-lightbox-toolbar"><span>{active+1} / {safeImages.length}</span><button type="button" onClick={()=>setOpen(false)} aria-label={en?'Close gallery':'Zamknij galerię'}>×</button></div>
      <div className="gallery-lightbox-stage"><img src={safeImages[active]} alt={`${title} — ${en?'photo':'zdjęcie'} ${active+1}`}/></div>
      {safeImages.length>1&&<><button type="button" className="gallery-lightbox-nav prev" onClick={prev} aria-label={en?'Previous photo':'Poprzednie zdjęcie'}>‹</button><button type="button" className="gallery-lightbox-nav next" onClick={next} aria-label={en?'Next photo':'Następne zdjęcie'}>›</button></>}
    </div>}
  </div>;
}
