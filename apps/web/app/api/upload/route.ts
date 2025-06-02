import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const backendFormData = new FormData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }
    backendFormData.append("file", file);
    const backendResponse = await axios.post(
      `${process.env.API_BASE_URL}/upload`,
      backendFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    const responseData = backendResponse.data;
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Proxy upload error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
