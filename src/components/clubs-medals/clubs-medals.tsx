"use client";

import { useLiveQuery, ilike, eq } from "@tanstack/react-db";
import { clubCollection, podiumCollection } from "@/collections";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryZodEnum } from "@/schema";
import { columns, ClubWithMedals } from "./columns";
import { DataTable } from "../ui/data-table";

export function ClubsMedals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

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

  const { data: podiums } = useLiveQuery(
    (q) => {
      if (selectedCategory) {
        return q
          .from({ podiums: podiumCollection })
          .where(({ podiums }) => eq(podiums.category, selectedCategory));
      }
      return q.from({ podiums: podiumCollection });
    },
    [selectedCategory]
  );

  const clubsWithMedals: ClubWithMedals[] = useMemo(() => {
    if (!clubs?.length || !Array.isArray(podiums)) {
      return [];
    }

    const result = clubs
      .map((club) => {
        const clubPodiums = podiums.filter((podium) => {
          const match = podium?.clubId === club?.id;
          return match;
        });

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
  }, [clubs, podiums]);

  if (isLoading) {
    return (
      <>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            🏅 Leaderboard <Badge className="rounded-sm">?</Badge>
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
            🏅 Leaderboard <Badge className="rounded-sm">?</Badge>
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
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <CardTitle className="flex items-center gap-2">
          🏅 Leaderboard{" "}
          <Badge className="rounded-sm">{clubsWithMedals.length}</Badge>
        </CardTitle>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-[140px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-0"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryZodEnum.options.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <DataTable columns={columns} data={clubsWithMedals} />
        )}
      </div>
    </div>
  );
}
