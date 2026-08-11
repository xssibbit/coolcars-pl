import Link from "next/link"; import { AuthForm } from "@/components/AuthForm";
export const metadata={title:'Rejestracja'};
export default function Register(){return <div className="auth-shell"><div className="auth-card"><span className="eyebrow">Nowe konto</span><h1>Zapisuj oferty</h1><p>Utwórz konto i dodawaj interesujące samochody do swojej listy.</p><AuthForm mode="register"/><p style={{textAlign:'center',fontSize:14}}>Masz już konto? <Link href="/login" style={{fontWeight:800,color:'#b92330'}}>Zaloguj się</Link></p></div></div>}
