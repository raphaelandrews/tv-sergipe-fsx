import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { podiumsTable, categoryZodEnum, placeZodEnum } from "@/schema";

// Zod schema for validating incoming JSON data
const createPodiumSchema = z.object({
  clubId: z.string().min(1, "Club ID is required"),
  player: z.string().min(1, "Player name is required"),
  category: categoryZodEnum,
  place: placeZodEnum,
  points: z.coerce.number().min(1, "Points are required"),
});

// POST /api/podiums/create - Webhook for creating a podium, called by third-party services
export async function POST(request: NextRequest) {
  try {
    // Check for API secret in headers
    const apiSecret = request.headers.get("x-api-secret");
    console.log("headers:", request.headers.entries());

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid API secret" },
        { status: 401 },
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const validationResult = createPodiumSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { clubId, player, category, place, points } = validationResult.data;

    // Create the podium in the database
    const now = new Date();
    const newPodium = {
      id: uuidv4(),
      userId: "e66f0500-b62b-42f2-803b-d3186df73995", // TODO: Replace with actual user ID from authentication
      clubId,
      player,
      category,
      place,
      points,
      createdAt: now,
      updatedAt: now,
    };

    const [createdPodium] = await db
      .insert(podiumsTable)
      .values(newPodium)
      .returning();

    return NextResponse.json(
      {
        success: true,
        podium: createdPodium,
        message: "Podium created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating podium via API:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to create podium",
      },
      { status: 500 },
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}