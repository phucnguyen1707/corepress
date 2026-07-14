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

const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
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

  const ext = filename.split(".").pop()!.toLowerCase();

  return new Response(file, {
    headers: {
      "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      // An SVG is a document, and a document served from this origin runs its <script> with this
      // origin's cookies. Uploading one and getting a victim to open /uploads/x.svg would otherwise
      // be account takeover — httpOnly does not help, because the attacker never needs to READ the
      // cookie, only to make same-origin requests that carry it.
      // `sandbox` (no allow-scripts) kills that, and applies only to direct navigation: an <img src>
      // does not create a document, so real image usage is untouched.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      // Never let the browser guess a different, more dangerous type than the one we declared.
      "X-Content-Type-Options": "nosniff",
    },
  });
};
