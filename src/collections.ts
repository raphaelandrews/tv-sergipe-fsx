import { createCollection } from "@tanstack/react-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { selectClubSchema, selectPodiumSchema } from "@/schema";
import {
  createClubAction,
  updateClubAction,
  deleteClubAction,
} from "@/actions/clubs";
import { createPodiumAction, deletePodiumAction, updatePodiumAction } from "./actions/podiums";
import z from "zod";

export type { Club } from "@/schema";

export type Podium = Omit<
   z.infer<typeof selectPodiumSchema>,
   "userId" | "createdAt" | "updatedAt"
 > & { points: number };

export const clubCollection = createCollection(
  electricCollectionOptions({
    id: "clubs",
    shapeOptions: {
      url: new URL(
        `/api/clubs`,
        typeof window !== `undefined`
          ? window.location.origin
          : `http://localhost:3000`,
      ).toString(),
      params: {
        table: "clubs",
      },
    },
    schema: selectClubSchema.omit({
      userId: true,
      createdAt: true,
      updatedAt: true,
    }),
    getKey: (item) => item.id,

    // Add server action handlers for mutations
    onInsert: async ({ transaction }) => {
      const results = [];

      for (const mutation of transaction.mutations) {
        const clubData = mutation.modified;

        const result = await createClubAction(clubData);

        if (!result.success) {
          throw new Error(result.error || "Failed to create club");
        }

        results.push(Date.now()); // Use timestamp as txid
      }

      return { txid: results };
    },

    onUpdate: async ({ transaction }) => {
      const results = [];
      for (const mutation of transaction.mutations) {
        const clubId = String(mutation.key);
        const changes = mutation.changes;

        const { id, ...updateData } = changes;

        const result = await updateClubAction(clubId, updateData);

        if (!result.success) {
          throw new Error(result.error || "Failed to update club");
        }

        results.push(Date.now()); // Use timestamp as txid
      }

      return { txid: results };
    },

    onDelete: async ({ transaction }) => {
      const results = [];

      for (const mutation of transaction.mutations) {
        const clubId = String(mutation.key);

        const result = await deleteClubAction(clubId);

        if (!result.success) {
          throw new Error(result.error || "Failed to delete club");
        }

        results.push(Date.now()); // Use timestamp as txid
      }

      return { txid: results };
    },
  }),
);

export const podiumCollection = createCollection(
  electricCollectionOptions({
    id: "podium",
    shapeOptions: {
      url: new URL(
        `/api/podiums`,
        typeof window !== `undefined`
          ? window.location.origin
          : `http://localhost:3000`,
      ).toString(),
      params: {
        table: "podiums",
      },
    },
    schema: selectPodiumSchema.omit({
      userId: true,
      createdAt: true,
      updatedAt: true,
    }),
    getKey: (item) => item.id,

    // Add server action handlers for mutations
    onInsert: async ({ transaction }) => {
      const results = [];

      for (const mutation of transaction.mutations) {
        const podiumData = mutation.modified;

        const result = await createPodiumAction(podiumData);

        if (!result.success) {
          throw new Error(result.error || "Failed to create podium");
        }

        results.push(Date.now()); // Use timestamp as txid
      }

      return { txid: results };
    },

    onUpdate: async ({ transaction }) => {
      const results = [];
      for (const mutation of transaction.mutations) {
        const podiumId = String(mutation.key);
        const changes = mutation.changes;

        const { id, ...updateData } = changes;

        const result = await updatePodiumAction(podiumId, updateData);

        if (!result.success) {
          throw new Error(result.error || "Failed to update podium");
        }

        results.push(Date.now()); // Use timestamp as txid
      }

      return { txid: results };
    },

    onDelete: async ({ transaction }) => {
      const results = [];

      for (const mutation of transaction.mutations) {
        const podiumId = String(mutation.key);

        const result = await deletePodiumAction(podiumId);

        if (!result.success) {
          throw new Error(result.error || "Failed to delete podium");
        }

        results.push(Date.now()); // Use timestamp as txid
      }

      return { txid: results };
    },
  }),
);
