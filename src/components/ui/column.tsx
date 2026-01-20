import { useDroppable } from "@dnd-kit/core";
import { ColumnType } from "@/model/columnType";
import { OrderType } from "@/model/orderType";
import { DraggableOrderCard } from "./orderCard";

interface ColumnProps {
  column: ColumnType;
  orders: OrderType[];
  activeOrder: OrderType | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDENTE':
    case 'Pendente':
      return 'border-yellow-400 text-yellow-600 bg-yellow-50';
    case 'EM_PREPARACAO':
    case 'Em preparação':
      return 'border-blue-500 text-blue-600 bg-blue-50';
    case 'A_CAMINHO':
    case 'A caminho':
      return 'border-purple-500 text-purple-600 bg-purple-50';
    case 'ENTREGUE':
    case 'Entregue':
      return 'border-green-500 text-green-600 bg-green-50';
    case 'CANCELADO':
    case 'Cancelado':
      return 'border-red-500 text-red-600 bg-red-50';
    default:
      return 'border-gray-300 text-gray-600 bg-gray-50';
  }
};

const getBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700';
      case 'EM_PREPARACAO':
      case 'Em preparação':
        return 'bg-blue-100 text-blue-700';
      case 'A_CAMINHO':
      case 'A caminho':
        return 'bg-purple-100 text-purple-700';
      case 'ENTREGUE':
      case 'Entregue':
        return 'bg-green-100 text-green-700';
      case 'CANCELADO':
      case 'Cancelado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

export default function Column ({column, orders, activeOrder}: ColumnProps) {
  const {setNodeRef} = useDroppable({
    id: column.id,
  });

  const borderColorClass = getStatusColor(column.id).split(' ')[0]; // Extract just the border color
  const badgeColorClass = getBadgeColor(column.id);

  return(
    <div ref={setNodeRef} className="w-[85vw] min-w-[85vw] md:w-[350px] md:min-w-[350px] h-full max-h-full flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className={`p-4 border-b-4 ${borderColorClass} rounded-t-xl flex justify-between items-center bg-white shrink-0`}>
            <h2 className="font-bold text-gray-800 text-lg">{column.title}</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeColorClass}`}>
                {orders.length}
            </span>
        </div>

        {/* Orders Container */}
        <div className="flex-1 p-3 overflow-y-auto min-h-0 space-y-3 bg-gray-50/50">
            {orders.map((order) => {
                return <DraggableOrderCard key={order.cardId} order={order} isDragging={activeOrder?.cardId === order.cardId} />
            })}
            {orders.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">
                    Sem pedidos
                </div>
            )}
        </div>
    </div>
  )
}
