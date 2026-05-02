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

function redirect(location: string) {
  return new Response(null, {
    status: 303,
    headers: { Location: location },
  });
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function onRequestPost({ request, env }: PagesContext) {
  const formData = await request.formData();
  const organisation = value(formData, "organisation");
  const contactName = value(formData, "contactName");
  const email = value(formData, "email");
  const message = value(formData, "message");

  if (!organisation || !contactName || !email || !message) {
    return redirect("/booking?error=missing");
  }

  const id = `${Date.now()}-${crypto.randomUUID()}`;
  const enquiry = {
    id,
    createdAt: new Date().toISOString(),
    organisation,
    contactName,
    email,
    phone: value(formData, "phone"),
    location: value(formData, "location"),
    venueType: value(formData, "venueType"),
    dateRange: value(formData, "dateRange"),
    expectedAudience: value(formData, "expectedAudience"),
    spaceDetails: value(formData, "spaceDetails"),
    message,
  };

  if (!env.SUBMISSIONS) {
    console.warn("SUBMISSIONS R2 binding is not configured; booking enquiry was not stored.");
    return redirect("/booking?submitted=1&storage=unconfigured");
  }

  await env.SUBMISSIONS.put(`bookings/${id}.json`, JSON.stringify(enquiry, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });

  return redirect("/booking?submitted=1");
}
