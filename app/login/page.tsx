"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GulgoLogo } from "@/components/GulgoLogo";
import { AuthVisual } from "@/components/AuthVisual";

export default function Login(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false); const router=useRouter();
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");const {error}=await createClient().auth.signInWithPassword({email,password});if(error){setError("Adresse e-mail ou mot de passe incorrect. Vérifiez vos informations puis réessayez.");setBusy(false);return;}router.push("/onboarding");}
 return <main className="auth-page"><AuthVisual mode="login"/><section className="auth-form-side"><div className="auth-topbar"><GulgoLogo compact/><span className="auth-security"><ShieldCheck size={14}/> Connexion sécurisée</span></div><div className="auth-form-wrap"><span className="auth-breadcrumb"><LockKeyhole size={12}/> ESPACE ENTREPRISE</span><h2>Bienvenue dans votre espace.</h2><p>Retrouvez vos données, vos preuves, vos évaluations et votre Score Pass.</p><div className="auth-form-card"><form onSubmit={submit}><div className="auth-field"><label htmlFor="email">E-MAIL PROFESSIONNEL</label><div style={{position:"relative"}}><Mail size={16} style={{position:"absolute",left:13,top:15,color:"#8ca0b2"}}/><input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="nom@entreprise.com" style={{paddingLeft:40}}/></div></div><div className="auth-field"><label htmlFor="password">MOT DE PASSE</label><div style={{position:"relative"}}><LockKeyhole size={16} style={{position:"absolute",left:13,top:15,color:"#8ca0b2"}}/><input id="password" type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Votre mot de passe" style={{paddingLeft:40}}/></div></div>{error&&<div className="auth-error">{error}</div>}<button className="auth-submit" disabled={busy}>{busy?"Connexion en cours…":"Se connecter"}</button></form><p className="auth-foot-note">Pas encore de compte ? <Link href="/register">Créer votre espace entreprise</Link></p></div><div className="auth-security"><ShieldCheck size={13}/> Vos données sont traitées dans un environnement sécurisé.</div></div></section></main>;
}
