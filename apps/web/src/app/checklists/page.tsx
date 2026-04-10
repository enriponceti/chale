import { ChecklistsManager } from "../../components/management/checklists-manager";
import {
  getChecklistModelos,
  getChecklistsLimpeza,
  getManutencoes
} from "../../lib/api";

export default async function ChecklistsPage() {
  const [modelos, checklists, manutencoes] = await Promise.all([
    getChecklistModelos(),
    getChecklistsLimpeza(),
    getManutencoes()
  ]);

  return (
    <ChecklistsManager
      initialModelos={modelos}
      initialChecklists={checklists}
      initialManutencoes={manutencoes}
    />
  );
}
