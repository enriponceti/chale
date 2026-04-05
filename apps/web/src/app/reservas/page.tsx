import { ReservasManager } from "../../components/management/reservas-manager";
import { getChales, getClientes, getReservasDetalhadas } from "../../lib/api";

export default async function ReservasPage() {
  const [reservas, chales, clientes] = await Promise.all([
    getReservasDetalhadas(),
    getChales(),
    getClientes()
  ]);

  return (
    <ReservasManager
      initialReservas={reservas}
      initialChales={chales}
      initialClientes={clientes}
    />
  );
}
