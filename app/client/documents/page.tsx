"use client";

import { EnterpriseIllustration } from "@/components/EnterpriseIllustration";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  CloudUpload,
  Download,
  File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Loader2,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type DocumentItem = {
  id: string;
  organization_id: string;
  file_name: string;
  storage_path: string;
  mime_type?: string | null;
  file_size?: number | null;
  created_at: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function Documents() {
  const [orgId, setOrgId] = useState("");
  const [docs, setDocs] = useState<DocumentItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
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

      setOrgId(membership.organization_id);

      const { data, error: documentsError } = await sb
        .from("documents")
        .select("*")
        .eq("organization_id", membership.organization_id)
        .order("created_at", { ascending: false });

      if (documentsError) {
        throw documentsError;
      }

      setDocs(data || []);
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible de récupérer vos documents."
      );
    } finally {
      setLoading(false);
    }
  }

  async function upload(file?: File) {
    if (!file || !orgId || uploading) return;

    setMessage("");
    setError("");

    if (file.size > MAX_FILE_SIZE) {
      setError("Le fichier dépasse la taille maximale autorisée de 10 Mo.");
      return;
    }

    setUploading(true);

    try {
      const sb = createClient();

      const safeName = file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );

      const path = `${orgId}/${crypto.randomUUID()}-${safeName}`;

      const { error: storageError } = await sb.storage
        .from("documents")
        .upload(path, file);

      if (storageError) {
        throw storageError;
      }

      const { error: databaseError } = await sb
        .from("documents")
        .insert({
          organization_id: orgId,
          file_name: file.name,
          storage_path: path,
          mime_type: file.type,
          file_size: file.size,
        });

      if (databaseError) {
        /*
         * Si l'insertion en base échoue après le dépôt Storage,
         * on tente de supprimer le fichier afin d'éviter
         * un document orphelin.
         */
        await sb.storage
          .from("documents")
          .remove([path]);

        throw databaseError;
      }

      setMessage("Document ajouté avec succès.");

      await loadDocuments();

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err: any) {
      setError(
        err?.message ||
          "Une erreur est survenue pendant l’envoi du document."
      );
    } finally {
      setUploading(false);
    }
  }

  async function downloadDocument(document: DocumentItem) {
    setError("");

    try {
      const sb = createClient();

      const { data, error: signedUrlError } = await sb.storage
        .from("documents")
        .createSignedUrl(document.storage_path, 60);

      if (signedUrlError) {
        throw signedUrlError;
      }

      if (!data?.signedUrl) {
        throw new Error(
          "Impossible de générer le lien sécurisé du document."
        );
      }

      window.open(
        data.signedUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible d’ouvrir ce document."
      );
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      upload(file);
    }
  }

  function formatSize(size?: number | null) {
    if (!size) return "—";

    if (size < 1024) {
      return `${size} octets`;
    }

    if (size < 1024 * 1024) {
      return `${Math.round(size / 1024)} Ko`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
  }

  function getFileIcon(mime?: string | null) {
    if (!mime) return File;

    if (mime.includes("pdf")) {
      return FileText;
    }

    if (
      mime.includes("spreadsheet") ||
      mime.includes("excel") ||
      mime.includes("csv")
    ) {
      return FileSpreadsheet;
    }

    if (mime.startsWith("image/")) {
      return FileImage;
    }

    if (
      mime.includes("zip") ||
      mime.includes("rar") ||
      mime.includes("archive")
    ) {
      return FileArchive;
    }

    return File;
  }

  return (
    <div className="gulgo-client-page gulgo-documents-page space-y-7">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <FolderOpen className="h-3.5 w-3.5" />
              Espace documentaire
            </div>

            <h1 className="section-title">
              Documents
            </h1>

            <p className="muted mt-2 max-w-2xl">
              Déposez et consultez les pièces justificatives liées à votre
              entreprise et à vos évaluations gulgo.
            </p>
          </div>

          <EnterpriseIllustration variant="documents" />

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-[var(--blue)]" />

            <div>
              <p className="text-xs font-semibold text-[var(--ink)]">
                Espace contrôlé
              </p>

              <p className="text-[11px] text-[var(--muted)]">
                Documents de votre organisation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          ALERTES
      ============================================================ */}

      {message && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Document enregistré
            </p>

            <p className="mt-0.5 text-xs text-emerald-700">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMessage("")}
            className="ml-auto text-emerald-600 transition hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            !
          </div>

          <div>
            <p className="text-sm font-semibold text-red-900">
              Une erreur est survenue
            </p>

            <p className="mt-0.5 text-xs text-red-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto text-red-600 transition hover:text-red-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ============================================================
          ZONE DE DEPOT
      ============================================================ */}

      <div
        className={[
          "relative overflow-hidden rounded-[28px] border-2 border-dashed p-8 transition-all duration-200 md:p-10",
          dragActive
            ? "border-[var(--blue)] bg-blue-50"
            : "border-slate-200 bg-white hover:border-slate-300",
        ].join(" ")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-50" />
        <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-slate-50" />

        <div className="relative flex flex-col items-center text-center">
          <div
            className={[
              "flex h-16 w-16 items-center justify-center rounded-2xl transition",
              dragActive
                ? "bg-[var(--blue)] text-white"
                : "bg-[var(--blue-light)] text-[var(--blue)]",
            ].join(" ")}
          >
            {uploading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <CloudUpload className="h-7 w-7" />
            )}
          </div>

          <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[var(--ink)]">
            {dragActive
              ? "Déposez votre document ici"
              : "Ajouter un document"}
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
            Glissez-déposez un fichier dans cette zone ou sélectionnez-le
            directement depuis votre ordinateur.
          </p>

          <button
            type="button"
            className="btn btn-primary mt-6 inline-flex items-center gap-2"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Sélectionner un fichier
              </>
            )}
          </button>

          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(event) =>
              upload(event.target.files?.[0])
            }
          />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
            <span>Maximum : 10 Mo</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
            <span>Documents et pièces justificatives</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          DOCUMENTS
      ============================================================ */}

      <section className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-7">
          <div className="flex items-center gap-3">
            <div className="icon-box h-10 w-10 rounded-xl">
              <FolderOpen className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-[var(--ink)]">
                Mes documents
              </h2>

              <p className="mt-1 text-xs text-[var(--muted)]">
                {docs.length === 0
                  ? "Aucun document enregistré"
                  : `${docs.length} document${docs.length > 1 ? "s" : ""} enregistré${docs.length > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {docs.length > 0 && (
            <span className="badge badge-blue">
              {docs.length} fichier{docs.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--blue)]" />

              <p className="text-sm text-[var(--muted)]">
                Chargement des documents...
              </p>
            </div>
          </div>
        ) : docs.length === 0 ? (
          <div className="px-6 py-16 text-center md:px-7">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FolderOpen className="h-7 w-7" />
            </div>

            <h3 className="mt-4 font-semibold text-[var(--ink)]">
              Votre espace documentaire est vide
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              Les documents que vous déposerez ici pourront être associés à
              votre dossier et utilisés dans le cadre des évaluations
              concernées.
            </p>
          </div>
        ) : (
          <>
            {/* VERSION DESKTOP */}
            <div className="hidden overflow-x-auto md:block">
              <table className="table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Type</th>
                    <th>Taille</th>
                    <th>Date d’ajout</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {docs.map((document) => {
                    const Icon = getFileIcon(document.mime_type);

                    return (
                      <tr key={document.id}>
                        <td>
                          <div className="flex min-w-[260px] items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <p
                                className="truncate text-sm font-semibold text-[var(--ink)]"
                                title={document.file_name}
                              >
                                {document.file_name}
                              </p>

                              <p className="mt-0.5 text-xs text-[var(--muted)]">
                                Document entreprise
                              </p>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="text-xs text-[var(--muted)]">
                            {document.mime_type || "Type non précisé"}
                          </span>
                        </td>

                        <td>
                          <span className="text-sm text-[var(--ink-2)]">
                            {formatSize(document.file_size)}
                          </span>
                        </td>

                        <td>
                          <span className="text-sm text-[var(--muted)]">
                            {new Date(
                              document.created_at
                            ).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        <td>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                downloadDocument(document)
                              }
                              className="btn btn-secondary inline-flex items-center gap-2 px-3 py-2 text-xs"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Ouvrir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* VERSION MOBILE */}
            <div className="divide-y divide-slate-100 md:hidden">
              {docs.map((document) => {
                const Icon = getFileIcon(document.mime_type);

                return (
                  <div
                    key={document.id}
                    className="p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-semibold text-[var(--ink)]"
                          title={document.file_name}
                        >
                          {document.file_name}
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {document.mime_type || "Type non précisé"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="badge">
                            {formatSize(document.file_size)}
                          </span>

                          <span className="badge">
                            {new Date(
                              document.created_at
                            ).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        downloadDocument(document)
                      }
                      className="btn btn-secondary mt-4 flex w-full items-center justify-center gap-2 text-xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Ouvrir le document
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* ============================================================
          INFORMATION
      ============================================================ */}

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Espace dédié"
          text="Les documents sont rattachés à l’organisation depuis laquelle ils ont été déposés."
        />

        <InfoCard
          icon={<FileText className="h-5 w-5" />}
          title="Pièces justificatives"
          text="Utilisez cet espace pour transmettre les éléments nécessaires à vos dossiers."
        />

        <InfoCard
          icon={<CloudUpload className="h-5 w-5" />}
          title="Dépôt simplifié"
          text="Ajoutez rapidement vos fichiers par sélection ou glisser-déposer."
        />
      </div>
    </div>
  );
}

/* ================================================================
   CARTE D’INFORMATION
================================================================ */

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(16,24,40,0.035)]">
      <div className="icon-box h-10 w-10 rounded-xl">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[var(--ink)]">
        {title}
      </h3>

      <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
        {text}
      </p>
    </div>
  );
}