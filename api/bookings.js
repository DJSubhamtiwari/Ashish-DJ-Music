/**
 * Vercel serverless endpoint. Configure SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY in Vercel Project Settings.
 * Never expose the service-role key in browser code.
 */
const fail = (res, code, message) => res.status(code).setHeader("Cache-Control", "no-store").json({ error: message });

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return fail(res, 405, "Method not allowed.");
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return fail(res, 503, "Booking database is not configured yet.");

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return fail(res, 400, "Invalid JSON."); }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return fail(res, 400, "Invalid booking.");

  if (String(body.website || "").trim()) return res.status(200).json({ ok: true });

  const name = String(body.name || "").trim();
  const service = String(body.service || "").trim();
  const date = String(body.date || "").trim();
  const time = String(body.time || "").trim();
  const phone = String(body.phone || "").trim();
  const notes = String(body.notes || "").trim();
  const digits = phone.replace(/\D/g, "");

  if (name.length < 2 || name.length > 80) return fail(res, 400, "Enter a valid name.");
  if (!service || service.length > 100) return fail(res, 400, "Choose a service.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail(res, 400, "Enter a valid event date.");
  if (!/^\d{2}:\d{2}$/.test(time)) return fail(res, 400, "Enter a valid event time.");
  if (digits.length < 8 || digits.length > 15) return fail(res, 400, "Enter a valid phone number.");
  if (notes.length > 1000) return fail(res, 400, "Details are too long.");

  try {
    const response = await fetch(url.replace(/\/$/, "") + "/rest/v1/bookings", {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        full_name: name, service, event_date: date, event_time: time,
        phone, notes: notes || null, status: "new"
      })
    });
    if (!response.ok) {
      console.error("Supabase insert failed:", response.status, await response.text());
      return fail(res, 502, "The booking database could not save this request.");
    }
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Booking endpoint failed:", error);
    return fail(res, 500, "Unexpected server error.");
  }
}