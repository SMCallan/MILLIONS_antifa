type PagesContext = {
  request: Request;
  env: {
    SUBMISSIONS?: {
      put: (
        key: string,
        value: string | ArrayBuffer | ReadableStream,
        options?: { httpMetadata?: { contentType?: string } },
      ) => Promise<unknown>;
    };
  };
};

const MAX_FILES = 6;
const MAX_FILE_SIZE = 15 * 1024 * 1024;

function redirect(location: string) {
  return new Response(null, {
    status: 303,
    headers: { Location: location },
  });
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function cleanFileName(fileName: string) {
  return (
    fileName
      .replace(/[^a-z0-9._-]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120) || "upload"
  );
}

function isUpload(entry: FormDataEntryValue): entry is File {
  return typeof entry === "object" && "arrayBuffer" in entry && "name" in entry;
}

export async function onRequestPost({ request, env }: PagesContext) {
  const formData = await request.formData();
  const artistName = value(formData, "artistName");
  const email = value(formData, "email");
  const title = value(formData, "title");
  const statement = value(formData, "statement");

  if (!artistName || !email || !title || !statement) {
    return redirect("/submit?error=missing");
  }

  const uploads = formData
    .getAll("artworkFiles")
    .filter(isUpload)
    .filter((file) => file.size > 0)
    .slice(0, MAX_FILES);

  if (uploads.some((file) => file.size > MAX_FILE_SIZE)) {
    return redirect("/submit?error=file-size");
  }

  const id = `${Date.now()}-${crypto.randomUUID()}`;
  const savedFiles = uploads.map((file) => ({
    name: cleanFileName(file.name),
    type: file.type,
    size: file.size,
  }));
  const submission = {
    id,
    createdAt: new Date().toISOString(),
    artistName,
    email,
    location: value(formData, "location"),
    title,
    medium: value(formData, "medium"),
    year: value(formData, "year"),
    statement,
    installationNotes: value(formData, "installationNotes"),
    consent: formData.get("consent") === "on",
    files: savedFiles,
  };

  if (!env.SUBMISSIONS) {
    console.warn("SUBMISSIONS R2 binding is not configured; artwork submission was not stored.");
    return redirect("/submit?submitted=1&storage=unconfigured");
  }

  await env.SUBMISSIONS.put(`artwork/${id}/submission.json`, JSON.stringify(submission, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });

  for (const file of uploads) {
    const safeName = cleanFileName(file.name);
    await env.SUBMISSIONS.put(`artwork/${id}/files/${safeName}`, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });
  }

  return redirect("/submit?submitted=1");
}
