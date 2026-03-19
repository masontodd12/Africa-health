import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit, getIP } from "@/lib/rateLimit";
import { validateRequest } from "@/lib/validation";
import { buildPrompt } from "@/lib/prompt";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  // ── 1. Rate limit ──────────────────────────────────────────────────────
  const ip = getIP(req);
  const { allowed, retryAfter } = await checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please wait before trying again.", retryAfter },
      { status: 429, headers: { "Retry-After": String(retryAfter ?? 60) } }
    );
  }

  // ── 2. Validate ────────────────────────────────────────────────────────
  let body: unknown;
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid request body" }, { status: 400 }); }

  const validation = validateRequest(body);
  if (!validation.valid) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const { symptoms, age, gender, duration, severity, locale, country, isChild } = body as {
    symptoms: string; age: string; gender: string;
    duration?: string; severity?: string; locale?: string;
    country?: string; isChild?: boolean;
  };

  // ── 3. Stream ──────────────────────────────────────────────────────────
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();

      try {
        const anthropicStream = await client.messages.stream({
          model: "claude-opus-4-5",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content: buildPrompt({ symptoms, age, gender, duration, severity, locale, country, isChild }),
          }],
        });

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(enc.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Assessment failed";
        controller.enqueue(enc.encode(`\nERROR: ${msg}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}