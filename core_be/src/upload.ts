import { extractUser } from "./utils";
import { nanoid } from "nanoid";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export const uploadImage = async (
  req: Bun.BunRequest<"/upload/image">,
): Promise<Response> => {
  const user = await extractUser(req);
  if (!user) return new Response(null, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return new Response("Invalid form data", { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return new Response("Missing file", { status: 400 });
  }

  if (file.size === 0 || file.size > MAX_SIZE) {
    return new Response("File too large or empty", { status: 400 });
  }

  const ext = EXT_BY_MIME[file.type];
  if (!ext) {
    return new Response("Unsupported file type", { status: 400 });
  }

  const filename = `${nanoid(16)}.${ext}`;
  const path = `assets/uploads/${filename}`;

  try {
    await Bun.write(path, file);
  } catch (err) {
    console.error("Upload write failed:", err);
    return new Response("Failed to save file", { status: 500 });
  }

  const url = `${new URL(req.url).origin}/uploads/${filename}`;

  return new Response(JSON.stringify({ url, filename }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const serveUpload = async (
  req: Bun.BunRequest<"/uploads/:filename">,
): Promise<Response> => {
  const filename = req.params.filename;

  if (!/^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|webp|svg)$/.test(filename)) {
    return new Response(null, { status: 400 });
  }

  const file = Bun.file(`assets/uploads/${filename}`);
  if (!(await file.exists())) {
    return new Response(null, { status: 404 });
  }

  return new Response(file, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
