"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type Podium } from "@/schema";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface PodiumColumnsProps {
  onEditRow: (podium: Podium) => void;
  onDeleteRow: (podiumId: string) => Promise<void>;
}

export const columns = ({
  onEditRow,
  onDeleteRow,
}: PodiumColumnsProps): ColumnDef<Podium>[] => [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => (
      <div className="font-medium">
        <div className="h-8 w-8 rounded-full flex items-center justify-center">
          {row.index + 1}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "player",
    header: "Player",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("player")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("category")}</span>
    ),
  },
  {
    accessorKey: "clubName",
    header: "Club",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.clubName}</span>
    ),
  },
  {
    accessorKey: "place",
    header: "Place",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("place")}</span>
    ),
  },
  {
    accessorKey: "points",
    header: "Points",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("points")}</span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const podium = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEditRow(podium)}
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
                    Are you sure you want to delete this podium for{" "}
                    <strong>{podium.player}</strong> at place{" "}
                    <strong>{podium.place}</strong>? This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteRow(podium.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
