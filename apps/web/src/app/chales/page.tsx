import { ChalesManager } from "../../components/management/chales-manager";
import { getChales } from "../../lib/api";

export default async function ChalesPage() {
  const chales = await getChales();

  return <ChalesManager initialChales={chales} />;
}
