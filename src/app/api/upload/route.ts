import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function getCloudinaryConfig() {
  return {
    cloudName: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
    apiKey: (process.env.CLOUDINARY_API_KEY || "").trim(),
    apiSecret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
  };
}

function signCloudinaryParams(
  params: Record<string, string | number>,
  apiSecret: string
) {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto
    .createHash("sha1")
    .update(`${sorted}${apiSecret}`)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Cloudinary credentials are not configured in .env.local.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder =
      (formData.get("folder") as string | null)?.trim() || "epic-store";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Please select an image file to upload." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "Only image files (JPG, PNG, WEBP, etc.) are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Image must be 10 MB or smaller." },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signCloudinaryParams({ folder, timestamp }, apiSecret);

    const cloudForm = new FormData();
    cloudForm.append("file", file);
    cloudForm.append("api_key", apiKey);
    cloudForm.append("timestamp", String(timestamp));
    cloudForm.append("folder", folder);
    cloudForm.append("signature", signature);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudForm,
      }
    );

    const data = (await cloudRes.json()) as {
      secure_url?: string;
      public_id?: string;
      width?: number;
      height?: number;
      format?: string;
      bytes?: number;
      error?: { message?: string };
    };

    if (!cloudRes.ok || !data.secure_url) {
      return NextResponse.json(
        {
          ok: false,
          error:
            data?.error?.message || "Cloudinary upload failed. Please retry.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Unexpected error uploading image.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { ok: false, error: "Cloudinary credentials are not configured." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as { publicId?: string };
    const publicId = (body.publicId || "").trim();
    if (!publicId) {
      return NextResponse.json(
        { ok: false, error: "Missing publicId." },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signCloudinaryParams(
      { public_id: publicId, timestamp },
      apiSecret
    );

    const cloudForm = new FormData();
    cloudForm.append("public_id", publicId);
    cloudForm.append("api_key", apiKey);
    cloudForm.append("timestamp", String(timestamp));
    cloudForm.append("signature", signature);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        body: cloudForm,
      }
    );

    const data = (await cloudRes.json()) as {
      result?: string;
      error?: { message?: string };
    };

    if (!cloudRes.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error?.message || "Delete failed." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, result: data.result });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Delete failed.",
      },
      { status: 500 }
    );
  }
}

