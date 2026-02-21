import { Context, Hono } from 'hono';
import { getFrontend } from './frontend';

interface Env {
  VPSAI: R2Bucket;
}

const app = new Hono<{ Bindings: Env }>();

// Route untuk melayani frontend
app.get('/', (c) => {
  return c.html(getFrontend(c.req.url));
});

// Endpoint untuk cek ketersediaan target (Health Check)
app.post('/check', async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ ok: false, error: 'Request body tidak valid' }, 400);
  }

  const { url: targetUrl, key: apiKey, provider } = body;

  if (!targetUrl) return c.json({ ok: false, error: 'URL tidak valid' }, 400);

  try {
    // Tentukan URL untuk health check. Beberapa API AI tidak mendukung root GET.
    let checkUrl = targetUrl;
    const testHeaders: Record<string, string> = { 'User-Agent': 'Smart-Proxy-Elite-Checker/1.0' };

    if (provider === 'gemini' && !targetUrl.includes('v1')) {
      checkUrl = targetUrl.replace(/\/$/, '') + '/v1beta/models';
      if (apiKey) checkUrl += `?key=${apiKey}`;
    } else if (['openai', 'mistral', 'groq', 'perplexity'].includes(provider as string)) {
      checkUrl = targetUrl.replace(/\/$/, '') + '/models';
      if (apiKey) testHeaders['Authorization'] = `Bearer ${apiKey}`;
    }

    let response = await fetch(checkUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: testHeaders
    });

    // Jika health check khusus gagal, coba root sebagai fallback
    if (!response.ok && checkUrl !== targetUrl) {
      response = await fetch(targetUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'User-Agent': 'Smart-Proxy-Elite-Checker/1.0' }
      });
    }

    // Kita anggap "OK" jika server merespons, meskipun statusnya bukan 200 (misal 401 pada root API)
    const id = crypto.randomUUID();
    const config = { url: targetUrl, key: apiKey, provider: provider };

    await c.env.VPSAI.put(id, JSON.stringify(config), {
      customMetadata: {
        url: targetUrl,
        provider: provider || 'custom'
      }
    });

    return c.json({
      ok: true,
      status: response.status,
      warning: response.ok ? null : `Target merespons dengan status ${response.status}`,
      id
    });
  } catch (err: any) {
    return c.json({ ok: false, error: 'Gagal terhubung ke target: ' + (err.message || 'Unknown error') }, 500);
  }
});

// Route internal untuk aset dan link (menggunakan Base64 untuk efisiensi)
app.all('/r/:mode/:encodedUrl/:path{.+}?', async (c) => {
  const { mode, encodedUrl, path } = c.req.param();
  let targetBaseUrl: string;
  try {
    // Kembalikan ke format Base64 standar dari format URL-safe
    const standardBase64 = encodedUrl.replace(/_/g, '/').replace(/-/g, '+');
    targetBaseUrl = atob(standardBase64);
  } catch (err) {
    return c.text('URL tidak valid', 400);
  }
  return handleProxy(c, mode, targetBaseUrl, path);
});

// Endpoint untuk list semua endpoint yang disimpan
app.get('/list', async (c) => {
  const list = await c.env.VPSAI.list({ include: ['customMetadata'] });
  const items = list.objects.map(obj => ({
    id: obj.key,
    url: obj.customMetadata?.url || 'Unknown',
    provider: obj.customMetadata?.provider || 'custom',
    uploaded: obj.uploaded
  }));
  return c.json({ ok: true, items });
});

// Endpoint untuk menghapus endpoint
app.delete('/delete/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.VPSAI.delete(id);
  return c.json({ ok: true });
});

// Direct AI Gateway (Simplified GET request)
app.get('/ai/:provider', async (c) => {
  const provider = c.req.param('provider').toLowerCase();
  const prompt = c.req.query('prompt');
  const apikey = c.req.query('apikey');
  const model = c.req.query('model');

  if (!prompt || !apikey) {
    return c.json({ ok: false, error: 'Parameter prompt dan apikey wajib diisi' }, 400);
  }

  let url = '';
  let method = 'POST';
  let headers: Record<string, string> = { 'Content-Type': 'application/json' };
  let body: any = null;

  try {
    if (provider === 'gemini' || provider === 'gimini') {
      const targetModel = model || 'gemini-1.5-flash';
      url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apikey}`;
      body = { contents: [{ parts: [{ text: prompt }] }] };
    } else if (provider === 'openai') {
      url = 'https://api.openai.com/v1/chat/completions';
      headers['Authorization'] = `Bearer ${apikey}`;
      body = {
        model: model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      };
    } else if (provider === 'claude' || provider === 'anthropic') {
      url = 'https://api.anthropic.com/v1/messages';
      headers['x-api-key'] = apikey;
      headers['anthropic-version'] = '2023-06-01';
      body = {
        model: model || 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      };
    } else if (['groq', 'mistral', 'perplexity'].includes(provider)) {
      const baseUrlMap: Record<string, string> = {
        groq: 'https://api.groq.com/openai/v1',
        mistral: 'https://api.mistral.ai/v1',
        perplexity: 'https://api.perplexity.ai'
      };
      const modelMap: Record<string, string> = {
        groq: 'llama3-8b-8192',
        mistral: 'mistral-tiny',
        perplexity: 'llama-3-sonar-small-32k-online'
      };
      url = `${baseUrlMap[provider]}/chat/completions`;
      headers['Authorization'] = `Bearer ${apikey}`;
      body = {
        model: model || modelMap[provider],
        messages: [{ role: 'user', content: prompt }]
      };
    } else {
      return c.json({ ok: false, error: 'Provider tidak didukung' }, 400);
    }

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body)
    });

    const data: any = await response.json();

    // Normalisasi respons untuk klien
    let resultText = '';
    if (provider === 'gemini' || provider === 'gimini') {
      resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    } else if (['openai', 'groq', 'mistral', 'perplexity'].includes(provider)) {
      resultText = data.choices?.[0]?.message?.content || 'No response';
    } else if (provider === 'claude' || provider === 'anthropic') {
      resultText = data.content?.[0]?.text || 'No response from Claude';
    }

    return c.json({
      ok: response.ok,
      provider,
      model: body?.model || model || 'default',
      result: resultText,
      raw: data
    });
  } catch (err: any) {
    return c.json({ ok: false, error: 'Gateway Error: ' + err.message }, 500);
  }
});

// Route utama untuk proxy dengan dukungan ID dari R2
app.all('/p/:mode/:id/:path{.+}?', async (c) => {
  const { mode, id, path } = c.req.param();
  const obj = await c.env.VPSAI.get(id);
  if (!obj) return c.text('Endpoint tidak ditemukan atau telah kedaluwarsa', 404);

  const rawData = await obj.text();
  let targetBaseUrl: string;
  let config: any = {};

  try {
    config = JSON.parse(rawData);
    targetBaseUrl = config.url;
  } catch {
    // Fallback untuk data lama yang hanya menyimpan string URL
    targetBaseUrl = rawData;
  }

  return handleProxy(c, mode, targetBaseUrl, path, config);
});

// Fungsi inti untuk menangani proxy
async function handleProxy(c: Context<{ Bindings: Env }>, mode: string, targetBaseUrl: string, path?: string, config?: any) {
  // Bangun target URL lengkap dengan path dan query parameters
  const targetUrlObj = new URL(targetBaseUrl);

  if (path) {
    // Gabungkan path tambahan dengan penanganan slash yang bersih
    const cleanOriginalPath = targetUrlObj.pathname.replace(/\/$/, '');
    const cleanSubPath = path.replace(/^\//, '');
    targetUrlObj.pathname = cleanOriginalPath + '/' + cleanSubPath;
  }

  // Teruskan query parameters dari request client
  const clientUrl = new URL(c.req.url);
  clientUrl.searchParams.forEach((value, key) => {
    targetUrlObj.searchParams.set(key, value);
  });

  // Persiapkan header berdasarkan mode
  const incomingHeaders = c.req.header();
  const newHeaders = new Headers();

  // Daftar header yang dibatasi oleh Cloudflare atau tidak ingin diteruskan
  const restrictedHeaders = [
    'host',
    'cf-connecting-ip',
    'cf-ipcountry',
    'cf-ray',
    'cf-visitor',
    'x-forwarded-for',
    'x-real-ip',
    'via'
  ];

  // Salin header yang diperbolehkan
  for (const [key, value] of Object.entries(incomingHeaders)) {
    if (!restrictedHeaders.includes(key.toLowerCase())) {
      newHeaders.set(key, value);
    }
  }

  // Suntikkan API Key jika ada di config
  if (config?.key && config?.provider) {
    const provider = config.provider.toLowerCase();
    const key = config.key;

    if (['openai', 'mistral', 'groq', 'perplexity'].includes(provider)) {
      newHeaders.set('Authorization', `Bearer ${key}`);
    } else if (provider === 'anthropic' || provider === 'claude') {
      newHeaders.set('x-api-key', key);
      newHeaders.set('anthropic-version', '2023-06-01');
    } else if (provider === 'gemini') {
      newHeaders.set('x-goog-api-key', key);
      // Dukungan untuk SDK yang menggunakan query parameter ?key=
      // Selalu timpa dengan key dari vault untuk keamanan
      targetUrlObj.searchParams.set('key', key);
    }
  }

  const targetUrl = targetUrlObj.toString();
  const clientIP = c.req.header('CF-Connecting-IP') || '127.0.0.1';

  if (mode === 'transparent') {
    newHeaders.set('X-Forwarded-For', clientIP);
    newHeaders.set('Via', '1.1 smart-proxy');
  } else if (mode === 'anonymous') {
    // Sembunyikan IP tapi beri tahu ada proxy
    newHeaders.set('Via', '1.1 smart-proxy');
  } else if (mode === 'elite') {
    // Jangan tambahkan apapun yang mengidentifikasi proxy
    // (Restricted headers sudah dihapus di atas)
  }

  try {
    const response = await fetch(targetUrl, {
      method: c.req.method,
      headers: newHeaders,
      body: ['GET', 'HEAD'].includes(c.req.method) ? null : c.req.raw.body,
      redirect: 'follow'
    });

    // Kembalikan respons ke klien
    const resHeaders = new Headers(response.headers);

    // Hapus header respons yang bermasalah jika ada
    resHeaders.delete('content-encoding');
    resHeaders.delete('content-security-policy');

    // Tambahkan CORS agar bisa digunakan dari mana saja jika perlu
    resHeaders.set('Access-Control-Allow-Origin', '*');

    // Gunakan HTMLRewriter untuk merombak link jika kontennya adalah HTML
    const contentType = resHeaders.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const baseUrl = new URL(targetUrl).origin;

      const rewriter = new HTMLRewriter()
        .on('a', {
          element(el) {
            const href = el.getAttribute('href');
            if (href) el.setAttribute('href', rewriteUrl(href, baseUrl, mode, c.req.url));
          }
        })
        .on('img', {
          element(el) {
            const src = el.getAttribute('src');
            if (src) el.setAttribute('src', rewriteUrl(src, baseUrl, mode, c.req.url));
          }
        })
        .on('link', {
          element(el) {
            const href = el.getAttribute('href');
            if (href) el.setAttribute('href', rewriteUrl(href, baseUrl, mode, c.req.url));
          }
        })
        .on('script', {
          element(el) {
            const src = el.getAttribute('src');
            if (src) el.setAttribute('src', rewriteUrl(src, baseUrl, mode, c.req.url));
          }
        })
        .on('form', {
          element(el) {
            const action = el.getAttribute('action');
            if (action) el.setAttribute('action', rewriteUrl(action, baseUrl, mode, c.req.url));
          }
        });

      return rewriter.transform(new Response(response.body, {
        status: response.status,
        headers: resHeaders
      }));
    }

    return new Response(response.body, {
      status: response.status,
      headers: resHeaders
    });
  } catch (err) {
    return c.text('Gagal mengambil konten dari: ' + targetUrl, 502);
  }
}

// Fungsi bantuan untuk merombak URL
function rewriteUrl(url: string, baseUrl: string, mode: string, workerUrl: string) {
  // Jika URL adalah data-uri atau anchor, abaikan
  if (url.startsWith('data:') || url.startsWith('#') || url.startsWith('javascript:')) return url;

  let absoluteUrl: string;
  try {
    absoluteUrl = new URL(url, baseUrl).href;
  } catch (err) {
    return url;
  }

  // Buat URL baru yang melalui proxy internal (r)
  const workerBase = new URL(workerUrl).origin;
  // Gunakan URL-safe Base64 (replace / with _ and + with -)
  const safeBase64 = btoa(absoluteUrl).replace(/\//g, '_').replace(/\+/g, '-');
  return `${workerBase}/r/${mode}/${safeBase64}`;
}

export default app;
