"use client";

import { EnterpriseIllustration } from "@/components/EnterpriseIllustration";
import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Globe2,
  Hash,
  Landmark,
  Loader2,
  MapPin,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { LogoUploader } from "@/components/LogoUploader";

type Enterprise = {
  id: string;
  legal_name?: string | null;
  registration_number?: string | null;
  sector?: string | null;
  address?: string | null;
  country?: string | null;
  website?: string | null;
  city?: string | null;
  postal_code?: string | null;
  establishment_date?: string | null;
};

type Organization = {
  id: string;
  name?: string | null;
  logo_url?: string | null;
};

export default function Company() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [ent, setEnt] = useState<Enterprise | null>(null);

  // Colonnes réellement présentes dans public.enterprises au moment du chargement.
  // Elles servent à éviter d'envoyer au PATCH des colonnes inexistantes.
  const [enterpriseColumns, setEnterpriseColumns] = useState<Set<string>>(
    new Set()
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCompany() {
      setLoading(true);
      setError("");

      try {
        const sb = createClient();

        const {
          data: { user },
        } = await sb.auth.getUser();

        if (!user) {
          setError("Votre session n’a pas pu être récupérée.");
          return;
        }

        const { data: membership, error: membershipError } = await sb
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (membershipError) {
          throw membershipError;
        }

        if (!membership) {
          setError("Aucune organisation associée à votre compte.");
          return;
        }

        const { data: organization, error: organizationError } = await sb
          .from("organizations")
          .select("*")
          .eq("id", membership.organization_id)
          .single();

        if (organizationError) {
          throw organizationError;
        }

        const { data: enterprise, error: enterpriseError } = await sb
          .from("enterprises")
          .select("*")
          .eq("organization_id", membership.organization_id)
          .single();

        if (enterpriseError) {
          throw enterpriseError;
        }

        setOrg(organization);
        setEnt(enterprise);
        setEnterpriseColumns(new Set(Object.keys(enterprise as Record<string, unknown>)));
      } catch (err: any) {
        setError(
          err?.message ||
            "Une erreur est survenue lors du chargement des informations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ent) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const sb = createClient();

      // IMPORTANT : hasOwnProperty(ent, "city") n'indique pas si la colonne
      // existe dans Supabase : updateField() peut ajouter cette propriété
      // côté React. On s'appuie donc uniquement sur les colonnes réellement
      // retournées par .select("*") au chargement.
      const editableFields = [
        "legal_name",
        "registration_number",
        "sector",
        "address",
        "country",
        "website",
        "city",
        "postal_code",
        "establishment_date",
      ] as const;

      const payload: Record<string, string | null> = {};

      for (const field of editableFields) {
        if (enterpriseColumns.has(field)) {
          payload[field] = ent[field] ?? null;
        }
      }

      if (Object.keys(payload).length === 0) {
        throw new Error(
          "Aucune colonne modifiable de l’entreprise n’a été trouvée dans la base de données."
        );
      }

      const { error: updateError } = await sb
        .from("enterprises")
        .update(payload)
        .eq("id", ent.id);

      if (updateError) {
        throw new Error(
          [
            updateError.message,
            updateError.code ? `Code : ${updateError.code}` : "",
            updateError.details ? `Détails : ${updateError.details}` : "",
            updateError.hint ? `Indication : ${updateError.hint}` : "",
          ]
            .filter(Boolean)
            .join(" ")
        );
      }

      setSuccess("Les informations de votre entreprise ont été enregistrées.");
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible d’enregistrer les informations de l’entreprise."
      );
    } finally {
      setSaving(false);
    }
  }

  const completion = useMemo(() => {
    if (!ent) return 0;

    const fields = [
      ent.legal_name,
      ent.registration_number,
      ent.sector,
      ent.address,
      ent.country,
      ent.city,
      ent.postal_code,
      ent.website,
    ];

    const completed = fields.filter(
      (value) => value !== null && value !== undefined && String(value).trim()
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [ent]);

  function updateField(field: keyof Enterprise, value: string) {
    if (!ent) return;

    setEnt({
      ...ent,
      [field]: value,
    });

    setSuccess("");
    setError("");
  }

  if (loading) {
    return (
      <div className="tolbo-client-page space-y-6">
        <div className="section-title">Mon entreprise</div>

        <div className="card flex min-h-[320px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="icon-box">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>

            <div>
              <p className="font-semibold text-[var(--ink)]">
                Chargement de votre entreprise
              </p>
              <p className="small muted mt-1">
                Récupération des informations depuis votre espace TOLBO.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ent) {
    return (
      <div className="space-y-6">
        <div>
          <div className="section-title">Mon entreprise</div>
          <p className="muted mt-1">
            Gérez l’identité, les coordonnées et les informations publiques
            de votre organisation.
          </p>
        </div>

        <div className="card border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <div className="mt-0.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
                !
              </div>
            </div>

            <div>
              <p className="font-semibold text-red-900">
                Informations indisponibles
              </p>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {error ||
                  "Aucune fiche entreprise n’a été trouvée pour votre organisation."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tolbo-client-page tolbo-company-page space-y-7">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="company-hero relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(16,24,40,0.06)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--blue)]" />

        <div className="relative p-6 md:p-8">
          <div className="company-hero-grid">
            <div className="company-header-identity">
              <div className="company-header-logo">{(org?.logo_url || null) ? <img src={String(org?.logo_url)} alt="Logo de l’entreprise" /> : <span>{(ent.legal_name || org?.name || "E").trim().charAt(0).toUpperCase()}</span>}</div>
              <div className="company-header-copy">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="badge badge-blue">
                    <Landmark className="h-3.5 w-3.5" />
                    Profil entreprise
                  </span>

                  {completion === 100 && (
                    <span className="badge badge-green">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Profil complet
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-bold tracking-[-0.03em] text-[var(--ink)] md:text-3xl">
                  {ent.legal_name || "Mon entreprise"}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                  Gérez les informations utilisées pour identifier votre
                  entreprise et construire votre profil au sein de TOLBO.
                </p>
              </div>
            </div>


            <div className="company-hero-visual"><EnterpriseIllustration variant="company" /></div>

            {/* Complétude */}
            <div className="company-hero-completion min-w-[230px] rounded-2xl border border-slate-200 bg-[var(--bg-soft)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  Complétude
                </span>

                <span className="text-lg font-bold text-[var(--ink)]">
                  {completion}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[var(--blue)] transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-[var(--muted)]">
                {completion === 100
                  ? "Toutes les informations principales sont renseignées."
                  : "Complétez votre profil pour disposer d’un dossier plus complet."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          ALERTES
      ============================================================ */}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div>
            <p className="font-semibold">Enregistrement réussi</p>
            <p className="mt-0.5 text-emerald-700">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            !
          </div>

          <div>
            <p className="font-semibold">Impossible d’effectuer cette action</p>
            <p className="mt-0.5 text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* ============================================================
          CONTENU PRINCIPAL
      ============================================================ */}

      <div className="company-form-grid">
        <div className="company-form-main">
        {/* ==========================================================
            FORMULAIRE
        ========================================================== */}

        <form onSubmit={save} className="space-y-6">
          {/* IDENTITÉ */}
          <section className="card overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5 md:px-7">
              <div className="flex items-start gap-3">
                <div className="icon-box h-10 w-10 rounded-xl">
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-[var(--ink)]">
                    Identité de l’entreprise
                  </h2>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Les informations essentielles permettant d’identifier
                    votre structure.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2 md:p-7">
              <div className="md:col-span-2">
                <label className="label">
                  Raison sociale
                  <span className="ml-1 text-[var(--blue)]">*</span>
                </label>

                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    className="field pl-10"
                    value={ent.legal_name || ""}
                    onChange={(e) =>
                      updateField("legal_name", e.target.value)
                    }
                    placeholder="Nom légal de l’entreprise"
                  />
                </div>
              </div>

              <div>
                <label className="label">Numéro d’identification</label>

                <div className="relative">
                  <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    className="field pl-10"
                    value={ent.registration_number || ""}
                    onChange={(e) =>
                      updateField("registration_number", e.target.value)
                    }
                    placeholder="Identifiant légal"
                  />
                </div>
              </div>

              <div>
                <label className="label">Secteur d’activité</label>

                <div className="relative">
                  <Landmark className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    className="field pl-10"
                    value={ent.sector || ""}
                    onChange={(e) =>
                      updateField("sector", e.target.value)
                    }
                    placeholder="Ex. Conseil, industrie, commerce..."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* LOCALISATION */}
          <section className="card overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5 md:px-7">
              <div className="flex items-start gap-3">
                <div className="icon-box h-10 w-10 rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-[var(--ink)]">
                    Localisation
                  </h2>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Adresse et pays d’implantation de votre entreprise.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 md:p-7">
              <div>
                <label className="label">Adresse</label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    className="field pl-10"
                    value={ent.address || ""}
                    onChange={(e) =>
                      updateField("address", e.target.value)
                    }
                    placeholder="Adresse du siège ou établissement principal"
                  />
                </div>
              </div>

              <SmartPlaceField label="Pays" icon={<Globe2 className="h-4 w-4" />} value={ent.country || ""} onChange={(v)=>updateField("country",v)} kind="country" placeholder="Commencez à saisir un pays…" />
              <SmartPlaceField label="Ville" icon={<MapPin className="h-4 w-4" />} value={ent.city || ""} onChange={(v)=>updateField("city",v)} kind="city" placeholder="3 lettres minimum pour suggérer une ville…" />
              <SmartPlaceField label="Code postal" icon={<Hash className="h-4 w-4" />} value={ent.postal_code || ""} onChange={(v)=>updateField("postal_code",v)} kind="postal" placeholder="Code postal" />
            </div>
          </section>

          {/* DATE DE RÉFÉRENCE */}
          <section className="card overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5 md:px-7"><div className="flex items-start gap-3"><div className="icon-box h-10 w-10 rounded-xl"><CalendarDays className="h-5 w-5" /></div><div><h2 className="font-semibold text-[var(--ink)]">Date de référence</h2><p className="mt-1 text-sm text-[var(--muted)]">Utilisez le calendrier pour saisir une date sans erreur de format.</p></div></div></div>
            <div className="p-6 md:p-7"><label className="label">Date de création / début d’activité</label><div className="relative"><CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="field pl-10 tolbo-date-field" type="date" value={ent.establishment_date || ""} onChange={(e)=>updateField("establishment_date",e.target.value)} /></div></div>
          </section>

          {/* PRÉSENCE DIGITALE */}
          <section className="card overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5 md:px-7">
              <div className="flex items-start gap-3">
                <div className="icon-box h-10 w-10 rounded-xl">
                  <Globe2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-[var(--ink)]">
                    Présence digitale
                  </h2>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Ajoutez le site officiel permettant de présenter votre
                    activité.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-7">
              <label className="label">Site web</label>

              <div className="relative">
                <Globe2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  className="field pl-10"
                  type="url"
                  value={ent.website || ""}
                  onChange={(e) =>
                    updateField("website", e.target.value)
                  }
                  placeholder="https://www.exemple.com"
                />
              </div>

              <p className="mt-2 text-xs text-[var(--muted)]">
                Utilisez l’adresse complète de votre site, avec
                <span className="font-medium"> https:// </span>
                lorsque cela est possible.
              </p>
            </div>
          </section>

          {/* ACTION */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(16,24,40,0.04)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">
                Mettre à jour votre profil
              </p>

              <p className="mt-1 text-xs text-[var(--muted)]">
                Les modifications seront enregistrées dans votre espace
                entreprise.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary inline-flex items-center justify-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>

        </div>

        {/* ==========================================================
            COLONNE DROITE
        ========================================================== */}

        <aside className="company-summary space-y-6">
          {/* LOGO */}
          <section className="card overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="icon-box h-10 w-10 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-[var(--ink)]">
                    Identité visuelle
                  </h2>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Logo de votre entreprise
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {org && <LogoUploader organizationId={org.id} />}

              <div className="mt-5 rounded-xl border border-slate-200 bg-[var(--bg-soft)] p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--blue)]" />

                  <p className="text-xs leading-5 text-[var(--muted)]">
                    Le logo de votre entreprise est utilisé uniquement pour
                    votre espace client et vos restitutions autorisées. Il
                    reste distinct de l’identité officielle de TOLBO.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ÉTAT DU PROFIL */}
          <section className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">
                  État du profil
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Informations principales
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--blue-light)] text-sm font-bold text-[var(--blue)]">
                {completion}%
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <ProfileCheck
                label="Raison sociale"
                complete={Boolean(ent.legal_name?.trim())}
              />

              <ProfileCheck
                label="Identification"
                complete={Boolean(ent.registration_number?.trim())}
              />

              <ProfileCheck
                label="Secteur d’activité"
                complete={Boolean(ent.sector?.trim())}
              />

              <ProfileCheck
                label="Adresse"
                complete={Boolean(ent.address?.trim())}
              />

              <ProfileCheck
                label="Pays"
                complete={Boolean(ent.country?.trim())}
              />

              <ProfileCheck
                label="Site web"
                complete={Boolean(ent.website?.trim())}
              />
            </div>
          </section>

          {/* CONSEIL */}
          <section className="relative overflow-hidden rounded-2xl bg-[var(--navy)] p-6 text-white shadow-[0_14px_35px_rgba(8,27,51,0.16)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h3 className="font-semibold">
                Un profil précis facilite l’évaluation
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/65">
                Des informations d’entreprise structurées et à jour permettent
                de constituer un dossier plus complet et plus facilement
                exploitable.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* ================================================================
   SOUS-COMPOSANT — ÉTAT D’UNE INFORMATION
================================================================ */

function SmartPlaceField({label, icon, value, onChange, kind, placeholder}:{label:string;icon:ReactNode;value:string;onChange:(v:string)=>void;kind:"country"|"city"|"postal";placeholder:string}){
  const [suggestions,setSuggestions]=useState<string[]>([]);
  const countries = useMemo(
    () => [
      "Afrique du Sud",
      "Algérie",
      "Allemagne",
      "Belgique",
      "Burkina Faso",
      "Cameroun",
      "Canada",
      "Côte d’Ivoire",
      "France",
      "Ghana",
      "Mali",
      "Maroc",
      "Niger",
      "Nigeria",
      "Sénégal",
      "Suisse",
      "Togo",
    ],
    []
  );
  useEffect(()=>{let cancelled=false; if((kind!=="country")&&value.trim().length>=3){const timer=setTimeout(async()=>{try{const q=encodeURIComponent(value.trim()); const url=kind==="postal"?`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&addressdetails=1&q=${q}`:`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&addressdetails=1&city=${q}`; const r=await fetch(url,{headers:{"Accept-Language":"fr"}}); const data=await r.json(); const vals=(data||[]).map((x:any)=>kind==="postal"?(x.address?.postcode?`${x.address.postcode} · ${x.address.city||x.address.town||x.address.village||x.display_name}`:x.display_name):(x.address?.city||x.address?.town||x.address?.village||x.name)).filter(Boolean); if(!cancelled)setSuggestions(Array.from(new Set(vals)).slice(0,6) as string[]);}catch{if(!cancelled)setSuggestions([])}},300); return()=>{cancelled=true;clearTimeout(timer)}}else setSuggestions([]); return()=>{}},[value,kind]);
  const listId=`tolbo-${kind}-suggestions`; const filtered=kind==="country"&&value.length>=3?countries.filter((c: string)=>c.toLocaleLowerCase("fr").includes(value.toLocaleLowerCase("fr"))).slice(0,8):suggestions;
  return <div><label className="label">{label}</label><div className="relative"><span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400">{icon}</span><input className="field pl-10" list={listId} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} autoComplete="off"/><datalist id={listId}>{filtered.map((x: string)=><option key={x} value={x}/>)}</datalist></div>{value.length>=3&&<span className="tolbo-smart-hint">Suggestions activées · sélectionnez une proposition ou continuez votre saisie</span>}</div>
}

function ProfileCheck({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3">
      <span className="text-sm text-[var(--ink-2)]">{label}</span>

      {complete ? (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          Renseigné
        </span>
      ) : (
        <span className="text-xs font-medium text-[var(--muted)]">
          À compléter
        </span>
      )}
    </div>
  );
}
