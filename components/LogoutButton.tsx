"use client";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";
import type { Locale } from "@/lib/i18n";
export function LogoutButton({locale='pl'}:{locale?:Locale}){
  const router=useRouter(); const en=locale==='en';
  return <button className="btn btn-ghost" onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'}); router.push('/'); router.refresh();}}><Icon name="logout"/> {en?'Sign out':'Wyloguj'}</button>
}
