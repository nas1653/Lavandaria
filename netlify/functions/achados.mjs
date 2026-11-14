// Lista pública de achados (GET) e gestão protegida por palavra-passe (POST e DELETE).
// Os objetos e as fotos ficam guardados no Netlify Blobs.
import { getStore } from "@netlify/blobs";
import { timingSafeEqual, randomUUID } from "node:crypto";

const LOJAS = ["arroios", "chile", "areeiro", "ericeira"];
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

function autorizado(req) {
  const certa = process.env.ADMIN_PASSWORD || "";
  const dada = req.headers.get("x-admin-password") || "";
  if (!certa) return false;
  const a = Buffer.from(certa), b = Buffer.from(dada);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async (req) => {
  const itens = getStore("achados");
  const fotos = getStore("achados-fotos");

  if (req.method === "GET") {
    const { blobs } = await itens.list();
    const lista = (await Promise.all(blobs.map(b => itens.get(b.key, { type: "json" })))).filter(Boolean);
    lista.sort((x, y) => (y.data || "").localeCompare(x.data || "") || (y.criado || 0) - (x.criado || 0));
    return json(lista);
  }

  if (!process.env.ADMIN_PASSWORD) return json({ erro: "Falta definir ADMIN_PASSWORD no Netlify." }, 500);
  if (!autorizado(req)) return json({ erro: "Palavra-passe errada." }, 401);

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ erro: "Pedido inválido." }, 400); }
    if (body.verificar) return json({ ok: true });
    const loja = String(body.loja || "");
    const descricao = String(body.descricao || "").trim().slice(0, 200);
    const data = String(body.data || "");
    if (!LOJAS.includes(loja)) return json({ erro: "Escolha a loja." }, 400);
    if (!descricao) return json({ erro: "Escreva ou dite uma descrição." }, 400);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return json({ erro: "Data inválida." }, 400);

    const id = randomUUID();
    let foto = "";
    if (body.foto) {
      const m = /^data:image\/jpeg;base64,(.+)$/.exec(String(body.foto));
      if (!m) return json({ erro: "Fotografia inválida." }, 400);
      const bytes = Buffer.from(m[1], "base64");
      if (bytes.length > 3_000_000) return json({ erro: "Fotografia demasiado grande." }, 413);
      await fotos.set(id, new Blob([bytes], { type: "image/jpeg" }));
      foto = `/api/foto/${id}`;
    }
    const item = { id, loja, descricao, data, foto, criado: Date.now() };
    await itens.setJSON(id, item);
    return json(item, 201);
  }

  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id") || "";
    if (!/^[0-9a-f-]{36}$/.test(id)) return json({ erro: "Objeto inválido." }, 400);
    await itens.delete(id);
    await fotos.delete(id);
    return json({ ok: true });
  }

  return json({ erro: "Método não suportado." }, 405);
};

export const config = { path: "/api/achados" };
