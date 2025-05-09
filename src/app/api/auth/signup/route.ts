import { NextResponse } from "next/server";
import { SignUpData } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body: SignUpData = await request.json();

    // Validate the request data
    if (
      !body.name ||
      !body.username ||
      !body.email ||
      !body.password ||
      !body.role
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 },
      );
    }

    // Make a request to your actual API to register the user
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: body.name,
          username: body.username,
          email: body.email,
          password: body.password,
          role: body.role,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Registration failed" },
        { status: response.status },
      );
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
