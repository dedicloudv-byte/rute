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
            .sidebar {
                order: 2;
            }
        }

        /* Glassmorphism Classes */
        .glass {
            background: var(--card-bg);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid var(--border);
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        /* Header & Titles */
        .header {
            margin-bottom: 3rem;
        }

        .header h1 {
            font-size: 3rem;
            font-weight: 800;
            letter-spacing: -0.05em;
            background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        .header p {
            color: var(--text-dim);
            font-size: 1.125rem;
            font-weight: 400;
        }

        /* Main Section */
        .main-content {
            padding: 2.5rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
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

        .section-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background: linear-gradient(to right, var(--border), transparent);
        }

        /* Forms */
        .input-group {
            margin-bottom: 1.5rem;
            position: relative;
        }

        .input-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-dim);
            margin-bottom: 0.75rem;
        }

        .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }

        input, select, textarea {
            width: 100%;
            padding: 1rem 1.25rem;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid var(--border);
            border-radius: 16px;
            color: var(--text);
            font-size: 1rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: var(--font-main);
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--primary);
            background: rgba(0, 0, 0, 0.5);
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
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
        }

        .main-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.4);
            filter: brightness(1.1);
        }

        .main-btn:active {
            transform: translateY(0);
        }

        .main-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        /* Instant Gateway Panel */
        .gateway-panel {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
            border: 1px solid rgba(99, 102, 241, 0.2);
            padding: 2rem;
            border-radius: 24px;
            margin-bottom: 2rem;
            display: none;
            animation: slideDown 0.5s ease-out;
        }

        .gateway-panel.active {
            display: block;
        }

        .gateway-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .close-btn {
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            border-radius: 12px;
            cursor: pointer;
            color: var(--text-dim);
            transition: all 0.2s;
        }

        .close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text);
        }

        /* Side Panel / Sidebar */
        .sidebar {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
        }

        .sidebar h2 {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .provider-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.75rem;
        }

        .provider-item {
            padding: 1rem 1.25rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 500;
        }

        .provider-item:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: var(--primary);
            transform: translateX(4px);
        }

        .provider-item.active {
            background: rgba(99, 102, 241, 0.1);
            border-color: var(--primary);
            color: var(--primary);
        }

        /* Stored List */
        .vault-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-height: 500px;
            overflow-y: auto;
            padding-right: 0.5rem;
        }

        .vault-card {
            padding: 1.25rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            border-radius: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }

        .vault-card:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--primary);
        }

        .vault-card.active {
            border-color: var(--primary);
            background: rgba(99, 102, 241, 0.05);
        }

        .vault-info h4 {
            font-size: 0.9375rem;
            margin-bottom: 0.25rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .vault-meta {
            font-size: 0.75rem;
            color: var(--text-dim);
            font-family: 'JetBrains Mono', monospace;
        }

        .delete-btn {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            color: var(--error);
            opacity: 0;
            transition: 0.2s;
            cursor: pointer;
        }

        .vault-card:hover .delete-btn {
            opacity: 1;
        }

        /* Result Area */
        .result-area {
            display: none;
            margin-top: 2rem;
            animation: fadeInUp 0.5s ease-out;
        }

        .result-area.active {
            display: block;
        }

        .access-card {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
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
            transition: 0.2s;
        }

        .copy-btn:hover {
            filter: brightness(1.2);
        }

        /* Utils */
        .badge {
            font-size: 0.625rem;
            font-weight: 800;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            text-transform: uppercase;
            background: var(--primary);
            color: white;
        }

        /* Animations */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-dim); }

        .loader {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <main class="main-content glass">
            <div class="header">
                <h1>Smart Proxy Elite</h1>
                <p>Private infrastructure for advanced AI orchestration.</p>
            </div>

            <div id="instantPanel" class="gateway-panel">
                <div class="gateway-header">
                    <h2 id="gatewayTitle" style="margin:0; font-size: 1.5rem;">Instant AI Gateway</h2>
                    <button class="close-btn" onclick="resetUI()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                </div>

                <div class="input-group">
                    <label class="input-label">Direct Endpoint (GET Ready)</label>
                    <div class="url-box" style="margin-top:0; background: #000;">
                        <div id="directUrlDisplay" class="url-text">Select a provider...</div>
                        <button class="copy-btn" onclick="copyDirectUrl()">Copy</button>
                    </div>
                </div>

                <div class="input-group">
                    <label class="input-label">Quick Prompt</label>
                    <textarea id="promptInput" rows="4" placeholder="Type your message here..."></textarea>
                </div>

                <button id="executeBtn" class="main-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    <span>Execute Instant Request</span>
                </button>

                <div id="instantResult" class="result-area" style="background: rgba(0,0,0,0.4); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border); margin-top: 1.5rem;">
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 1rem; text-transform: uppercase;">Gateway Output:</div>
                    <pre id="instantOutput" style="color: var(--success); font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; white-space: pre-wrap;"></pre>
                </div>
            </div>

            <div id="vaultForm">
                <div class="section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Create Private Vault
                </div>

                <div class="input-group">
                    <label class="input-label">Global API Key (Auto-injected)</label>
                    <input type="password" id="globalApiKey" placeholder="sk-...">
                </div>

                <div class="input-group">
                    <label class="input-label">Target Endpoint URL</label>
                    <input type="text" id="targetUrl" placeholder="https://api.openai.com/v1" value="https://example.com">
                </div>

                <div class="input-group">
                    <label class="input-label">Security Protocol</label>
                    <select id="proxyMode">
                        <option value="elite">Elite Stealth (Stripped Headers)</option>
                        <option value="anonymous">Anonymous (Hidden Client IP)</option>
                        <option value="transparent">Transparent (Full Passthrough)</option>
                    </select>
                </div>

                <button id="saveBtn" class="main-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
                    <span>Initialize Private Vault</span>
                </button>
            </div>

            <div id="vaultResult" class="result-area">
                <div class="section-title">Deployment Complete</div>
                <div id="deploymentCards"></div>

                <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(99, 102, 241, 0.05); border-radius: 20px; border: 1px dashed var(--primary);">
                    <h3 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--primary);">Integration Guide</h3>
                    <p id="integrationGuide" style="font-size: 0.875rem; color: var(--text-dim);"></p>
                </div>
            </div>
        </main>

        <aside class="sidebar glass">
            <div class="side-section">
                <h2>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    AI Gateways
                </h2>
                <div class="provider-grid">
                    <div class="provider-item" onclick="selectProvider('gemini')">
                        <span>✨ Gemini Pro</span>
                        <span class="badge">v1.5</span>
                    </div>
                    <div class="provider-item" onclick="selectProvider('openai')">
                        <span>🤖 GPT-4o</span>
                        <span class="badge">NEW</span>
                    </div>
                    <div class="provider-item" onclick="selectProvider('claude')">
                        <span>🧠 Claude 3.5</span>
                        <span class="badge">PRO</span>
                    </div>
                    <div class="provider-item" onclick="selectProvider('groq')">
                        <span>⚡ Groq Llama3</span>
                        <span class="badge">FAST</span>
                    </div>
                </div>
            </div>

            <div class="side-section">
                <h2>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    My Vaults
                </h2>
                <div id="vaultList" class="vault-list">
                    <div style="text-align: center; color: var(--text-dim); padding: 2rem; font-size: 0.875rem;">Initializing...</div>
                </div>
            </div>
        </aside>
    </div>

    <script>
        const PROVIDERS = {
            gemini: { name: 'Gemini Pro', url: 'https://generativelanguage.googleapis.com' },
            openai: { name: 'GPT-4o / OpenAI', url: 'https://api.openai.com/v1' },
            claude: { name: 'Claude 3.5 Sonnet', url: 'https://api.anthropic.com/v1' },
            groq: { name: 'Groq Cloud', url: 'https://api.groq.com/openai/v1' }
        };

        let selectedId = null;
        let currentProvider = null;

        // UI Interactions
        function selectProvider(id) {
            currentProvider = id;
            document.querySelectorAll('.provider-item').forEach(el => {
                el.classList.remove('active');
                if(el.innerText.toLowerCase().includes(id)) el.classList.add('active');
            });

            document.getElementById('vaultForm').style.display = 'none';
            document.getElementById('vaultResult').classList.remove('active');
            document.getElementById('instantPanel').classList.add('active');
            document.getElementById('gatewayTitle').innerText = PROVIDERS[id].name + ' Gateway';
            document.getElementById('targetUrl').value = PROVIDERS[id].url;

            updateDirectUrl();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function resetUI() {
            currentProvider = null;
            document.querySelectorAll('.provider-item').forEach(el => el.classList.remove('active'));
            document.getElementById('instantPanel').classList.remove('active');
            document.getElementById('vaultForm').style.display = 'block';
            document.getElementById('targetUrl').value = 'https://example.com';
        }

        function updateDirectUrl() {
            if(!currentProvider) return;
            const baseUrl = window.location.origin + '/ai/' + currentProvider;
            const key = document.getElementById('globalApiKey').value.trim() || 'YOUR_API_KEY';
            const prompt = encodeURIComponent(document.getElementById('promptInput').value.trim() || 'Hello');
            document.getElementById('directUrlDisplay').innerText = \`\${baseUrl}?prompt=\${prompt}&apikey=\${key}\`;
        }

        document.getElementById('promptInput').oninput = updateDirectUrl;
        document.getElementById('globalApiKey').oninput = updateDirectUrl;

        function copyDirectUrl() {
            const url = document.getElementById('directUrlDisplay').innerText;
            navigator.clipboard.writeText(url);
            const btn = document.querySelector('.copy-btn');
            btn.innerText = 'Copied!';
            setTimeout(() => btn.innerText = 'Copy', 2000);
        }

        // Backend Calls
        async function fetchVault() {
            const list = document.getElementById('vaultList');
            try {
                const res = await fetch('/list');
                const data = await res.json();
                list.innerHTML = '';

                if (data.items.length === 0) {
                    list.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 2rem;">Vault is empty</div>';
                    return;
                }

                data.items.sort((a,b) => new Date(b.uploaded) - new Date(a.uploaded)).forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'vault-card' + (selectedId === item.id ? ' active' : '');
                    card.onclick = () => showVaultDetail(item);
                    card.innerHTML = \`
                        <div class="vault-info">
                            <h4>\${item.url}</h4>
                            <div class="vault-meta">ID: \${item.id.substring(0,8)}... • \${item.provider}</div>
                        </div>
                        <div class="delete-btn" onclick="event.stopPropagation(); deleteVault('\${item.id}')">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </div>
                    \`;
                    list.appendChild(card);
                });
            } catch (err) {
                list.innerHTML = '<div style="color: var(--error); text-align: center;">Sync failed</div>';
            }
        }

        async function deleteVault(id) {
            if(!confirm('Destroy this secure vault?')) return;
            await fetch('/delete/' + id, { method: 'DELETE' });
            if(selectedId === id) resetUI();
            fetchVault();
        }

        function showVaultDetail(item) {
            selectedId = item.id;
            document.querySelectorAll('.vault-card').forEach(el => el.classList.remove('active'));
            resetUI();

            document.getElementById('vaultResult').classList.add('active');
            const container = document.getElementById('deploymentCards');
            container.innerHTML = '';

            const modes = [
                { id: 'elite', label: 'Elite Stealth Protocol' },
                { id: 'anonymous', label: 'Anonymous Routing' },
                { id: 'transparent', label: 'Transparent Proxy' }
            ];

            modes.forEach(m => {
                const url = window.location.origin + '/p/' + m.id + '/' + item.id;
                const card = document.createElement('div');
                card.className = 'access-card';
                card.innerHTML = \`
                    <div style="font-size: 0.875rem; font-weight: 700;">\${m.label}</div>
                    <div class="url-box">
                        <div class="url-text">\${url}</div>
                        <button class="copy-btn" onclick="copyText('\${url}', this)">Copy</button>
                    </div>
                \`;
                container.appendChild(card);
            });

            const guide = document.getElementById('integrationGuide');
            if (item.provider === 'gemini') {
                guide.innerText = 'Configured for Google GenAI SDK. Set client_options={"api_endpoint": "'+window.location.origin+'/p/elite/'+item.id+'"}.';
            } else if (item.provider === 'openai') {
                guide.innerText = 'OpenAI SDK ready. Use base_url="'+window.location.origin+'/p/elite/'+item.id+'".';
            } else {
                guide.innerText = 'Use these endpoints in any HTTP client. Headers and keys are automatically injected.';
            }
        }

        function copyText(text, btn) {
            navigator.clipboard.writeText(text);
            const original = btn.innerText;
            btn.innerText = 'Done!';
            setTimeout(() => btn.innerText = original, 2000);
        }

        document.getElementById('saveBtn').onclick = async () => {
            const btn = document.getElementById('saveBtn');
            const url = document.getElementById('targetUrl').value.trim();
            const key = document.getElementById('globalApiKey').value.trim();

            btn.disabled = true;
            btn.innerHTML = '<div class="loader"></div><span>Securing...</span>';

            try {
                const res = await fetch('/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url, key, provider: currentProvider || 'custom' })
                });
                const data = await res.json();
                if (data.ok) {
                    await fetchVault();
                    showVaultDetail({ id: data.id, url, provider: currentProvider || 'custom' });
                } else {
                    alert('Deployment Failed: ' + data.error);
                }
            } catch (err) {
                alert('Connection Error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg><span>Initialize Private Vault</span>';
            }
        };

        document.getElementById('executeBtn').onclick = async () => {
            const btn = document.getElementById('executeBtn');
            const key = document.getElementById('globalApiKey').value.trim();
            const prompt = document.getElementById('promptInput').value.trim();

            if(!key || !prompt) return alert('API Key and Prompt are required for instant routing.');

            btn.disabled = true;
            document.getElementById('instantResult').classList.add('active');
            document.getElementById('instantOutput').innerText = 'Initializing stream...';

            try {
                const url = \`/ai/\${currentProvider}?prompt=\${encodeURIComponent(prompt)}&apikey=\${key}\`;
                const res = await fetch(url);
                const data = await res.json();
                document.getElementById('instantOutput').innerText = data.result || JSON.stringify(data.raw, null, 2);
            } catch (err) {
                document.getElementById('instantOutput').innerText = 'Gateway Timeout';
            } finally {
                btn.disabled = false;
            }
        };

        fetchVault();
    </script>
</body>
</html>
`;
