import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiOk(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function apiError(
  error: unknown,
  fallbackMessage = "Something went wrong",
  status = 500
) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.flatten()
      },
      { status: 422 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ error: fallbackMessage }, { status });
}
