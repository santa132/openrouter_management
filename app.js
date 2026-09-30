/**
 * OpenRouter Management Console - Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- APP STATE ---
    const state = {
        activeTab: 'dashboard',
        theme: 'dark',
        apiKeys: [
            { id: 1, name: 'Production Main API', key: 'sk-or-v1-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c', limit: 200, used: 42.15, created: '2026-08-15', status: 'active' },
            { id: 2, name: 'Staging Chatbot Key', key: 'sk-or-v1-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d', limit: 50, used: 11.20, created: '2026-09-01', status: 'active' },
            { id: 3, name: 'Mobile App Assistant', key: 'sk-or-v1-7f6e5d4c3b2a109876543210fedcba98', limit: 100, used: 3.80, created: '2026-09-20', status: 'active' },
            { id: 4, name: 'Legacy Agent Key', key: 'sk-or-v1-00112233445566778899aabbccddeeff', limit: 20, used: 20.00, created: '2026-06-10', status: 'disabled' }
        ],
        models: [
            { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', context: '200k', speed: '85 tok/s', priceIn: '$3.00', priceOut: '$15.00', priceInNum: 3.0, priceOutNum: 15.0, popular: true, usagePct: 42 },
            { id: 'openai/gpt-4o', name: 'GPT-4o (Omni)', provider: 'openai', context: '128k', speed: '110 tok/s', priceIn: '$2.50', priceOut: '$10.00', priceInNum: 2.5, priceOutNum: 10.0, popular: true, usagePct: 28 },
            { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'deepseek', context: '64k', speed: '95 tok/s', priceIn: '$0.14', priceOut: '$0.28', priceInNum: 0.14, priceOutNum: 0.28, popular: true, usagePct: 18 },
            { id: 'google/gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google', context: '1,000k', speed: '140 tok/s', priceIn: '$0.10', priceOut: '$0.40', priceInNum: 0.10, priceOutNum: 0.40, popular: true, usagePct: 8 },
            { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'meta', context: '128k', speed: '75 tok/s', priceIn: '$0.35', priceOut: '$0.40', priceInNum: 0.35, priceOutNum: 0.40, popular: false, usagePct: 4 },
            { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic', context: '200k', speed: '40 tok/s', priceIn: '$15.00', priceOut: '$75.00', priceInNum: 15.0, priceOutNum: 75.0, popular: false, usagePct: 0 },
            { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', context: '128k', speed: '130 tok/s', priceIn: '$0.15', priceOut: '$0.60', priceInNum: 0.15, priceOutNum: 0.60, popular: false, usagePct: 0 },
            { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1 (Reasoning)', provider: 'deepseek', context: '64k', speed: '60 tok/s', priceIn: '$0.55', priceOut: '$2.19', priceInNum: 0.55, priceOutNum: 2.19, popular: true, usagePct: 0 }
        ],
        liveStream: [
            { time: 'Vừa xong', model: 'anthropic/claude-3.5-sonnet', keyName: 'Production Main API', tokens: '1,420 / 380', latency: '320 ms', cost: '$0.0099', status: 200 },
            { time: '2 giây trước', model: 'openai/gpt-4o', keyName: 'Staging Chatbot Key', tokens: '890 / 210', latency: '410 ms', cost: '$0.0043', status: 200 },
            { time: '5 giây trước', model: 'deepseek/deepseek-chat', keyName: 'Production Main API', tokens: '4,100 / 1,200', latency: '280 ms', cost: '$0.0009', status: 200 },
            { time: '8 giây trước', model: 'google/gemini-2.0-flash', keyName: 'Mobile App Assistant', tokens: '620 / 140', latency: '190 ms', cost: '$0.0001', status: 200 }
        ]
    };

    // --- INITIALIZATION ---
    initNavigation();
    initThemeToggle();
    initDashboard();
    initApiKeys();
    initModelDirectory();
    initAnalytics();
    initPlayground();
    initLiveStreamSimulator();

    // --- 1. NAVIGATION & TABS ---
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const tabContents = document.querySelectorAll('.tab-content');
        const mobileToggle = document.getElementById('mobile-toggle');
        const sidebar = document.getElementById('sidebar');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetTab = item.getAttribute('data-tab');
                if (targetTab) {
                    e.preventDefault();
                    switchTab(targetTab);

                    // Close mobile sidebar if open
                    sidebar.classList.remove('show');
                }
            });
        });

        // Trigger links with data-tab-trigger
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-tab-trigger]');
            if (trigger) {
                e.preventDefault();
                const target = trigger.getAttribute('data-tab-trigger');
                switchTab(target);
            }
        });

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('show');
            });
        }
    }

    function switchTab(tabId) {
        state.activeTab = tabId;
        
        // Update nav UI
        document.querySelectorAll('.nav-item').forEach(el => {
            if (el.getAttribute('data-tab') === tabId) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        // Update tab views
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === `${tabId}-view`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Re-render chart if switching to dashboard or analytics
        if (tabId === 'dashboard') {
            renderDashboardChart();
        } else if (tabId === 'analytics') {
            renderProviderPieChart();
            renderLatencyBars();
        }
    }

    // --- 2. THEME TOGGLE ---
    function initThemeToggle() {
        const themeBtn = document.getElementById('theme-toggle');
        themeBtn.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            document.body.className = `${state.theme}-theme`;
            showToast(`Đã chuyển sang giao diện ${state.theme === 'dark' ? 'Tối (Dark)' : 'Sáng (Light)'}`);
        });
    }

    // --- 3. DASHBOARD RENDERERS ---
    function initDashboard() {
        renderTopModelsList();
        renderDashboardChart();
        renderLiveRequestsTable();

        const btnRefresh = document.getElementById('btn-refresh-stats');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', () => {
                showToast('Đã làm mới dữ liệu thống kê từ OpenRouter API');
                renderLiveRequestsTable();
                renderDashboardChart();
            });
        }

        const btnCreateQuick = document.getElementById('btn-create-key-quick');
        if (btnCreateQuick) {
            btnCreateQuick.addEventListener('click', () => {
                openModal('create-key-modal');
            });
        }
    }

    function renderTopModelsList() {
        const container = document.getElementById('top-models-list');
        if (!container) return;

        const sorted = [...state.models].sort((a, b) => b.usagePct - a.usagePct).slice(0, 4);

        const colors = ['var(--accent-purple)', 'var(--accent-indigo)', 'var(--accent-cyan)', 'var(--accent-emerald)'];

        container.innerHTML = sorted.map((m, idx) => `
            <div class="model-usage-item">
                <div class="model-usage-info">
                    <span>${m.name}</span>
                    <span>${m.usagePct}% lưu lượng</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${m.usagePct}%; background: ${colors[idx]};"></div>
                </div>
            </div>
        `).join('');
    }

    function renderDashboardChart() {
        const wrapper = document.getElementById('dashboard-chart-wrapper');
        if (!wrapper) return;

        // Custom SVG Line Chart
        const points = [
            { day: 'T2', val: 32 },
            { day: 'T3', val: 45 },
            { day: 'T4', val: 38 },
            { day: 'T5', val: 62 },
            { day: 'T6', val: 54 },
            { day: 'T7', val: 78 },
            { day: 'CN', val: 85 }
        ];

        const width = wrapper.clientWidth || 500;
        const height = 230;
        const padding = 30;

        const maxVal = 100;
        const minVal = 0;

        const getX = (i) => padding + (i * (width - 2 * padding) / (points.length - 1));
        const getY = (v) => height - padding - ((v - minVal) * (height - 2 * padding) / maxVal);

        let pathD = `M ${getX(0)} ${getY(points[0].val)}`;
        for (let i = 1; i < points.length; i++) {
            const x0 = getX(i - 1);
            const y0 = getY(points[i - 1].val);
            const x1 = getX(i);
            const y1 = getY(points[i].val);
            const cx = (x0 + x1) / 2;
            pathD += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
        }

        const areaD = `${pathD} L ${getX(points.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;

        wrapper.innerHTML = `
            <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#6366F1" stop-opacity="0.4"/>
                        <stop offset="100%" stop-color="#6366F1" stop-opacity="0.0"/>
                    </linearGradient>
                </defs>

                <!-- Horizontal grid lines -->
                <line x1="${padding}" y1="${getY(25)}" x2="${width - padding}" y2="${getY(25)}" stroke="var(--border-color)" stroke-dasharray="4"/>
                <line x1="${padding}" y1="${getY(50)}" x2="${width - padding}" y2="${getY(50)}" stroke="var(--border-color)" stroke-dasharray="4"/>
                <line x1="${padding}" y1="${getY(75)}" x2="${width - padding}" y2="${getY(75)}" stroke="var(--border-color)" stroke-dasharray="4"/>

                <!-- Area Fill -->
                <path d="${areaD}" fill="url(#chartGrad)" />

                <!-- Smooth Line -->
                <path d="${pathD}" fill="none" stroke="var(--accent-indigo)" stroke-width="3" stroke-linecap="round"/>

                <!-- Data Points -->
                ${points.map((p, i) => `
                    <circle cx="${getX(i)}" cy="${getY(p.val)}" r="5" fill="#111625" stroke="var(--accent-cyan)" stroke-width="3" />
                    <text x="${getX(i)}" y="${height - 8}" fill="var(--text-muted)" font-size="12" text-anchor="middle" font-family="sans-serif">${p.day}</text>
                `).join('')}
            </svg>
        `;
    }

    function renderLiveRequestsTable() {
        const tbody = document.querySelector('#live-requests-table tbody');
        if (!tbody) return;

        tbody.innerHTML = state.liveStream.map(item => `
            <tr>
                <td>${item.time}</td>
                <td><strong style="color:var(--text-primary);">${item.model}</strong></td>
                <td><span class="key-code">${item.keyName}</span></td>
                <td>${item.tokens}</td>
                <td><span class="badge badge-secondary">${item.latency}</span></td>
                <td style="color:var(--accent-emerald); font-weight:600;">${item.cost}</td>
                <td><span class="badge badge-glow" style="color:var(--accent-emerald);">HTTP ${item.status} OK</span></td>
            </tr>
        `).join('');
    }

    function initLiveStreamSimulator() {
        // Add random request every 6 seconds to show real-time dynamism
        setInterval(() => {
            const randomModel = state.models[Math.floor(Math.random() * state.models.length)];
            const randomKey = state.apiKeys[Math.floor(Math.random() * state.apiKeys.length)];
            const inTok = Math.floor(Math.random() * 2000) + 300;
            const outTok = Math.floor(Math.random() * 500) + 100;
            const lat = Math.floor(Math.random() * 350) + 180;
            const estCost = ((inTok * randomModel.priceInNum + outTok * randomModel.priceOutNum) / 1000000).toFixed(4);

            const newReq = {
                time: 'Vừa xong',
                model: randomModel.id,
                keyName: randomKey.name,
                tokens: `${inTok.toLocaleString()} / ${outTok.toLocaleString()}`,
                latency: `${lat} ms`,
                cost: `$${estCost}`,
                status: 200
            };

            state.liveStream.unshift(newReq);
            if (state.liveStream.length > 6) state.liveStream.pop();

            if (state.activeTab === 'dashboard') {
                renderLiveRequestsTable();
            }
        }, 6000);
    }

    // --- 4. API KEYS MANAGEMENT ---
    function initApiKeys() {
        renderApiKeysTable();

        const btnOpenModal = document.getElementById('btn-open-create-key-modal');
        const modalClose = document.getElementById('modal-close-btn');
        const modalCancel = document.getElementById('modal-cancel-btn');
        const modalSubmit = document.getElementById('modal-submit-btn');

        if (btnOpenModal) btnOpenModal.addEventListener('click', () => openModal('create-key-modal'));
        if (modalClose) modalClose.addEventListener('click', () => closeModal('create-key-modal'));
        if (modalCancel) modalCancel.addEventListener('click', () => closeModal('create-key-modal'));

        if (modalSubmit) {
            modalSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('new-key-name').value.trim();
                const limitInput = parseFloat(document.getElementById('new-key-limit').value) || 100;

                if (!nameInput) {
                    showToast('Vui lòng nhập tên cho API Key!');
                    return;
                }

                // Generate random secret key hash
                const randHash = Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('');
                const fullKey = `sk-or-v1-${randHash}`;

                const newKeyObj = {
                    id: Date.now(),
                    name: nameInput,
                    key: fullKey,
                    limit: limitInput,
                    used: 0.00,
                    created: new Date().toISOString().split('T')[0],
                    status: 'active'
                };

                state.apiKeys.unshift(newKeyObj);
                renderApiKeysTable();
                updateActiveKeysCount();

                closeModal('create-key-modal');
                document.getElementById('create-key-form').reset();

                // Show created success modal
                document.getElementById('generated-key-text').innerText = fullKey;
                openModal('key-success-modal');
            });
        }

        // Copy Key event
        const btnCopyGenerated = document.getElementById('btn-copy-generated');
        if (btnCopyGenerated) {
            btnCopyGenerated.addEventListener('click', () => {
                const keyText = document.getElementById('generated-key-text').innerText;
                navigator.clipboard.writeText(keyText);
                showToast('✔ Đã sao chép API Key vào Khay nhớ tạm (Clipboard)');
            });
        }

        const btnDoneCreated = document.getElementById('btn-done-created');
        const keySuccessClose = document.getElementById('key-success-close');
        if (btnDoneCreated) btnDoneCreated.addEventListener('click', () => closeModal('key-success-modal'));
        if (keySuccessClose) keySuccessClose.addEventListener('click', () => closeModal('key-success-modal'));

        // Search Key Filter
        const keySearchInput = document.getElementById('key-search-input');
        if (keySearchInput) {
            keySearchInput.addEventListener('input', (e) => {
                renderApiKeysTable(e.target.value);
            });
        }
    }

    function updateActiveKeysCount() {
        const activeCount = state.apiKeys.filter(k => k.status === 'active').length;
        const el = document.getElementById('active-keys-count');
        if (el) el.innerText = activeCount;
    }

    function renderApiKeysTable(filterQuery = '') {
        const tbody = document.querySelector('#api-keys-table tbody');
        if (!tbody) return;

        const filtered = state.apiKeys.filter(k => 
            k.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
            k.key.toLowerCase().includes(filterQuery.toLowerCase())
        );

        tbody.innerHTML = filtered.map(item => `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td><code class="key-code">${item.key.substring(0, 14)}...${item.key.slice(-4)}</code></td>
                <td>$${item.limit.toFixed(2)}</td>
                <td>
                    <div>$${item.used.toFixed(2)}</div>
                    <div class="progress-track" style="width: 80px; height: 5px; margin-top: 4px;">
                        <div class="progress-fill" style="width: ${Math.min(100, (item.used/item.limit)*100)}%; background: var(--accent-indigo);"></div>
                    </div>
                </td>
                <td>${item.created}</td>
                <td>
                    <span class="badge ${item.status === 'active' ? 'badge-glow' : 'badge-secondary'}" style="color: ${item.status === 'active' ? 'var(--accent-emerald)' : 'var(--text-muted)'};">
                        ${item.status === 'active' ? '● Active' : '○ Disabled'}
                    </span>
                </td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-secondary copy-key-btn" data-key="${item.key}">Copy</button>
                        <button class="btn btn-sm btn-danger toggle-key-btn" data-id="${item.id}">
                            ${item.status === 'active' ? 'Tắt' : 'Bật'}
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Bind table button handlers
        tbody.querySelectorAll('.copy-key-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const keyVal = btn.getAttribute('data-key');
                navigator.clipboard.writeText(keyVal);
                showToast('✔ Đã sao chép API Key!');
            });
        });

        tbody.querySelectorAll('.toggle-key-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const targetKey = state.apiKeys.find(k => k.id === id);
                if (targetKey) {
                    targetKey.status = targetKey.status === 'active' ? 'disabled' : 'active';
                    renderApiKeysTable(filterQuery);
                    updateActiveKeysCount();
                    showToast(`Trạng thái Key "${targetKey.name}" đã cập nhật.`);
                }
            });
        });
    }

    // --- 5. MODEL DIRECTORY & CALCULATOR ---
    function initModelDirectory() {
        renderModelsGrid();

        // Calculator inputs logic
        const inTokInput = document.getElementById('calc-input-tokens');
        const outTokInput = document.getElementById('calc-output-tokens');

        if (inTokInput && outTokInput) {
            const updateCalc = () => {
                const inT = parseFloat(inTokInput.value) || 0;
                const outT = parseFloat(outTokInput.value) || 0;
                // Sample model: Claude 3.5 Sonnet ($3.00 in / $15.00 out)
                const sampleCost = (inT * 3.0 + outT * 15.0) / 1000000;
                document.getElementById('calc-result-price').innerText = `$${sampleCost.toFixed(4)}`;
            };

            inTokInput.addEventListener('input', updateCalc);
            outTokInput.addEventListener('input', updateCalc);
        }

        // Provider Filter Buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const provider = btn.getAttribute('data-provider');
                renderModelsGrid(provider);
            });
        });
    }

    function renderModelsGrid(providerFilter = 'all') {
        const grid = document.getElementById('models-grid-container');
        if (!grid) return;

        let filtered = state.models;
        if (providerFilter !== 'all') {
            filtered = state.models.filter(m => m.provider === providerFilter);
        }

        grid.innerHTML = filtered.map(m => `
            <div class="model-card">
                <div>
                    <div class="model-card-header">
                        <span class="provider-badge ${m.provider}">${m.provider}</span>
                        ${m.popular ? '<span class="badge badge-glow">HOT</span>' : ''}
                    </div>
                    <div class="model-name">${m.name}</div>
                    <div class="model-id">${m.id}</div>

                    <div class="model-specs">
                        <div class="spec-item">
                            <span>Context Window</span>
                            <strong>${m.context}</strong>
                        </div>
                        <div class="spec-item">
                            <span>Throughput Speed</span>
                            <strong>${m.speed}</strong>
                        </div>
                    </div>
                </div>

                <div class="model-pricing">
                    <div>
                        <span style="color:var(--text-muted); font-size:0.75rem;">Input / Output Price (1M tok)</span>
                        <div class="price-tag">${m.priceIn} / ${m.priceOut}</div>
                    </div>
                    <button class="btn btn-sm btn-secondary btn-test-model" data-model-id="${m.id}">Test Model</button>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.btn-test-model').forEach(btn => {
            btn.addEventListener('click', () => {
                const modelId = btn.getAttribute('data-model-id');
                const select = document.getElementById('pg-model-select');
                if (select) select.value = modelId;
                switchTab('playground');
                showToast(`Đã chọn model ${modelId} vào Playground!`);
            });
        });
    }

    // --- 6. ANALYTICS RENDERERS ---
    function initAnalytics() {
        renderProviderPieChart();
        renderLatencyBars();
        renderAnalyticsHistoryTable();
    }

    function renderProviderPieChart() {
        const container = document.getElementById('provider-pie-chart');
        if (!container) return;

        container.innerHTML = `
            <svg width="200" height="200" viewBox="0 0 42 42" class="donut">
                <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="transparent"></circle>

                <!-- Anthropic 45% -->
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#F59E0B" stroke-width="6" stroke-dasharray="45 55" stroke-dashoffset="25"></circle>
                <!-- OpenAI 30% -->
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" stroke-width="6" stroke-dasharray="30 70" stroke-dashoffset="80"></circle>
                <!-- DeepSeek 15% -->
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#A855F7" stroke-width="6" stroke-dasharray="15 85" stroke-dashoffset="50"></circle>
                <!-- Google 10% -->
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3B82F6" stroke-width="6" stroke-dasharray="10 90" stroke-dashoffset="35"></circle>
            </svg>
            <div class="d-flex justify-between w-100 mt-3" style="font-size:0.8rem; text-align:center;">
                <div><span style="color:#F59E0B;">●</span> Anthropic (45%)</div>
                <div><span style="color:#10B981;">●</span> OpenAI (30%)</div>
                <div><span style="color:#A855F7;">●</span> DeepSeek (15%)</div>
                <div><span style="color:#3B82F6;">●</span> Google (10%)</div>
            </div>
        `;
    }

    function renderLatencyBars() {
        const container = document.getElementById('latency-bars');
        if (!container) return;

        const data = [
            { provider: 'Google Gemini 2.0 Flash', ms: 190, color: 'var(--accent-cyan)' },
            { provider: 'DeepSeek V3', ms: 280, color: 'var(--accent-purple)' },
            { provider: 'Claude 3.5 Sonnet', ms: 320, color: 'var(--accent-amber)' },
            { provider: 'GPT-4o', ms: 410, color: 'var(--accent-emerald)' }
        ];

        container.innerHTML = data.map(item => `
            <div class="mb-3">
                <div class="d-flex justify-between" style="font-size:0.82rem; margin-bottom:0.3rem;">
                    <span>${item.provider}</span>
                    <strong style="font-family:var(--font-mono);">${item.ms} ms</strong>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width:${(item.ms / 500) * 100}%; background:${item.color};"></div>
                </div>
            </div>
        `).join('');
    }

    function renderAnalyticsHistoryTable() {
        const tbody = document.getElementById('analytics-history-tbody');
        if (!tbody) return;

        const rows = [
            { date: '30/09/2026', reqs: '48,290', inTok: '10.5M', outTok: '3.7M', cost: '$3.82', lat: '410ms' },
            { date: '29/09/2026', reqs: '42,100', inTok: '9.2M', outTok: '3.1M', cost: '$3.15', lat: '425ms' },
            { date: '28/09/2026', reqs: '51,400', inTok: '12.1M', outTok: '4.2M', cost: '$4.50', lat: '390ms' },
            { date: '27/09/2026', reqs: '39,800', inTok: '8.4M', outTok: '2.8M', cost: '$2.90', lat: '405ms' }
        ];

        tbody.innerHTML = rows.map(r => `
            <tr>
                <td><strong>${r.date}</strong></td>
                <td>${r.reqs}</td>
                <td>${r.inTok}</td>
                <td>${r.outTok}</td>
                <td style="color:var(--accent-emerald); font-weight:600;">${r.cost}</td>
                <td>${r.lat}</td>
            </tr>
        `).join('');
    }

    // --- 7. PLAYGROUND TESTER ---
    function initPlayground() {
        const tempSlider = document.getElementById('pg-temp-slider');
        const tempVal = document.getElementById('pg-temp-val');
        if (tempSlider && tempVal) {
            tempSlider.addEventListener('input', (e) => tempVal.innerText = e.target.value);
        }

        const maxTokSlider = document.getElementById('pg-max-tokens');
        const maxTokVal = document.getElementById('pg-max-tokens-val');
        if (maxTokSlider && maxTokVal) {
            maxTokSlider.addEventListener('input', (e) => maxTokVal.innerText = e.target.value);
        }

        const btnSend = document.getElementById('pg-btn-send');
        const userInput = document.getElementById('pg-user-input');
        const messagesArea = document.getElementById('pg-messages-container');
        const btnClear = document.getElementById('pg-btn-clear');

        if (btnClear) {
            btnClear.addEventListener('click', () => {
                messagesArea.innerHTML = `
                    <div class="playground-welcome">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <h4>Sẵn sàng thử nghiệm OpenRouter API</h4>
                        <p>Nhập tin nhắn hoặc yêu cầu của bạn ở bên dưới và nhấn <strong>Gửi Request</strong>.</p>
                    </div>
                `;
            });
        }

        if (btnSend && userInput) {
            btnSend.addEventListener('click', () => {
                const promptText = userInput.value.trim();
                if (!promptText) {
                    showToast('Vui lòng nhập prompt thử nghiệm!');
                    return;
                }

                // Hide welcome box if present
                const welcome = messagesArea.querySelector('.playground-welcome');
                if (welcome) welcome.remove();

                // Append User Message Bubble
                const userBubble = document.createElement('div');
                userBubble.className = 'chat-bubble user';
                userBubble.innerText = promptText;
                messagesArea.appendChild(userBubble);

                userInput.value = '';
                messagesArea.scrollTop = messagesArea.scrollHeight;

                // Simulate Streaming AI Response
                const modelSelected = document.getElementById('pg-model-select').value;
                const assistantBubble = document.createElement('div');
                assistantBubble.className = 'chat-bubble assistant';
                assistantBubble.innerHTML = `<em>Đang gửi request tới OpenRouter (${modelSelected})...</em>`;
                messagesArea.appendChild(assistantBubble);
                messagesArea.scrollTop = messagesArea.scrollHeight;

                const startTime = Date.now();

                setTimeout(() => {
                    const elapsed = Date.now() - startTime;
                    const sampleOutputs = [
                        `Dưới đây là mã nguồn JavaScript hoàn chỉnh cho yêu cầu của bạn:\n\n\`\`\`javascript\nfunction fibonacciMemo(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 2) return 1;\n  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);\n  return memo[n];\n}\n\nconsole.log(fibonacciMemo(50)); // Kết quả cực kỳ nhanh!\n\`\`\`\n\nHàm trên tận dụng kỹ thuật memoization để giảm độ phức tạp từ O(2^n) xuống còn O(n).`,
                        `Chào bạn! OpenRouter API đã nhận thành công request với Model **${modelSelected}**.\n\nHệ thống phản hồi bình thường, độ trễ cực thấp và đáp ứng tốt cấu hình Temperature & Max Tokens của bạn.`
                    ];

                    const textToStream = sampleOutputs[Math.floor(Math.random() * sampleOutputs.length)];
                    assistantBubble.innerHTML = '';

                    let charIdx = 0;
                    const streamTimer = setInterval(() => {
                        assistantBubble.innerText += textToStream.charAt(charIdx);
                        charIdx++;
                        messagesArea.scrollTop = messagesArea.scrollHeight;

                        if (charIdx >= textToStream.length) {
                            clearInterval(streamTimer);
                            // Update stats bar
                            const infoStats = document.getElementById('pg-stats-info');
                            if (infoStats) {
                                infoStats.innerHTML = `<span>Latency: ${elapsed} ms</span> | <span>Tokens: ${Math.floor(textToStream.length / 4)}</span>`;
                            }
                        }
                    }, 15);
                }, 800);
            });
        }
    }

    // --- 8. GLOBAL HELPERS & MODALS & TOASTS ---
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('show');
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    }

    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
