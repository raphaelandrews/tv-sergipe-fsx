"use client";

import { useLiveQuery, ilike } from "@tanstack/react-db";
import { clubCollection, type Club } from "@/collections";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { UpdateClubForm } from "@/components/update-club-form";
import { CreateClubForm } from "@/components/create-club-form";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export function ClubsList() {
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    data: clubs,
    isLoading,
    isError,
  } = useLiveQuery(
    (q) => {
      if (!searchTerm.trim()) {
        return q.from({ clubs: clubCollection });
      }

      const searchPattern = `%${searchTerm}%`;
      return q
        .from({ clubs: clubCollection })
        .where(({ clubs }) => ilike(clubs.name, searchPattern));
    },
    [searchTerm]
  );



  if (isLoading) {
    return (
      <>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            🏫 Clubs <Badge className="rounded-sm">?</Badge>
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
            🏫 Clubs <Badge className="rounded-sm">?</Badge>
          </CardTitle>
        </div>
        <div className="w-full mt-4">
          <p className="text-red-600 text-center">
            Error loading clubs. Please try again.
          </p>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          🏫 Clubs <Badge className="rounded-sm">{clubs.length}</Badge>
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
        {clubs.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <div>
                <p className="text-lg">
                  No clubs found matching "{searchTerm}"
                </p>
                <p className="text-sm mt-2">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg">No clubs found</p>
                <p className="text-sm mt-2">
                  Create your first club to get started!
                </p>
              </div>
            )}
          </div>
        ) : (
          <DataTable
            columns={columns(
              (club) => setEditingClub(club),
              async (clubId: string) => {
                try {
                  await clubCollection.delete(clubId);
                  toast.success("Club deleted successfully!");
                } catch (error) {
                  console.error("Error deleting club:", error);
                  toast.error("Failed to delete club. Please try again.");
                }
              }
            )}
            data={clubs}
          />
        )}

        {editingClub && (
          <UpdateClubForm
            club={editingClub}
            open={true}
            onOpenChange={(open: boolean) => !open && setEditingClub(null)}
          />
        )}

        <CreateClubForm
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
        />
      </div>
    </div>
  );
}
