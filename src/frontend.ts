export const getFrontend = (workerUrl: string) => `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Smart Proxy Elite | Premium AI Gateway</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --primary-glow: rgba(99, 102, 241, 0.4);
            --secondary: #a855f7;
            --bg: #030712;
            --card-bg: rgba(17, 24, 39, 0.7);
            --text: #f9fafb;
            --text-dim: #9ca3af;
            --border: rgba(255, 255, 255, 0.08);
            --success: #10b981;
            --error: #ef4444;
            --font-main: 'Inter', system-ui, -apple-system, sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            font-family: var(--font-main);
            background-color: var(--bg);
            background-image:
                radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.1) 0%, transparent 40%);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding: 1.5rem;
            line-height: 1.5;
            overflow-x: hidden;
        }

        @media (max-width: 640px) {
            body { padding: 0.75rem; }
        }

        .container {
            width: 100%;
            max-width: 1200px;
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 2rem;
            animation: fadeIn 0.8s ease-out;
        }

        @media (max-width: 1100px) {
            .container {
                grid-template-columns: 1fr;
                max-width: 800px;
            }
            .sidebar { order: 2; }
        }

        @media (max-width: 640px) {
            .container { gap: 1rem; }
        }

        .glass {
            background: var(--card-bg);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid var(--border);
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 640px) {
            .glass { border-radius: 20px; }
        }

        .header { margin-bottom: 3rem; }
        .header h1 {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        .header p { color: var(--text-dim); font-size: 1.125rem; }

        @media (max-width: 640px) {
            .header { margin-bottom: 2rem; }
            .header h1 { font-size: 2rem; }
            .header p { font-size: 0.95rem; }
        }

        .main-content { padding: 2.5rem; display: flex; flex-direction: column; gap: 2rem; }
        @media (max-width: 640px) {
            .main-content { padding: 1.5rem; gap: 1.5rem; }
        }

        .section-title {
            font-size: 0.875rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--primary);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        @media (max-width: 640px) {
            .section-title { margin-bottom: 1rem; }
        }

        .input-group { margin-bottom: 1.5rem; }
        .input-label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--text-dim); margin-bottom: 0.75rem; }

        input, select, textarea {
            width: 100%;
            padding: 1rem 1.25rem;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid var(--border);
            border-radius: 16px;
            color: var(--text);
            font-size: 1rem;
            transition: all 0.3s;
            appearance: none;
            -webkit-appearance: none;
        }

        @media (max-width: 640px) {
            input, select, textarea { padding: 0.875rem 1rem; font-size: 16px; } /* Prevent iOS zoom */
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 4px var(--primary-glow);
        }

        .main-btn {
            width: 100%;
            padding: 1.125rem;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            border: none;
            border-radius: 16px;
            color: white;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
        }

        .main-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .main-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .result-area { display: none; margin-top: 2rem; animation: fadeInUp 0.5s ease-out; }
        .result-area.active { display: block; }

        .access-card {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }

        @media (max-width: 640px) {
            .access-card { padding: 1.25rem; margin-bottom: 1rem; border-radius: 16px; }
        }

        .url-box {
            display: flex;
            gap: 1rem;
            align-items: center;
            background: rgba(0, 0, 0, 0.5);
            padding: 0.75rem 1rem;
            border-radius: 12px;
            margin-top: 1rem;
            border: 1px solid var(--border);
        }

        @media (max-width: 640px) {
            .url-box { flex-direction: column; align-items: stretch; gap: 0.75rem; padding: 1rem; }
            .url-text { font-size: 0.8rem; word-break: break-all; white-space: normal; }
        }

        .url-text {
            flex: 1;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.875rem;
            color: var(--success);
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .copy-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
        }

        .tester-section {
            margin-top: 3rem;
            padding: 2rem;
            background: rgba(99, 102, 241, 0.05);
            border-radius: 24px;
            border: 1px solid rgba(99, 102, 241, 0.2);
        }

        @media (max-width: 640px) {
            .tester-section { margin-top: 2rem; padding: 1.5rem; border-radius: 20px; }
        }

        .sidebar { padding: 2rem; display: flex; flex-direction: column; gap: 2.5rem; }
        @media (max-width: 640px) {
            .sidebar { padding: 1.5rem; gap: 1.5rem; }
        }
        .provider-item {
            padding: 1rem 1.25rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            border-radius: 16px;
            cursor: pointer;
            margin-bottom: 0.5rem;
            transition: 0.3s;
        }
        .provider-item:hover { background: rgba(255, 255, 255, 0.06); }
        .provider-item.active { border-color: var(--primary); color: var(--primary); }

        .vault-card {
            padding: 1.25rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            border-radius: 18px;
            cursor: pointer;
            margin-bottom: 0.75rem;
            position: relative;
        }
        .delete-btn { position: absolute; top: 1rem; right: 1rem; color: var(--error); font-size: 0.75rem; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .loader { width: 20px; height: 20px; border: 3px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: white; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <main class="main-content glass">
            <div class="header">
                <h1>Smart Proxy Elite</h1>
                <p>Advanced Private AI Orchestration</p>
            </div>

            <div id="vaultForm">
                <div class="section-title">Create Private Vault</div>
                <div class="input-group">
                    <label class="input-label">Target AI End Point (Gemini, OpenAI, etc.)</label>
                    <input type="text" id="targetUrl" placeholder="https://api.openai.com/v1" value="https://example.com">
                </div>
                <div class="input-group">
                    <label class="input-label">Provider API Key</label>
                    <input type="password" id="providerApiKey" placeholder="sk-...">
                </div>
                <div class="input-group">
                    <label class="input-label">Security Mode</label>
                    <select id="proxyMode">
                        <option value="elite">Elite Stealth Proxy</option>
                        <option value="anonymous">Anonymous Proxy</option>
                        <option value="transparent">Transparent Proxy</option>
                    </select>
                </div>
                <button id="saveBtn" class="main-btn">Initialize Vault & Generate API</button>
            </div>

            <div id="vaultResult" class="result-area">
                <div class="section-title">API Deployment Success</div>

                <div id="directApiSection" style="display:none;">
                    <div class="access-card" style="border-color: var(--primary); background: rgba(99, 102, 241, 0.1);">
                        <div style="font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">DIRECT CLIENT API (GET Format)</div>
                        <div class="url-box">
                            <div id="directClientUrl" class="url-text" style="color: white;">-</div>
                            <button class="copy-btn" onclick="copyText(document.getElementById('directClientUrl').innerText, this)">Copy</button>
                        </div>
                        <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.5rem;">Gunakan format ini untuk pemanggilan API langsung dengan parameter prompt dan apikey.</p>
                    </div>
                </div>

                <div class="access-card" style="border-color: var(--success); background: rgba(16, 185, 129, 0.05);">
                    <div style="font-weight: 700; color: var(--success); margin-bottom: 0.5rem;">PROXY VAULT KEY (Bearer Token)</div>
                    <div class="url-box">
                        <div id="newProxyKey" class="url-text" style="color: white;">-</div>
                        <button class="copy-btn" onclick="copyText(document.getElementById('newProxyKey').innerText, this)">Copy</button>
                    </div>
                </div>

                <div id="deploymentCards"></div>

                <div class="tester-section">
                    <h3 style="margin-bottom: 1.5rem; color: var(--primary);">Interactive Live Tester</h3>
                    <div class="input-group">
                        <label class="input-label">Endpoint</label>
                        <input type="text" id="testEndpoint" readonly>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Proxy Key / API Key</label>
                        <input type="text" id="testProxyKey">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Prompt</label>
                        <textarea id="testPrompt" rows="3" placeholder="Test message..."></textarea>
                    </div>
                    <button id="runTestBtn" class="main-btn">Execute Test Request</button>

                    <div id="testOutput" style="display:none; margin-top: 1.5rem; background: #000; padding: 1rem; border-radius: 12px; border: 1px solid var(--border);">
                        <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 0.5rem;">Raw Provider Response:</div>
                        <pre id="testResultText" style="color: var(--success); font-family: monospace; font-size: 0.8rem; white-space: pre-wrap;"></pre>
                    </div>
                </div>
            </div>
        </main>

        <aside class="sidebar glass">
            <h2>AI Templates</h2>
            <div class="provider-item" onclick="selectTemplate('gemini')">✨ Gemini 2.0 Flash</div>
            <div class="provider-item" onclick="selectTemplate('openai')">🤖 GPT-4o</div>
            <div class="provider-item" onclick="selectTemplate('claude')">🧠 Claude 3.5 Sonnet</div>

            <h2 style="margin-top: 2rem;">My Vaults</h2>
            <div id="vaultList"></div>
        </aside>
    </div>

    <script>
        let currentProvider = 'custom';
        let currentVaultData = null;

        function selectTemplate(id) {
            currentProvider = id;
            if (id === 'gemini') {
                document.getElementById('targetUrl').value = 'https://generativelanguage.googleapis.com';
            } else if (id === 'openai') {
                document.getElementById('targetUrl').value = 'https://api.openai.com/v1';
            } else if (id === 'claude') {
                document.getElementById('targetUrl').value = 'https://api.anthropic.com/v1';
            }
            document.querySelectorAll('.provider-item').forEach(el => el.classList.remove('active'));
            event.currentTarget.classList.add('active');
        }

        function copyText(t, b) {
            navigator.clipboard.writeText(t);
            const original = b.innerText;
            b.innerText = 'Copied';
            setTimeout(() => b.innerText = original, 2000);
        }

        async function fetchVaults() {
            try {
                const res = await fetch('/list');
                const data = await res.json();
                const list = document.getElementById('vaultList');
                list.innerHTML = '';
                if (data.items.length === 0) {
                    list.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 1rem;">Vault is empty.</div>';
                    return;
                }
                data.items.forEach(item => {
                    const d = document.createElement('div');
                    d.className = 'vault-card';
                    d.innerHTML = \`
                        <div style="font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${item.url}</div>
                        <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 4px;">\${item.provider} • \${item.id.substring(0,8)}</div>
                        <div class="delete-btn" onclick="event.stopPropagation(); deleteVault('\${item.id}')">Delete</div>
                    \`;
                    d.onclick = () => showDetails(item.id, item.url, item.provider);
                    list.appendChild(d);
                });
            } catch (e) {
                console.error('Failed to fetch vaults');
            }
        }

        async function deleteVault(id) {
            if(confirm('Are you sure you want to delete this vault?')) {
                await fetch('/delete/' + id, { method: 'DELETE' });
                fetchVaults();
            }
        }

        function showDetails(id, url, provider, vaultKey = '', providerKey = '') {
            document.getElementById('vaultResult').classList.add('active');
            document.getElementById('vaultForm').style.display = 'none';

            if (vaultKey) {
                document.getElementById('newProxyKey').innerText = vaultKey;
                document.getElementById('testProxyKey').value = vaultKey;
            } else {
                document.getElementById('newProxyKey').innerText = '(Key Hidden)';
                document.getElementById('testProxyKey').value = '';
            }

            const directApiSection = document.getElementById('directApiSection');
            const directClientUrl = document.getElementById('directClientUrl');

            if (provider !== 'custom') {
                directApiSection.style.display = 'block';
                const base = window.location.origin;
                const exampleKey = providerKey || 'YOUR_API_KEY';
                directClientUrl.innerText = \`\${base}/ai/\${provider}?prompt=Halo&apikey=\${exampleKey}\`;
            } else {
                directApiSection.style.display = 'none';
            }

            const cards = document.getElementById('deploymentCards');
            cards.innerHTML = '';
            ['elite', 'anonymous', 'transparent'].forEach(mode => {
                const pUrl = window.location.origin + '/p/' + mode + '/' + id;
                const c = document.createElement('div');
                c.className = 'access-card';
                c.innerHTML = \`
                    <div style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">\${mode} Protocol</div>
                    <div class="url-box">
                        <div class="url-text">\${pUrl}</div>
                        <button class="copy-btn" onclick="copyText('\${pUrl}', this)">Copy</button>
                    </div>
                \`;
                cards.appendChild(c);
            });
            document.getElementById('testEndpoint').value = window.location.origin + '/p/elite/' + id;
            currentVaultData = { id, provider };
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        document.getElementById('saveBtn').onclick = async () => {
            const btn = document.getElementById('saveBtn');
            const url = document.getElementById('targetUrl').value;
            const key = document.getElementById('providerApiKey').value;

            btn.disabled = true;
            btn.innerHTML = '<div class="loader"></div>';

            try {
                const res = await fetch('/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url, key, provider: currentProvider })
                });
                const data = await res.json();
                if(data.ok) {
                    showDetails(data.id, url, currentProvider, data.vaultKey, key);
                    fetchVaults();
                } else {
                    alert('Error initializing vault: ' + data.error);
                }
            } catch (e) {
                alert('Connection error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = 'Initialize Vault & Generate API';
            }
        };

        document.getElementById('runTestBtn').onclick = async () => {
            const btn = document.getElementById('runTestBtn');
            const output = document.getElementById('testOutput');
            const outText = document.getElementById('testResultText');
            btn.disabled = true;
            output.style.display = 'block';
            outText.innerText = 'Connecting to proxy...';

            try {
                let testUrl = document.getElementById('testEndpoint').value;
                let body = null;
                let method = 'POST';
                let headers = {
                    'Authorization': 'Bearer ' + document.getElementById('testProxyKey').value,
                    'Content-Type': 'application/json'
                };

                if (currentVaultData.provider === 'gemini') {
                    testUrl += '/v1beta/models/gemini-2.0-flash-exp:generateContent';
                    body = JSON.stringify({ contents: [{ parts: [{ text: document.getElementById('testPrompt').value || 'Hello' }] }] });
                } else if (currentVaultData.provider === 'openai') {
                    testUrl += '/chat/completions';
                    body = JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'user', content: document.getElementById('testPrompt').value || 'Hello' }] });
                } else if (currentVaultData.provider === 'claude') {
                    testUrl += '/messages';
                    body = JSON.stringify({
                        model: 'claude-3-5-sonnet-20240620',
                        max_tokens: 1024,
                        messages: [{ role: 'user', content: document.getElementById('testPrompt').value || 'Hello' }]
                    });
                } else {
                    // Generic test for custom URL
                    method = 'GET';
                    body = null;
                }

                const res = await fetch(testUrl, {
                    method: method,
                    headers: headers,
                    body: body
                });
                const data = await res.text();
                try {
                    const json = JSON.parse(data);
                    outText.innerText = JSON.stringify(json, null, 2);
                } catch {
                    outText.innerText = data;
                }
            } catch (e) {
                outText.innerText = 'Test Error: ' + e.message;
            } finally {
                btn.disabled = false;
            }
        };

        fetchVaults();
    </script>
</body>
</html>
`;
