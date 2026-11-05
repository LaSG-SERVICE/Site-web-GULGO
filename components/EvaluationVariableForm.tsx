
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Database,
  FileCheck2,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";

import config from "@/data/scorepass-v1.json";
import { createClient } from "@/lib/supabase/client";

type EvaluationVariableFormProps = {
  evaluationId: string;
};

type Variable = {
  Variable_ID: string;
  Dimension?: string;
  "Nom variable"?: string;
  Format?: string;
  "Type technique"?: string;
  "Source privilégiée"?: string;
  Indicateur?: string;
  [key: string]: unknown;
};

type Dimension = {
  Code: string;
  Dimension: string;
  "Objet général"?: string;
  [key: string]: unknown;
};

type VariableStatus =
  | "EVALUABLE"
  | "NOT_APPLICABLE"
  | "NOT_EVALUABLE_MISSING"
  | "NOT_EVALUABLE_EVIDENCE"
  | "COLD_START"
  | "TEMP_UNAVAILABLE"
  | "REFUSED";

type SavedVariable = {
  variable_id: string;
  value_text: string | null;
  status: VariableStatus;
};

const STATUS_OPTIONS: {
  value: VariableStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "EVALUABLE",
    label: "Évaluable",
    description: "Donnée disponible et exploitable.",
  },
  {
    value: "NOT_APPLICABLE",
    label: "Non applicable",
    description: "La variable ne s'applique pas au dossier.",
  },
  {
    value: "NOT_EVALUABLE_MISSING",
    label: "Donnée manquante",
    description: "La donnée attendue n'est pas disponible.",
  },
  {
    value: "NOT_EVALUABLE_EVIDENCE",
    label: "Preuve insuffisante",
    description: "La donnée ne peut pas être suffisamment étayée.",
  },
  {
    value: "COLD_START",
    label: "Cold start",
    description: "Historique insuffisant pour l'évaluation.",
  },
  {
    value: "TEMP_UNAVAILABLE",
    label: "Temporairement indisponible",
    description: "La donnée n'est pas actuellement accessible.",
  },
  {
    value: "REFUSED",
    label: "Refus",
    description: "L'information n'a pas été communiquée.",
  },
];

const STATUS_LABELS: Record<VariableStatus, string> = {
  EVALUABLE: "Évaluable",
  NOT_APPLICABLE: "Non applicable",
  NOT_EVALUABLE_MISSING: "Donnée manquante",
  NOT_EVALUABLE_EVIDENCE: "Preuve insuffisante",
  COLD_START: "Cold start",
  TEMP_UNAVAILABLE: "Indisponible",
  REFUSED: "Refus",
};

const VALID_STATUSES = new Set<string>(
  STATUS_OPTIONS.map((option) => option.value),
);

export function EvaluationVariableForm({
  evaluationId,
}: EvaluationVariableFormProps) {
  const sb = useMemo(() => createClient(), []);

  const variables = useMemo(
    () =>
      (config.variables as Variable[]).filter(
        (variable) => variable.Variable_ID,
      ),
    [],
  );

  const dimensions = useMemo(
    () =>
      (config.dimensions as Dimension[]).filter(
        (dimension) => dimension.Code,
      ),
    [],
  );

  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    Record<string, VariableStatus>
  >({});

  const [openDimensions, setOpenDimensions] = useState<
    Record<string, boolean>
  >(
    Object.fromEntries(
      dimensions.map((dimension) => [dimension.Code, true]),
    ),
  );

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // CHARGEMENT DES DONNEES DEJA ENREGISTREES
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadSavedVariables() {
      setLoading(true);
      setError("");
      setMsg("");

      try {
        const { data, error: loadError } = await sb
          .from("evaluation_variables")
          .select("variable_id, value_text, status")
          .eq("evaluation_id", evaluationId);

        if (loadError) {
          throw loadError;
        }

        if (cancelled) return;

        const savedValues: Record<string, string> = {};
        const savedStatuses: Record<string, VariableStatus> = {};

        (data as SavedVariable[] | null)?.forEach((item) => {
          if (
            !variables.some(
              (variable) => variable.Variable_ID === item.variable_id,
            )
          ) {
            return;
          }

          if (item.value_text !== null) {
            savedValues[item.variable_id] = item.value_text;
          }

          if (VALID_STATUSES.has(item.status)) {
            savedStatuses[item.variable_id] = item.status;
          }
        });

        setValues(savedValues);
        setStatus(savedStatuses);
      } catch (err) {
        if (cancelled) return;

        console.error("Erreur de chargement des variables :", err);

        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les variables de cette évaluation.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSavedVariables();

    return () => {
      cancelled = true;
    };
  }, [sb, evaluationId, variables]);

  // =========================================================
  // REGROUPEMENT PAR DIMENSION
  // =========================================================

  const grouped = useMemo(
    () =>
      dimensions.map((dimension) => ({
        dimension,
        variables: variables.filter(
          (variable) => variable.Dimension === dimension.Code,
        ),
      })),
    [dimensions, variables],
  );

  // =========================================================
  // PROGRESSION
  // =========================================================

  const filledCount = variables.filter((variable) => {
    const id = variable.Variable_ID;

    return (
      (values[id] !== undefined && values[id].trim() !== "") ||
      (status[id] !== undefined && status[id] !== "EVALUABLE")
    );
  }).length;

  const completion =
    variables.length > 0
      ? Math.round((filledCount / variables.length) * 100)
      : 0;

  // =========================================================
  // ACTIONS
  // =========================================================

  function toggleDimension(code: string) {
    setOpenDimensions((current) => ({
      ...current,
      [code]: !current[code],
    }));
  }

  function updateValue(variableId: string, value: string) {
    setValues((current) => ({
      ...current,
      [variableId]: value,
    }));

    setMsg("");
    setError("");
  }

  function updateStatus(
    variableId: string,
    value: VariableStatus,
  ) {
    setStatus((current) => ({
      ...current,
      [variableId]: value,
    }));

    setMsg("");
    setError("");
  }

  // =========================================================
  // ENREGISTREMENT DANS SUPABASE
  // =========================================================

  async function save() {
    if (loading || busy) return;

    setBusy(true);
    setMsg("");
    setError("");

    try {
      const payload = variables
        .filter((variable) => {
          const id = variable.Variable_ID;

          return (
            Object.prototype.hasOwnProperty.call(values, id) ||
            Object.prototype.hasOwnProperty.call(status, id)
          );
        })
        .map((variable) => {
          const id = variable.Variable_ID;

          return {
            evaluation_id: evaluationId,
            variable_id: id,
            value_text:
              values[id] !== undefined
                ? values[id].trim() || null
                : null,
            status: status[id] || "EVALUABLE",
          };
        });

      if (payload.length === 0) {
        setMsg("Aucune modification à enregistrer.");
        return;
      }

      const { error: saveError } = await sb
        .from("evaluation_variables")
        .upsert(payload, {
          onConflict: "evaluation_id,variable_id",
        });

      if (saveError) {
        throw saveError;
      }

      setMsg(
        `${payload.length} variable${
          payload.length > 1 ? "s" : ""
        } enregistrée${payload.length > 1 ? "s" : ""} avec succès.`,
      );
    } catch (err) {
      console.error("Erreur d'enregistrement :", err);

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue est survenue pendant l'enregistrement.",
      );
    } finally {
      setBusy(false);
    }
  }

  // =========================================================
  // AFFICHAGE PENDANT LE CHARGEMENT
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Loader2 size={30} className="animate-spin text-blue-600" />

        <p className="mt-4 text-sm font-semibold text-slate-800">
          Chargement des variables...
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Récupération des données déjà enregistrées.
        </p>
      </div>
    );
  }

  // =========================================================
  // INTERFACE PRINCIPALE
  // =========================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-[var(--navy)] px-5 py-6 text-white sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <ClipboardCheck size={22} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white/80">
                    Score Pass V1
                  </span>
                </div>

                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  Données d’évaluation
                </h1>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/65">
                  Renseignez les variables du dossier en vous
                  appuyant sur les informations et preuves
                  disponibles.
                </p>
              </div>
            </div>

            <div className="min-w-[190px] rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/60">
                  Progression
                </span>

                <span className="text-sm font-bold text-white">
                  {completion} %
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-400 transition-all duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="mt-2 text-[11px] text-white/50">
                {filledCount} / {variables.length} variables renseignées
                ou qualifiées
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:grid-cols-3 sm:px-7">
          <InfoItem
            icon={Database}
            title={`${variables.length} variables`}
            text="Référentiel Score Pass V1"
          />

          <InfoItem
            icon={FileCheck2}
            title="Données & preuves"
            text="Associez les informations disponibles"
          />

          <InfoItem
            icon={ShieldCheck}
            title="Pas de zéro automatique"
            text="Une donnée manquante reste distincte de zéro"
          />
        </div>
      </section>

      {/* ALERTES */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />

          <div>
            <div className="font-semibold">
              {error.includes("charg") || error.includes("fetch")
                ? "Chargement impossible"
                : "Opération impossible"}
            </div>

            <div className="mt-0.5 text-red-600">{error}</div>
          </div>
        </div>
      )}

      {msg && !error && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

          <div>
            <div className="font-semibold">
              Enregistrement effectué
            </div>

            <div className="mt-0.5 text-emerald-600">{msg}</div>
          </div>
        </div>
      )}

      {/* DIMENSIONS */}

      <div className="space-y-4">
        {grouped.map(({ dimension, variables: dimensionVariables }) => {
          const isOpen = openDimensions[dimension.Code] ?? true;

          const dimensionFilled = dimensionVariables.filter(
            (variable) => {
              const id = variable.Variable_ID;

              return (
                (values[id] !== undefined && values[id].trim() !== "") ||
                (status[id] !== undefined && status[id] !== "EVALUABLE")
              );
            },
          ).length;

          return (
            <section
              key={dimension.Code}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleDimension(dimension.Code)}
                className="group flex w-full items-center gap-4 px-5 py-5 text-left transition hover:bg-slate-50 sm:px-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-extrabold text-blue-700">
                  {dimension.Code}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                      {dimension.Dimension}
                    </h2>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      {dimensionVariables.length} variables
                    </span>
                  </div>

                  {dimension["Objet général"] && (
                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                      {dimension["Objet général"]}
                    </p>
                  )}
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <div className="text-xs font-semibold text-slate-600">
                    {dimensionFilled}/{dimensionVariables.length}
                  </div>

                  <div className="mt-1 text-[10px] text-slate-400">
                    renseignées ou qualifiées
                  </div>
                </div>

                <ChevronDown
                  size={19}
                  className={[
                    "shrink-0 text-slate-400 transition-transform duration-200",
                    isOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>

              {isOpen && (
                <div className="border-t border-slate-200">
                  <div className="divide-y divide-slate-100">
                    {dimensionVariables.map((variable) => (
                      <VariableField
                        key={variable.Variable_ID}
                        variable={variable}
                        value={values[variable.Variable_ID] ?? ""}
                        status={
                          status[variable.Variable_ID] ?? "EVALUABLE"
                        }
                        onValueChange={updateValue}
                        onStatusChange={updateStatus}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* BARRE D'ENREGISTREMENT */}

      <div className="sticky bottom-4 z-20">
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 px-1">
              <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 sm:flex">
                <Save size={17} />
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {filledCount} / {variables.length} variables renseignées
                  ou qualifiées
                </div>

                <div className="mt-0.5 text-xs text-slate-500">
                  Vous pouvez enregistrer progressivement le dossier.
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary inline-flex min-h-11 items-center justify-center gap-2 px-5"
              disabled={busy || loading}
              onClick={save}
            >
              {busy ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Enregistrement…
                </>
              ) : (
                <>
                  <Save size={17} />
                  Enregistrer les variables
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   VARIABLE FIELD
================================================================ */

function VariableField({
  variable,
  value,
  status,
  onValueChange,
  onStatusChange,
}: {
  variable: Variable;
  value: string;
  status: VariableStatus;
  onValueChange: (variableId: string, value: string) => void;
  onStatusChange: (
    variableId: string,
    status: VariableStatus,
  ) => void;
}) {
  const statusInfo =
    STATUS_OPTIONS.find((option) => option.value === status) ??
    STATUS_OPTIONS[0];

  const isNonEvaluable = status !== "EVALUABLE";

  return (
    <div className="px-5 py-5 sm:px-6 sm:py-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={`variable-${variable.Variable_ID}`}
              className="text-sm font-bold text-slate-900"
            >
              {variable["Nom variable"] || variable.Variable_ID}
            </label>

            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-500">
              {variable.Variable_ID}
            </span>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <MetaItem
              label="Format"
              value={
                variable.Format ||
                variable["Type technique"] ||
                "—"
              }
            />

            <MetaItem
              label="Source privilégiée"
              value={variable["Source privilégiée"] || "—"}
            />

            <MetaItem
              label="Indicateur"
              value={variable.Indicateur || "—"}
            />
          </div>
        </div>

        <div className="grid gap-3">
          <div>
            <label
              htmlFor={`variable-${variable.Variable_ID}`}
              className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500"
            >
              Valeur
            </label>

            <input
              id={`variable-${variable.Variable_ID}`}
              className="field w-full"
              value={value}
              onChange={(event) =>
                onValueChange(
                  variable.Variable_ID,
                  event.target.value,
                )
              }
              placeholder={
                variable.Format ||
                variable["Type technique"] ||
                "Saisir une valeur"
              }
            />
          </div>

          <div>
            <label
              htmlFor={`status-${variable.Variable_ID}`}
              className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500"
            >
              Statut de la donnée
            </label>

            <select
              id={`status-${variable.Variable_ID}`}
              className="field w-full"
              value={status}
              onChange={(event) =>
                onStatusChange(
                  variable.Variable_ID,
                  event.target.value as VariableStatus,
                )
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div
            className={[
              "rounded-lg border px-3 py-2 text-[11px] leading-4",
              isNonEvaluable
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-slate-100 bg-slate-50 text-slate-500",
            ].join(" ")}
          >
            <span className="font-semibold">
              {STATUS_LABELS[status]} :
            </span>{" "}
            {statusInfo.description}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   SMALL COMPONENTS
================================================================ */

function InfoItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Database;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon size={17} />
      </div>

      <div>
        <div className="text-xs font-bold text-slate-800">
          {title}
        </div>

        <div className="mt-0.5 text-[11px] leading-4 text-slate-500">
          {text}
        </div>
      </div>
    </div>
  );
}

function MetaItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-50 px-3 py-2">
      <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </div>

      <div className="mt-0.5 truncate text-[11px] font-medium text-slate-600">
        {value}
      </div>
    </div>
  );
}
