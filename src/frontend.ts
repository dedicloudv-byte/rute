export const getFrontend = (workerUrl: string) => `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Proxy Manager</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .container { background: #fff; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 500px; }
        h1 { font-size: 1.5rem; margin-bottom: 1.5rem; color: #2c3e50; text-align: center; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
        input[type="text"], select { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        button { width: 100%; padding: 0.75rem; background-color: #3498db; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; transition: background 0.3s; }
        button:hover { background-color: #2980b9; }
        button:disabled { background-color: #bdc3c7; cursor: not-allowed; }
        .result { margin-top: 1.5rem; padding: 1rem; background: #e8f4fd; border-radius: 6px; display: none; }
        .result.show { display: block; }
        .result h2 { font-size: 1rem; margin-top: 0; }
        .endpoint-item { margin-bottom: 1rem; padding: 0.75rem; background: #fff; border: 1px solid #cfe2f3; border-radius: 6px; }
        .endpoint-label { font-size: 0.85rem; font-weight: bold; margin-bottom: 0.25rem; color: #7f8c8d; }
        .url-row { display: flex; gap: 0.5rem; align-items: center; }
        .url-box { flex-grow: 1; background: #f9f9f9; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 0.85rem; }
        .copy-btn, .test-btn { width: auto; padding: 0.5rem 0.75rem; font-size: 0.85rem; background-color: #95a5a6; border: none; border-radius: 4px; color: white; cursor: pointer; }
        .test-btn { background-color: #e67e22; }
        .test-btn:hover { background-color: #d35400; }
        .copy-btn:hover { background-color: #7f8c8d; }
        .preview-box { margin-top: 1rem; padding: 0.75rem; background: #2c3e50; color: #ecf0f1; border-radius: 6px; font-family: monospace; font-size: 0.85rem; max-height: 300px; overflow: auto; display: none; }
        .preview-box.show { display: block; }
        .status { margin-top: 0.5rem; font-size: 0.85rem; }
        .status.error { color: #e74c3c; }
        .status.success { color: #27ae60; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Smart Proxy Manager</h1>
        <div class="form-group">
            <label for="targetUrl">URL Tujuan (Endpoint)</label>
            <input type="text" id="targetUrl" placeholder="https://example.com" value="https://example.com">
        </div>
        <div class="form-group">
            <label for="proxyMode">Jenis Proxy (Anonymity Level)</label>
            <select id="proxyMode">
                <option value="transparent">Transparent (IP Terlihat)</option>
                <option value="anonymous">Anonymous (IP Tersembunyi, Tanda Proxy Ada)</option>
                <option value="elite">Elite (Sangat Anonim, Tanpa Jejak)</option>
            </select>
        </div>
        <button id="generateBtn">Generate & Cek Ketersediaan</button>

        <div id="resultBox" class="result">
            <h2>API / Proxy Endpoints Berhasil Dihasilkan:</h2>

            <div id="endpointsContainer"></div>

            <div id="statusMsg" class="status"></div>

            <div id="previewBox" class="preview-box">
                <div style="color: #bdc3c7; margin-bottom: 0.5rem; font-size: 0.75rem;">Response Preview:</div>
                <pre id="previewContent"></pre>
            </div>

            <br>
            <button id="goBtn" style="background-color: #2ecc71;">Kunjungi Endpoint Utama</button>
        </div>
    </div>

    <script>
        const generateBtn = document.getElementById('generateBtn');
        const targetUrlInput = document.getElementById('targetUrl');
        const proxyModeSelect = document.getElementById('proxyMode');
        const resultBox = document.getElementById('resultBox');
        const endpointsContainer = document.getElementById('endpointsContainer');
        const statusMsg = document.getElementById('statusMsg');
        const goBtn = document.getElementById('goBtn');

        let primaryUrl = '';

        const previewBox = document.getElementById('previewBox');
        const previewContent = document.getElementById('previewContent');

        function createEndpointUI(label, url) {
            const div = document.createElement('div');
            div.className = 'endpoint-item';
            div.innerHTML = '<div class="endpoint-label">' + label + '</div>' +
                '<div class="url-row">' +
                    '<div class="url-box">' + url + '</div>' +
                    '<button class="copy-btn" onclick="copyToClipboard(\\'' + url + '\\', this)">Copy</button>' +
                    '<button class="test-btn" onclick="testEndpoint(\\'' + url + '\\')">Test</button>' +
                '</div>';
            return div;
        }

        window.testEndpoint = async (url) => {
            previewBox.classList.add('show');
            previewContent.innerText = 'Fetching...';
            try {
                const res = await fetch(url);
                const text = await res.text();
                try {
                    const json = JSON.parse(text);
                    previewContent.innerText = JSON.stringify(json, null, 2);
                } catch (e) {
                    previewContent.innerText = text;
                }
            } catch (err) {
                previewContent.innerText = 'Error testing endpoint: ' + err.message;
            }
        };

        window.copyToClipboard = (text, btn) => {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = btn.innerText;
                btn.innerText = 'Copied!';
                btn.style.backgroundColor = '#27ae60';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                }, 2000);
            });
        };

        generateBtn.addEventListener('click', async () => {
            const target = targetUrlInput.value.trim();
            const selectedMode = proxyModeSelect.value;

            if (!target) {
                alert('Silakan masukkan URL tujuan');
                return;
            }

            generateBtn.disabled = true;
            generateBtn.innerText = 'Mengecek ketersediaan...';
            statusMsg.innerText = '';
            resultBox.classList.remove('show');
            previewBox.classList.remove('show');
            endpointsContainer.innerHTML = '';

            try {
                const checkRes = await fetch('/check?url=' + encodeURIComponent(target));
                const checkData = await checkRes.json();

                if (checkData.ok) {
                    const origin = window.location.origin;
                    const id = checkData.id;

                    const modes = [
                        { id: 'transparent', label: 'Transparent Endpoint' },
                        { id: 'anonymous', label: 'Anonymous Endpoint' },
                        { id: 'elite', label: 'Elite (Highly Anonymous) Endpoint' }
                    ];

                    modes.forEach(m => {
                        const url = origin + '/p/' + m.id + '/' + id;
                        endpointsContainer.appendChild(createEndpointUI(m.label, url));
                        if (m.id === selectedMode) primaryUrl = url;
                    });

                    statusMsg.innerText = 'API Endpoints berhasil dibuat dan siap digunakan!';
                    statusMsg.className = 'status success';
                    resultBox.classList.add('show');
                } else {
                    statusMsg.innerText = 'Gagal: ' + (checkData.error || 'Terjadi kesalahan tidak diketahui');
                    statusMsg.className = 'status error';
                    resultBox.classList.add('show');
                }
            } catch (err) {
                statusMsg.innerText = 'Terjadi kesalahan sistem saat menghubungi server.';
                statusMsg.className = 'status error';
                resultBox.classList.add('show');
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerText = 'Generate & Cek Ketersediaan';
            }
        });

        goBtn.addEventListener('click', () => {
            if (primaryUrl) window.open(primaryUrl, '_blank');
        });
    </script>
</body>
</html>
`;
