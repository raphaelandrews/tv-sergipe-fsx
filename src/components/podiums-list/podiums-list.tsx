"use client";

import { useLiveQuery, ilike, eq } from "@tanstack/react-db";
import { podiumCollection, clubCollection, type Club } from "@/collections";
import { type Podium } from "@/schema";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { UpdatePodiumForm } from "@/components/update-podium-form";
import { CreatePodiumForm } from "@/components/create-podium-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export function PodiumsList() {
  const [editingPodium, setEditingPodium] = useState<Podium | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    data: podiumsWithClubs,
    isLoading,
    isError,
  } = useLiveQuery(
    (q) => {
      const baseQuery = q
        .from({ podiums: podiumCollection })
        .leftJoin(
          { clubs: clubCollection },
          ({ podiums, clubs }) => eq(podiums.clubId, clubs.id)
        )
        .select(({ podiums, clubs }) => ({
          ...podiums,
          clubName: clubs?.name
        }));

      if (!searchTerm.trim()) {
        return baseQuery;
      }

      const searchPattern = `%${searchTerm}%`;
      return baseQuery.where(({ podiums }) => ilike(podiums.player, searchPattern));
    },
    [searchTerm]
  );

  const podiums = podiumsWithClubs?.map(podium => ({
    ...podium,
    clubName: podium.clubName || 'No Club'
  }));



  if (isLoading) {
    return (
      <>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            🏆 Podiums <Badge className="rounded-sm">?</Badge>
          </CardTitle>
        </div>
        <div className="w-full mt-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-ground rounded"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-ground rounded"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            🏆 Podiums <Badge className="rounded-sm">?</Badge>
          </CardTitle>
        </div>
        <div className="w-full mt-4">
          <p className="text-red-600 text-center">
            Error loading podiums. Please try again.
          </p>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          🏆 Podiums <Badge className="rounded-sm">{podiums.length}</Badge>
        </CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-[140px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-0"
            />
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
      <div className="w-full mt-4">
        {podiums.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <div>
                <p className="text-lg">
                  No podiums found matching "{searchTerm}"
                </p>
                <p className="text-sm mt-2">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg">No podiums found</p>
                <p className="text-sm mt-2">
                  Create your first podium to get started!
                </p>
              </div>
            )}
          </div>
        ) : (
          <DataTable
            columns={columns({
              onEditRow: setEditingPodium,
              onDeleteRow: async (podiumId: string) => {
                try {
                  await podiumCollection.delete(podiumId);
                  toast.success("Podium deleted successfully!");
                } catch (error) {
                  console.error("Error deleting podium:", error);
                  toast.error("Failed to delete podium. Please try again.");
                }
              }
            })}
            data={podiums}
          />
        )}

        {editingPodium && (
          <UpdatePodiumForm
            podium={editingPodium}
            open={true}
            onOpenChange={(open: boolean) => !open && setEditingPodium(null)}
          />
        )}

        <CreatePodiumForm
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
        />
      </div>
    </div>
  );
}
