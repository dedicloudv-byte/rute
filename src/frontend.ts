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
        .url-box { background: #fff; padding: 0.5rem; border: 1px solid #cfe2f3; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 0.9rem; }
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
            <h2>Domain / URL Proxy Berhasil Dihasilkan:</h2>
            <div id="generatedUrl" class="url-box"></div>
            <div id="statusMsg" class="status"></div>
            <br>
            <button id="goBtn" style="background-color: #2ecc71;">Kunjungi Link Proxy</button>
        </div>
    </div>

    <script>
        const generateBtn = document.getElementById('generateBtn');
        const targetUrlInput = document.getElementById('targetUrl');
        const proxyModeSelect = document.getElementById('proxyMode');
        const resultBox = document.getElementById('resultBox');
        const generatedUrlDiv = document.getElementById('generatedUrl');
        const statusMsg = document.getElementById('statusMsg');
        const goBtn = document.getElementById('goBtn');

        let finalUrl = '';

        generateBtn.addEventListener('click', async () => {
            const target = targetUrlInput.value.trim();
            const mode = proxyModeSelect.value;

            if (!target) {
                alert('Silakan masukkan URL tujuan');
                return;
            }

            generateBtn.disabled = true;
            generateBtn.innerText = 'Mengecek ketersediaan...';
            statusMsg.innerText = '';
            resultBox.classList.remove('show');

            try {
                const checkRes = await fetch('/check?url=' + encodeURIComponent(target));
                const checkData = await checkRes.json();

                if (checkData.ok) {
                    const encoded = btoa(target);
                    finalUrl = window.location.origin + '/p/' + mode + '/' + encoded;

                    generatedUrlDiv.innerText = finalUrl;
                    statusMsg.innerText = 'Proxy tersedia dan siap digunakan!';
                    statusMsg.className = 'status success';
                    resultBox.classList.add('show');
                } else {
                    statusMsg.innerText = 'Gagal: ' + checkData.error;
                    statusMsg.className = 'status error';
                    resultBox.classList.add('show');
                    generatedUrlDiv.innerText = 'N/A';
                }
            } catch (err) {
                statusMsg.innerText = 'Terjadi kesalahan sistem.';
                statusMsg.className = 'status error';
                resultBox.classList.add('show');
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerText = 'Generate & Cek Ketersediaan';
            }
        });

        goBtn.addEventListener('click', () => {
            if (finalUrl) window.open(finalUrl, '_blank');
        });
    </script>
</body>
</html>
`;
