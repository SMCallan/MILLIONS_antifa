import {
  type PagesContext,
  cleanFileName,
  formFailure,
  formSuccess,
  isValidEmail,
  optionalUrlValue,
  readFormData,
  storageUnconfigured,
  uploadFiles,
  validateArtworkUploads,
  validateTextFields,
} from "./_formValidation";

const ARTWORK_FIELDS = [
  { key: "artistName", required: true, maxLength: 120 },
  { key: "email", required: true, maxLength: 254, validate: isValidEmail, invalidError: "invalid-email" },
  { key: "location", maxLength: 120 },
  { key: "medium", maxLength: 80 },
  { key: "title", required: true, maxLength: 160 },
  { key: "year", maxLength: 20 },
  { key: "statement", required: true, maxLength: 4000 },
  { key: "installationNotes", maxLength: 2000 },
] as const;

export async function onRequestPost({ request, env }: PagesContext) {
  const parsed = await readFormData(request, "/submit");
  if (parsed.response) {
    return parsed.response;
  }

  const { formData } = parsed;
  const fieldResult = validateTextFields(formData, ARTWORK_FIELDS);

  if (fieldResult.error) {
    return formFailure(request, "/submit", fieldResult.error);
  }

  if (formData.get("consent") !== "on") {
    return formFailure(request, "/submit", "missing");
  }

  const portfolioUrl = optionalUrlValue(formData, "portfolio_url");
  const previewLink = optionalUrlValue(formData, "preview_link");
  const fullResolutionLinkOptional = optionalUrlValue(formData, "full_resolution_link_optional");

  for (const link of [portfolioUrl, previewLink, fullResolutionLinkOptional]) {
    if (link.error) {
      return formFailure(request, "/submit", link.error);
    }
  }

  const uploads = uploadFiles(formData, "artworkFiles");
  const uploadValidation = validateArtworkUploads(uploads);

  if (uploadValidation.error) {
    return formFailure(request, "/submit", uploadValidation.error);
  }

  if (
    uploads.length === 0 &&
    !portfolioUrl.value &&
    !previewLink.value &&
    !fullResolutionLinkOptional.value
  ) {
    return formFailure(request, "/submit", "missing-preview");
  }

  const id = `${Date.now()}-${crypto.randomUUID()}`;
  const fileRecords = uploads.map((file, index) => {
    const originalName = cleanFileName(file.name);
    const storedName = `${String(index + 1).padStart(2, "0")}-${originalName}`;
    const key = `artwork/${id}/files/${storedName}`;

    return {
      file,
      key,
      name: originalName,
      storedName,
      type: file.type,
      size: file.size,
    };
  });

  const submission = {
    id,
    createdAt: new Date().toISOString(),
    artistName: fieldResult.values.artistName,
    email: fieldResult.values.email,
    location: fieldResult.values.location,
    title: fieldResult.values.title,
    medium: fieldResult.values.medium,
    year: fieldResult.values.year,
    statement: fieldResult.values.statement,
    installationNotes: fieldResult.values.installationNotes,
    consent: true,
    links: {
      portfolioUrl: portfolioUrl.value,
      previewLink: previewLink.value,
      fullResolutionLinkOptional: fullResolutionLinkOptional.value,
    },
    uploadPolicy: {
      previewFilesOnly: true,
      totalUploadSize: uploadValidation.totalSize,
    },
    files: fileRecords.map(({ file: _file, ...record }) => record),
  };

  if (!env.SUBMISSIONS) {
    console.warn("SUBMISSIONS R2 binding is not configured; artwork submission was not stored.");
    return storageUnconfigured(request, "/submit");
  }

  try {
    await env.SUBMISSIONS.put(`artwork/${id}/submission.json`, JSON.stringify(submission, null, 2), {
      httpMetadata: { contentType: "application/json" },
    });

    for (const record of fileRecords) {
      await env.SUBMISSIONS.put(record.key, await record.file.arrayBuffer(), {
        httpMetadata: { contentType: record.type || "application/octet-stream" },
      });
    }
  } catch (error) {
    console.error("Artwork submission storage failed.", error);
    return formFailure(request, "/submit", "storage-error", 500);
  }

  return formSuccess(request, "/submit");
}
