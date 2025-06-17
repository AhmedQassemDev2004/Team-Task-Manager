import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { z } from "zod";

// Schema for user registration validation
const UserRegistrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Zod validation
    const validationResult = UserRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid user data",
          errors: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Check if user with this username already exists
    const existingUserByUsername = await db.user.findUnique({
      where: { username }
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { message: "Username is already taken" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "User registered successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
