"use client";

import { useLiveQuery, ilike } from "@tanstack/react-db";
import { podiumCollection, type Podium } from "@/collections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  User,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { UpdatePodiumForm } from "./update-podium-form";
import { CreatePodiumForm } from "./create-podium-form";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "./ui/badge";

export function PodiumsList() {
  const [editingPodium, setEditingPodium] = useState<Podium | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    data: podiums,
    isLoading,
    isError,
  } = useLiveQuery(
    (q) => {
      if (!searchTerm.trim()) {
        return q.from({ podiums: podiumCollection });
      }

      const searchPattern = `%${searchTerm}%`;
      return q
        .from({ podiums: podiumCollection })
        .where(({ podiums }) => ilike(podiums.player, searchPattern));
    },
    [searchTerm]
  );

  const handleDeletePodium = async (podiumId: string) => {
    try {
      // Delete the podium using the collection
      // The collection will call our server action via onDelete
      await podiumCollection.delete(podiumId);
      toast.success("Podium deleted successfully!");
    } catch (error) {
      console.error("Error deleting podium:", error);
      toast.error("Failed to delete podium. Please try again.");
    }
  };

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
          <Table>
            <TableHeader className="bg-card rounded-t-2xl sticky top-0 z-10">
              <TableRow>
                <TableHead className="!text-left">Player</TableHead>
                <TableHead className="w-[200px]">Category</TableHead>
                <TableHead className="w-[100px]">Place</TableHead>
                <TableHead className="w-[100px]">Points</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {podiums.map((podium: Podium) => (
                <TableRow key={podium.id}>
                  <TableCell className="font-medium !text-left">
                    <span className="font-semibold">{podium.player}</span>
                  </TableCell>
                  <TableCell>{podium.category}</TableCell>
                  <TableCell>{podium.place}</TableCell>
                  <TableCell>{podium.points}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingPodium(podium)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="flex items-center gap-2 text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Podium</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <strong>{podium.player}</strong>? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePodium(podium.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
