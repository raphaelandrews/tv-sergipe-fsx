import { ClientOnly } from "@/components/client-only";
import { stackServerApp } from "../stack";
import { ClubsList } from "@/components/clubs-list";
import { PodiumsList } from "@/components/podiums-list";
import { ClubsMedals } from "@/components/clubs-medals";
import { MockupClubs } from "@/components/mockup-clubs";
import { ModeToggle } from "@/components/mode-toggle";

export default async function Home() {
  const user = await stackServerApp.getUser({ or: "redirect" });

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ModeToggle/>
        <ClientOnly>
          <div className="w-full max-w-6xl mx-auto">
            <MockupClubs />
          </div>
        </ClientOnly>
      </div>
    </main>
  );
}
