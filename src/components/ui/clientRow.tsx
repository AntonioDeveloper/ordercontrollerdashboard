import { ClientType } from "@/model/clientType";

interface ClientRow {
  clients: ClientType[];  
}

export default function ClientRow({ clients }: ClientRow) {

  return (
    <>
    {clients.map((client: ClientType) => (
      <tr key={client._id} className="w-full">
        <td className="w-1/12 border border-gray-300 px-4 py-2">{client._id}</td>
        <td className="w-1/12 border border-gray-300 px-4 py-2">{client.nome_cliente}</td>
        <td className="w-1/12 border border-gray-300 px-4 py-2">{client.endereco}</td>
        <td className="w-1/12 border border-gray-300 px-4 py-2">{client.telefone}</td>
        <td className="w-1/12 border border-gray-300 px-4 py-2">{client.email}</td>
      </tr>
    ))}
    </>
  )
}