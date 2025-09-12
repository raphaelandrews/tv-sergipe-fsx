"use server";

import { stackServerApp } from "@/stack";
import { db } from "@/db";
import { clubsTable } from "@/schema";
import { and, eq } from "drizzle-orm";
import type { CreateClub, UpdateClub, Club } from "@/schema";

export async function createClubAction(data: CreateClub) {
  try {
    const user = await stackServerApp.getUser({ or: "throw" });

    const now = new Date();
    const newClub = {
      ...data,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    };

    const [insertedClub] = await db
      .insert(clubsTable)
      .values(newClub)
      .returning();

    return {
      success: true,
      club: insertedClub,
    };
  } catch (error) {
    console.error("Error creating club:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create club",
    };
  }
}

export async function updateClubAction(id: string, data: UpdateClub) {
  try {
    const user = await stackServerApp.getUser({ or: "throw" });

    const updateData = {
      ...data,
      userId: user.id,
      updatedAt: new Date(),
    };

    const [updatedClub] = await db
      .update(clubsTable)
      .set(updateData)
      .where(and(eq(clubsTable.id, id), eq(clubsTable.userId, user.id)))
      .returning();

    if (!updatedClub) {
      return {
        success: false,
        error: "Club not found",
      };
    }

    // Verify the club belongs to the user
    if (updatedClub.userId !== user.id) {
      return {
        success: false,
        error: "Not authorized to update this club",
      };
    }

    return {
      success: true,
      club: updatedClub,
    };
  } catch (error) {
    console.error("Error updating club:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update club",
    };
  }
}

export async function deleteClubAction(id: string) {
  try {
    const user = await stackServerApp.getUser({ or: "throw" });

    // First check if the club exists and belongs to the user
    const [existingClub] = await db
      .select()
      .from(clubsTable)
      .where(and(eq(clubsTable.id, id), eq(clubsTable.userId, user.id)))
      .limit(1);

    if (!existingClub) {
      return {
        success: false,
        error: "Club not found",
      };
    }

    if (existingClub.userId !== user.id) {
      return {
        success: false,
        error: "Not authorized to delete this club",
      };
    }

    await db.delete(clubsTable).where(eq(clubsTable.id, id));

    return {
      success: true,
      clubId: id,
    };
  } catch (error) {
    console.error("Error deleting club:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete club",
    };
  }
}
