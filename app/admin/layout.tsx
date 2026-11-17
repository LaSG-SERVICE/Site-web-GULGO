
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

  // 1. Vérifier que l'utilisateur est authentifié
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Vérifier le statut SUPER_ADMIN dans la base Supabase
  const {
    data: isPlatformAdmin,
    error: adminError,
  } = await supabase.rpc("is_platform_admin");

  // 3. Refuser l'accès en cas d'erreur ou d'absence du statut
  if (adminError || isPlatformAdmin !== true) {
    redirect("/client");
  }

  // 4. Autoriser uniquement le SUPER_ADMIN
  return <AdminShell>{children}</AdminShell>;
}
