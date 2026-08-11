"use client";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";
export function LogoutButton(){
  const router=useRouter();
  return <button className="btn btn-ghost" onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'}); router.push('/'); router.refresh();}}><Icon name="logout"/> Wyloguj</button>
}
