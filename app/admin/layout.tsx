
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/AdminShell";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Vérifier le rôle interne GULGO
  const {
    data: isStaff,
    error: staffError,
  } = await supabase.rpc("is_gulgo_staff");

  // En cas d'erreur, refuser l'accès par défaut
  if (staffError || isStaff !== true) {
    redirect("/client");
  }

  // 3. Autoriser uniquement le personnel GULGO
  return <AdminShell>{children}</AdminShell>;
}
