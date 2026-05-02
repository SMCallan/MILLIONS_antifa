import {
  type PagesContext,
  formFailure,
  formSuccess,
  isValidEmail,
  readFormData,
  storageUnconfigured,
  validateTextFields,
} from "./_formValidation";

const BOOKING_FIELDS = [
  { key: "organisation", required: true, maxLength: 120 },
  { key: "contactName", required: true, maxLength: 120 },
  { key: "email", required: true, maxLength: 254, validate: isValidEmail, invalidError: "invalid-email" },
  { key: "phone", maxLength: 80 },
  { key: "location", maxLength: 120 },
  { key: "venueType", maxLength: 80 },
  { key: "dateRange", maxLength: 120 },
  { key: "expectedAudience", maxLength: 80 },
  { key: "spaceDetails", maxLength: 2000 },
  { key: "message", required: true, maxLength: 3000 },
] as const;

export async function onRequestPost({ request, env }: PagesContext) {
  const parsed = await readFormData(request, "/booking");
  if (parsed.response) {
    return parsed.response;
  }

  const { formData } = parsed;
  const fieldResult = validateTextFields(formData, BOOKING_FIELDS);

  if (fieldResult.error) {
    return formFailure(request, "/booking", fieldResult.error);
  }

  const id = `${Date.now()}-${crypto.randomUUID()}`;
  const enquiry = {
    id,
    createdAt: new Date().toISOString(),
    organisation: fieldResult.values.organisation,
    contactName: fieldResult.values.contactName,
    email: fieldResult.values.email,
    phone: fieldResult.values.phone,
    location: fieldResult.values.location,
    venueType: fieldResult.values.venueType,
    dateRange: fieldResult.values.dateRange,
    expectedAudience: fieldResult.values.expectedAudience,
    spaceDetails: fieldResult.values.spaceDetails,
    message: fieldResult.values.message,
  };

  if (!env.SUBMISSIONS) {
    console.warn("SUBMISSIONS R2 binding is not configured; booking enquiry was not stored.");
    return storageUnconfigured(request, "/booking");
  }

  try {
    await env.SUBMISSIONS.put(`bookings/${id}.json`, JSON.stringify(enquiry, null, 2), {
      httpMetadata: { contentType: "application/json" },
    });
  } catch (error) {
    console.error("Booking enquiry storage failed.", error);
    return formFailure(request, "/booking", "storage-error", 500);
  }

  return formSuccess(request, "/booking");
}
