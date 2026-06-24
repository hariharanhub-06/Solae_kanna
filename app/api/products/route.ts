import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/session";
import { slugify } from "@/lib/slug";
import { normalizeSpecs } from "@/lib/data";

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "product";
  let slug = root;
  let n = 2;
  while (await prisma.product.findUnique({ where: { slug } })) {
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

  const max = await prisma.product.aggregate({ _max: { sort: true } });
  const product = await prisma.product.create({
    data: {
      title,
      slug: await uniqueSlug(title),
      summary: (body.summary || "").trim(),
      description: (body.description || "").trim(),
      imageUrl: (body.imageUrl || "").trim(),
      price: (body.price || "").trim(),
      specs: normalizeSpecs(body.specs),
      featured: body.featured === true,
      published: body.published !== false,
      sort: (max._max.sort ?? -1) + 1,
    },
  });
  return NextResponse.json({ product });
}
