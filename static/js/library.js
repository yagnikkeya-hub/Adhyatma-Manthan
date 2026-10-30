var allShlokas = [];
var currentCategory = 'all';
var searchQuery = '';
var savedShlokaIds = [];

const categoryMeta = [
    { id: 'all', name: 'All Shlokas', icon: '✦' },
    { id: 'saved', name: 'Saved Shlokas', icon: '🔖' },
    { id: 'courage', name: 'Fear & Courage', icon: '🛡️' },
    { id: 'anger', name: 'Anger Control', icon: '🌊' },
    { id: 'action', name: 'Action (Karma)', icon: '⚖️' },
    { id: 'discipline', name: 'Discipline', icon: '🧘' },
    { id: 'wisdom', name: 'Wisdom', icon: '💡' },
    { id: 'failure', name: 'Success & Failure', icon: '🌱' },
    { id: 'patience', name: 'Patience', icon: '⏳' },
    { id: 'gratitude', name: 'Gratitude', icon: '🤍' },
    { id: 'friendship', name: 'Friendship', icon: '🤝' },
    { id: 'devotion', name: 'Devotion', icon: '🪔' },
    { id: 'peace', name: 'Peace', icon: '🕊️' },
    { id: 'self-confidence', name: 'Self-Confidence', icon: '✨' }
];

document.addEventListener('DOMContentLoaded', function() {
    loadSavedBookmarks();

    if (typeof EMBEDDED_SHLOKAS !== 'undefined' && Array.isArray(EMBEDDED_SHLOKAS) && EMBEDDED_SHLOKAS.length > 0) {
        allShlokas = EMBEDDED_SHLOKAS;
        initLibrary();
    } else {
        fetch('/api/shlokas')
            .then(res => res.json())
            .then(data => {
                allShlokas = data;
                initLibrary();
            })
            .catch(err => {
                console.error('Error loading shlokas:', err);
            });
    }

    const modal = document.getElementById('shlokaDetailModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeShlokaModal();
            }
        });
    }
});

function initLibrary() {
    renderCategoryBar();
    renderFeaturedShloka();
    filterAndRender();
}

function loadSavedBookmarks() {
    try {
        const stored = localStorage.getItem('adhyatma_saved_shlokas');
        if (stored) {
            savedShlokaIds = JSON.parse(stored);
        }
    } catch (e) {
        savedShlokaIds = [];
    }
}

function persistBookmarks() {
    try {
        localStorage.setItem('adhyatma_saved_shlokas', JSON.stringify(savedShlokaIds));
    } catch (e) {}
}

function renderCategoryBar() {
    const bar = document.getElementById('libCategoryBar');
    if (!bar) return;

    const counts = { all: allShlokas.length, saved: savedShlokaIds.length };
    allShlokas.forEach(s => {
        const cat = s.category || '';
        counts[cat] = (counts[cat] || 0) + 1;
    });

    let html = '';
    categoryMeta.forEach(meta => {
        const count = counts[meta.id] || 0;
        const isActive = (currentCategory === meta.id) ? 'active' : '';
        html += `
            <button type="button" 
                    class="lib-cat-chip ${isActive}" 
                    data-cat="${meta.id}"
                    onclick="selectCategory('${meta.id}', this)"
                    role="tab">
                <span>${meta.icon}</span>
                <span>${meta.name}</span>
                <span class="lib-cat-badge-count" id="cat-count-${meta.id}">${count}</span>
            </button>
        `;
    });

    bar.innerHTML = html;
}

function updateCategoryCounts() {
    const savedCountEl = document.getElementById('cat-count-saved');
    if (savedCountEl) {
        savedCountEl.innerText = savedShlokaIds.length;
    }
}

function renderFeaturedShloka() {
    const featBox = document.getElementById('libFeaturedBox');
    if (!featBox || allShlokas.length === 0) return;

    const featured = allShlokas.find(s => s.id === 28 || (s.source && s.source.includes('2.48'))) 
                  || allShlokas.find(s => s.id === 27 || (s.source && s.source.includes('2.47'))) 
                  || allShlokas[0];

    featBox.innerHTML = `
        <div>
            <div class="lib-featured-eyebrow">✦ A Verse Worth Pausing For ✦</div>
            <div class="lib-featured-sanskrit">${featured.sanskrit}</div>
            <div class="lib-featured-source">📖 ${featured.source} &bull; ${featured.theme || 'Timeless Wisdom'}</div>
            <div class="lib-featured-meaning">&ldquo;${featured.english_translation || featured.meaning}&rdquo;</div>
            <button type="button" class="lib-btn-explore-featured" onclick="openShlokaModal(${featured.id})">
                Explore Complete Meaning &rarr;
            </button>
        </div>
        <div class="lib-featured-right">
            <h4>🌟 When to Remember This</h4>
            <p>${featured.life_situation || 'When you need quiet steadiness and clarity of purpose.'}</p>
            <h4 style="color: var(--teal); margin-top: 10px;">💡 Practical Application</h4>
            <p style="margin-bottom: 0;">${featured.practical_application || featured.practical_tip || 'Focus on your sincere effort without anxious attachment.'}</p>
        </div>
    `;
}

function selectCategory(catId, btnEl) {
    currentCategory = catId;

    document.querySelectorAll('.lib-cat-chip').forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-cat') === catId);
    });

    filterAndRender();
}

function handleSearchInput() {
    const input = document.getElementById('libSearchInput');
    searchQuery = input.value.trim().toLowerCase();

    const clearBtn = document.getElementById('libSearchClear');
    if (clearBtn) {
        clearBtn.style.display = searchQuery ? 'block' : 'none';
    }

    filterAndRender();
}

function clearSearch() {
    const input = document.getElementById('libSearchInput');
    if (input) input.value = '';
    searchQuery = '';
    const clearBtn = document.getElementById('libSearchClear');
    if (clearBtn) clearBtn.style.display = 'none';

    filterAndRender();
}

function resetAllFilters() {
    currentCategory = 'all';
    searchQuery = '';
    const input = document.getElementById('libSearchInput');
    if (input) input.value = '';
    const clearBtn = document.getElementById('libSearchClear');
    if (clearBtn) clearBtn.style.display = 'none';

    document.querySelectorAll('.lib-cat-chip').forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-cat') === 'all');
    });

    filterAndRender();
}

function filterAndRender() {
    let filtered = allShlokas;


    if (currentCategory === 'saved') {
        filtered = filtered.filter(s => savedShlokaIds.includes(s.id));
    } else if (currentCategory !== 'all') {
        filtered = filtered.filter(s => (s.category || '') === currentCategory);
    }

    if (searchQuery) {
        filtered = filtered.filter(s => {
            const sanskrit = (s.sanskrit || '').toLowerCase();
            const pron = (s.pronunciation || s.transliteration || '').toLowerCase();
            const eng = (s.english_translation || s.meaning || s.translation || '').toLowerCase();
            const hindi = (s.hindi_translation || '').toLowerCase();
            const source = (s.source || '').toLowerCase();
            const theme = (s.theme || '').toLowerCase();
            const situation = (s.life_situation || '').toLowerCase();
            const app = (s.practical_application || s.practical_tip || '').toLowerCase();

            return sanskrit.includes(searchQuery) ||
                   pron.includes(searchQuery) ||
                   eng.includes(searchQuery) ||
                   hindi.includes(searchQuery) ||
                   source.includes(searchQuery) ||
                   theme.includes(searchQuery) ||
                   situation.includes(searchQuery) ||
                   app.includes(searchQuery);
        });
    }

    renderShlokasGrid(filtered);
    updateStatusText(filtered.length);
}

function updateStatusText(count) {
    const statusText = document.getElementById('libStatusInfo');
    if (!statusText) return;

    let catName = 'All Shlokas';
    const foundMeta = categoryMeta.find(m => m.id === currentCategory);
    if (foundMeta) catName = foundMeta.name;

    let msg = `Showing <strong>${count} verse${count === 1 ? '' : 's'}</strong>`;
    if (currentCategory !== 'all') {
        msg += ` in <em>${catName}</em>`;
    }
    if (searchQuery) {
        msg += ` matching &ldquo;${searchQuery}&rdquo;`;
    }
    statusText.innerHTML = msg;
}

function renderShlokasGrid(shlokas) {
    const grid = document.getElementById('libShlokasGrid');
    if (!grid) return;

    if (shlokas.length === 0) {
        if (currentCategory === 'saved') {
            grid.innerHTML = `
                <div class="lib-empty-state" style="grid-column: 1 / -1;">
                    <h3>No saved verses yet</h3>
                    <p>Click the bookmark icon (🔖) on any shloka card below to save it here for quick contemplation.</p>
                    <button type="button" class="lib-reset-filter-btn" onclick="resetAllFilters()">Browse All Shlokas</button>
                </div>
            `;
        } else {
            grid.innerHTML = `
                <div class="lib-empty-state" style="grid-column: 1 / -1;">
                    <h3>No verses found just yet</h3>
                    <p>Try searching with another word (like <em>anger</em>, <em>peace</em>, <em>Gita 2.47</em>) or select a different situation.</p>
                    <button type="button" class="lib-reset-filter-btn" onclick="resetAllFilters()">Reset Search &amp; Filters</button>
                </div>
            `;
        }
        return;
    }

    let html = '';
    shlokas.forEach(s => {
        const isSaved = savedShlokaIds.includes(s.id);
        const sourceLabel = s.source || 'Ancient Wisdom';
        const themeLabel = s.theme || s.category || 'Life Wisdom';
        const sanskritSnippet = s.sanskrit || '';
        const translitSnippet = s.pronunciation || s.transliteration || '';
        const engSnippet = s.english_translation || s.meaning || '';

        html += `
            <div class="lib-card" id="shloka-card-${s.id}">
                <div>
                    <div class="lib-card-header">
                        <span class="lib-card-source">${escapeHtml(sourceLabel)}</span>
                        <span class="lib-card-badge">${escapeHtml(themeLabel)}</span>
                    </div>

                    <div class="lib-card-sanskrit">${escapeHtml(sanskritSnippet)}</div>
                    
                    ${translitSnippet ? `<div class="lib-card-transliteration">${escapeHtml(translitSnippet)}</div>` : ''}
                    
                    <div class="lib-card-meaning">
                        &ldquo;${escapeHtml(engSnippet)}&rdquo;
                    </div>
                </div>

                <div class="lib-card-footer">
                    <button type="button" class="lib-btn-explore" onclick="openShlokaModal(${s.id})">
                        Explore Shloka &rarr;
                    </button>
                    <div class="lib-card-actions">
                        <button type="button" 
                                class="lib-btn-icon ${isSaved ? 'saved' : ''}" 
                                onclick="toggleSaveShloka(${s.id}, this)"
                                title="${isSaved ? 'Remove from Saved' : 'Save Shloka'}">
                            ${isSaved ? '★' : '☆'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

function openShlokaModal(shlokaId) {
    const shloka = allShlokas.find(s => s.id === shlokaId);
    if (!shloka) return;

    const modal = document.getElementById('shlokaDetailModal');
    const content = document.getElementById('shlokaModalContent');
    if (!modal || !content) return;

    const isSaved = savedShlokaIds.includes(shloka.id);

    content.innerHTML = `
        <div class="lib-modal-header">
            <span class="lib-modal-title-meta">
                📖 ${escapeHtml(shloka.source || 'Sacred Scripture')} &bull; ${escapeHtml(shloka.theme || shloka.category)}
            </span>
            <button type="button" class="lib-modal-close-btn" onclick="closeShlokaModal()" aria-label="Close modal">✕</button>
        </div>

        <div class="lib-modal-body">
            <!-- Sacred Manuscript Altar -->
            <div class="lib-modal-altar">
                <div class="lib-modal-sanskrit">${escapeHtml(shloka.sanskrit)}</div>
                ${shloka.pronunciation ? `<div class="lib-modal-translit">🗣️ <em>${escapeHtml(shloka.pronunciation)}</em></div>` : ''}
            </div>

            <!-- Two-Column Translations -->
            <div class="lib-modal-translations-grid">
                <div class="lib-modal-trans-card">
                    <h5>🇬🇧 English Meaning</h5>
                    <p>&ldquo;${escapeHtml(shloka.english_translation || shloka.meaning || shloka.translation)}&rdquo;</p>
                </div>
                ${shloka.hindi_translation ? `
                <div class="lib-modal-trans-card hindi">
                    <h5>🇮🇳 हिन्दी अर्थ</h5>
                    <p>${escapeHtml(shloka.hindi_translation)}</p>
                </div>
                ` : ''}
            </div>

            <!-- When to remember -->
            ${shloka.life_situation ? `
            <div class="lib-modal-situation-box">
                <strong style="color: #2E7D32; display: block; margin-bottom: 4px;">🌟 When to Remember This:</strong>
                ${escapeHtml(shloka.life_situation)}
            </div>
            ` : ''}

            <!-- Daily Life Practice -->
            ${(shloka.practical_application || shloka.practical_tip) ? `
            <div class="lib-modal-practice-box">
                <strong style="color: var(--lib-gold); display: block; margin-bottom: 4px;">💡 Daily Life Example &amp; Practice:</strong>
                ${escapeHtml(shloka.practical_application || shloka.practical_tip)}
            </div>
            ` : ''}

            <!-- Footer Actions -->
            <div class="lib-modal-footer-actions">
                <div>
                    <button type="button" class="lib-btn-copy-verse" onclick="copyShlokaVerse('${escapeJs(shloka.sanskrit)}')">
                        📋 Copy Sanskrit Verse
                    </button>
                    <button type="button" class="lib-btn-copy-verse" style="margin-left: 8px;" onclick="toggleSaveShloka(${shloka.id}, this)">
                        ${isSaved ? '★ Saved in Library' : '☆ Save to Bookmarks'}
                    </button>
                </div>
                <a href="/chat" class="yc-context-link" style="font-size: 0.85rem;">
                    Discuss with Spiritual Guide &rarr;
                </a>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeShlokaModal() {
    const modal = document.getElementById('shlokaDetailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function toggleSaveShloka(id, btn) {
    const idx = savedShlokaIds.indexOf(id);
    if (idx > -1) {
        savedShlokaIds.splice(idx, 1);
        showLibToast('Removed from Saved Shlokas');
    } else {
        savedShlokaIds.push(id);
        showLibToast('✓ Shloka saved to your bookmarks! 🔖');
    }

    persistBookmarks();
    updateCategoryCounts();

    filterAndRender();
}

function copyShlokaVerse(text) {
    navigator.clipboard.writeText(text).then(() => {
        showLibToast('✓ Sanskrit verse copied to clipboard!');
    }).catch(err => {
        console.warn('Copy failed:', err);
    });
}

function showLibToast(message) {
    const existing = document.getElementById('libToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'libToast';
    toast.innerText = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: #1A101A;
        color: #F8F4EC;
        border: 1px solid rgba(226, 185, 97, 0.4);
        padding: 11px 24px;
        border-radius: 25px;
        font-size: 0.88rem;
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: fadeIn 0.25s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

function escapeJs(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'")
              .replace(/"/g, '\\"')
              .replace(/\n/g, '\\n')
              .replace(/\r/g, '\\r');
}
