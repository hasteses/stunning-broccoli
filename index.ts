import { serve, file } from 'bun';
import { readdir } from 'node:fs/promises';
import { mkdir } from 'node:fs/promises';
import { basename } from 'node:path';
import { join } from 'path';

const STORAGE_DIR = join(import.meta.dir, 'storage');
await mkdir(STORAGE_DIR, { recursive: true });

const PORT = 8080;

const uploadFile = async (file: File) => {
    const filename = basename(file.name);
    const filepath = join(STORAGE_DIR, filename);
    return Bun.write(filepath, file);
}

const endpointHandler = async (req: Request, url: URL): Promise<Response> => {
    if (url.pathname === '/' && req.method === 'GET') {
        return Response.json({ message: 'Hello, world!' });
    }

    if (url.pathname === '/upload' && req.method === 'POST') {
        const formData = await req.formData();
        const uploaded = formData.get('file');

        if (!uploaded || !(uploaded instanceof File)) {
            return Response.json({ message: 'Use \'file\' field to upload file.' }, { status: 400 });
        }

        await uploadFile(uploaded);
        return Response.json({ message: `File succesfully uploaded` }, { status: 201 });
    }

    if (url.pathname === "/list" && req.method === "GET") {
        const files = await readdir(STORAGE_DIR);
        return Response.json({ files, count: files.length });
    }

    if (url.pathname.startsWith("/files/") && req.method === "GET") {
      const filename = basename(decodeURIComponent(url.pathname.slice("/files/".length)));
      const filepath = join(STORAGE_DIR, filename);
      const f = file(filepath);

      if (!(await f.exists())) {
        return Response.json({ message: `File '${filename}' does not exist.` }, { status: 404 });
      }

      return new Response(f, {
        headers: { "Content-Disposition": `attachment; filename="${filename}"` },
      });
    }

    return Response.json({ message: 'Not found' }, { status: 404 });
}

serve({
    port: PORT,
    fetch: async (req) => {
        const url = new URL(req.url);
        return endpointHandler(req, url);
    },
});

console.log(`Running on localhost:${PORT}`)