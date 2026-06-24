import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().max(40).optional().default(""),
  email: z.string().trim().email().max(160).optional().or(z.literal("")).default(""),
  message: z.string().trim().max(3000).optional().default(""),
  source: z.string().trim().max(80).optional().default("website"),
  // Honeypot — bots fill this; humans never see it.
  company: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  // Silently accept honeypot hits without storing them.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { name, phone, email, message, source } = parsed.data;
  if (!phone && !email) {
    return NextResponse.json(
      { error: "Please provide a phone number or email so we can reach you." },
      { status: 400 }
    );
  }

  await prisma.enquiry.create({
    data: { name, phone, email, message, source },
  });

  return NextResponse.json({ ok: true });
}

// List enquiries (admin only) — used by the admin UI if needed.
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ enquiries });
}
