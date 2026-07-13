import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyServerRequest } from "@/lib/supabase/auth-guard";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const download = searchParams.get("download") === "true";

    if (!id) {
      return NextResponse.json({ error: "Missing resource ID" }, { status: 400 });
    }

    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const supabase = await createClient();

    // 2. Fetch the resource record from database
    // Row Level Security (RLS) is active on the "resources" table, so the query
    // will only succeed and return data if the user has correct membership tier access.
    const { data: resource, error: dbError } = await supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .single();

    if (dbError || !resource) {
      return NextResponse.json({ error: "Resource not found or access denied" }, { status: 404 });
    }

    // 3. Extract the file path from the fileUrl
    const fileUrl = resource.file_url;
    const urlParts = fileUrl.split("/member-resources/");
    const filePath = urlParts[urlParts.length - 1];

    if (!filePath) {
      return NextResponse.json({ error: "Invalid file path configuration" }, { status: 500 });
    }

    // 4. Download the file from Supabase Storage
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from("member-resources")
      .download(filePath);

    if (downloadError || !fileBlob) {
      return NextResponse.json({ error: "Failed to download storage object" }, { status: 500 });
    }

    // 5. Construct secure streaming response headers
    const contentType = fileBlob.type || "application/octet-stream";
    const contentDisposition = download
      ? `attachment; filename="${encodeURIComponent(resource.title)}.${filePath.split(".").pop()}"`
      : `inline; filename="${encodeURIComponent(resource.title)}.${filePath.split(".").pop()}"`;

    return new Response(fileBlob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err: any) {
    console.error("Resource secure proxy error:", err);
    return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
  }
}
