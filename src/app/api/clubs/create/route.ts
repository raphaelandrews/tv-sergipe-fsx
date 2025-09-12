import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { clubsTable } from "@/schema";

// Zod schema for validating incoming JSON data (name only)
const createClubSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
});

// POST /api/clubs/create - Webhook for creating a club, called by third-party services
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
    const validationResult = createClubSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { name } = validationResult.data;

    // Create the club in the database
    const now = new Date();
    const newClub = {
      id: uuidv4(),
      userId: "e66f0500-b62b-42f2-803b-d3186df73995",
      name,
      email: null,
      tel: null,
      title: null,
      company: null,
      createdAt: now,
      updatedAt: now,
    };

    const [createdClub] = await db
      .insert(clubsTable)
      .values(newClub)
      .returning();

    return NextResponse.json(
      {
        success: true,
        club: createdClub,
        message: "Club created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating club via API:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to create club",
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
