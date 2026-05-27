/* ============================================================
   PDBench — Interactivity
   - Loads per-generator JSON data from /data
   - Renders leaderboard, supports sort + search + filter
   - Tab switching, stat count-up
   ============================================================ */

(() => {
  const TASKS = {
    // ---- Attribute Manipulation ----
    stargan:   { name: 'StarGAN',   group: 'Attribute Manipulation', file: 'data/stargan.json' },
    styleclip: { name: 'StyleCLIP', group: 'Attribute Manipulation', file: 'data/styleclip.json' },
    diffae:    { name: 'DiffAE',    group: 'Attribute Manipulation', file: 'data/diffae.json' },
    // ---- Face Swap ----
    simswap:   { name: 'SimSwap',   group: 'Face Swap', file: 'data/simswap.json' },
    psp:       { name: 'pSp-mix',   group: 'Face Swap', file: 'data/psp.json' },
    blendface: { name: 'BlendFace', group: 'Face Swap', file: 'data/blendface.json' },
    diffswap:  { name: 'DiffSwap',  group: 'Face Swap', file: 'data/diffswap.json' },
    diffface:  { name: 'DiffFace',  group: 'Face Swap', file: 'data/diffface.json' }
  };

  const DATASETS = {
    celebahq: { name: 'CelebA-HQ',   tableRef: 'Table 2' },
    ffhq:     { name: 'FFHQ',        tableRef: 'Table 8' },
    vgg:      { name: 'VGGFace2-HQ', tableRef: 'Table 9' }
  };

  const COLUMNS = [
    { key: 'method',  numeric: false },
    { key: 'setting', numeric: false },
    { key: 'avgrank', numeric: true, lowerIsBetter: true, primary: true },
    { key: 'mse',     numeric: true },
    { key: 'lpips',   numeric: true },
    { key: 'cidr',    numeric: true },
    { key: 'brisque', numeric: true },
    { key: 'rob',     numeric: true },
    { key: 'te',      numeric: true }
  ];

  const state = {
    activeTask: 'stargan',
    activeDataset: 'celebahq',
    rawData: null,    // full JSON object: { celebahq: [...], ffhq: [...], vgg: [...] }
    data: [],         // current dataset's rows
    sortKey: 'avgrank',
    sortDir: 'asc',
    search: '',
    filter: 'all'
  };

  // ---------- Helpers ----------
  const fmt = (val, key) => {
    if (val === null || val === undefined || val === '') return '—';
    const n = Number(val);
    if (Number.isNaN(n)) return val;
    if (key === 'mse')     return n.toFixed(4);
    if (key === 'lpips')   return n.toFixed(4);
    if (key === 'cidr')    return n.toFixed(4);
    if (key === 'brisque') return n.toFixed(2);
    if (key === 'avgrank') return n.toFixed(2);
    if (key === 'rob')     return n.toFixed(4);
    if (key === 'te')      return n.toFixed(4);
    return val;
  };

  const medal = (rank) => {
    if (rank === 1) return `<span class="rank-medal rank-1">1</span>`;
    if (rank === 2) return `<span class="rank-medal rank-2">2</span>`;
    if (rank === 3) return `<span class="rank-medal rank-3">3</span>`;
    return `<span class="rank-n">${rank}</span>`;
  };

  const settingBadge = (s) => {
    if (s === 'whitebox') return `<span class="setting-badge setting-whitebox">White-box</span>`;
    if (s === 'blackbox') return `<span class="setting-badge setting-blackbox">Black-box</span>`;
    return `<span class="setting-badge">${s || '—'}</span>`;
  };

  // ---------- Data loading ----------
  async function loadTask(taskKey) {
    state.activeTask = taskKey;
    try {
      const res = await fetch(TASKS[taskKey].file, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.rawData = await res.json();
    } catch (err) {
      console.warn('Could not load', TASKS[taskKey].file, err);
      state.rawData = null;
    }
    applyDataset();   // pick the dataset slice + update header + render
  }

  function applyDataset() {
    // Slice raw data by current dataset
    state.data = (state.rawData && state.rawData[state.activeDataset]) || [];

    // Build dynamic title & subtitle
    const task = TASKS[state.activeTask];
    const ds   = DATASETS[state.activeDataset];
    const titleEl = document.getElementById('task-title');
    const subEl   = document.getElementById('task-sub');
    titleEl.innerHTML = linkifyGenerators(`Leaderboard: ${task.name} · ${ds.name}`);
    subEl.innerHTML   = `${task.group} task on ${ds.name}. Numbers from ${ds.tableRef} of our paper.`;
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([subEl]).catch(() => {});
    }

    state.sortKey = 'avgrank';
    state.sortDir = 'asc';
    render();
  }

  // Replace generator names in a string with linked spans
  function linkifyGenerators(text) {
    if (!window.PDBENCH_REFS) return text;
    const gens = window.PDBENCH_REFS.generators;
    // Sort by length desc so "pSp-mix" matches before "pSp"
    const names = Object.keys(gens).sort((a, b) => b.length - a.length);
    let result = text;
    names.forEach(name => {
      const ref = gens[name];
      const safeTitle = `${ref.full} — ${ref.authors}`.replace(/"/g, '&quot;');
      const link = `<a href="${ref.url}" target="_blank" rel="noopener" title="${safeTitle}" class="ref-link">${name}</a>`;
      // Escape special chars in name for regex
      const pattern = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      result = result.replace(pattern, link);
    });
    return result;
  }

  // Turn protocol-tags <li>X</li> into linked refs (generators + datasets)
  function enrichProtocolTags() {
    if (!window.PDBENCH_REFS) return;
    const refs = {
      ...window.PDBENCH_REFS.generators,
      ...window.PDBENCH_REFS.datasets
    };
    // Tag pills in .protocol-tags
    document.querySelectorAll('.protocol-tags li').forEach(li => {
      const name = li.textContent.trim();
      const ref = refs[name];
      if (!ref) return;
      li.innerHTML = `<a href="${ref.url}" target="_blank" rel="noopener" class="ref-link">${name}</a>`;
      li.setAttribute('title', `${ref.full} — ${ref.authors}`);
    });
    // Strong tags in .protocol-list (e.g. CelebA-HQ)
    document.querySelectorAll('.protocol-list li strong').forEach(el => {
      const name = el.textContent.trim();
      const ref = refs[name];
      if (!ref) return;
      el.innerHTML = `<a href="${ref.url}" target="_blank" rel="noopener" class="ref-link">${name}</a>`;
      el.parentElement.setAttribute('title', `${ref.full} — ${ref.authors}`);
    });
  }

  // ---------- Sort + filter ----------
  function getSorted() {
    const q = state.search.trim().toLowerCase();
    let rows = state.data.filter(r => {
      if (state.filter === 'whitebox' && r.setting !== 'whitebox') return false;
      if (state.filter === 'blackbox' && r.setting !== 'blackbox') return false;
      if (!q) return true;
      return (r.method || '').toLowerCase().includes(q);
    });

    const key = state.sortKey;
    const col = COLUMNS.find(c => c.key === key);
    const dir = state.sortDir === 'asc' ? 1 : -1;

    rows.sort((a, b) => {
      let av = a[key], bv = b[key];
      const aMissing = av === undefined || av === null || av === '';
      const bMissing = bv === undefined || bv === null || bv === '';
      if (aMissing && bMissing) return 0;
      if (aMissing) return 1;   // missing values always last
      if (bMissing) return -1;
      if (col?.numeric) return (Number(av) - Number(bv)) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });

    return rows;
  }

  // ---------- Render ----------
  function render() {
    const tbody = document.getElementById('lb-body');
    const rows = getSorted();

    // Rank by AvgRank ascending across full dataset (lower is better)
    const ranked = [...state.data]
      .filter(r => r.avgrank !== undefined && r.avgrank !== null)
      .sort((a, b) => Number(a.avgrank) - Number(b.avgrank));
    const rankMap = new Map(ranked.map((r, i) => [r.method, i + 1]));

    const COLS = 10;
    if (rows.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="${COLS}" style="text-align:center; padding:48px 16px; color:var(--ink-mute);">
          No entries match the current filter.
        </td></tr>`;
    } else {
      tbody.innerHTML = rows.map(r => {
        const rank = rankMap.get(r.method) || '—';
        // Use centralized refs (refs.js) for paper URL + full name tooltip
        const ref = (window.PDBENCH_REFS && window.PDBENCH_REFS.methods[r.method]) || null;
        const url   = (ref && ref.url) || r.paper_url || '';
        const title = ref ? `${ref.full} — ${ref.authors}` : r.method;
        const methodCell = url
          ? `<a href="${url}" target="_blank" rel="noopener" title="${title.replace(/"/g, '&quot;')}">${r.method}</a>`
          : `<span title="${title.replace(/"/g, '&quot;')}">${r.method}</span>`;
        return `
          <tr>
            <td class="th-rank">${medal(rank)}</td>
            <td class="td-method">${methodCell}</td>
            <td>${settingBadge(r.setting)}</td>
            <td class="td-num td-primary">${fmt(r.avgrank, 'avgrank')}</td>
            <td class="td-num">${fmt(r.mse, 'mse')}</td>
            <td class="td-num">${fmt(r.lpips, 'lpips')}</td>
            <td class="td-num">${fmt(r.cidr, 'cidr')}</td>
            <td class="td-num">${fmt(r.brisque, 'brisque')}</td>
            <td class="td-num">${fmt(r.rob, 'rob')}</td>
            <td class="td-num">${fmt(r.te, 'te')}</td>
          </tr>`;
      }).join('');
    }

    // Update sort indicators
    document.querySelectorAll('#leaderboard thead th[data-sort]').forEach(th => {
      th.removeAttribute('data-dir');
      if (th.dataset.sort === state.sortKey) {
        th.setAttribute('data-dir', state.sortDir);
      }
    });
  }

  // ---------- Wire up ----------
  function init() {
    // Linkify generator tags in the Protocol section
    enrichProtocolTags();

    // Tabs (across both groups) + tooltips with generator full names
    const allTabs = document.querySelectorAll('.tabs .tab');
    allTabs.forEach(btn => {
      // Add tooltip from refs if available
      if (window.PDBENCH_REFS) {
        const name = btn.textContent.trim();
        const ref = window.PDBENCH_REFS.generators[name];
        if (ref) btn.setAttribute('title', `${ref.full} — ${ref.authors}`);
      }
      btn.addEventListener('click', () => {
        allTabs.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        loadTask(btn.dataset.task);
      });
    });

    // Sortable headers
    document.querySelectorAll('#leaderboard thead th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        const col = COLUMNS.find(c => c.key === key);
        if (state.sortKey === key) {
          state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortKey = key;
          if (col?.lowerIsBetter) state.sortDir = 'asc';
          else if (col?.numeric)  state.sortDir = 'desc';
          else                    state.sortDir = 'asc';
        }
        render();
      });
    });

    // Search
    document.getElementById('lb-search').addEventListener('input', (e) => {
      state.search = e.target.value;
      render();
    });

    // Dataset
    document.getElementById('lb-dataset').addEventListener('change', (e) => {
      state.activeDataset = e.target.value;
      applyDataset();
    });

    // Filter
    document.getElementById('lb-filter').addEventListener('change', (e) => {
      state.filter = e.target.value;
      render();
    });

    // Stat count-up
    const statEls = document.querySelectorAll('.stat-num');
    const animateStat = (el) => {
      const target = parseInt(el.dataset.target || '0', 10);
      const dur = 1100;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animateStat(e.target);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      statEls.forEach(el => io.observe(el));
    } else {
      statEls.forEach(animateStat);
    }

    // Initial load
    loadTask('stargan');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
