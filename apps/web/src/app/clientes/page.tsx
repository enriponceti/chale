import { ClientesManager } from "../../components/management/clientes-manager";
import { getClientes } from "../../lib/api";

export default async function ClientesPage() {
  const clientes = await getClientes();

  return <ClientesManager initialClientes={clientes} />;
}
