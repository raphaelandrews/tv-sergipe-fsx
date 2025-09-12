"use client";

import { useLiveQuery, ilike } from "@tanstack/react-db";
import {
  clubCollection,
  podiumCollection,
  type Club,
  type Podium,
} from "@/collections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreHorizontal, User } from "lucide-react";
import { useState, useMemo } from "react";

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

  const { data: podiums } = useLiveQuery((q) =>
    q.from({ podiums: podiumCollection })
  );

  const clubsWithMedals = useMemo(() => {
    if (!clubs || !podiums) return [];

    return clubs
      .map((club) => {
        const clubPodiums = podiums.filter(
          (podium) => podium.clubId === club.id
        );
        const medals = {
          gold: clubPodiums.filter((p) => p.place === "1").length,
          silver: clubPodiums.filter((p) => p.place === "2").length,
          bronze: clubPodiums.filter((p) => p.place === "3").length,
        };
        return { ...club, medals };
      })
      .sort((a, b) => {
        // Sort by gold, then silver, then bronze
        if (b.medals.gold !== a.medals.gold) {
          return b.medals.gold - a.medals.gold;
        }
        if (b.medals.silver !== a.medals.silver) {
          return b.medals.silver - a.medals.silver;
        }
        return b.medals.bronze - a.medals.bronze;
      });
  }, [clubs, podiums]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Clubs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600 text-center">
            Error loading clubs. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Your Clubs ({clubsWithMedals.length})
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {clubs.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <div>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No clubs found matching "{searchTerm}"
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div>
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No clubs found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Create your first club to get started!
                </p>
              </div>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[100px]">Gold</TableHead>
                <TableHead className="w-[100px]">Silver</TableHead>
                <TableHead className="w-[100px]">Bronze</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubsWithMedals.map((club) => (
                <TableRow key={club.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {club.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{club.medals.gold}</TableCell>
                  <TableCell>{club.medals.silver}</TableCell>
                  <TableCell>{club.medals.bronze}</TableCell>
                  <TableCell>
                    <MoreHorizontal className="h-4 w-4" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
