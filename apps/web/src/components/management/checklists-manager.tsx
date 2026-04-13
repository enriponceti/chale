"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../auth/auth-provider";
import {
  authorizedJson,
  type ChecklistItemModeloInput,
  type ChecklistItemModeloListItem,
  type ChecklistLimpezaInput,
  type ChecklistLimpezaItemInput,
  type ChecklistLimpezaListItem,
  type ManutencaoListItem
} from "../../lib/api";
import { capitalize } from "../../lib/format";
import { PageHeader } from "../ui/page-header";

type Props = {
  initialModelos: ChecklistItemModeloListItem[];
  initialChecklists: ChecklistLimpezaListItem[];
  initialManutencoes: ManutencaoListItem[];
};

const emptyModeloForm: ChecklistItemModeloInput = {
  descricao: "",
  area: "quarto",
  obrigatorio: true,
  ordem: 1,
  status: "ativo"
};

const emptyChecklistItem = (): ChecklistLimpezaItemInput => ({
  idItemModelo: 0,
  descricao: "",
  statusItem: "pendente",
  dataExecucao: new Date().toISOString().slice(0, 10),
  observacao: ""
});

const buildEmptyChecklistForm = (manutencoes: ManutencaoListItem[]): ChecklistLimpezaInput => ({
  idManutencao: manutencoes[0]?.id ?? 0,
  dataInicio: new Date().toISOString().slice(0, 10),
  dataFim: "",
  status: "aberto",
  observacao: "",
  itens: [emptyChecklistItem()]
});

export function ChecklistsManager({
  initialModelos,
  initialChecklists,
  initialManutencoes
}: Props) {
  const { session } = useAuth();
  const [modelos, setModelos] = useState(initialModelos);
  const [checklists, setChecklists] = useState(initialChecklists);
  const [modeloOpen, setModeloOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [editingModeloId, setEditingModeloId] = useState<number | null>(null);
  const [editingChecklistId, setEditingChecklistId] = useState<number | null>(null);
  const [modeloForm, setModeloForm] = useState<ChecklistItemModeloInput>(emptyModeloForm);
  const [checklistForm, setChecklistForm] = useState<ChecklistLimpezaInput>(() =>
    buildEmptyChecklistForm(initialManutencoes)
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuType, setMenuType] = useState<"modelo" | "checklist" | null>(null);
  const [activeModelo, setActiveModelo] = useState<ChecklistItemModeloListItem | null>(null);
  const [activeChecklist, setActiveChecklist] = useState<ChecklistLimpezaListItem | null>(null);

  function handleOpenModeloCreate() {
    setEditingModeloId(null);
    setModeloForm(emptyModeloForm);
    setError(null);
    setModeloOpen(true);
  }

  function handleOpenChecklistCreate() {
    setEditingChecklistId(null);
    setChecklistForm(buildEmptyChecklistForm(initialManutencoes));
    setError(null);
    setChecklistOpen(true);
  }

  function handleOpenModeloEdit(item: ChecklistItemModeloListItem) {
    setEditingModeloId(item.id);
    setModeloForm({
      descricao: item.descricao,
      area: item.area,
      obrigatorio: item.obrigatorio,
      ordem: item.ordem,
      status: item.status
    });
    setError(null);
    setModeloOpen(true);
  }

  function handleOpenChecklistEdit(item: ChecklistLimpezaListItem) {
    setEditingChecklistId(item.id);
    setChecklistForm({
      idManutencao: item.idManutencao,
      dataInicio: item.dataInicio,
      dataFim: item.dataFim,
      status: item.status,
      observacao: item.observacao,
      itens: item.itens.map((entry) => ({
        idItemModelo: entry.idItemModelo,
        descricao: entry.descricao,
        statusItem: entry.statusItem,
        dataExecucao: entry.dataExecucao,
        observacao: entry.observacao
      }))
    });
    setError(null);
    setChecklistOpen(true);
  }

  function handleOpenModeloMenu(event: React.MouseEvent<HTMLElement>, item: ChecklistItemModeloListItem) {
    setMenuAnchorEl(event.currentTarget);
    setMenuType("modelo");
    setActiveModelo(item);
    setActiveChecklist(null);
  }

  function handleOpenChecklistMenu(event: React.MouseEvent<HTMLElement>, item: ChecklistLimpezaListItem) {
    setMenuAnchorEl(event.currentTarget);
    setMenuType("checklist");
    setActiveChecklist(item);
    setActiveModelo(null);
  }

  function handleCloseMenu() {
    setMenuAnchorEl(null);
    setMenuType(null);
    setActiveModelo(null);
    setActiveChecklist(null);
  }

  async function handleSubmitModelo() {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const nextItem = editingModeloId
        ? await authorizedJson<ChecklistItemModeloListItem>(
            `/checklist-modelos/${editingModeloId}`,
            session.token,
            {
              method: "PUT",
              body: JSON.stringify(modeloForm)
            }
          )
        : await authorizedJson<ChecklistItemModeloListItem>("/checklist-modelos", session.token, {
            method: "POST",
            body: JSON.stringify(modeloForm)
          });

      setModelos((current) =>
        editingModeloId
          ? current.map((item) => (item.id === editingModeloId ? nextItem : item))
          : [...current, nextItem].sort((a, b) => a.ordem - b.ordem)
      );
      setModeloOpen(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel salvar o modelo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmitChecklist() {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const nextItem = editingChecklistId
        ? await authorizedJson<ChecklistLimpezaListItem>(
            `/checklists-limpeza/${editingChecklistId}`,
            session.token,
            {
              method: "PUT",
              body: JSON.stringify(checklistForm)
            }
          )
        : await authorizedJson<ChecklistLimpezaListItem>("/checklists-limpeza", session.token, {
            method: "POST",
            body: JSON.stringify(checklistForm)
          });

      setChecklists((current) =>
        editingChecklistId
          ? current.map((item) => (item.id === editingChecklistId ? nextItem : item))
          : [nextItem, ...current]
      );
      setChecklistOpen(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel salvar o checklist.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteModelo(item: ChecklistItemModeloListItem) {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    if (!window.confirm(`Excluir o modelo ${item.descricao}?`)) {
      return;
    }

    try {
      await authorizedJson(`/checklist-modelos/${item.id}`, session.token, { method: "DELETE" });
      setModelos((current) => current.filter((entry) => entry.id !== item.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir o modelo.");
    }
  }

  async function handleDeleteChecklist(item: ChecklistLimpezaListItem) {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    if (!window.confirm(`Excluir o checklist #${item.id}?`)) {
      return;
    }

    try {
      await authorizedJson(`/checklists-limpeza/${item.id}`, session.token, { method: "DELETE" });
      setChecklists((current) => current.filter((entry) => entry.id !== item.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir o checklist.");
    }
  }

  function updateChecklistItem(index: number, patch: Partial<ChecklistLimpezaItemInput>) {
    setChecklistForm((current) => ({
      ...current,
      itens: current.itens.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    }));
  }

  function addChecklistItem() {
    setChecklistForm((current) => ({
      ...current,
      itens: [...current.itens, emptyChecklistItem()]
    }));
  }

  function removeChecklistItem(index: number) {
    setChecklistForm((current) => ({
      ...current,
      itens: current.itens.filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Checklists"
        title="Modelos e execucoes operacionais"
        description="Gerencie os modelos padronizados e os checklists reais vinculados a manutencoes."
      />

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 1fr) minmax(0, 1.35fr)"
          }
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Modelos de checklist
            </Typography>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleOpenModeloCreate}>
              Novo modelo
            </Button>
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descricao</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Obrigatorio</TableCell>
                  <TableCell>Ordem</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Acoes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modelos.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>{capitalize(item.area)}</TableCell>
                    <TableCell>{item.obrigatorio ? "Sim" : "Nao"}</TableCell>
                    <TableCell>{item.ordem}</TableCell>
                    <TableCell>
                      <Chip label={capitalize(item.status)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleOpenModeloMenu(event, item)}>
                        <SettingsRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>

        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Checklists de limpeza
            </Typography>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleOpenChecklistCreate}>
              Novo checklist
            </Button>
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Chale</TableCell>
                  <TableCell>Manutenção</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Periodo</TableCell>
                  <TableCell>Itens</TableCell>
                  <TableCell align="right">Acoes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {checklists.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.chaleNome}</TableCell>
                    <TableCell>{item.manutencaoDescricao}</TableCell>
                    <TableCell>
                      <Chip label={capitalize(item.status)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        Inicio: {item.dataInicio}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fim: {item.dataFim || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.itens.length}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleOpenChecklistMenu(event, item)}>
                        <SettingsRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}>
        {menuType === "modelo" && activeModelo ? (
          <Box>
            <MenuItem
              onClick={() => {
                const target = activeModelo;
                handleCloseMenu();
                handleOpenModeloEdit(target);
              }}
            >
              <ListItemIcon>
                <EditRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                const target = activeModelo;
                handleCloseMenu();
                void handleDeleteModelo(target);
              }}
            >
              <ListItemIcon>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Excluir</ListItemText>
            </MenuItem>
          </Box>
        ) : null}

        {menuType === "checklist" && activeChecklist ? (
          <Box>
            <MenuItem
              onClick={() => {
                const target = activeChecklist;
                handleCloseMenu();
                handleOpenChecklistEdit(target);
              }}
            >
              <ListItemIcon>
                <EditRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                const target = activeChecklist;
                handleCloseMenu();
                void handleDeleteChecklist(target);
              }}
            >
              <ListItemIcon>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Excluir</ListItemText>
            </MenuItem>
          </Box>
        ) : null}
      </Menu>

      <Dialog open={modeloOpen} onClose={() => !isSubmitting && setModeloOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingModeloId ? "Editar modelo" : "Novo modelo"}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
            <TextField
              label="Descricao"
              value={modeloForm.descricao}
              onChange={(event) => setModeloForm((current) => ({ ...current, descricao: event.target.value }))}
              sx={{ gridColumn: "1 / -1" }}
            />
            <TextField
              label="Area"
              value={modeloForm.area}
              onChange={(event) => setModeloForm((current) => ({ ...current, area: event.target.value }))}
            />
            <TextField
              label="Ordem"
              type="number"
              value={modeloForm.ordem}
              onChange={(event) => setModeloForm((current) => ({ ...current, ordem: Number(event.target.value) }))}
            />
            <TextField
              select
              label="Status"
              value={modeloForm.status}
              onChange={(event) => setModeloForm((current) => ({ ...current, status: event.target.value }))}
            >
              <MenuItem value="ativo">Ativo</MenuItem>
              <MenuItem value="inativo">Inativo</MenuItem>
            </TextField>
            <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
              <Checkbox
                checked={modeloForm.obrigatorio}
                onChange={(event) => setModeloForm((current) => ({ ...current, obrigatorio: event.target.checked }))}
              />
              <Typography>Obrigatorio</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setModeloOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmitModelo} variant="contained" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={checklistOpen} onClose={() => !isSubmitting && setChecklistOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>{editingChecklistId ? "Editar checklist" : "Novo checklist"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                select
                label="Manutenção"
                value={checklistForm.idManutencao}
                onChange={(event) =>
                  setChecklistForm((current) => ({ ...current, idManutencao: Number(event.target.value) }))
                }
                fullWidth
              >
                {initialManutencoes.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.chaleNome} - {item.descricaoProblema}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Status"
                value={checklistForm.status}
                onChange={(event) =>
                  setChecklistForm((current) => ({
                    ...current,
                    status: event.target.value as ChecklistLimpezaInput["status"]
                  }))
                }
                fullWidth
              >
                <MenuItem value="aberto">Aberto</MenuItem>
                <MenuItem value="em_andamento">Em andamento</MenuItem>
                <MenuItem value="concluido">Concluido</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Data inicio"
                type="date"
                value={checklistForm.dataInicio}
                onChange={(event) =>
                  setChecklistForm((current) => ({ ...current, dataInicio: event.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Data fim"
                type="date"
                value={checklistForm.dataFim}
                onChange={(event) =>
                  setChecklistForm((current) => ({ ...current, dataFim: event.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>

            <TextField
              label="Observacao"
              value={checklistForm.observacao}
              onChange={(event) =>
                setChecklistForm((current) => ({ ...current, observacao: event.target.value }))
              }
              multiline
              minRows={2}
            />

            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Itens do checklist
              </Typography>
              <Button onClick={addChecklistItem} startIcon={<AddRoundedIcon />}>
                Adicionar item
              </Button>
            </Stack>

            {checklistForm.itens.map((item, index) => (
              <Box key={`${index}-${item.idItemModelo}`} sx={{ p: 2, border: "1px solid #dee2e6", borderRadius: 2 }}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      select
                      label="Modelo"
                      value={item.idItemModelo}
                      onChange={(event) => {
                        const modelo = initialModelos.find(
                          (entry) => entry.id === Number(event.target.value)
                        );
                        updateChecklistItem(index, {
                          idItemModelo: Number(event.target.value),
                          descricao: modelo?.descricao ?? ""
                        });
                      }}
                      fullWidth
                    >
                      {initialModelos.map((modelo) => (
                        <MenuItem key={modelo.id} value={modelo.id}>
                          {modelo.descricao}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Status do item"
                      value={item.statusItem}
                      onChange={(event) =>
                        updateChecklistItem(index, {
                          statusItem: event.target.value as ChecklistLimpezaItemInput["statusItem"]
                        })
                      }
                      fullWidth
                    >
                      <MenuItem value="pendente">Pendente</MenuItem>
                      <MenuItem value="concluido">Concluido</MenuItem>
                      <MenuItem value="nao_aplicavel">Nao aplicavel</MenuItem>
                    </TextField>
                  </Stack>

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      label="Descricao"
                      value={item.descricao}
                      onChange={(event) =>
                        updateChecklistItem(index, { descricao: event.target.value })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Data execucao"
                      type="date"
                      value={item.dataExecucao}
                      onChange={(event) =>
                        updateChecklistItem(index, { dataExecucao: event.target.value })
                      }
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Stack>

                  <TextField
                    label="Observacao"
                    value={item.observacao}
                    onChange={(event) =>
                      updateChecklistItem(index, { observacao: event.target.value })
                    }
                    fullWidth
                  />

                  <Box>
                    <Button color="error" onClick={() => removeChecklistItem(index)} disabled={checklistForm.itens.length === 1}>
                      Remover item
                    </Button>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setChecklistOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmitChecklist} variant="contained" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
