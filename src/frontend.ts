export const getFrontend = (workerUrl: string) => `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Proxy Elite</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
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

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding: 2rem;
        }

        .layout {
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 2rem;
            width: 100%;
            max-width: 1200px;
        }

        @media (max-width: 900px) {
            .layout { grid-template-columns: 1fr; }
        }

        .main-panel, .side-panel {
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        h1 { font-size: 2rem; font-weight: 700; margin-bottom: 1.5rem; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        h2 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }

        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; color: var(--text-dim); }

        input, select {
            width: 100%;
            padding: 0.8rem 1rem;
            background: var(--glass);
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
        }

        .btn {
            width: 100%;
            padding: 0.9rem;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { background: var(--primary-hover); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .btn-danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); }
        .btn-danger:hover { background: var(--danger); color: white; }

        .result-box {
            margin-top: 2rem;
            display: none;
            animation: fadeIn 0.5s ease-out;
        }
        .result-box.show { display: block; }

        .endpoint-card {
            background: var(--glass);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 1.2rem;
            margin-bottom: 1rem;
        }

        .endpoint-card label { font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; }
        .url-row { display: flex; gap: 0.75rem; align-items: center; }
        .url-text { flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; padding: 0.6rem; background: rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .stored-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            max-height: 500px;
            overflow-y: auto;
            padding-right: 0.5rem;
        }

        .stored-item {
            background: var(--glass);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }

        .stored-item:hover { background: rgba(255, 255, 255, 0.06); border-color: var(--primary); }
        .stored-item.active { border-color: var(--primary); background: rgba(99, 102, 241, 0.1); }

        .stored-url { font-size: 0.85rem; font-weight: 500; word-break: break-all; margin-bottom: 0.25rem; }
        .stored-id { font-size: 0.7rem; color: var(--text-dim); }

        .delete-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            padding: 0.4rem;
            background: transparent;
            border: none;
            color: var(--text-dim);
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .stored-item:hover .delete-btn { opacity: 1; }
        .delete-btn:hover { color: var(--danger); }

        .preview-container {
            margin-top: 1.5rem;
            background: #000;
            border-radius: 12px;
            padding: 1rem;
            font-size: 0.85rem;
            max-height: 200px;
            overflow: auto;
            display: none;
        }
        .preview-container.show { display: block; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-dim); }
    </style>
</head>
<body>
    <div class="layout">
        <div class="main-panel">
            <h1>Smart Proxy Elite</h1>

            <div class="form-group">
                <label>URL Tujuan (Target Endpoint)</label>
                <input type="text" id="targetUrl" placeholder="https://api.example.com" value="https://example.com">
            </div>

            <div class="form-group">
                <label>Anonymity Level</label>
                <select id="proxyMode">
                    <option value="transparent">Transparent (Standard)</option>
                    <option value="anonymous">Anonymous (Hidden IP)</option>
                    <option value="elite">Elite (Highly Secure)</option>
                </select>
            </div>

            <button id="generateBtn" class="btn btn-primary">
                <span>Generate Proxy Endpoint</span>
            </button>

            <div id="resultBox" class="result-box">
                <h2>Generated Endpoints</h2>
                <div id="endpointsContainer"></div>

                <div id="previewContainer" class="preview-container">
                    <div style="color: var(--text-dim); font-size: 0.7rem; margin-bottom: 0.5rem;">API RESPONSE PREVIEW:</div>
                    <pre id="previewContent" style="color: #22c55e;"></pre>
                </div>
            </div>
        </div>

        <div class="side-panel">
            <h2>Stored Targets</h2>
            <div id="storedList" class="stored-list">
                <div style="text-align: center; color: var(--text-dim); padding: 2rem;">Loading...</div>
            </div>
        </div>
    </div>

    <script>
        const generateBtn = document.getElementById('generateBtn');
        const targetUrlInput = document.getElementById('targetUrl');
        const proxyModeSelect = document.getElementById('proxyMode');
        const resultBox = document.getElementById('resultBox');
        const endpointsContainer = document.getElementById('endpointsContainer');
        const storedList = document.getElementById('storedList');
        const previewContainer = document.getElementById('previewContainer');
        const previewContent = document.getElementById('previewContent');

        let activeId = null;

        async function loadStored() {
            try {
                const res = await fetch('/list');
                const data = await res.json();
                storedList.innerHTML = '';

                if (data.items.length === 0) {
                    storedList.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 2rem; font-size: 0.9rem;">No saved endpoints</div>';
                    return;
                }

                data.items.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded)).forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'stored-item' + (activeId === item.id ? ' active' : '');
                    div.onclick = () => showEndpoints(item.id, item.url);
                    div.innerHTML = \`
                        <div class="stored-url">\${item.url}</div>
                        <div class="stored-id">\${item.id}</div>
                        <button class="delete-btn" onclick="event.stopPropagation(); deleteEndpoint('\${item.id}')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
                        </button>
                    \`;
                    storedList.appendChild(div);
                });
            } catch (err) {
                storedList.innerHTML = '<div style="color: var(--danger);">Failed to load</div>';
            }
        }

        async function deleteEndpoint(id) {
            if (!confirm('Hapus endpoint ini?')) return;
            try {
                await fetch('/delete/' + id, { method: 'DELETE' });
                if (activeId === id) resultBox.classList.remove('show');
                loadStored();
            } catch (err) {
                alert('Gagal menghapus');
            }
        }

        function showEndpoints(id, url) {
            activeId = id;
            document.querySelectorAll('.stored-item').forEach(el => el.classList.remove('active'));
            const items = document.querySelectorAll('.stored-item');
            // Re-render list to show active state properly (or just find and add class)
            loadStored();

            resultBox.classList.add('show');
            endpointsContainer.innerHTML = '';
            previewContainer.classList.remove('show');

            const modes = [
                { id: 'transparent', label: 'Transparent Endpoint' },
                { id: 'anonymous', label: 'Anonymous Endpoint' },
                { id: 'elite', label: 'Elite (Private) Endpoint' }
            ];

            modes.forEach(m => {
                const proxyUrl = window.location.origin + '/p/' + m.id + '/' + id;
                const card = document.createElement('div');
                card.className = 'endpoint-card';
                card.innerHTML = \`
                    <label>\${m.label}</label>
                    <div class="url-row">
                        <div class="url-text">\${proxyUrl}</div>
                        <button class="btn btn-primary" style="width: auto; padding: 0.5rem 1rem;" onclick="copyText('\${proxyUrl}', this)">Copy</button>
                        <button class="btn" style="width: auto; padding: 0.5rem 1rem; background: var(--glass); color: white; border: 1px solid var(--border);" onclick="testProxy('\${proxyUrl}')">Test</button>
                    </div>
                \`;
                endpointsContainer.appendChild(card);
            });
        }

        async function testProxy(url) {
            previewContainer.classList.add('show');
            previewContent.innerText = 'Connecting...';
            try {
                const res = await fetch(url);
                const text = await res.text();
                try {
                    previewContent.innerText = JSON.stringify(JSON.parse(text), null, 2);
                } catch {
                    previewContent.innerText = text.substring(0, 1000) + (text.length > 1000 ? '...' : '');
                }
            } catch (err) {
                previewContent.innerText = 'Error: ' + err.message;
            }
        }

        function copyText(text, btn) {
            navigator.clipboard.writeText(text);
            const original = btn.innerText;
            btn.innerText = 'Copied!';
            setTimeout(() => btn.innerText = original, 2000);
        }

        generateBtn.onclick = async () => {
            const url = targetUrlInput.value.trim();
            if (!url) return;

            generateBtn.disabled = true;
            generateBtn.innerText = 'Validating...';

            try {
                const res = await fetch('/check?url=' + encodeURIComponent(url));
                const data = await res.json();
                if (data.ok) {
                    await loadStored();
                    showEndpoints(data.id, url);
                } else {
                    alert('Error: ' + data.error);
                }
            } catch (err) {
                alert('System error');
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerText = 'Generate Proxy Endpoint';
            }
        };

        // Initial load
        loadStored();
    </script>
</body>
</html>
`;
