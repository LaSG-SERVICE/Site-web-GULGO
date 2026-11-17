
import { createClient } from "@/lib/supabase/server";

type StatCardProps = {
  label: string;
  value: number | null;
  source: string;
};

function StatCard({ label, value, source }: StatCardProps) {
  return (
    <div className="kpi">
      <div className="small muted">{label}</div>
      <div className="text-3xl font-extrabold mt-2">
        {value === null ? "Indisponible" : value.toLocaleString("fr-FR")}
      </div>
      <div className="small muted mt-2">{source}</div>
    </div>
  );
}

export default async function Admin() {
  const supabase = await createClient();

  const [
    enterprisesResult,
    evaluationsResult,
    documentsResult,
  ] = await Promise.all([
    supabase
      .from("enterprises")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("evaluations")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("documents")
      .select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Entreprises",
      value: enterprisesResult.error ? null : enterprisesResult.count,
      source: "Table enterprises",
    },
    {
      label: "Évaluations",
      value: evaluationsResult.error ? null : evaluationsResult.count,
      source: "Table evaluations",
    },
    {
      label: "Documents reçus",
      value: documentsResult.error ? null : documentsResult.count,
      source: "Table documents",
    },
    {
      label: "Anomalies",
      value: null,
      source: "Source de données à connecter",
    },
    {
      label: "Score Pass produits",
      value: null,
      source: "Source de données à connecter",
    },
  ];

  const hasErrors = [
    enterprisesResult.error,
    evaluationsResult.error,
    documentsResult.error,
  ].some(Boolean);

  return (
    <>
      <div className="section-title">Vue d’ensemble</div>

      <p className="muted mt-1">
        Pilotage interne de GULGO — données issues de Supabase.
      </p>

      {hasErrors && (
        <div className="card p-4 mt-5">
          <p className="text-sm">
            Certaines statistiques n’ont pas pu être récupérées.
            Vérifie les autorisations RLS et la connexion à Supabase.
          </p>
        </div>
      )}

      <div className="mt-7 grid-auto">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            source={stat.source}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h2 className="font-bold">État des données</h2>

          <div className="mt-4 grid gap-4 text-sm">
            <div className="flex justify-between">
              <span>Entreprises</span>
              <span>Supabase</span>
            </div>

            <div className="flex justify-between">
              <span>Évaluations</span>
              <span>Supabase</span>
            </div>

            <div className="flex justify-between">
              <span>Documents</span>
              <span>Supabase</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold">Gouvernance</h2>

          <ul className="mt-4 grid gap-3 text-sm">
            <li>✓ Accès réservé au SUPER_ADMIN</li>
            <li>✓ Données récupérées depuis Supabase</li>
            <li>✓ Contrôle des erreurs de lecture</li>
            <li>✓ Statistiques non disponibles non inventées</li>
          </ul>
        </div>
      </div>
    </>
  );
}
