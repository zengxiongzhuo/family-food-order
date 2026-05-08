"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

// 客户端图片压缩：将大图压缩到指定最大尺寸
async function compressImage(file: File, maxSizeKB = 1024): Promise<File> {
  if (file.size <= maxSizeKB * 1024) return file;

  return new Promise((resolve) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const maxDim = 1200;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        0.8
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("不支持的文件格式，仅支持 JPG、PNG、WebP");
      return;
    }

    setUploading(true);
    try {
      // 自动压缩大于 1MB 的图片
      const compressed = await compressImage(file, 1024);

      const formData = new FormData();
      formData.append("file", compressed);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        onChange(url);
        toast.success("图片上传成功");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || `上传失败 (${res.status})`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("网络错误，上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          <Image
            src={value}
            alt="菜品图片"
            width={200}
            height={150}
            className="rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center h-32 w-full rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors cursor-pointer"
        >
          <Upload className="h-6 w-6 text-gray-400 mb-1" />
          <span className="text-sm text-gray-500">
            {uploading ? "上传中..." : "点击上传图片"}
          </span>
          <span className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP（自动压缩）</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
