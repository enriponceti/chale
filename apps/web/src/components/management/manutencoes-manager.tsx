"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  type ChaleListItem,
  type ManutencaoInput,
  type ManutencaoListItem,
  type ReservaEntity
} from "../../lib/api";
import { capitalize, formatCurrency } from "../../lib/format";
import { PageHeader } from "../ui/page-header";

type Props = {
  initialManutencoes: ManutencaoListItem[];
  initialChales: ChaleListItem[];
  initialReservas: ReservaEntity[];
};

const emptyForm = (chales: ChaleListItem[]): ManutencaoInput => ({
  idChale: chales[0]?.id ?? 0,
  tipoManutencao: "corretiva",
  descricaoProblema: "",
  dataAbertura: new Date().toISOString().slice(0, 10),
  dataInicio: "",
  dataFim: "",
  status: "aberta",
  responsavel: "",
  fornecedor: "",
  custo: 0,
  observacao: ""
});

function validateForm(form: ManutencaoInput) {
  const errors: string[] = [];

  if (!form.idChale) {
    errors.push("Selecione um chale.");
  }

  if (form.descricaoProblema.trim().length < 5) {
    errors.push("Descricao do problema deve ter pelo menos 5 caracteres.");
  }

  if (!form.dataAbertura) {
    errors.push("Data de abertura deve ser informada.");
  }

  if (form.custo < 0) {
    errors.push("Custo nao pode ser negativo.");
  }

  return errors;
}

export function ManutencoesManager({
  initialManutencoes,
  initialChales,
  initialReservas
}: Props) {
  const { session } = useAuth();
  const [manutencoes, setManutencoes] = useState(initialManutencoes);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ManutencaoInput>(() => emptyForm(initialChales));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeItem, setActiveItem] = useState<ManutencaoListItem | null>(null);

  function getAvailableChales(currentChaleId?: number) {
    const activeReservationStatuses = new Set(["pendente", "confirmada", "hospedado"]);
    const activeMaintenanceStatuses = new Set(["aberta", "em_andamento"]);

    const reservedChaleIds = new Set(
      initialReservas
        .filter((item) => activeReservationStatuses.has(item.statusReserva))
        .map((item) => item.idChale)
    );

    const maintenanceChaleIds = new Set(
      manutencoes
        .filter(
          (item) =>
            activeMaintenanceStatuses.has(item.status) &&
            (currentChaleId === undefined || item.idChale !== currentChaleId || item.id === editingId)
        )
        .map((item) => item.idChale)
    );

    return initialChales.filter((chale) => {
      if (currentChaleId === chale.id) {
        return true;
      }

      return !reservedChaleIds.has(chale.id) && !maintenanceChaleIds.has(chale.id);
    });
  }

  function handleOpenMenu(event: React.MouseEvent<HTMLElement>, item: ManutencaoListItem) {
    setMenuAnchorEl(event.currentTarget);
    setActiveItem(item);
  }

  function handleCloseMenu() {
    setMenuAnchorEl(null);
    setActiveItem(null);
  }

  function handleOpenCreate() {
    setEditingId(null);
    setForm(emptyForm(getAvailableChales()));
    setError(null);
    setOpen(true);
  }

  function handleOpenEdit(item: ManutencaoListItem) {
    setEditingId(item.id);
    setForm({
      idChale: item.idChale,
      tipoManutencao: item.tipoManutencao as ManutencaoInput["tipoManutencao"],
      descricaoProblema: item.descricaoProblema,
      dataAbertura: item.dataAbertura,
      dataInicio: item.dataInicio,
      dataFim: item.dataFim,
      status: item.status as ManutencaoInput["status"],
      responsavel: item.responsavel,
      fornecedor: item.fornecedor,
      custo: item.custo,
      observacao: item.observacao
    });
    setError(null);
    setOpen(true);
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    setOpen(false);
  }

  async function handleSubmit() {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    const payload: ManutencaoInput = {
      ...form,
      descricaoProblema: form.descricaoProblema.trim(),
      responsavel: form.responsavel.trim(),
      fornecedor: form.fornecedor.trim(),
      observacao: form.observacao.trim(),
      custo: Number(form.custo)
    };

    const validationErrors = validateForm(payload);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const nextItem = editingId
        ? await authorizedJson<ManutencaoListItem>(`/manutencoes/${editingId}`, session.token, {
            method: "PUT",
            body: JSON.stringify(payload)
          })
        : await authorizedJson<ManutencaoListItem>("/manutencoes", session.token, {
            method: "POST",
            body: JSON.stringify(payload)
          });

      setManutencoes((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? nextItem : item))
          : [nextItem, ...current]
      );
      setOpen(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel salvar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(item: ManutencaoListItem) {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    const confirmed = window.confirm(`Excluir a manutenção #${item.id}?`);
    if (!confirmed) {
      return;
    }

    try {
      await authorizedJson(`/manutencoes/${item.id}`, session.token, {
        method: "DELETE"
      });
      setManutencoes((current) => current.filter((entry) => entry.id !== item.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir.");
    }
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Manutenção"
        title="Operacao tecnica dos chales"
        description="Controle as manutenções preventivas e corretivas com impacto direto na disponibilidade dos chales."
        action={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleOpenCreate}>
            Nova manutenção
          </Button>
        }
      />

      {error ? <Alert severity="error">{error}</Alert> : null}

      <TableContainer
        component={Paper}
        sx={{
          overflow: "hidden",
          border: "1px solid rgba(15, 107, 99, 0.08)",
          borderRadius: 3
        }}
      >
        <Table sx={{ minWidth: 1120 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Chale</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Problema</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Datas</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Responsavel</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Custo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, pr: 3 }}>Acoes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manutencoes.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell sx={{ minWidth: 220 }}>
                  <Typography fontWeight={700}>{item.chaleNome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.chaleCodigo}
                  </Typography>
                </TableCell>
                <TableCell>{capitalize(item.tipoManutencao)}</TableCell>
                <TableCell sx={{ minWidth: 280 }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.descricaoProblema}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={capitalize(item.status)}
                    color={
                      item.status === "concluida"
                        ? "success"
                        : item.status === "cancelada"
                          ? "default"
                          : "warning"
                    }
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    Abertura: {item.dataAbertura || "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inicio: {item.dataInicio || "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fim: {item.dataFim || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {item.responsavel || item.fornecedor || "-"}
                  </Typography>
                </TableCell>
                <TableCell align="right">{formatCurrency(item.custo)}</TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", pr: 2 }}>
                  <IconButton onClick={(event) => handleOpenMenu(event, item)} aria-label="Ações da manutenção">
                    <SettingsRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl && activeItem)} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            if (!activeItem) {
              return;
            }
            const target = activeItem;
            handleCloseMenu();
            handleOpenEdit(target);
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!activeItem) {
              return;
            }
            const target = activeItem;
            handleCloseMenu();
            void handleDelete(target);
          }}
        >
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? "Editar manutenção" : "Nova manutenção"}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              pt: 1,
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))"
              }
            }}
          >
            <TextField
              select
              label="Chale"
              value={form.idChale}
              onChange={(event) =>
                setForm((current) => ({ ...current, idChale: Number(event.target.value) }))
              }
            >
              {getAvailableChales(editingId ? form.idChale : undefined).map((chale) => (
                <MenuItem key={chale.id} value={chale.id}>
                  {chale.nome}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Tipo de manutenção"
              value={form.tipoManutencao}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  tipoManutencao: event.target.value as ManutencaoInput["tipoManutencao"]
                }))
              }
            >
              <MenuItem value="preventiva">Preventiva</MenuItem>
              <MenuItem value="corretiva">Corretiva</MenuItem>
              <MenuItem value="limpeza">Limpeza</MenuItem>
              <MenuItem value="inspescao">Inspescao</MenuItem>
            </TextField>
            <TextField
              label="Descrição do problema"
              value={form.descricaoProblema}
              onChange={(event) =>
                setForm((current) => ({ ...current, descricaoProblema: event.target.value }))
              }
              multiline
              minRows={3}
              sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}
            />
            <TextField
              label="Data de abertura"
              type="date"
              value={form.dataAbertura}
              onChange={(event) =>
                setForm((current) => ({ ...current, dataAbertura: event.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as ManutencaoInput["status"]
                }))
              }
            >
              <MenuItem value="aberta">Aberta</MenuItem>
              <MenuItem value="em_andamento">Em andamento</MenuItem>
              <MenuItem value="concluida">Concluída</MenuItem>
              <MenuItem value="cancelada">Cancelada</MenuItem>
            </TextField>
            <TextField
              label="Data de início"
              type="date"
              value={form.dataInicio}
              onChange={(event) =>
                setForm((current) => ({ ...current, dataInicio: event.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Data de fim"
              type="date"
              value={form.dataFim}
              onChange={(event) =>
                setForm((current) => ({ ...current, dataFim: event.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Responsavel"
              value={form.responsavel}
              onChange={(event) =>
                setForm((current) => ({ ...current, responsavel: event.target.value }))
              }
            />
            <TextField
              label="Fornecedor"
              value={form.fornecedor}
              onChange={(event) =>
                setForm((current) => ({ ...current, fornecedor: event.target.value }))
              }
            />
            <TextField
              label="Custo"
              type="number"
              value={form.custo}
              onChange={(event) =>
                setForm((current) => ({ ...current, custo: Number(event.target.value) }))
              }
            />
            <TextField
              label="Observação"
              value={form.observacao}
              onChange={(event) =>
                setForm((current) => ({ ...current, observacao: event.target.value }))
              }
              multiline
              minRows={3}
              sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
