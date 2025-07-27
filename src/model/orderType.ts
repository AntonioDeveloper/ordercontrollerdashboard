export interface OrderType {
  id: string;
  nome_cliente: string;
  status_pedido:
    | 'Em preparação'
    | 'A caminho'
    | 'Entregue'
    | 'Cancelado'
    | 'Pendente';
  endereco: string;
  pedido: {
    pizza_sabor: string;
    tamanho: 'Grande' | 'Média' | 'Pequena';
    quantidade: number;
    observacoes: string;
  };
}
