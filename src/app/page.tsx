"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Splash from "@/components/Splash";

export default function RootPage() {
  const { hydrated, currentUser } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) router.replace("/logg-inn");
    else if (currentUser.role === "leiar") router.replace("/leiar");
    else router.replace("/ansatt");
  }, [hydrated, currentUser, router]);

  return <Splash />;
}
