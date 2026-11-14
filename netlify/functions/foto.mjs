// Serve as fotografias dos achados guardadas no Netlify Blobs.
import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const id = context.params.id || "";
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("Não encontrado", { status: 404 });
  const foto = await getStore("achados-fotos").get(id, { type: "arrayBuffer" });
  if (!foto) return new Response("Não encontrado", { status: 404 });
  return new Response(foto, {
    headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable" },
  });
};

export const config = { path: "/api/foto/:id" };
