"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import LoadingImage from "@/components/LoadingImage";

type CloudinaryImageUploadProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  previewClassName?: string;
};

export default function CloudinaryImageUpload({
  label,
  value,
  onChange,
  folder = "epic-store",
  placeholder = "Upload an image or paste an image URL",
  previewClassName = "relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200 bg-gray-100",
}: CloudinaryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as {
        ok?: boolean;
        url?: string;
        error?: string;
      };

      if (!res.ok || !data?.ok || !data.url) {
        setError(data?.error || "Failed to upload image to Cloudinary.");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Network error while uploading image.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="block text-sm font-semibold text-[#17171B]">
          {label}
        </label>
        <span className="text-[11px] font-semibold text-green-700">
          Cloudinary CDN
        </span>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 transition focus-within:border-[#78D94F]">
          <ImagePlus size={18} className="shrink-0 text-gray-400" />
          <input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (error) setError("");
            }}
            placeholder={placeholder}
            className="w-full min-w-0 border-0 bg-transparent text-sm outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear image URL"
              className="cursor-pointer border-0 bg-transparent p-0.5 text-gray-400 hover:text-[#17171B]"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#17171B] bg-[#17171B] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#78D94F] hover:border-[#78D94F] hover:text-[#17171B] disabled:cursor-wait disabled:opacity-70"
        >
          {uploading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={15} />
              Upload Image
            </>
          )}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      {value.trim() && (
        <div className="mt-3 flex items-center gap-3">
          <LoadingImage
            src={value}
            alt="Uploaded preview"
            wrapperClassName={previewClassName}
          />
          <p className="m-0 text-xs text-gray-500">
            Stored &amp; served via Cloudinary / CDN URL.
          </p>
        </div>
      )}
    </div>
  );
}

