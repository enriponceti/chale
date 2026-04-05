import { ComodidadesManager } from "../../components/management/comodidades-manager";
import { getComodidades } from "../../lib/api";

export default async function ComodidadesPage() {
  const comodidades = await getComodidades();

  return <ComodidadesManager initialComodidades={comodidades} />;
}
