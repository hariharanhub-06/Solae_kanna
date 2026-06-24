import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/session";
import { slugify } from "@/lib/slug";

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "service";
  let slug = root;
  let n = 2;
  while (await prisma.service.findUnique({ where: { slug } })) {
    slug = `${root}-${n++}`;
  }
  return slug;
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const title = (body.title || "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const max = await prisma.service.aggregate({ _max: { sort: true } });
  const service = await prisma.service.create({
    data: {
      title,
      slug: await uniqueSlug(title),
      summary: (body.summary || "").trim(),
      description: (body.description || "").trim(),
      imageUrl: (body.imageUrl || "").trim(),
      icon: (body.icon || "").trim(),
      published: body.published !== false,
      sort: (max._max.sort ?? -1) + 1,
    },
  });
  return NextResponse.json({ service });
}
