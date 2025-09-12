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
import { useState, useMemo } from "react";
import { Badge } from "./ui/badge";

export function ClubsPoints() {
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

  const { data: podiums } = useLiveQuery((q) =>
    q.from({ podiums: podiumCollection })
  );

  const clubsWithPoints = useMemo(() => {
    if (!clubs || !podiums) return [];

    return clubs
      .map((club) => {
        const clubPodiums = podiums.filter(
          (podium) => podium.clubId === club.id
        );
        const points = clubPodiums.reduce((sum, p) => sum + p.points, 0);
        return { ...club, points };
      })
      .sort((a, b) => b.points - a.points);
  }, [clubs, podiums]);

  if (isLoading) {
    return (
      <>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            📊 Quadro de Pontos <Badge className="rounded-sm">?</Badge>
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
            📊 Quadro de Pontos <Badge className="rounded-sm">{clubsWithPoints.length}</Badge>
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
              </div>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-card rounded-t-2xl sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[20px] text-center">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[120px] text-center">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubsWithPoints.map((club, index) => (
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
                    {club.points}
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
