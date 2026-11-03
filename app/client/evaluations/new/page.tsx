
"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Info,
  Landmark,
  Loader2,
  Plus,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

/* ================================================================
   TYPES ET CONFIGURATION
================================================================ */

type FormFields = {
  observation_period: string;
  registration_number: string;
  sector: string;
  activity_start_date: string;
};

type FieldConfig = {
  key: keyof FormFields;
  label: string;
  placeholder: string;
  type: "text" | "date";
  description: string;
  icon: typeof CalendarDays;
};

const initialForm: FormFields = {
  observation_period: "",
  registration_number: "",
  sector: "",
  activity_start_date: "",
};

const fields: FieldConfig[] = [
  {
    key: "observation_period",
    label: "Période d’observation",
    placeholder: "2026-01 à 2026-06",
    type: "text",
    description:
      "Période couverte par les données utilisées pour l’évaluation.",
    icon: CalendarDays,
  },
  {
    key: "registration_number",
    label: "Numéro officiel d’identification",
    placeholder: "Numéro d’identification de l’entreprise",
    type: "text",
    description:
      "Référence officielle permettant d’identifier l’entreprise.",
    icon: FileText,
  },
  {
    key: "sector",
    label: "Secteur d’activité",
    placeholder: "Ex. Commerce, industrie, services...",
    type: "text",
    description:
      "Principale activité économique exercée par l’entreprise.",
    icon: Landmark,
  },
  {
    key: "activity_start_date",
    label: "Date de début effectif",
    placeholder: "",
    type: "date",
    description:
      "Date à laquelle l’activité de l’entreprise a effectivement commencé.",
    icon: CalendarDays,
  },
];

/* ================================================================
   UTILITAIRE DE GESTION DES ERREURS
================================================================ */

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const dbError = error as {
      code?: string;
      message?: string;
    };

    switch (dbError.code) {
      case "42501":
        return (
          "Vous ne disposez pas des autorisations nécessaires " +
          "pour créer ce dossier. Vérifiez les droits de votre compte."
        );

      case "23503":
        return (
          "Une référence liée à l'entreprise ou à l'utilisateur " +
          "est invalide. Vérifiez les données associées."
        );

      case "23505":
        return (
          "Un dossier présentant les mêmes caractéristiques " +
          "existe déjà. Vérifiez les évaluations existantes."
        );

      case "PGRST116":
        return (
          "Les données associées à votre organisation sont " +
          "introuvables ou ne correspondent pas à la sélection attendue."
        );

      default:
        break;
    }
  }

  return (
    "Une erreur est survenue lors de la création du dossier. " +
    "Veuillez réessayer. Si le problème persiste, contactez l'administrateur."
  );
}

/* ================================================================
   COMPOSANT PRINCIPAL
================================================================ */

export default function NewEvaluation() {
  const [form, setForm] = useState<FormFields>(initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  /* ==============================================================
     MODIFICATION DES CHAMPS
  ============================================================== */

  function updateField(
    key: keyof FormFields,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
  }

  /* ==============================================================
     CRÉATION DU DOSSIER
  ============================================================== */

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const sb = createClient();

      // ----------------------------------------------------------
      // 1. Validation des informations du formulaire
      // ----------------------------------------------------------

      const observationPeriod = form.observation_period.trim();

      if (!observationPeriod) {
        throw new Error(
          "Veuillez renseigner la période d'observation."
        );
      }

      // ----------------------------------------------------------
      // 2. Vérification de la session utilisateur
      // ----------------------------------------------------------

      const {
        data: { user },
        error: authError,
      } = await sb.auth.getUser();

      if (authError) {
        console.error("Erreur d'authentification :", authError);

        throw new Error(
          "Impossible de vérifier votre session. " +
          "Veuillez vous reconnecter."
        );
      }

      if (!user) {
        throw new Error(
          "Votre session a expiré. Veuillez vous reconnecter."
        );
      }

      // ----------------------------------------------------------
      // 3. Récupération de l'organisation
      // ----------------------------------------------------------

      const {
        data: memberships,
        error: membershipError,
      } = await sb
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(2);

      if (membershipError) {
        console.error(
          "Erreur de récupération de l'organisation :",
          membershipError
        );

        throw new Error(
          "Impossible de récupérer votre organisation. " +
          "Vérifiez votre rattachement organisationnel."
        );
      }

      if (!memberships || memberships.length === 0) {
        throw new Error(
          "Aucune organisation n'est associée à votre compte."
        );
      }

      if (memberships.length > 1) {
        throw new Error(
          "Votre compte est associé à plusieurs organisations. " +
          "Une sélection de l'organisation est nécessaire avant de continuer."
        );
      }

      const organizationId = memberships[0].organization_id;

      if (!organizationId) {
        throw new Error(
          "L'organisation associée à votre compte ne possède pas " +
          "d'identifiant valide."
        );
      }

      // ----------------------------------------------------------
      // 4. Récupération de l'entreprise
      // ----------------------------------------------------------

      const {
        data: enterprises,
        error: enterpriseError,
      } = await sb
        .from("enterprises")
        .select("id")
        .eq("organization_id", organizationId)
        .limit(2);

      if (enterpriseError) {
        console.error(
          "Erreur de récupération de l'entreprise :",
          enterpriseError
        );

        throw new Error(
          "Impossible de récupérer l'entreprise associée à votre organisation."
        );
      }

      if (!enterprises || enterprises.length === 0) {
        throw new Error(
          "Aucune entreprise n'est associée à votre organisation. " +
          "Veuillez compléter votre fiche entreprise avant de créer une évaluation."
        );
      }

      if (enterprises.length > 1) {
        throw new Error(
          "Plusieurs entreprises sont associées à votre organisation. " +
          "Veuillez sélectionner l'entreprise concernée avant de créer le dossier."
        );
      }

      const enterpriseId = enterprises[0].id;

      if (!enterpriseId) {
        throw new Error(
          "L'identifiant de l'entreprise est invalide."
        );
      }

      // ----------------------------------------------------------
      // 5. Création du dossier dans evaluations
      // ----------------------------------------------------------

      const {
        error: evaluationError,
      } = await sb
        .from("evaluations")
        .insert({
          enterprise_id: enterpriseId,
          observation_period: observationPeriod,
          created_by: user.id,
        });

      if (evaluationError) {
        console.error(
          "Erreur lors de l'insertion de l'évaluation :",
          evaluationError
        );

        throw evaluationError;
      }

      // ----------------------------------------------------------
      // 6. Redirection après confirmation de l'insertion
      // ----------------------------------------------------------

      router.push("/client/evaluations");

    } catch (err: unknown) {
      console.error(
        "Création de l'évaluation impossible :",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : getErrorMessage(err);

      setError(message);

    } finally {
      setBusy(false);
    }
  }

  /* ==============================================================
     AFFICHAGE
  ============================================================== */

  return (
    <div className="gulgo-client-page space-y-7">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(16,24,40,0.06)]">

        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--blue)]" />

        <div className="relative p-6 md:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--blue-light)] text-[var(--blue)]">
                <Plus className="h-7 w-7" />
              </div>

              <div>

                <div className="mb-2 flex flex-wrap items-center gap-2">

                  <span className="badge badge-blue">
                    <ClipboardCheck className="h-3.5 w-3.5" />
                    Nouveau dossier
                  </span>

                  <span className="badge">
                    Score Pass V1
                  </span>

                </div>

                <h1 className="text-2xl font-bold tracking-[-0.03em] text-[var(--ink)] md:text-3xl">
                  Nouvelle évaluation
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                  Créez un dossier d’évaluation afin de commencer
                  la collecte des informations nécessaires au
                  référentiel Score Pass V1.
                </p>

              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/client/evaluations")}
              className="btn btn-secondary inline-flex items-center justify-center gap-2 self-start"
              disabled={busy}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>

          </div>

          {/* ÉTAPES */}

          <div className="mt-8 border-t border-slate-100 pt-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

              <Step
                number="01"
                title="Créer le dossier"
                active
              />

              <div className="hidden h-px flex-1 bg-slate-200 sm:block" />

              <Step
                number="02"
                title="Collecter les variables"
              />

              <div className="hidden h-px flex-1 bg-slate-200 sm:block" />

              <Step
                number="03"
                title="Contrôler les informations"
              />

              <div className="hidden h-px flex-1 bg-slate-200 sm:block" />

              <Step
                number="04"
                title="Restitution"
              />

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          CORPS
      ============================================================ */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

        {/* ==========================================================
            FORMULAIRE
        ========================================================== */}

        <form
          onSubmit={submit}
          className="space-y-6"
          noValidate
        >

          <section className="card overflow-hidden">

            <div className="border-b border-slate-200 px-6 py-5 md:px-7">

              <div className="flex items-start gap-3">

                <div className="icon-box h-10 w-10 rounded-xl">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="font-semibold text-[var(--ink)]">
                    Informations initiales
                  </h2>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Quelques informations permettent d'identifier
                    et de contextualiser le dossier.
                  </p>

                </div>

              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2 md:p-7">

              {fields.map((field) => {

                const Icon = field.icon;

                return (
                  <div
                    key={field.key}
                    className={
                      field.key === "observation_period"
                        ? "md:col-span-2"
                        : ""
                    }
                  >

                    <label
                      htmlFor={field.key}
                      className="label"
                    >
                      {field.label}
                      {field.key === "observation_period" && (
                        <span className="ml-1 text-red-600">
                          *
                        </span>
                      )}
                    </label>

                    <div className="relative">

                      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id={field.key}
                        name={field.key}
                        className="field pl-10"
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.key]}
                        onChange={(event) =>
                          updateField(
                            field.key,
                            event.target.value
                          )
                        }
                        disabled={busy}
                        required={
                          field.key === "observation_period"
                        }
                        autoComplete="off"
                      />

                    </div>

                    <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                      {field.description}
                    </p>

                  </div>
                );

              })}

            </div>
          </section>

          {/* INFORMATION SUR L'ENREGISTREMENT */}

          <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 md:p-6">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
                <Info className="h-5 w-5" />
              </div>

              <div>

                <h2 className="text-sm font-semibold text-[var(--ink)]">
                  Informations relatives à l'entreprise
                </h2>

                <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                  La création du dossier enregistre actuellement
                  la période d'observation. Le numéro d'identification,
                  le secteur d'activité et la date de début effectif
                  ne sont pas encore enregistrés par cette opération.
                  Leur rattachement à la fiche entreprise nécessite
                  la validation du schéma de données.
                </p>

              </div>
            </div>
          </section>

          {/* INFORMATION SUR LE PARCOURS */}

          <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 md:p-6">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--blue)] shadow-sm">
                <Info className="h-5 w-5" />
              </div>

              <div>

                <h2 className="text-sm font-semibold text-[var(--ink)]">
                  Après la création du dossier
                </h2>

                <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                  Une fois le dossier créé, vous pourrez renseigner
                  les variables du référentiel Score Pass V1.
                  La collecte sera organisée par dimension afin
                  de faciliter la constitution progressive du dossier.
                </p>

              </div>
            </div>
          </section>

          {/* ERREUR */}

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4"
            >

              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </div>

              <div>

                <p className="text-sm font-semibold text-red-900">
                  Création impossible
                </p>

                <p className="mt-0.5 text-xs leading-5 text-red-700">
                  {error}
                </p>

              </div>
            </div>
          )}

          {/* ACTION */}

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(16,24,40,0.04)] sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-semibold text-[var(--ink)]">
                Prêt à commencer ?
              </p>

              <p className="mt-1 text-xs text-[var(--muted)]">
                Le dossier pourra être complété progressivement.
              </p>

            </div>

            <button
              type="submit"
              className="btn btn-primary inline-flex items-center justify-center gap-2"
              disabled={busy}
            >

              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création du dossier...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Créer le dossier
                </>
              )}

            </button>

          </div>

        </form>

        {/* ==========================================================
            COLONNE DROITE
        ========================================================== */}

        <aside className="space-y-6">

          {/* PARCOURS SCORE PASS */}

          <section className="card overflow-hidden">

            <div className="border-b border-slate-200 px-6 py-5">

              <div className="flex items-start gap-3">

                <div className="icon-box h-10 w-10 rounded-xl">
                  <ClipboardCheck className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="font-semibold text-[var(--ink)]">
                    Parcours Score Pass
                  </h2>

                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Les prochaines étapes du dossier
                  </p>

                </div>
              </div>
            </div>

            <div className="space-y-1 p-4">

              <ProcessItem
                number="01"
                title="Informations initiales"
                description="Identification et période d'observation"
                active
              />

              <ProcessItem
                number="02"
                title="Variables Score Pass"
                description="Collecte des 37 variables"
              />

              <ProcessItem
                number="03"
                title="Documents et preuves"
                description="Éléments justificatifs disponibles"
              />

              <ProcessItem
                number="04"
                title="Contrôles"
                description="Vérifications et anomalies éventuelles"
              />

              <ProcessItem
                number="05"
                title="Restitution"
                description="Résultats selon les règles du référentiel"
              />

            </div>
          </section>

          {/* GARDE-FOU MÉTHODOLOGIQUE */}

          <section className="relative overflow-hidden rounded-2xl bg-[var(--navy)] p-6 text-white shadow-[0_14px_35px_rgba(8,27,51,0.16)]">

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />

            <div className="relative">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-semibold">
                Une collecte fondée sur les données disponibles
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/65">
                Les informations renseignées dans le dossier doivent
                refléter les éléments effectivement disponibles.
                Une donnée manquante n'est pas assimilée automatiquement
                à une valeur nulle.
              </p>

            </div>
          </section>

          {/* RAPPEL */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5">

            <div className="flex gap-3">

              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>

                <p className="text-sm font-semibold text-[var(--ink)]">
                  Création progressive
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  La création du dossier ne signifie pas que
                  l'évaluation est terminée. Les données pourront
                  être complétées et contrôlées lors des étapes suivantes.
                </p>

              </div>
            </div>
          </section>

        </aside>
      </div>
    </div>
  );
}

/* ================================================================
   ÉTAPE DU PARCOURS
================================================================ */

function Step({
  number,
  title,
  active = false,
}: {
  number: string;
  title: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">

      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold",
          active
            ? "bg-[var(--blue)] text-white"
            : "bg-slate-100 text-slate-500",
        ].join(" ")}
      >
        {number}
      </div>

      <span
        className={[
          "text-xs font-semibold",
          active
            ? "text-[var(--ink)]"
            : "text-[var(--muted)]",
        ].join(" ")}
      >
        {title}
      </span>

    </div>
  );
}

/* ================================================================
   ÉLÉMENT DU PROCESSUS
================================================================ */

function ProcessItem({
  number,
  title,
  description,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "flex gap-3 rounded-xl p-3 transition",
        active
          ? "bg-blue-50"
          : "hover:bg-slate-50",
      ].join(" ")}
    >

      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold",
          active
            ? "bg-[var(--blue)] text-white"
            : "bg-slate-100 text-slate-500",
        ].join(" ")}
      >
        {number}
      </div>

      <div className="min-w-0">

        <p
          className={[
            "text-xs font-semibold",
            active
              ? "text-[var(--blue)]"
              : "text-[var(--ink)]",
          ].join(" ")}
        >
          {title}
        </p>

        <p className="mt-0.5 text-[11px] leading-5 text-[var(--muted)]">
          {description}
        </p>

      </div>
    </div>
  );
}
