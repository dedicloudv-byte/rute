export const getFrontend = (workerUrl: string) => `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Smart Proxy Elite</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --primary-hover: #4f46e5;
            --bg: #0f172a;
            --card-bg: rgba(30, 41, 59, 0.7);
            --text: #f8fafc;
            --text-dim: #94a3b8;
            --danger: #ef4444;
            --success: #22c55e;
            --glass: rgba(255, 255, 255, 0.03);
            --border: rgba(255, 255, 255, 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
            background-attachment: fixed;
            color: var(--text);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding: 2rem;
        }

        .layout {
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 2rem;
            width: 100%;
            max-width: 1300px;
        }

        @media (max-width: 1024px) {
            .layout { display: flex; flex-direction: column-reverse; }
            body { padding: 1rem; }
        }

        .main-panel, .side-panel {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            height: fit-content;
            position: sticky;
            top: 2rem;
        }

        @media (max-width: 640px) {
            .main-panel, .side-panel { padding: 1.5rem; border-radius: 20px; }
            h1 { font-size: 1.75rem !important; }
        }

        h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: 1.5rem; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.025em; }
        h2 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1.25rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; }

        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.6rem; font-size: 0.85rem; font-weight: 600; color: var(--text-dim); }

        input, select {
            width: 100%;
            padding: 0.8rem 1rem;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border);
            border-radius: 12px;
            color: var(--text);
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        input:focus, select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
            background: rgba(0, 0, 0, 0.3);
        }

        .template-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.6rem;
            margin-bottom: 1rem;
        }
        @media (max-width: 480px) { .template-grid { grid-template-columns: repeat(2, 1fr); } }

        .template-chip {
            padding: 0.6rem;
            background: var(--glass);
            border: 1px solid var(--border);
            border-radius: 10px;
            font-size: 0.8rem;
            font-weight: 500;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: var(--text-dim);
        }
        .template-chip:hover { background: rgba(255, 255, 255, 0.08); color: var(--text); }
        .template-chip.active { background: var(--primary); border-color: var(--primary); color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }

        .btn {
            width: 100%;
            padding: 1rem;
            border: none;
            border-radius: 14px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
        }

        .btn-primary { background: linear-gradient(135deg, var(--primary), #4f46e5); color: white; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.4); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .result-box {
            margin-top: 2.5rem;
            display: none;
            animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .result-box.show { display: block; }

        .endpoint-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 1.5rem;
            margin-bottom: 1.25rem;
        }

        .endpoint-card label { font-size: 0.7rem; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
        .url-row { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
        .url-text { flex: 1; min-width: 200px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.8rem; padding: 0.75rem; background: rgba(0,0,0,0.3); border-radius: 10px; overflow: hidden; text-overflow: ellipsis; color: var(--success); }

        .stored-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-height: 400px;
            overflow-y: auto;
            padding-right: 0.5rem;
            margin-bottom: 2rem;
        }

        .stored-item {
            background: var(--glass);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 1.25rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }

        .stored-item:hover { background: rgba(255, 255, 255, 0.05); border-color: var(--primary); transform: translateX(4px); }
        .stored-item.active { border-color: var(--primary); background: rgba(99, 102, 241, 0.08); }

        .stored-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem; }
        .stored-url { font-size: 0.9rem; font-weight: 600; word-break: break-all; color: var(--text); padding-right: 2rem; }
        .provider-badge { font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 6px; background: rgba(99, 102, 241, 0.2); color: var(--primary); text-transform: uppercase; }
        .stored-id { font-size: 0.75rem; color: var(--text-dim); font-family: monospace; }

        .delete-btn {
            position: absolute;
            top: 1.25rem;
            right: 1rem;
            padding: 0.5rem;
            background: rgba(239, 68, 68, 0.1);
            border: none;
            border-radius: 8px;
            color: var(--danger);
            cursor: pointer;
            opacity: 0;
            transition: all 0.2s;
        }
        .stored-item:hover .delete-btn { opacity: 1; }
        .delete-btn:hover { background: var(--danger); color: white; }

        @media (max-width: 1024px) { .delete-btn { opacity: 1; } }

        .preview-container {
            margin-top: 1.5rem;
            background: #000;
            border-radius: 14px;
            padding: 1.25rem;
            font-size: 0.85rem;
            max-height: 300px;
            overflow: auto;
            border: 1px solid var(--border);
            display: none;
        }
        .preview-container.show { display: block; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
    </style>
</head>
<body>
    <div class="layout">
        <div class="main-panel">
            <h1 id="panelTitle">Smart Proxy Elite</h1>

            <div id="configSection">
                <div class="form-group">
                    <label>API Key (Essential for AI Proxies)</label>
                    <input type="password" id="apiKey" placeholder="sk-..." class="main-input">
                </div>

                <div id="gatewayActivePanel" style="display: none; margin-bottom: 2rem; padding: 2rem; background: rgba(99, 102, 241, 0.1); border-radius: 20px; border: 2px solid var(--primary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h2 id="activeGatewayName" style="color: var(--primary); margin: 0;">Instant AI Gateway</h2>
                        <button class="btn" style="width: auto; padding: 0.5rem 1rem; background: var(--glass);" onclick="resetToVault()">Close</button>
                    </div>

                    <div class="form-group">
                        <label>Direct Gateway URL (GET)</label>
                        <div id="gatewayUrlDisplay" class="url-text" style="word-break: break-all; margin-bottom: 0.5rem; display: block; background: #000;"></div>
                        <button class="btn" style="width: auto; padding: 0.4rem 0.8rem; font-size: 0.75rem; background: var(--primary);" onclick="copyGatewayUrl()">Copy URL</button>
                    </div>

                    <div class="form-group">
                        <label>Enter Prompt (Message to AI)</label>
                        <textarea id="gatewayPrompt" style="width: 100%; height: 120px; padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 12px; color: white; font-family: inherit; font-size: 1rem; resize: none; margin-bottom: 1rem;">Halo, siapa kamu?</textarea>
                    </div>

                    <button id="gatewayBtn" class="btn btn-primary" style="background: var(--primary);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2l-18 10 18 10-2-10 2-10zM2 12l21 0"/></svg>
                        <span>Execute Direct Request</span>
                    </button>

                    <div id="gatewayResult" class="preview-container" style="margin-top: 1.5rem;">
                        <div style="color: var(--text-dim); font-size: 0.7rem; font-weight: 700; margin-bottom: 0.75rem; text-transform: uppercase;">Response Preview:</div>
                        <pre id="gatewayContent" style="color: var(--success); font-family: 'JetBrains Mono', monospace; white-space: pre-wrap;"></pre>
                    </div>
                </div>

                <div id="vaultForm" class="form-group">
                    <h2 style="margin-top: 2rem;">Custom Proxy Vault</h2>
                    <div class="form-group">
                        <label>Target URL (Endpoint)</label>
                        <input type="text" id="targetUrl" placeholder="https://api.example.com" value="https://example.com">
                    </div>

                    <div class="form-group">
                        <label>Anonymity Mode</label>
                        <select id="proxyMode">
                            <option value="transparent">Transparent (Full Header)</option>
                            <option value="anonymous">Anonymous (Hidden IP)</option>
                            <option value="elite">Elite (Stealth Mode)</option>
                        </select>
                    </div>

                    <button id="generateBtn" class="btn btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                        <span>Save to Private Vault</span>
                    </button>
                </div>
            </div>

            <div id="resultBox" class="result-box">
                <h2>Generated Vault Endpoints</h2>
                <div id="endpointsContainer"></div>

                <div id="previewContainer" class="preview-container">
                    <div style="color: var(--text-dim); font-size: 0.7rem; font-weight: 700; margin-bottom: 0.75rem; text-transform: uppercase;">Real-time API Response:</div>
                    <pre id="previewContent" style="color: var(--success); font-family: 'JetBrains Mono', monospace;"></pre>
                </div>

                <div id="usageInstructions" style="margin-top: 2rem; padding: 1.5rem; background: rgba(99, 102, 241, 0.05); border-radius: 18px; border: 1px dashed var(--primary); display: none;">
                    <h3 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 0.75rem;">SDK Integration Guide</h3>
                    <div id="instructionText" style="font-size: 0.8rem; color: var(--text-dim); line-height: 1.5;"></div>
                </div>
            </div>
        </div>

        <div class="side-panel">
            <h2>Instant AI Gateways</h2>
            <div id="aiTemplates" class="template-grid" style="grid-template-columns: 1fr; margin-bottom: 2rem;">
                <div class="template-chip" onclick="selectTemplate('gemini')">✨ Gemini Gateway (New)</div>
                <div class="template-chip" onclick="selectTemplate('openai')">🤖 OpenAI Gateway</div>
                <div class="template-chip" onclick="selectTemplate('claude')">🧠 Claude Gateway</div>
                <div class="template-chip" onclick="selectTemplate('groq')">⚡ Groq Gateway</div>
                <div class="template-chip" onclick="selectTemplate('mistral')">🌪️ Mistral Gateway</div>
                <div class="template-chip" onclick="selectTemplate('perplexity')">🔍 Perplexity Gateway</div>
            </div>

            <h2>Private Vault</h2>
            <div id="storedList" class="stored-list">
                <div style="text-align: center; color: var(--text-dim); padding: 3rem;">Loading vault...</div>
            </div>
        </div>
    </div>

    <script>
        const AI_TEMPLATES = {
            openai: { url: 'https://api.openai.com/v1', name: 'OpenAI' },
            claude: { url: 'https://api.anthropic.com/v1', name: 'Claude' },
            gemini: { url: 'https://generativelanguage.googleapis.com', name: 'Gemini' },
            groq: { url: 'https://api.groq.com/openai/v1', name: 'Groq' },
            mistral: { url: 'https://api.mistral.ai/v1', name: 'Mistral' },
            perplexity: { url: 'https://api.perplexity.ai', name: 'Perplexity' }
        };

        const generateBtn = document.getElementById('generateBtn');
        const targetUrlInput = document.getElementById('targetUrl');
        const apiKeyInput = document.getElementById('apiKey');
        const proxyModeSelect = document.getElementById('proxyMode');
        const resultBox = document.getElementById('resultBox');
        const endpointsContainer = document.getElementById('endpointsContainer');
        const storedList = document.getElementById('storedList');
        const previewContainer = document.getElementById('previewContainer');
        const previewContent = document.getElementById('previewContent');
        const usageInstructions = document.getElementById('usageInstructions');
        const instructionText = document.getElementById('instructionText');
        const gatewayPrompt = document.getElementById('gatewayPrompt');
        const gatewayBtn = document.getElementById('gatewayBtn');
        const gatewayResult = document.getElementById('gatewayResult');
        const gatewayContent = document.getElementById('gatewayContent');
        const gatewayUrlDisplay = document.getElementById('gatewayUrlDisplay');
        const gatewayActivePanel = document.getElementById('gatewayActivePanel');
        const vaultForm = document.getElementById('vaultForm');
        const activeGatewayName = document.getElementById('activeGatewayName');

        let activeId = null;
        let selectedProvider = null;

        function selectTemplate(id) {
            document.querySelectorAll('.template-chip').forEach(el => el.classList.remove('active'));
            const chip = Array.from(document.querySelectorAll('.template-chip')).find(el => el.innerText.toLowerCase().includes(id));
            if (chip) chip.classList.add('active');

            selectedProvider = id;
            activeGatewayName.innerText = AI_TEMPLATES[id].name + ' Instant Gateway';
            gatewayActivePanel.style.display = 'block';
            vaultForm.style.display = 'none';
            resultBox.classList.remove('show');

            targetUrlInput.value = AI_TEMPLATES[id].url;
            updateGatewayUrl();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function resetToVault() {
            document.querySelectorAll('.template-chip').forEach(el => el.classList.remove('active'));
            selectedProvider = null;
            gatewayActivePanel.style.display = 'none';
            vaultForm.style.display = 'block';
            targetUrlInput.value = 'https://example.com';
        }

        function updateGatewayUrl() {
            if (!selectedProvider) return;
            const baseUrl = window.location.origin + '/ai/' + selectedProvider;
            const apikey = apiKeyInput.value.trim() || 'YOUR_API_KEY';
            const prompt = encodeURIComponent(gatewayPrompt.value.trim());
            const fullUrl = \`\${baseUrl}?prompt=\${prompt}&apikey=\${apikey}\`;
            gatewayUrlDisplay.innerText = fullUrl;
        }

        function copyGatewayUrl() {
            copyText(gatewayUrlDisplay.innerText, document.querySelector('#gatewayActivePanel button[onclick="copyGatewayUrl()"]'));
        }

        gatewayPrompt.oninput = updateGatewayUrl;
        apiKeyInput.oninput = updateGatewayUrl;

        gatewayBtn.onclick = async () => {
            if (!selectedProvider) return;
            const apikey = apiKeyInput.value.trim();
            const prompt = gatewayPrompt.value.trim();
            if (!apikey) {
                alert('Please enter your API Key in the field above first');
                apiKeyInput.focus();
                return;
            }

            gatewayBtn.disabled = true;
            gatewayResult.style.display = 'block';
            gatewayContent.innerText = 'Connecting to ' + selectedProvider + '...';

            try {
                const url = \`/ai/\${selectedProvider}?prompt=\${encodeURIComponent(prompt)}&apikey=\${apikey}\`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.ok) {
                    gatewayContent.innerText = data.result;
                } else {
                    gatewayContent.innerText = 'Error from Provider: ' + (data.error || JSON.stringify(data.raw, null, 2));
                }
            } catch (err) {
                gatewayContent.innerText = 'Connection Failed: ' + err.message;
            } finally {
                gatewayBtn.disabled = false;
            }
        };

        async function loadStored() {
            try {
                const res = await fetch('/list');
                const data = await res.json();
                storedList.innerHTML = '';

                if (data.items.length === 0) {
                    storedList.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 3rem; font-size: 0.9rem;">Vault is empty</div>';
                    return;
                }

                data.items.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded)).forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'stored-item' + (activeId === item.id ? ' active' : '');
                    div.onclick = () => showEndpoints(item.id, item.url);
                    div.innerHTML = \`
                        <div class="stored-header">
                            <div class="stored-url">\${item.url}</div>
                            <span class="provider-badge">\${item.provider}</span>
                        </div>
                        <div class="stored-id">\${item.id}</div>
                        <button class="delete-btn" onclick="event.stopPropagation(); deleteEndpoint('\${item.id}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
                        </button>
                    \`;
                    storedList.appendChild(div);
                });
            } catch (err) {
                storedList.innerHTML = '<div style="color: var(--danger); text-align: center;">Sync failed</div>';
            }
        }

        async function deleteEndpoint(id) {
            if (!confirm('Permanent delete this proxy?')) return;
            try {
                await fetch('/delete/' + id, { method: 'DELETE' });
                if (activeId === id) resultBox.classList.remove('show');
                loadStored();
            } catch (err) {
                alert('Delete failed');
            }
        }

        function showEndpoints(id, url) {
            activeId = id;
            const item = Array.from(document.querySelectorAll('.stored-item')).find(el => el.querySelector('.stored-id').innerText === id);
            const provider = item ? item.querySelector('.provider-badge').innerText.toLowerCase() : 'custom';

            document.querySelectorAll('.stored-item').forEach(el => el.classList.remove('active'));
            if (item) item.classList.add('active');

            resultBox.classList.add('show');
            endpointsContainer.innerHTML = '';
            previewContainer.classList.remove('show');
            usageInstructions.style.display = 'block';

            if (provider === 'gemini') {
                instructionText.innerHTML = 'To use with <b>Latest Google GenAI SDK</b>:<br>1. Set <code>api_endpoint</code> in client options.<br>2. Specify model <code>gemini-3-flash-preview</code>.<br>3. The proxy securely injects your vault API key.';
            } else if (provider === 'openai') {
                instructionText.innerHTML = 'To use with <b>OpenAI SDK</b>:<br>1. Set <code>base_url</code> to the Elite endpoint below.<br>2. Use any dummy string for <code>api_key</code> (proxy handles the real key).';
            } else if (provider === 'claude' || provider === 'anthropic') {
                instructionText.innerHTML = 'To use with <b>Anthropic SDK</b>:<br>1. Set <code>base_url</code> to the Elite endpoint below.<br>2. Use any dummy string for <code>api_key</code>.';
            } else {
                instructionText.innerHTML = 'Point your application to these endpoints. Authentication and headers are managed by the Smart Proxy Elite vault.';
            }

            const modes = [
                { id: 'transparent', label: 'Transparent Endpoint' },
                { id: 'anonymous', label: 'Anonymous Endpoint' },
                { id: 'elite', label: 'Elite (Highly Secure) Endpoint' }
            ];

            modes.forEach(m => {
                const proxyUrl = window.location.origin + '/p/' + m.id + '/' + id;
                const card = document.createElement('div');
                card.className = 'endpoint-card';
                card.innerHTML = \`
                    <label>\${m.label}</label>
                    <div class="url-row">
                        <div class="url-text">\${proxyUrl}</div>
                        <button class="btn btn-primary" style="width: auto; padding: 0.6rem 1.2rem; font-size: 0.85rem;" onclick="copyText('\${proxyUrl}', this)">Copy</button>
                        <button class="btn" style="width: auto; padding: 0.6rem 1.2rem; background: var(--glass); color: white; border: 1px solid var(--border); font-size: 0.85rem;" onclick="testProxy('\${proxyUrl}')">Test</button>
                    </div>
                \`;
                endpointsContainer.appendChild(card);
            });

            // Auto scroll to result on mobile
            if (window.innerWidth < 1024) {
                resultBox.scrollIntoView({ behavior: 'smooth' });
            }
        }

        async function testProxy(url) {
            previewContainer.classList.add('show');
            previewContent.innerText = 'Initializing handshake...';

            let testUrl = url;
            // Gunakan path yang valid untuk testing provider tertentu
            if (selectedProvider === 'gemini') {
                testUrl = url.replace(/\\/$/, '') + '/v1beta/models';
            } else if (['openai', 'mistral', 'groq', 'perplexity'].includes(selectedProvider)) {
                testUrl = url.replace(/\\/$/, '') + '/models';
            }

            try {
                const res = await fetch(testUrl);
                const text = await res.text();
                try {
                    previewContent.innerText = JSON.stringify(JSON.parse(text), null, 2);
                } catch {
                    previewContent.innerText = text.substring(0, 2000) + (text.length > 2000 ? '...' : '');
                }
            } catch (err) {
                previewContent.innerText = 'Connection Error: ' + err.message;
            }
        }

        function copyText(text, btn) {
            navigator.clipboard.writeText(text);
            const original = btn.innerText;
            btn.innerText = 'Copied!';
            btn.style.background = 'var(--success)';
            setTimeout(() => {
                btn.innerText = original;
                btn.style.background = '';
            }, 2000);
        }

        generateBtn.onclick = async () => {
            const url = targetUrlInput.value.trim();
            const key = apiKeyInput.value.trim();
            if (!url) return;

            generateBtn.disabled = true;
            const originalBtnText = generateBtn.innerHTML;
            generateBtn.innerHTML = '<span class="loader"></span><span>Securing Vault...</span>';

            try {
                const checkRes = await fetch('/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url,
                        key,
                        provider: selectedProvider || 'custom'
                    })
                });
                const data = await checkRes.json();
                if (data.ok) {
                    await loadStored();
                    showEndpoints(data.id, url);
                } else {
                    alert('Handshake Failed: ' + data.error);
                }
            } catch (err) {
                alert('Vault System Error');
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = originalBtnText;
            }
        };

        // Initial load
        loadStored();
    </script>
</body>
</html>
`;
