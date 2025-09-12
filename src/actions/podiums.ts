"use server";

import { stackServerApp } from "@/stack";
import { db } from "@/db";
import { podiumsTable } from "@/schema";
import { and, eq } from "drizzle-orm";
import type { CreatePodium, UpdatePodium, Podium } from "@/schema";

export async function createPodiumAction(data: CreatePodium) {
  try {
    const user = await stackServerApp.getUser({ or: "throw" });

    const now = new Date();
    const newPodium = {
      ...data,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    };

    const [insertedPodium] = await db
      .insert(podiumsTable)
      .values(newPodium)
      .returning();

    return {
      success: true,
      podium: insertedPodium,
    };
  } catch (error) {
    console.error("Error creating podium:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create podium",
    };
  }
}

export async function updatePodiumAction(id: string, data: UpdatePodium) {
  try {
    const user = await stackServerApp.getUser({ or: "throw" });

    const updateData = {
      ...data,
      userId: user.id,
      updatedAt: new Date(),
    };

    const [updatedPodium] = await db
      .update(podiumsTable)
      .set(updateData)
      .where(and(eq(podiumsTable.id, id), eq(podiumsTable.userId, user.id)))
      .returning();

    if (!updatedPodium) {
      return {
        success: false,
        error: "Podium not found",
      };
    }

    // Verify the podium belongs to the user
    if (updatedPodium.userId !== user.id) {
      return {
        success: false,
        error: "Not authorized to update this podium",
      };
    }

    return {
      success: true,
      podium: updatedPodium,
    };
  } catch (error) {
    console.error("Error updating podium:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update podium",
    };
  }
}

export async function deletePodiumAction(id: string) {
  try {
    const user = await stackServerApp.getUser({ or: "throw" });

    // First check if the podium exists and belongs to the user
    const [existingPodium] = await db
      .select()
      .from(podiumsTable)
      .where(and(eq(podiumsTable.id, id), eq(podiumsTable.userId, user.id)))
      .limit(1);

    if (!existingPodium) {
      return {
        success: false,
        error: "Podium not found",
      };
    }

    if (existingPodium.userId !== user.id) {
      return {
        success: false,
        error: "Not authorized to delete this podium",
      };
    }

    await db.delete(podiumsTable).where(eq(podiumsTable.id, id));

    return {
      success: true,
      podiumId: id,
    };
  } catch (error) {
    console.error("Error deleting podium:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete podium",
    };
  }
}