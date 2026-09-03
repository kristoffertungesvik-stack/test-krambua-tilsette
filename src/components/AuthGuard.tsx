"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import Splash from "@/components/Splash";

/** Gates a route behind a logged-in user of the given role, mock-auth style. */
export default function AuthGuard({ role, children }: { role: Role; children: React.ReactNode }) {
  const { hydrated, currentUser } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) router.replace("/logg-inn");
    else if (currentUser.role !== role) router.replace(currentUser.role === "leiar" ? "/leiar" : "/ansatt");
  }, [hydrated, currentUser, role, router]);

  if (!hydrated || !currentUser || currentUser.role !== role) return <Splash />;
  return <>{children}</>;
}
