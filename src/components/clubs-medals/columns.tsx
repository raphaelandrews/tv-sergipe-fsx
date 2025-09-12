"use client"

import { ColumnDef } from "@tanstack/react-table"

export type ClubWithMedals = {
  id: string
  name: string
  medals: {
    gold: number
    silver: number
    bronze: number
  }
}

export const columns: ColumnDef<ClubWithMedals>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => (
      <div>
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "medals.gold",
    header: () => <div className="text-center">Gold</div>,
    cell: ({ row }) => (
      <div className="rounded-sm text-center">
        {row.original.medals.gold}
      </div>
    ),
  },
  {
    accessorKey: "medals.silver",
    header: () => <div className="text-center">Silver</div>,
    cell: ({ row }) => (
      <div className="rounded-sm text-center">
        {row.original.medals.silver}
      </div>
    ),
  },
  {
    accessorKey: "medals.bronze",
    header: () => <div className="text-center">Bronze</div>,
    cell: ({ row }) => (
      <div className="rounded-sm text-center">
        {row.original.medals.bronze}
      </div>
    ),
  },
]