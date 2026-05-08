import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "图片存储未配置，请在 Vercel 中添加 Blob Store 并配置 BLOB_READ_WRITE_TOKEN" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "未选择文件" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "不支持的文件格式，仅支持 JPG、PNG、WebP" },
        { status: 400 }
      );
    }

    // Validate file size (4MB max to stay under Vercel's 4.5MB body limit)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "文件过大，最大支持 4MB" },
        { status: 400 }
      );
    }

    const blob = await put(`dishes/${Date.now()}-${file.name}`, file, {
      access: "public",
      token,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json(
      { error: `上传失败: ${message}` },
      { status: 500 }
    );
  }
}
