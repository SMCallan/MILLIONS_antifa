import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES,
  MAX_TOTAL_UPLOAD_BYTES,
  fileExtension,
} from "../../src/lib/submissionPolicy";

export type R2Bucket = {
  delete: (keys: string | string[]) => Promise<unknown>;
  list: (options?: { prefix?: string; cursor?: string }) => Promise<{
    cursor?: string;
    delimitedPrefixes: string[];
    objects: { key: string }[];
    truncated: boolean;
  }>;
  put: (
    key: string,
    value: string | ArrayBuffer | ReadableStream,
    options?: { httpMetadata?: { contentType?: string } },
  ) => Promise<unknown>;
};

export type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
};

export type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  run: () => Promise<unknown>;
  all: <T = Record<string, unknown>>() => Promise<{ results: T[] }>;
};

export type PagesContext = {
  request: Request;
  env: {
    BYPASS_TURNSTILE_IN_DEV?: string;
    EMAIL_PROVIDER_API_KEY?: string;
    MAGIC_LINK_SECRET?: string;
    PUBLIC_SITE_URL?: string;
    SUBMISSIONS?: R2Bucket;
    SUBMISSIONS_DB?: D1Database;
    SUBMISSION_NOTIFICATION_EMAIL?: string;
    TURNSTILE_SECRET_KEY?: string;
  };
};

export type FormError =
  | "empty-file"
  | "database-unconfigured"
  | "expired-token"
  | "file-count"
  | "file-size"
  | "file-type"
  | "invalid"
  | "invalid-email"
  | "invalid-token"
  | "invalid-url"
  | "link-sent"
  | "magic-link-unconfigured"
  | "missing"
  | "missing-preview"
  | "session-invalid"
  | "storage-error"
  | "too-long"
  | "turnstile-invalid"
  | "turnstile-missing"
  | "turnstile-unavailable"
  | "turnstile-unconfigured"
  | "total-size"
  | "verified-link-required";

type FieldRule = {
  key: string;
  maxLength: number;
  required?: boolean;
  validate?: (value: string) => boolean;
  invalidError?: FormError;
};

const allowedExtensions = new Set<string>(ALLOWED_EXTENSIONS);
const allowedMimeTypes = new Set<string>(ALLOWED_MIME_TYPES);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string) {
  return value.length <= 254 && emailPattern.test(value);
}

export function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function textValue(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

export function validateTextFields(formData: FormData, rules: readonly FieldRule[]) {
  const values: Record<string, string> = {};

  for (const rule of rules) {
    const fieldValue = textValue(formData, rule.key);
    values[rule.key] = fieldValue;

    if (rule.required && !fieldValue) {
      return { error: "missing" as const, values };
    }

    if (fieldValue.length > rule.maxLength) {
      return { error: "too-long" as const, values };
    }

    if (fieldValue && rule.validate && !rule.validate(fieldValue)) {
      return { error: rule.invalidError ?? ("invalid" as const), values };
    }
  }

  return { values };
}

export function optionalUrlValue(formData: FormData, key: string, maxLength = 2048) {
  const fieldValue = textValue(formData, key);

  if (!fieldValue) {
    return { value: "" };
  }

  if (fieldValue.length > maxLength) {
    return { error: "too-long" as const, value: fieldValue };
  }

  if (!isValidHttpUrl(fieldValue)) {
    return { error: "invalid-url" as const, value: fieldValue };
  }

  return { value: fieldValue };
}

export function isUpload(entry: FormDataEntryValue): entry is File {
  return typeof entry === "object" && "arrayBuffer" in entry && "name" in entry;
}

export function uploadFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter(isUpload)
    .filter((file) => file.name.trim() !== "");
}

export function validateArtworkUploads(files: File[]) {
  if (files.length > MAX_FILES) {
    return { error: "file-count" as const, totalSize: 0 };
  }

  let totalSize = 0;

  for (const file of files) {
    totalSize += file.size;

    if (file.size === 0) {
      return { error: "empty-file" as const, totalSize };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { error: "file-size" as const, totalSize };
    }

    if (!allowedExtensions.has(fileExtension(file.name))) {
      return { error: "file-type" as const, totalSize };
    }

    const mimeType = file.type.trim().toLowerCase();
    if (mimeType && !allowedMimeTypes.has(mimeType)) {
      return { error: "file-type" as const, totalSize };
    }
  }

  if (totalSize > MAX_TOTAL_UPLOAD_BYTES) {
    return { error: "total-size" as const, totalSize };
  }

  return { totalSize };
}

export async function readFormData(request: Request, path: string) {
  try {
    return { formData: await request.formData() };
  } catch {
    return { response: formFailure(request, path, "invalid") };
  }
}

export function cleanFileName(fileName: string) {
  return (
    fileName
      .replace(/[^a-z0-9._-]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120) || "upload"
  );
}

export function redirectWith(path: string, params: Record<string, string>) {
  const search = new URLSearchParams(params);
  return new Response(null, {
    status: 303,
    headers: { Location: `${path}?${search.toString()}` },
  });
}

export function formFailure(request: Request, path: string, error: FormError, status = 400) {
  if (prefersJson(request)) {
    return json({ ok: false, error }, status);
  }

  return redirectWith(path, { error });
}

export function formSuccess(request: Request, path: string) {
  if (prefersJson(request)) {
    return json({ ok: true }, 200);
  }

  return redirectWith(path, { submitted: "1" });
}

export function storageUnconfigured(request: Request, path: string) {
  if (prefersJson(request)) {
    return json({ ok: false, storage: "unconfigured" }, 503);
  }

  return redirectWith(path, { storage: "unconfigured" });
}

function prefersJson(request: Request) {
  return request.headers.get("Accept")?.includes("application/json") ?? false;
}

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
