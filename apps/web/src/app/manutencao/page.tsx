import { ManutencoesManager } from "../../components/management/manutencoes-manager";
import { getChales, getManutencoes, getReservasDetalhadas } from "../../lib/api";

export default async function ManutencaoPage() {
  const [manutencoes, chales, reservas] = await Promise.all([
    getManutencoes(),
    getChales(),
    getReservasDetalhadas()
  ]);

  return (
    <ManutencoesManager
      initialManutencoes={manutencoes}
      initialChales={chales}
      initialReservas={reservas}
    />
  );
}
