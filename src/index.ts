import { Hono } from 'hono';
import { getFrontend } from './frontend';

const app = new Hono();

// Route untuk melayani frontend
app.get('/', (c) => {
  return c.html(getFrontend(c.req.url));
});

// Endpoint untuk cek ketersediaan target (Health Check)
app.get('/check', async (c) => {
  const targetUrl = c.req.query('url');
  if (!targetUrl) return c.json({ ok: false, error: 'URL tidak valid' }, 400);

  try {
    // Gunakan GET tapi batasi hanya ambil header untuk efisiensi jika mungkin,
    // namun banyak API butuh GET penuh.
    const response = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'Smart-Proxy-Checker/1.0' }
    });

    if (response.ok) {
      return c.json({ ok: true, status: response.status });
    } else {
      return c.json({
        ok: false,
        status: response.status,
        error: `Target mengembalikan status ${response.status} (${response.statusText || 'Unknown'})`
      });
    }
  } catch (err: any) {
    return c.json({ ok: false, error: 'Gagal terhubung ke target: ' + (err.message || 'Unknown error') }, 500);
  }
});

// Route utama untuk proxy dengan dukungan sub-path
app.all('/p/:mode/:encodedUrl/:path{.+}?', async (c) => {
  const { mode, encodedUrl, path } = c.req.param();
  let targetBaseUrl: string;

  try {
    targetBaseUrl = atob(encodedUrl);
  } catch (err) {
    return c.text('URL terenkripsi tidak valid', 400);
  }

  // Bangun target URL lengkap dengan path dan query parameters
  const targetUrlObj = new URL(targetBaseUrl);

  if (path) {
    // Gabungkan path tambahan
    const originalPath = targetUrlObj.pathname === '/' ? '' : targetUrlObj.pathname;
    targetUrlObj.pathname = originalPath + '/' + path;
  }

  // Teruskan query parameters dari request client
  const clientUrl = new URL(c.req.url);
  clientUrl.searchParams.forEach((value, key) => {
    targetUrlObj.searchParams.set(key, value);
  });

  const targetUrl = targetUrlObj.toString();

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
});

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

  // Buat URL baru yang melalui proxy
  const workerBase = new URL(workerUrl).origin;
  return `${workerBase}/p/${mode}/${btoa(absoluteUrl)}`;
}

export default app;
