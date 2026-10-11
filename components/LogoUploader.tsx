"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoUploader({organizationId}:{organizationId:string}){
 const [url,setUrl]=useState<string|null>(null); const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const input=useRef<HTMLInputElement>(null);
 useEffect(()=>{const load=async()=>{const sb=createClient(); const {data}=await sb.from("organizations").select("logo_url").eq("id",organizationId).maybeSingle(); if(data?.logo_url)setUrl(data.logo_url); else setUrl(localStorage.getItem(`gulgo-logo-${organizationId}`));}; load();},[organizationId]);
 async function upload(file:File){
   if(!file.type.startsWith("image/")) return setMessage("Sélectionnez une image JPG, PNG, WEBP ou SVG.");
   if(file.size>3*1024*1024) return setMessage("Le logo doit faire au maximum 3 Mo.");
   setBusy(true); setMessage("");
   try{
    const sb=createClient(); const ext=file.name.split('.').pop()?.toLowerCase()||'png'; const path=`organizations/${organizationId}/logo-${Date.now()}.${ext}`;
    const {error:storageError}=await sb.storage.from("organization-assets").upload(path,file,{upsert:true,contentType:file.type});
    let finalUrl:string;
    if(!storageError){ const {data}=sb.storage.from("organization-assets").getPublicUrl(path); finalUrl=data.publicUrl; }
    else { finalUrl=await new Promise<string>((resolve,reject)=>{const reader=new FileReader(); reader.onload=()=>resolve(String(reader.result)); reader.onerror=()=>reject(reader.error); reader.readAsDataURL(file);}); }
    const {error:updateError}=await sb.from("organizations").update({logo_url:finalUrl}).eq("id",organizationId);
    if(updateError){ localStorage.setItem(`gulgo-logo-${organizationId}`,finalUrl); }
    setUrl(finalUrl); localStorage.setItem(`gulgo-logo-${organizationId}`,finalUrl); setMessage("Logo enregistré et appliqué à votre espace."); window.dispatchEvent(new CustomEvent("gulgo-logo-updated",{detail:{url:finalUrl}}));
   }catch(e:any){setMessage(e?.message||"Impossible d’enregistrer le logo.");} finally{setBusy(false)}
 }
 async function remove(){setBusy(true); try{const sb=createClient(); await sb.from("organizations").update({logo_url:null}).eq("id",organizationId); localStorage.removeItem(`gulgo-logo-${organizationId}`); setUrl(null); window.dispatchEvent(new CustomEvent("gulgo-logo-updated",{detail:{url:null}}));}finally{setBusy(false)}}
 return <div className="gulgo-logo-uploader">
   <div className="gulgo-logo-preview">{url?<Image src={url} alt="Logo de l’entreprise" width={120} height={120} unoptimized />:<ImagePlus size={30}/>}</div>
   <div className="gulgo-logo-copy"><strong>{url?"Identité visuelle active":"Ajoutez votre logo"}</strong><span>{url?"Votre logo accompagne désormais votre espace entreprise.":"PNG, JPG, WEBP ou SVG · 3 Mo maximum"}</span></div>
   <div className="gulgo-logo-actions"><button type="button" className="gulgo-btn gulgo-btn-primary" onClick={()=>input.current?.click()} disabled={busy}>{busy?<Loader2 className="animate-spin" size={16}/>:<ImagePlus size={16}/>} {url?"Remplacer":"Ajouter le logo"}</button>{url&&<button type="button" className="gulgo-icon-button" onClick={remove} disabled={busy} aria-label="Supprimer le logo"><Trash2 size={16}/></button>}</div>
   {message&&<div className="gulgo-logo-message"><CheckCircle2 size={15}/>{message}</div>}
   <input ref={input} hidden type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={e=>{const f=e.target.files?.[0];if(f)upload(f);e.currentTarget.value=""}}/>
 </div>
}
