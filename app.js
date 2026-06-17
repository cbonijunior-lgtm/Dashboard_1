const SECTOR_MAP = {
  HGLG11: 'FII Logística', XPLG11: 'FII Logística', BTLG11: 'FII Logística',
  VILG11: 'FII Logística', LVBI11: 'FII Logística',
  HGBS11: 'FII Shopping', VISC11: 'FII Shopping', XPML11: 'FII Shopping', HSML11: 'FII Shopping',
  KNRI11: 'FII Lajes Corporativas', BRCR11: 'FII Lajes Corporativas',
  PVBI11: 'FII Lajes Corporativas', JSRE11: 'FII Lajes Corporativas',
  MXRF11: 'FII Papel/Recebíveis', KNCR11: 'FII Papel/Recebíveis', RBRR11: 'FII Papel/Recebíveis',
  GGRC11: 'FII Papel/Recebíveis', CPTS11: 'FII Papel/Recebíveis', TRXF11: 'FII Papel/Recebíveis',
  GARE11: 'FII Papel/Recebíveis', RECR11: 'FII Papel/Recebíveis',
  VGIR11: 'FII Papel/Recebíveis', TGAR11: 'FII Papel/Recebíveis',
  RBRF11: 'FII Fundo de Fundos', BCFF11: 'FII Fundo de Fundos',
  AAPL34: 'BDR Tecnologia', MSFT34: 'BDR Tecnologia', GOGL34: 'BDR Tecnologia',
  NFLX34: 'BDR Tecnologia', TSLA34: 'BDR Tecnologia', NVDA34: 'BDR Tecnologia',
  META34: 'BDR Tecnologia', INTC34: 'BDR Tecnologia',
  JPMB34: 'BDR Financeiro', BOAC34: 'BDR Financeiro', VISA34: 'BDR Financeiro',
  MAST34: 'BDR Financeiro', PYPL34: 'BDR Financeiro',
  AMZO34: 'BDR Varejo/E-commerce', WALM34: 'BDR Varejo/E-commerce', MELI34: 'BDR Varejo/E-commerce',
  BABA34: 'BDR Varejo/E-commerce', NIKE34: 'BDR Varejo/E-commerce', UBER34: 'BDR Varejo/E-commerce',
  COCA34: 'BDR Consumo', MCDO34: 'BDR Consumo', DISB34: 'BDR Consumo',
  BMYB34: 'BDR Saúde', PFEE34: 'BDR Saúde',
  EXXO34: 'BDR Energia/Commodities', GOLD34: 'BDR Energia/Commodities'
};

const LPA_MAP = {
  HGLG11: 145.5, XPLG11: 102.0, KNRI11: 138.0, MXRF11: 10.52, HGBS11: 22.0,
  VISC11: 112.0, BTLG11: 98.0, XPML11: 105.0, KNCR11: 108.0, RBRR11: 95.0,
  VILG11: 99.0, GGRC11: 10.15, HSML11: 90.0, BRCR11: 54.0, CPTS11: 7.55,
  TRXF11: 100.0, GARE11: 9.45, PVBI11: 82.0, RECR11: 81.0, RBRF11: 8.0,
  LVBI11: 118.0, VGIR11: 9.85, BCFF11: 71.0, TGAR11: 9.35, JSRE11: 76.0,
  AAPL34: 3.85, AMZO34: 2.45, MSFT34: 4.65, GOGL34: 3.20, NFLX34: 1.85,
  TSLA34: 1.65, NVDA34: 2.95, META34: 3.10, DISB34: 1.42, INTC34: 0.85,
  COCA34: 1.65, JPMB34: 4.25, BOAC34: 2.15, WALM34: 2.85, MELI34: 8.50,
  BABA34: 2.35, MCDO34: 3.45, NIKE34: 1.95, PYPL34: 1.25, UBER34: 0.95,
  GOLD34: 0.78, EXXO34: 5.85, BMYB34: 1.55, PFEE34: 1.35, VISA34: 2.75, MAST34: 3.05
};

const DY_MAP = {
  'FII Logística': 8.5, 'FII Shopping': 9.2, 'FII Lajes Corporativas': 7.8,
  'FII Papel/Recebíveis': 11.5, 'FII Fundo de Fundos': 10.0,
  'BDR Tecnologia': 0.5, 'BDR Financeiro': 1.2, 'BDR Varejo/E-commerce': 0.8,
  'BDR Consumo': 2.8, 'BDR Saúde': 3.5, 'BDR Energia/Commodities': 2.2
};

function getAssetType(ticker) {
  if (ticker.endsWith('11')) return 'FII';
  if (ticker.endsWith('34') || ticker.endsWith('35') || ticker.endsWith('39')) return 'BDR';
  return 'Ação';
}

const CHART_COLORS = [
  '#7c5cfc', '#ff4d8d', '#00d4ff', '#4ade80', '#fbbf24',
  '#fb7185', '#38bdf8', '#a78bfa', '#34d399', '#f97316',
  '#e879f9', '#22d3ee', '#86efac', '#fcd34d', '#c084fc'
];

const state = {
  rawData: [],
  clickFilter: { sector: null, ticker: null, source: null },
  charts: {}
};

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row = {};
    headers.forEach((h, i) => { row[h.trim()] = values[i]?.trim(); });
    return enrichRow(row);
  });
}

function enrichRow(row) {
  const preco = parseFloat(row.preco);
  const variacao = parseFloat(row.variacao_dia);
  const volume = parseInt(row.volume, 10);
  const ticker = row.ticker;
  const tipo = getAssetType(ticker);
  const setor = SECTOR_MAP[ticker] || 'Outros';
  const lpa = LPA_MAP[ticker] ?? preco * 0.08;
  const pl = lpa > 0 ? preco / lpa : null;
  const baseDy = DY_MAP[setor] ?? (tipo === 'FII' ? 9 : 2);
  const dy = Math.max(0, baseDy + (Math.sin(ticker.charCodeAt(0)) * 1.2));

  return {
    ticker,
    empresa: row.empresa,
    tipo,
    preco,
    abertura: parseFloat(row.abertura),
    maxima: parseFloat(row.maxima),
    minima: parseFloat(row.minima),
    variacao_dia: variacao,
    volume,
    data: row.data,
    setor,
    pl: pl !== null ? Math.round(pl * 10) / 10 : null,
    dividend_yield: Math.round(dy * 100) / 100
  };
}

function getFilterValues() {
  return {
    search: document.getElementById('searchInput').value.toLowerCase().trim(),
    tipo: document.getElementById('tipoFilter').value,
    sector: document.getElementById('sectorFilter').value,
    variation: document.getElementById('variationFilter').value,
    dy: document.getElementById('dyFilter').value,
    pl: document.getElementById('plFilter').value
  };
}

function applyFilters(data) {
  const f = getFilterValues();

  return data.filter(d => {
    if (f.search && !d.ticker.toLowerCase().includes(f.search) &&
        !d.empresa.toLowerCase().includes(f.search)) return false;

    if (f.tipo && d.tipo !== f.tipo) return false;

    if (f.sector && d.setor !== f.sector) return false;

    if (state.clickFilter.sector && d.setor !== state.clickFilter.sector) return false;
    if (state.clickFilter.ticker && d.ticker !== state.clickFilter.ticker) return false;

    if (f.variation === 'positive' && d.variacao_dia <= 0) return false;
    if (f.variation === 'negative' && d.variacao_dia >= 0) return false;
    if (f.variation === 'high' && d.variacao_dia <= 2) return false;

    if (f.dy === 'high' && d.dividend_yield <= 6) return false;
    if (f.dy === 'medium' && (d.dividend_yield < 3 || d.dividend_yield > 6)) return false;
    if (f.dy === 'low' && d.dividend_yield >= 3) return false;

    if (f.pl === 'cheap' && (d.pl === null || d.pl > 10)) return false;
    if (f.pl === 'fair' && (d.pl === null || d.pl < 10 || d.pl > 20)) return false;
    if (f.pl === 'expensive' && (d.pl === null || d.pl < 20)) return false;

    return true;
  });
}

function formatCurrency(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatNumber(val) {
  if (val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
  if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
  if (val >= 1e3) return (val / 1e3).toFixed(1) + 'K';
  return val.toLocaleString('pt-BR');
}

function updateKPIs(data) {
  const totalValue = data.reduce((s, d) => s + d.preco, 0);
  const avgVar = data.length ? data.reduce((s, d) => s + d.variacao_dia, 0) / data.length : 0;
  const totalVol = data.reduce((s, d) => s + d.volume, 0);
  const avgDY = data.length ? data.reduce((s, d) => s + d.dividend_yield, 0) / data.length : 0;
  const positiveCount = data.filter(d => d.variacao_dia > 0).length;

  document.getElementById('kpiPortfolio').textContent = formatCurrency(totalValue);
  document.getElementById('kpiPortfolioChange').textContent =
    `${positiveCount}/${data.length} ativos em alta hoje`;
  document.getElementById('kpiPortfolioChange').className =
    `kpi-change ${positiveCount >= data.length / 2 ? 'positive' : 'negative'}`;

  document.getElementById('kpiVariation').textContent = `${avgVar >= 0 ? '+' : ''}${avgVar.toFixed(2)}%`;
  document.getElementById('kpiVariation').className = `kpi-value ${avgVar >= 0 ? 'positive' : 'negative'}`;
  document.getElementById('kpiCount').textContent = `${data.length} ativos`;

  document.getElementById('kpiVolume').textContent = formatNumber(totalVol);
  document.getElementById('kpiVolumeLabel').textContent = `${data.length} ativos filtrados`;

  document.getElementById('kpiDY').textContent = `${avgDY.toFixed(2)}%`;
  document.getElementById('kpiDYLabel').textContent = 'média anual estimada';

  updateSparklines(data);
}

function updateSparklines(data) {
  const sparks = [
    { id: 'sparkPortfolio', values: data.map(d => d.preco), color: '#7c5cfc' },
    { id: 'sparkVariation', values: data.map(d => d.variacao_dia), color: '#ff4d8d' },
    { id: 'sparkVolume', values: data.map(d => d.volume / 1e6), color: '#00d4ff' },
    { id: 'sparkDY', values: data.map(d => d.dividend_yield), color: '#4ade80' }
  ];

  sparks.forEach(({ id, values, color }) => {
    const canvas = document.getElementById(id);
    if (!canvas || !values.length) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 120;
    canvas.height = 50;
    ctx.clearRect(0, 0, 120, 50);

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const step = 120 / (values.length - 1 || 1);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    values.forEach((v, i) => {
      const x = i * step;
      const y = 45 - ((v - min) / range) * 40;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.lineTo(120, 50);
    ctx.lineTo(0, 50);
    ctx.closePath();
    ctx.fillStyle = color + '22';
    ctx.fill();
  });
}

function groupBySector(data) {
  const groups = {};
  data.forEach(d => {
    if (!groups[d.setor]) groups[d.setor] = { count: 0, plSum: 0, plCount: 0, value: 0, dySum: 0, variacaoSum: 0 };
    const g = groups[d.setor];
    g.count++;
    g.value += d.preco;
    g.dySum += d.dividend_yield;
    g.variacaoSum += d.variacao_dia;
    if (d.pl !== null) { g.plSum += d.pl; g.plCount++; }
  });
  return groups;
}

function chartDefaults() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#8b8fa3', font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 16 }
      },
      tooltip: {
        backgroundColor: '#222333',
        titleColor: '#fff',
        bodyColor: '#8b8fa3',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        ticks: { color: '#8b8fa3', font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.04)' }
      },
      y: {
        ticks: { color: '#8b8fa3', font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.04)' }
      }
    }
  };
}

function destroyChart(key) {
  if (state.charts[key]) {
    state.charts[key].destroy();
    state.charts[key] = null;
  }
}

function renderPLChart(data) {
  destroyChart('pl');
  const groups = groupBySector(data);
  const labels = Object.keys(groups).sort();
  const values = labels.map(l => {
    const g = groups[l];
    return g.plCount ? g.plSum / g.plCount : 0;
  });

  const ctx = document.getElementById('chartPL').getContext('2d');
  const selected = state.clickFilter.sector;

  state.charts.pl = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'P/VP ou P/L médio',
        data: values,
        backgroundColor: labels.map((l, i) =>
          selected === l ? '#ffffff' : CHART_COLORS[i % CHART_COLORS.length] + 'cc'
        ),
        borderColor: labels.map((l, i) =>
          selected === l ? '#ffffff' : CHART_COLORS[i % CHART_COLORS.length]
        ),
        borderWidth: selected ? 2 : 0,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      ...chartDefaults(),
      onClick: (_, elements) => {
        if (!elements.length) return;
        const sector = labels[elements[0].index];
        toggleClickFilter('sector', sector, 'P/VP ou P/L por Setor');
      },
      plugins: {
        ...chartDefaults().plugins,
        legend: { display: false }
      }
    }
  });
}

function renderSectorChart(data) {
  destroyChart('sector');
  const groups = groupBySector(data);
  const labels = Object.keys(groups);
  const values = labels.map(l => groups[l].value);
  const selected = state.clickFilter.sector;

  state.charts.sector = new Chart(document.getElementById('chartSector'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: labels.map((l, i) => {
          const c = CHART_COLORS[i % CHART_COLORS.length];
          return selected && selected !== l ? c + '44' : c;
        }),
        borderColor: '#1a1b28',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      onClick: (_, elements) => {
        if (!elements.length) return;
        toggleClickFilter('sector', labels[elements[0].index], 'Alocação por Setor');
      },
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#8b8fa3', font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 10 }
        },
        tooltip: {
          ...chartDefaults().plugins.tooltip,
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.raw / total) * 100).toFixed(1);
              return `${ctx.label}: ${formatCurrency(ctx.raw)} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

function renderDYChart(data) {
  destroyChart('dy');
  const sorted = [...data].sort((a, b) => b.dividend_yield - a.dividend_yield).slice(0, 12);
  const selected = state.clickFilter.ticker;

  state.charts.dy = new Chart(document.getElementById('chartDY'), {
    type: 'bar',
    data: {
      labels: sorted.map(d => d.ticker),
      datasets: [{
        label: 'Div. Yield (%)',
        data: sorted.map(d => d.dividend_yield),
        backgroundColor: sorted.map(d =>
          selected === d.ticker ? '#ffffff' : '#00d4ff' + 'bb'
        ),
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      ...chartDefaults(),
      onClick: (_, elements) => {
        if (!elements.length) return;
        toggleClickFilter('ticker', sorted[elements[0].index].ticker, 'Dividend Yield');
      },
      plugins: { ...chartDefaults().plugins, legend: { display: false } },
      scales: {
        x: { ...chartDefaults().scales.x, ticks: { callback: v => v + '%' } },
        y: chartDefaults().scales.y
      }
    }
  });
}

function renderVariationChart(data) {
  destroyChart('variation');
  const sorted = [...data].sort((a, b) => b.variacao_dia - a.variacao_dia);
  const selected = state.clickFilter.ticker;

  state.charts.variation = new Chart(document.getElementById('chartVariation'), {
    type: 'line',
    data: {
      labels: sorted.map(d => d.ticker),
      datasets: [{
        label: 'Variação (%)',
        data: sorted.map(d => d.variacao_dia),
        borderColor: '#7c5cfc',
        backgroundColor: 'rgba(124, 92, 252, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: sorted.map(d => selected === d.ticker ? 8 : 4),
        pointBackgroundColor: sorted.map(d =>
          selected === d.ticker ? '#ffffff' : '#7c5cfc'
        ),
        pointBorderColor: sorted.map(d =>
          selected === d.ticker ? '#7c5cfc' : 'transparent'
        ),
        pointBorderWidth: 2
      }]
    },
    options: {
      ...chartDefaults(),
      onClick: (_, elements) => {
        if (!elements.length) return;
        toggleClickFilter('ticker', sorted[elements[0].index].ticker, 'Variação do Dia');
      },
      plugins: { ...chartDefaults().plugins, legend: { display: false } }
    }
  });
}

function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = data.map(d => {
    const varClass = d.variacao_dia >= 0 ? 'positive' : 'negative';
    const selected = state.clickFilter.ticker === d.ticker ? 'selected' : '';
    const ratioLabel = d.tipo === 'FII' ? 'P/VP' : 'P/L';
    return `
      <tr data-ticker="${d.ticker}" class="${selected}">
        <td class="ticker-cell">${d.ticker}</td>
        <td>${d.empresa}</td>
        <td><span class="tipo-tag tipo-${d.tipo.toLowerCase()}">${d.tipo}</span></td>
        <td><span class="sector-tag">${d.setor}</span></td>
        <td>${formatCurrency(d.preco)}</td>
        <td>${formatCurrency(d.abertura)}</td>
        <td>${formatCurrency(d.maxima)}</td>
        <td>${formatCurrency(d.minima)}</td>
        <td class="${varClass}">${d.variacao_dia >= 0 ? '+' : ''}${d.variacao_dia.toFixed(2)}%</td>
        <td title="${ratioLabel}">${d.pl !== null ? d.pl.toFixed(1) + 'x' : '—'}</td>
        <td>${d.dividend_yield.toFixed(2)}%</td>
        <td>${formatNumber(d.volume)}</td>
        <td>${d.data}</td>
      </tr>`;
  }).join('');

  tbody.querySelectorAll('tr').forEach(tr => {
    tr.addEventListener('click', () => {
      toggleClickFilter('ticker', tr.dataset.ticker, 'Tabela');
    });
  });
}

function toggleClickFilter(type, value, source) {
  if (type === 'sector') {
    state.clickFilter.sector = state.clickFilter.sector === value ? null : value;
    state.clickFilter.ticker = null;
  } else {
    state.clickFilter.ticker = state.clickFilter.ticker === value ? null : value;
    state.clickFilter.sector = null;
  }
  state.clickFilter.source = state.clickFilter.sector || state.clickFilter.ticker ? source : null;
  refresh();
}

function updateActiveFilters() {
  const container = document.getElementById('activeFilters');
  const chips = [];

  if (state.clickFilter.sector) {
    chips.push(`<span class="filter-chip">Setor: ${state.clickFilter.sector} (gráfico)</span>`);
  }
  if (state.clickFilter.ticker) {
    chips.push(`<span class="filter-chip pink">Ticker: ${state.clickFilter.ticker} (gráfico)</span>`);
  }

  const f = getFilterValues();
  if (f.tipo) chips.push(`<span class="filter-chip purple">Tipo: ${f.tipo}</span>`);
  if (f.sector) chips.push(`<span class="filter-chip cyan">Setor: ${f.sector}</span>`);
  if (f.variation) {
    const labels = { positive: 'Var. positivas', negative: 'Var. negativas', high: 'Var. > 2%' };
    chips.push(`<span class="filter-chip">${labels[f.variation]}</span>`);
  }
  if (f.dy) {
    const labels = { high: 'DY > 6%', medium: 'DY 3–6%', low: 'DY < 3%' };
    chips.push(`<span class="filter-chip">${labels[f.dy]}</span>`);
  }
  if (f.pl) {
    const labels = { cheap: 'P/L ≤ 10x', fair: 'P/L 10–20x', expensive: 'P/L > 20x' };
    chips.push(`<span class="filter-chip">${labels[f.pl]}</span>`);
  }
  if (f.search) chips.push(`<span class="filter-chip">Busca: "${f.search}"</span>`);

  container.innerHTML = chips.join('');
}

function populateSectorFilter(data) {
  const select = document.getElementById('sectorFilter');
  const sectors = [...new Set(data.map(d => d.setor))].sort();
  sectors.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  });
}

function refresh() {
  const filtered = applyFilters(state.rawData);
  updateKPIs(filtered);
  renderPLChart(filtered);
  renderSectorChart(filtered);
  renderDYChart(filtered);
  renderVariationChart(filtered);
  renderTable(filtered);
  updateActiveFilters();
}

function clearAllFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('tipoFilter').value = '';
  document.getElementById('sectorFilter').value = '';
  document.getElementById('variationFilter').value = '';
  document.getElementById('dyFilter').value = '';
  document.getElementById('plFilter').value = '';
  state.clickFilter = { sector: null, ticker: null, source: null };
  refresh();
}

function bindEvents() {
  ['searchInput', 'tipoFilter', 'sectorFilter', 'variationFilter', 'dyFilter', 'plFilter'].forEach(id => {
    document.getElementById(id).addEventListener('input', refresh);
    document.getElementById(id).addEventListener('change', refresh);
  });
  document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
}

async function loadCotacoesFromSupabase() {
  const client = requireSupabaseClient();
  const cols = Object.values(SUPABASE_SCHEMA.columns).join(', ');
  const { data, error } = await client
    .from(SUPABASE_SCHEMA.table)
    .select(cols)
    .order(SUPABASE_SCHEMA.columns.data, { ascending: false });

  if (error) throw error;
  if (!data?.length) throw new Error(`Tabela "${SUPABASE_SCHEMA.table}" vazia`);

  return data.map(row => enrichRow(mapSupabaseRow(row)));
}

async function init() {
  try {
    state.rawData = await loadCotacoesFromSupabase();
  } catch {
    try {
      const res = await fetch('cotacoes.csv');
      const text = await res.text();
      state.rawData = parseCSV(text);
    } catch {
      console.warn('Supabase e CSV indisponíveis — usando dados embutidos.');
      state.rawData = EMBEDDED_DATA.map(enrichRow);
    }
  }

  populateSectorFilter(state.rawData);
  bindEvents();
  refresh();
}

const EMBEDDED_DATA = [
  { ticker:'HGLG11',empresa:'CSHG Logística FII',preco:'158.42',abertura:'157.20',maxima:'159.85',minima:'156.90',variacao_dia:'0.78',volume:'1245800',data:'2026-06-13' },
  { ticker:'XPLG11',empresa:'XP Log FII',preco:'98.75',abertura:'97.80',maxima:'99.40',minima:'97.45',variacao_dia:'0.97',volume:'987400',data:'2026-06-13' },
  { ticker:'KNRI11',empresa:'Kinea Renda Imobiliária FII',preco:'142.30',abertura:'141.50',maxima:'143.20',minima:'140.85',variacao_dia:'0.57',volume:'765300',data:'2026-06-13' },
  { ticker:'MXRF11',empresa:'Maxi Renda FII',preco:'10.18',abertura:'10.05',maxima:'10.28',minima:'10.02',variacao_dia:'1.29',volume:'45231800',data:'2026-06-13' },
  { ticker:'HGBS11',empresa:'Hedge Brasil Shopping FII',preco:'21.45',abertura:'21.20',maxima:'21.68',minima:'21.10',variacao_dia:'1.18',volume:'8765400',data:'2026-06-13' },
  { ticker:'VISC11',empresa:'Vinci Shopping Centers FII',preco:'108.92',abertura:'108.10',maxima:'109.75',minima:'107.80',variacao_dia:'0.76',volume:'6543200',data:'2026-06-13' },
  { ticker:'BTLG11',empresa:'BTG Pactual Logística FII',preco:'102.35',abertura:'101.60',maxima:'103.10',minima:'101.25',variacao_dia:'0.74',volume:'5432100',data:'2026-06-13' },
  { ticker:'XPML11',empresa:'XP Malls FII',preco:'102.80',abertura:'102.00',maxima:'103.55',minima:'101.70',variacao_dia:'0.78',volume:'4321800',data:'2026-06-13' },
  { ticker:'KNCR11',empresa:'Kinea Rendimentos Imobiliários FII',preco:'104.67',abertura:'103.90',maxima:'105.40',minima:'103.55',variacao_dia:'0.74',volume:'3214560',data:'2026-06-13' },
  { ticker:'RBRR11',empresa:'RBR Rendimento High Grade FII',preco:'92.18',abertura:'91.50',maxima:'93.05',minima:'91.20',variacao_dia:'0.74',volume:'2876540',data:'2026-06-13' },
  { ticker:'VILG11',empresa:'Vinci Logística FII',preco:'95.42',abertura:'94.80',maxima:'96.25',minima:'94.50',variacao_dia:'0.65',volume:'2543210',data:'2026-06-13' },
  { ticker:'GGRC11',empresa:'GGR Covepi Renda FII',preco:'9.85',abertura:'9.72',maxima:'9.95',minima:'9.68',variacao_dia:'1.34',volume:'18763200',data:'2026-06-13' },
  { ticker:'HSML11',empresa:'HSI Mall FII',preco:'87.65',abertura:'87.00',maxima:'88.40',minima:'86.75',variacao_dia:'0.75',volume:'1987650',data:'2026-06-13' },
  { ticker:'BRCR11',empresa:'BTG Pactual Corporate Office FII',preco:'52.30',abertura:'51.85',maxima:'52.85',minima:'51.60',variacao_dia:'0.87',volume:'1654320',data:'2026-06-13' },
  { ticker:'CPTS11',empresa:'Capitania Securities FII',preco:'7.42',abertura:'7.30',maxima:'7.52',minima:'7.25',variacao_dia:'1.64',volume:'22145600',data:'2026-06-13' },
  { ticker:'TRXF11',empresa:'TRX Real Estate FII',preco:'98.15',abertura:'97.40',maxima:'99.00',minima:'97.10',variacao_dia:'0.77',volume:'1432100',data:'2026-06-13' },
  { ticker:'GARE11',empresa:'Guardian Real Estate FII',preco:'9.28',abertura:'9.15',maxima:'9.38',minima:'9.10',variacao_dia:'1.42',volume:'15678400',data:'2026-06-13' },
  { ticker:'PVBI11',empresa:'VBI Prime Properties FII',preco:'78.90',abertura:'78.30',maxima:'79.65',minima:'78.00',variacao_dia:'0.77',volume:'876540',data:'2026-06-13' },
  { ticker:'RECR11',empresa:'REC Recebíveis Imobiliários FII',preco:'78.45',abertura:'77.90',maxima:'79.20',minima:'77.55',variacao_dia:'0.71',volume:'765430',data:'2026-06-13' },
  { ticker:'RBRF11',empresa:'RBR Alpha Fundo de Fundos FII',preco:'7.85',abertura:'7.72',maxima:'7.95',minima:'7.68',variacao_dia:'1.68',volume:'13456700',data:'2026-06-13' },
  { ticker:'LVBI11',empresa:'VBI Logístico FII',preco:'112.35',abertura:'111.60',maxima:'113.20',minima:'111.25',variacao_dia:'0.67',volume:'654320',data:'2026-06-13' },
  { ticker:'VGIR11',empresa:'Valora RE III FII',preco:'9.62',abertura:'9.48',maxima:'9.75',minima:'9.42',variacao_dia:'1.48',volume:'11234500',data:'2026-06-13' },
  { ticker:'BCFF11',empresa:'BTG Pactual Fundo de Fundos FII',preco:'68.42',abertura:'67.90',maxima:'69.05',minima:'67.65',variacao_dia:'0.77',volume:'987650',data:'2026-06-13' },
  { ticker:'TGAR11',empresa:'TG Ativo Real FII',preco:'9.15',abertura:'9.02',maxima:'9.28',minima:'8.98',variacao_dia:'1.44',volume:'9876500',data:'2026-06-13' },
  { ticker:'JSRE11',empresa:'JS Real Estate FII',preco:'72.80',abertura:'72.20',maxima:'73.55',minima:'71.90',variacao_dia:'0.83',volume:'543210',data:'2026-06-13' },
  { ticker:'AAPL34',empresa:'Apple BDR',preco:'52.45',abertura:'51.80',maxima:'53.10',minima:'51.55',variacao_dia:'1.26',volume:'8765400',data:'2026-06-13' },
  { ticker:'AMZO34',empresa:'Amazon BDR',preco:'58.92',abertura:'58.10',maxima:'59.75',minima:'57.85',variacao_dia:'1.41',volume:'7654300',data:'2026-06-13' },
  { ticker:'MSFT34',empresa:'Microsoft BDR',preco:'68.35',abertura:'67.60',maxima:'69.10',minima:'67.25',variacao_dia:'1.11',volume:'6543200',data:'2026-06-13' },
  { ticker:'GOGL34',empresa:'Alphabet BDR',preco:'42.18',abertura:'41.65',maxima:'42.75',minima:'41.40',variacao_dia:'1.27',volume:'5432100',data:'2026-06-13' },
  { ticker:'NFLX34',empresa:'Netflix BDR',preco:'38.67',abertura:'38.10',maxima:'39.25',minima:'37.85',variacao_dia:'1.50',volume:'4321800',data:'2026-06-13' },
  { ticker:'TSLA34',empresa:'Tesla BDR',preco:'45.82',abertura:'45.10',maxima:'46.50',minima:'44.85',variacao_dia:'1.60',volume:'9876500',data:'2026-06-13' },
  { ticker:'NVDA34',empresa:'NVIDIA BDR',preco:'72.15',abertura:'71.20',maxima:'73.05',minima:'70.85',variacao_dia:'1.33',volume:'8765400',data:'2026-06-13' },
  { ticker:'META34',empresa:'Meta Platforms BDR',preco:'48.90',abertura:'48.20',maxima:'49.55',minima:'47.95',variacao_dia:'1.45',volume:'7654300',data:'2026-06-13' },
  { ticker:'DISB34',empresa:'Disney BDR',preco:'28.45',abertura:'28.00',maxima:'28.90',minima:'27.75',variacao_dia:'1.61',volume:'3214560',data:'2026-06-13' },
  { ticker:'INTC34',empresa:'Intel BDR',preco:'18.92',abertura:'18.55',maxima:'19.25',minima:'18.40',variacao_dia:'2.00',volume:'6543200',data:'2026-06-13' },
  { ticker:'COCA34',empresa:'Coca-Cola BDR',preco:'52.30',abertura:'51.75',maxima:'52.85',minima:'51.50',variacao_dia:'1.06',volume:'4321800',data:'2026-06-13' },
  { ticker:'JPMB34',empresa:'JP Morgan BDR',preco:'68.75',abertura:'68.00',maxima:'69.40',minima:'67.75',variacao_dia:'1.10',volume:'2876540',data:'2026-06-13' },
  { ticker:'BOAC34',empresa:'Bank of America BDR',preco:'32.18',abertura:'31.75',maxima:'32.65',minima:'31.55',variacao_dia:'1.35',volume:'5432100',data:'2026-06-13' },
  { ticker:'WALM34',empresa:'Walmart BDR',preco:'45.67',abertura:'45.10',maxima:'46.25',minima:'44.85',variacao_dia:'1.26',volume:'3214560',data:'2026-06-13' },
  { ticker:'MELI34',empresa:'MercadoLibre BDR',preco:'285.40',abertura:'282.50',maxima:'288.75',minima:'281.20',variacao_dia:'1.03',volume:'876540',data:'2026-06-13' },
  { ticker:'BABA34',empresa:'Alibaba BDR',preco:'42.85',abertura:'42.20',maxima:'43.50',minima:'41.95',variacao_dia:'1.54',volume:'6543200',data:'2026-06-13' },
  { ticker:'MCDO34',empresa:"McDonald's BDR",preco:'58.23',abertura:'57.65',maxima:'58.90',minima:'57.40',variacao_dia:'1.01',volume:'1987650',data:'2026-06-13' },
  { ticker:'NIKE34',empresa:'Nike BDR',preco:'38.45',abertura:'37.90',maxima:'39.05',minima:'37.65',variacao_dia:'1.45',volume:'2876540',data:'2026-06-13' },
  { ticker:'PYPL34',empresa:'PayPal BDR',preco:'22.67',abertura:'22.20',maxima:'23.05',minima:'22.05',variacao_dia:'2.12',volume:'4321800',data:'2026-06-13' },
  { ticker:'UBER34',empresa:'Uber BDR',preco:'35.82',abertura:'35.25',maxima:'36.45',minima:'35.00',variacao_dia:'1.62',volume:'5432100',data:'2026-06-13' },
  { ticker:'GOLD34',empresa:'Barrick Gold BDR',preco:'18.45',abertura:'18.10',maxima:'18.75',minima:'17.95',variacao_dia:'1.93',volume:'3214560',data:'2026-06-13' },
  { ticker:'EXXO34',empresa:'Exxon Mobil BDR',preco:'62.18',abertura:'61.50',maxima:'62.85',minima:'61.20',variacao_dia:'1.10',volume:'2543210',data:'2026-06-13' },
  { ticker:'BMYB34',empresa:'Bristol Myers Squibb BDR',preco:'28.92',abertura:'28.45',maxima:'29.35',minima:'28.20',variacao_dia:'1.65',volume:'1987650',data:'2026-06-13' },
  { ticker:'PFEE34',empresa:'Pfizer BDR',preco:'24.35',abertura:'24.00',maxima:'24.65',minima:'23.85',variacao_dia:'1.46',volume:'2876540',data:'2026-06-13' },
  { ticker:'VISA34',empresa:'Visa BDR',preco:'78.42',abertura:'77.60',maxima:'79.25',minima:'77.35',variacao_dia:'1.06',volume:'1654320',data:'2026-06-13' },
  { ticker:'MAST34',empresa:'Mastercard BDR',preco:'82.65',abertura:'81.80',maxima:'83.40',minima:'81.50',variacao_dia:'1.04',volume:'1432100',data:'2026-06-13' }
];

