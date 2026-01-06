import { MinicartItem } from './minicart';

export interface OrderType {
  _id: string;
  cardId: string;
  nome_cliente: string;
  status_pedido:
    | 'Em preparação'
    | 'A caminho'
    | 'Entregue'
    | 'Cancelado'
    | 'Pendente';
  endereco: string;
  pedido:
    | {
        pizza_sabor: string;
        tamanho?: 'Grande' | 'Média' | 'Pequena';
        quantidade: number;
        observacoes?: string;
      }
    | MinicartItem[];
}
