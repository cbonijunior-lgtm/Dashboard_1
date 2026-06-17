// Ajuste aqui se a tabela/colunas no Supabase tiverem nomes diferentes.
// Valor da esquerda = campo usado pelo dashboard; valor da direita = coluna no Supabase.

const SUPABASE_SCHEMA = {
  table: 'cotacoes',
  columns: {
    ticker: 'ticker',
    empresa: 'empresa',
    preco: 'preco',
    abertura: 'abertura',
    maxima: 'maxima',
    minima: 'minima',
    variacao_dia: 'variacao_dia',
    volume: 'volume',
    data: 'data'
  }
};

function mapSupabaseRow(row) {
  const c = SUPABASE_SCHEMA.columns;
  const rawDate = row[c.data];

  return {
    ticker: row[c.ticker],
    empresa: row[c.empresa],
    preco: String(row[c.preco]),
    abertura: String(row[c.abertura]),
    maxima: String(row[c.maxima]),
    minima: String(row[c.minima]),
    variacao_dia: String(row[c.variacao_dia]),
    volume: String(row[c.volume]),
    data: typeof rawDate === 'string' ? rawDate.slice(0, 10) : rawDate
  };
}
