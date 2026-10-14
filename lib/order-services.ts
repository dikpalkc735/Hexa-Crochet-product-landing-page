import { formatNpr, product } from "@/lib/product";

export type OrderRecord = {
  orderId: string;
  dateTime: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode: string;
  size: string;
  quantity: number;
  notes?: string;
  productName: string;
  pricePerPiece: number;
  deliveryFee: number;
  totalPrice: number;
  paymentMethod: "Cash On Delivery";
  orderStatus: "New Order";
};

const HEADERS = ["Order ID", "Date & Time", "Customer Name", "Phone Number", "Email Address", "Exact Location", "Product Name", "Quantity", "Price Per Piece", "Total Price", "Payment Method", "Order Status", "Notes"];
const STATUSES = ["New Order", "Order Confirmed", "Order Ongoing", "Delivered", "Cancelled"];

function base64Url(input: Uint8Array | string) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemBytes(pem: string) {
  const binary = atob(pem.replace(/\\n/g, "\n").replace(/-----[^-]+-----/g, "").replace(/\s/g, ""));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function googleAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const key = await crypto.subtle.importKey("pkcs8", pemBytes(process.env.GOOGLE_PRIVATE_KEY!).buffer as ArrayBuffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64Url(JSON.stringify({ iss: email, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }))}`;
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${base64Url(new Uint8Array(signature))}` }) });
  if (!response.ok) throw new Error(`Google authentication failed (${response.status}). Check the service-account email and private key.`);
  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error("Google authentication returned no access token.");
  return data.access_token;
}

async function sheetsRequest(path: string, token: string, init?: RequestInit) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers } });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google Sheets request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  return response.json();
}

export async function appendOrderToSheet(order: OrderRecord) {
  const token = await googleAccessToken();
  const tab = process.env.GOOGLE_SHEET_TAB_NAME!;
  const metadata = await sheetsRequest("?fields=sheets.properties", token) as { sheets?: { properties: { sheetId: number; title: string } }[] };
  let sheet = metadata.sheets?.find((candidate) => candidate.properties.title === tab)?.properties;
  if (!sheet) {
    const created = await sheetsRequest(":batchUpdate", token, { method: "POST", body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tab, gridProperties: { rowCount: 1000, columnCount: 13 }, frozenRowCount: 1 } } }] }) }) as { replies?: { addSheet?: { properties: { sheetId: number; title: string } } }[] };
    sheet = created.replies?.[0]?.addSheet?.properties;
  }
  if (!sheet) throw new Error(`Could not create or locate the “${tab}” sheet tab.`);

  const headerRange = encodeURIComponent(`'${tab.replace(/'/g, "''")}'!A1:M1`);
  const header = await sheetsRequest(`/values/${headerRange}`, token) as { values?: string[][] };
  if (!header.values?.length) {
    await sheetsRequest(`/values/${headerRange}?valueInputOption=RAW`, token, { method: "PUT", body: JSON.stringify({ values: [HEADERS] }) });
  } else if (HEADERS.some((name, index) => header.values?.[0]?.[index] !== name)) {
    throw new Error(`The “${tab}” header row does not match the required order columns. See README.md.`);
  }

  await sheetsRequest(":batchUpdate", token, { method: "POST", body: JSON.stringify({ requests: [
    { updateSheetProperties: { properties: { sheetId: sheet.sheetId, gridProperties: { frozenRowCount: 1 } }, fields: "gridProperties.frozenRowCount" } },
    { setDataValidation: { range: { sheetId: sheet.sheetId, startRowIndex: 1, endRowIndex: 10000, startColumnIndex: 11, endColumnIndex: 12 }, rule: { condition: { type: "ONE_OF_LIST", values: STATUSES.map((userEnteredValue) => ({ userEnteredValue })) }, strict: true, showCustomUi: true } } },
  ] }) });

  const exactLocation = [order.address, order.city, order.postalCode].filter(Boolean).join(", ");
  const notes = [order.size ? `Size: ${order.size}` : "", order.notes || ""].filter(Boolean).join(" | ");
  await sheetsRequest(`/values/${encodeURIComponent(`'${tab.replace(/'/g, "''")}'!A:M`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, token, { method: "POST", body: JSON.stringify({ values: [[order.orderId, order.dateTime, order.customerName, order.phone, order.email || "", exactLocation, order.productName, order.quantity, order.pricePerPiece, order.totalPrice, order.paymentMethod, order.orderStatus, notes]] }) });
}

function escapeHtml(value: string | number) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
}

function emailFrame(title: string, preheader: string, body: string) {
  const brand = escapeHtml(process.env.BRAND_NAME || product.brand);
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width"><meta charset="utf-8"><title>${escapeHtml(title)}</title></head><body style="margin:0;background:#f3eee5;font-family:Arial,sans-serif;color:#292929"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3eee5"><tr><td align="center" style="padding:32px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fff;border-radius:20px;overflow:hidden"><tr><td style="background:#12372a;padding:24px 32px;color:#fff"><div style="font-family:Georgia,serif;font-size:25px;letter-spacing:1px">${brand}</div><div style="color:#c49a62;font-size:10px;letter-spacing:2px;margin-top:5px">HANDMADE FASHION · NEPAL</div></td></tr><tr><td style="padding:36px 32px">${body}</td></tr><tr><td style="padding:22px 32px;background:#f7f2e8;color:#6b6258;font-size:12px;line-height:1.6">Cash on Delivery · Available across Nepal<br>Reply to this email if you need help.</td></tr></table></td></tr></table></body></html>`;
}

function detailRow(label: string, value: string | number) {
  return `<tr><td style="padding:9px 0;color:#756d63;font-size:13px;vertical-align:top">${escapeHtml(label)}</td><td align="right" style="padding:9px 0;font-weight:600;font-size:13px;vertical-align:top">${escapeHtml(value)}</td></tr>`;
}

function businessEmailHtml(order: OrderRecord) {
  const body = `<div style="font-size:12px;font-weight:700;letter-spacing:1.7px;color:#9a7444">NEW ORDER</div><h1 style="margin:8px 0 10px;font-family:Georgia,serif;font-size:34px;line-height:1.1">A new order has arrived.</h1><p style="margin:0 0 24px;color:#6b6258">Order <strong>${escapeHtml(order.orderId)}</strong> · ${escapeHtml(order.dateTime)}</p><div style="background:#f7f2e8;border-radius:12px;padding:14px 18px;margin-bottom:26px;color:#5b4630;font-weight:700">Please call the customer soon to confirm this order.</div><h2 style="font-size:16px;margin:0 0 8px">Customer details</h2><table role="presentation" width="100%" cellspacing="0" style="border-top:1px solid #e8e1d8">${detailRow("Name", order.customerName)}${detailRow("Phone", order.phone)}${detailRow("Email", order.email || "Not provided")}${detailRow("Location", `${order.address}, ${order.city} ${order.postalCode}`)}</table><h2 style="font-size:16px;margin:28px 0 8px">Product & payment</h2><table role="presentation" width="100%" cellspacing="0" style="border-top:1px solid #e8e1d8">${detailRow("Product", order.productName)}${detailRow("Size", order.size)}${detailRow("Quantity", order.quantity)}${detailRow("Price per piece", formatNpr(order.pricePerPiece))}${detailRow("Delivery", formatNpr(order.deliveryFee))}${detailRow("Total", formatNpr(order.totalPrice))}${detailRow("Payment", order.paymentMethod)}${detailRow("Status", order.orderStatus)}${detailRow("Notes", order.notes || "—")}</table>`;
  return emailFrame(`New Product Order Received - ${order.orderId}`, `New cash-on-delivery order ${order.orderId}`, body);
}

function customerEmailHtml(order: OrderRecord) {
  const body = `<div style="font-size:12px;font-weight:700;letter-spacing:1.7px;color:#9a7444">ORDER RECEIVED</div><h1 style="margin:8px 0 14px;font-family:Georgia,serif;font-size:34px;line-height:1.1">Thank you, ${escapeHtml(order.customerName)}.</h1><p style="margin:0 0 24px;color:#5f5850;line-height:1.7">We have received your order successfully. Our sales representative will call you soon to confirm your order.</p><div style="border:1px solid #e8e1d8;border-radius:14px;padding:20px"><table role="presentation" width="100%" cellspacing="0">${detailRow("Order ID", order.orderId)}${detailRow("Product", order.productName)}${detailRow("Size", order.size)}${detailRow("Quantity", order.quantity)}${detailRow("Total price", formatNpr(order.totalPrice))}${detailRow("Payment method", order.paymentMethod)}</table></div><p style="margin:24px 0 0;line-height:1.7">Thank you for choosing ${escapeHtml(process.env.BRAND_NAME || product.brand)}.<br><strong>We look forward to speaking with you soon.</strong></p>`;
  return emailFrame(`Your Order Has Been Received - ${process.env.BRAND_NAME || product.brand}`, `We received order ${order.orderId}`, body);
}

async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.EMAIL_SERVICE_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, html, reply_to: process.env.EMAIL_FROM }) });
  if (!response.ok) throw new Error(`Email delivery failed (${response.status}): ${(await response.text()).slice(0, 300)}`);
}

export async function sendOrderEmails(order: OrderRecord) {
  const brand = process.env.BRAND_NAME || product.brand;
  const deliveries = [sendEmail(process.env.BUSINESS_EMAIL!, `New Product Order Received - ${order.orderId}`, businessEmailHtml(order))];
  if (order.email) deliveries.push(sendEmail(order.email, `Your Order Has Been Received - ${brand}`, customerEmailHtml(order)));
  const results = await Promise.allSettled(deliveries);
  const failures = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
  if (failures.length) throw new Error(failures.map((failure) => failure.reason instanceof Error ? failure.reason.message : String(failure.reason)).join("; "));
}

