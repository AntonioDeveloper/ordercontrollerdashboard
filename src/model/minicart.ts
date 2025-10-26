export interface MinicartItem {
  nome_item: string;
  tamanho?: 'Grande' | 'Média' | 'Pequena';
  quantidade: number;
  observacoes?: string;
}
