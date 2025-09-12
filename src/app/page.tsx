import { ClientOnly } from "@/components/client-only";
import { stackServerApp } from "../stack";
import { ClubsList } from "@/components/clubs-list";
import { PodiumsList } from "@/components/podiums-list";
import { ClubsMedals } from "@/components/clubs-medals";
import { MockupClubs } from "@/components/mockup-clubs";
import { MedalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClubsPoints } from "@/components/clubs-points";

export default async function Home() {
  const user = await stackServerApp.getUser({ or: "redirect" });

  return (
    <main className="!max-w-[960px] container relative min-h-screen pb-12">
      <div className="flex flex-col items-left gap-2 py-8 text-left md:py-16 lg:py-20">
        <h1 className="text-primary max-w-2xl text-2xl font-bold text-balance xl:tracking-tighter">
          Quadro de Medalhas
        </h1>
        <div className="flex gap-2">
          <Button className="font-bold text-xs px-2 py-0.5">
            TV Sergipe 2025
          </Button>
          <Button variant="secondary" className="font-bold text-xs px-2 py-0.5">
            Xadrez
          </Button>
        </div>
      </div>
      <ClientOnly>
        <div className="flex flex-col gap-20">
          <ClubsMedals />
          <ClubsPoints />
          <ClubsList />
          <PodiumsList />
        </div>
      </ClientOnly>
    </main>
  );
}
