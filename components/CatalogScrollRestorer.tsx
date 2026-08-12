"use client";

import { useEffect } from "react";

const PREFIX="coolcars_catalog_scroll:";

export function CatalogScrollRestorer(){
  useEffect(()=>{
    const key=PREFIX+window.location.pathname+window.location.search;
    const raw=sessionStorage.getItem(key);
    if(raw){
      const y=Number(raw);
      requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:Number.isFinite(y)?y:0,behavior:"auto"})));
    }
    const save=()=>{try{sessionStorage.setItem(key,String(window.scrollY))}catch{}};
    window.addEventListener("pagehide",save);
    return()=>{save();window.removeEventListener("pagehide",save)};
  },[]);
  return null;
}
