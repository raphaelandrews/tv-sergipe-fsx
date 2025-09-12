"use client";

import { useLiveQuery, ilike } from "@tanstack/react-db";
import {
  clubCollection,
  podiumCollection,
} from "@/collections";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";

export function ClubsMedals() {
  const [searchTerm, setSearchTerm] = useState("");

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

  const { 
    data: podiums, 
  } = useLiveQuery((q) =>
    q.from({ podiums: podiumCollection })
  );

  function calculateClubsWithMedals() {        
    if (!clubs?.length || !Array.isArray(podiums)) {
      return [];
    }

    const result = clubs
      .map((club) => {        
        const clubPodiums = podiums.filter(
          (podium) => {
            const match = podium?.clubId === club?.id;
            return match;
          }
        );
        
        const medals = {
          gold: clubPodiums.filter((p) => p?.place === "1").length,
          silver: clubPodiums.filter((p) => p?.place === "2").length,
          bronze: clubPodiums.filter((p) => p?.place === "3").length,
        };
        
        return { ...club, medals };
      })
      .sort((a, b) => {
        if (b.medals.gold !== a.medals.gold) {
          return b.medals.gold - a.medals.gold;
        }
        if (b.medals.silver !== a.medals.silver) {
          return b.medals.silver - a.medals.silver;
        }
        return b.medals.bronze - a.medals.bronze;
      });
      
    return result;
  }

  const clubsWithMedals = calculateClubsWithMedals();

  if (isLoading) {
    return (
      <>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            🏅 Quadro de Medalhas <Badge className="rounded-sm">?</Badge>
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
            🏅 Quadro de Medalhas <Badge className="rounded-sm">?</Badge>
          </CardTitle>
        </div>
        <div className="w-full mt-4">
          <p className="text-red-600 text-center">Error. Please try again.</p>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          🏅 Quadro de Medalhas{" "}
          <Badge className="rounded-sm">{clubsWithMedals.length}</Badge>
        </CardTitle>
        <div className="relative flex-1 max-w-[140px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-0"
          />
        </div>
      </div>
      <div className="w-full mt-4">
        {clubsWithMedals.length === 0 ? (
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
              </div>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-card rounded-t-2xl sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[20px] text-center">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[120px] text-center">Gold</TableHead>
                <TableHead className="w-[120px] text-center">Silver</TableHead>
                <TableHead className="w-[120px] text-center">Bronze</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubsWithMedals.map((club, index) => (
                <TableRow key={club.id}>
                  <TableCell className="font-medium">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <span className="font-semibold">{club.name}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {club.medals.gold}
                  </TableCell>
                  <TableCell className="text-center">
                    {club.medals.silver}
                  </TableCell>
                  <TableCell className="text-center">
                    {club.medals.bronze}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}