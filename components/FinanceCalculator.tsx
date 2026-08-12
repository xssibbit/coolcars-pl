"use client";
import { useMemo, useState } from "react";
import { formatPln } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

export function FinanceCalculator({grossPrice,locale='pl'}:{grossPrice:number;locale?:Locale}){
  const en=locale==='en'; const [downPct,setDownPct]=useState(20); const [months,setMonths]=useState(48); const [buyoutPct,setBuyoutPct]=useState(10); const [rate,setRate]=useState(8.5);
  const calc=useMemo(()=>{const down=grossPrice*downPct/100,buyout=grossPrice*buyoutPct/100,principal=Math.max(0,grossPrice-down-buyout),r=rate/100/12;let monthly=0;if(principal&&months){if(!r)monthly=principal/months;else{const p=Math.pow(1+r,months);monthly=principal*r*p/(p-1)}}return{down,buyout,monthly,total:down+buyout+monthly*months}},[grossPrice,downPct,buyoutPct,months,rate]);
  const askFinance=()=>{const msg=en?`I am interested in financing this vehicle. Simulation: ${downPct}% down payment, ${months} months, ${buyoutPct}% buyout. Please prepare an individual offer.`:`Interesuje mnie finansowanie tego pojazdu. Symulacja: wpłata ${downPct}%, okres ${months} mies., wykup ${buyoutPct}%. Proszę o przygotowanie indywidualnej oferty.`;window.dispatchEvent(new CustomEvent('coolcars:setInquiryMessage',{detail:msg}));document.getElementById('zapytanie')?.scrollIntoView({behavior:'smooth',block:'start'});};
  return <div className="content-card leasing-card" style={{marginTop:22}}>
    <div className="leasing-head"><div><span className="eyebrow">{en?'Financing':'Finansowanie'}</span><h2>{en?'Estimate your monthly payment':'Sprawdź orientacyjną ratę'}</h2></div><div className="leasing-rate"><small>{en?'from approx.':'od ok.'}</small><strong>{formatPln(Math.round(calc.monthly))}</strong><span>/ {en?'month':'mies.'}</span></div></div>
    <p className="leasing-disclaimer">{en?'Indicative simulation only. Final terms depend on the financing partner and customer assessment.':'Orientacyjna symulacja. Finalne warunki zależą od partnera finansującego i oceny klienta.'}</p>
    <div className="leasing-controls">
      <div className="leasing-control"><div><label>{en?'Down payment':'Wpłata własna'}</label><b>{downPct}% · {formatPln(Math.round(calc.down))}</b></div><input type="range" min="0" max="45" step="5" value={downPct} onChange={e=>setDownPct(Number(e.target.value))}/></div>
      <div className="field"><label>{en?'Term':'Okres'}</label><select className="select" value={months} onChange={e=>setMonths(Number(e.target.value))}><option value={24}>24 {en?'months':'mies.'}</option><option value={36}>36 {en?'months':'mies.'}</option><option value={48}>48 {en?'months':'mies.'}</option><option value={60}>60 {en?'months':'mies.'}</option></select></div>
      <div className="field"><label>{en?'Buyout':'Wykup'}</label><select className="select" value={buyoutPct} onChange={e=>setBuyoutPct(Number(e.target.value))}><option value={1}>1%</option><option value={10}>10%</option><option value={20}>20%</option><option value={30}>30%</option></select></div>
      <div className="field"><label>{en?'Illustrative rate':'Przykładowe oprocentowanie'}</label><input className="input" type="number" min={0} max={30} step="0.1" value={rate} onChange={e=>setRate(Number(e.target.value)||0)}/></div>
    </div>
    <div className="leasing-summary"><div><small>{en?'Down payment':'Wpłata'}</small><strong>{formatPln(Math.round(calc.down))}</strong></div><div><small>{en?'Estimated payment':'Szacowana rata'}</small><strong>{formatPln(Math.round(calc.monthly))}</strong></div><div><small>{en?'Buyout':'Wykup'}</small><strong>{formatPln(Math.round(calc.buyout))}</strong></div></div>
    <button type="button" className="btn btn-primary leasing-cta" onClick={askFinance}>{en?'Ask for a financing offer':'Poproś o ofertę finansowania'}</button>
  </div>;
}
