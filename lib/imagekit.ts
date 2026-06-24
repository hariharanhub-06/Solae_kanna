import ImageKit from "imagekit";

let client: ImageKit | null = null;

export function imagekitConfigured(): boolean {
  return Boolean(
    process.env.IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.IMAGEKIT_URL_ENDPOINT
  );
}

function getClient(): ImageKit {
  if (!imagekitConfigured()) {
    throw new Error("ImageKit is not configured (missing IMAGEKIT_* env vars).");
  }
  if (!client) {
    client = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
    });
  }
  return client;
}

/** Upload a file buffer to ImageKit and return its CDN URL. */
export async function uploadImage(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const res = await getClient().upload({
    file: buffer,
    fileName,
    folder: "/solar-website",
    useUniqueFileName: true,
  });
  return res.url;
}
