export const MAX_FILES = 5;
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
export const MAX_TOTAL_UPLOAD_BYTES = 75 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf", "mp3", "m4a", "wav"] as const;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
] as const;

export const ACCEPTED_FILE_TYPES = [
  ...ALLOWED_EXTENSIONS.map((extension) => `.${extension}`),
  ...ALLOWED_MIME_TYPES,
].join(",");

export function fileExtension(fileName: string) {
  const match = /\.([a-z0-9]+)$/i.exec(fileName.trim());
  return match?.[1]?.toLowerCase() ?? "";
}

export function formatUploadBytes(bytes: number) {
  const megabytes = bytes / (1024 * 1024);
  return `${Number.isInteger(megabytes) ? megabytes : megabytes.toFixed(1)}MB`;
}
