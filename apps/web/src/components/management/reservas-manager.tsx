"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {
  Alert,
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
  type ClienteListItem,
  type ReservaEntity,
  type ReservaInput
} from "../../lib/api";
import { capitalize, formatCurrency, formatDateRange } from "../../lib/format";
import { PageHeader } from "../ui/page-header";

type Props = {
  initialReservas: ReservaEntity[];
  initialChales: ChaleListItem[];
  initialClientes: ClienteListItem[];
};

const statusColor: Record<string, "success" | "warning" | "info" | "default"> = {
  confirmada: "success",
  pendente: "warning",
  hospedado: "info",
  finalizada: "default",
  cancelada: "default",
  no_show: "default"
};

function safeValue(value?: string | null) {
  return value && value.trim() ? value : "";
}

function buildEmptyForm(chales: ChaleListItem[], clientes: ClienteListItem[]): ReservaInput {
  return {
    idChale: chales[0]?.id ?? 0,
    idCliente: clientes[0]?.id ?? 0,
    dataCheckinPrevisto: "",
    dataCheckoutPrevisto: "",
    dataCheckinReal: "",
    dataCheckoutReal: "",
    qtdAdultos: 2,
    qtdCriancas: 0,
    valorDiariaAplicada: chales[0]?.valorDiariaBase ?? 0,
    valorDesconto: 0,
    valorTaxaLimpeza: 0,
    valorTaxaExtra: 0,
    statusReserva: "pendente",
    origemReserva: "site",
    observacao: ""
  };
}

export function ReservasManager({ initialReservas, initialChales, initialClientes }: Props) {
  const { session } = useAuth();
  const [reservas, setReservas] = useState(initialReservas);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ReservaInput>(() => buildEmptyForm(initialChales, initialClientes));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeReserva, setActiveReserva] = useState<ReservaEntity | null>(null);

  function handleOpenMenu(event: React.MouseEvent<HTMLElement>, reserva: ReservaEntity) {
    setMenuAnchorEl(event.currentTarget);
    setActiveReserva(reserva);
  }

  function handleCloseMenu() {
    setMenuAnchorEl(null);
    setActiveReserva(null);
  }

  function getChaleName(id: number) {
    return initialChales.find((item) => item.id === id)?.nome ?? "Chale nao encontrado";
  }

  function getClienteName(id: number) {
    return initialClientes.find((item) => item.id === id)?.nomeCompleto ?? "Cliente nao encontrado";
  }

  function syncChalePrice(chaleId: number) {
    const chale = initialChales.find((item) => item.id === chaleId);
    return chale?.valorDiariaBase ?? 0;
  }

  function handleOpenCreate() {
    setEditingId(null);
    setForm(buildEmptyForm(initialChales, initialClientes));
    setError(null);
    setOpen(true);
  }

  function handleOpenEdit(reserva: ReservaEntity) {
    setEditingId(reserva.id);
    setForm({
      idChale: reserva.idChale,
      idCliente: reserva.idCliente,
      dataCheckinPrevisto: safeValue(reserva.dataCheckinPrevisto),
      dataCheckoutPrevisto: safeValue(reserva.dataCheckoutPrevisto),
      dataCheckinReal: safeValue(reserva.dataCheckinReal),
      dataCheckoutReal: safeValue(reserva.dataCheckoutReal),
      qtdAdultos: reserva.qtdAdultos,
      qtdCriancas: reserva.qtdCriancas,
      valorDiariaAplicada: reserva.valorDiariaAplicada,
      valorDesconto: reserva.valorDesconto,
      valorTaxaLimpeza: reserva.valorTaxaLimpeza,
      valorTaxaExtra: reserva.valorTaxaExtra,
      statusReserva: (safeValue(reserva.statusReserva) || "pendente") as ReservaInput["statusReserva"],
      origemReserva: safeValue(reserva.origemReserva) || "site",
      observacao: safeValue(reserva.observacao)
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

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...form,
        idChale: Number(form.idChale),
        idCliente: Number(form.idCliente),
        qtdAdultos: Number(form.qtdAdultos),
        qtdCriancas: Number(form.qtdCriancas),
        valorDiariaAplicada: Number(form.valorDiariaAplicada),
        valorDesconto: Number(form.valorDesconto),
        valorTaxaLimpeza: Number(form.valorTaxaLimpeza),
        valorTaxaExtra: Number(form.valorTaxaExtra)
      };

      const nextItem = editingId
        ? await authorizedJson<ReservaEntity>(`/reservas/${editingId}`, session.token, {
            method: "PUT",
            body: JSON.stringify(payload)
          })
        : await authorizedJson<ReservaEntity>("/reservas", session.token, {
            method: "POST",
            body: JSON.stringify(payload)
          });

      setReservas((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? nextItem : item))
          : [...current, nextItem].sort((a, b) =>
              a.dataCheckinPrevisto.localeCompare(b.dataCheckinPrevisto)
            )
      );
      setOpen(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel salvar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(reserva: ReservaEntity) {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    const confirmed = window.confirm(`Excluir a reserva #${reserva.id}?`);
    if (!confirmed) {
      return;
    }

    try {
      await authorizedJson(`/reservas/${reserva.id}`, session.token, {
        method: "DELETE"
      });
      setReservas((current) => current.filter((item) => item.id !== reserva.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir.");
    }
  }

  function getTodayDate() {
    return new Date().toISOString().slice(0, 10);
  }

  async function handleRealCheckin(reserva: ReservaEntity) {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    if (reserva.dataCheckinReal) {
      setError("Esta reserva ja possui check-in real registrado.");
      return;
    }

    try {
      setError(null);
      const nextItem = await authorizedJson<ReservaEntity>(`/reservas/${reserva.id}`, session.token, {
        method: "PUT",
        body: JSON.stringify({
          ...reserva,
          dataCheckinReal: getTodayDate(),
          dataCheckoutReal: reserva.dataCheckoutReal,
          statusReserva: reserva.statusReserva === "pendente" ? "confirmada" : reserva.statusReserva
        })
      });

      setReservas((current) => current.map((item) => (item.id === reserva.id ? nextItem : item)));
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Nao foi possivel registrar o check-in real."
      );
    }
  }

  async function handleRealCheckout(reserva: ReservaEntity) {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    if (!reserva.dataCheckinReal) {
      setError("Registre o check-in real antes do check-out.");
      return;
    }

    if (reserva.dataCheckoutReal) {
      setError("Esta reserva ja possui check-out real registrado.");
      return;
    }

    try {
      setError(null);
      const nextItem = await authorizedJson<ReservaEntity>(`/reservas/${reserva.id}`, session.token, {
        method: "PUT",
        body: JSON.stringify({
          ...reserva,
          dataCheckinReal: reserva.dataCheckinReal,
          dataCheckoutReal: getTodayDate(),
          statusReserva: "finalizada"
        })
      });

      setReservas((current) => current.map((item) => (item.id === reserva.id ? nextItem : item)));
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Nao foi possivel registrar o check-out real."
      );
    }
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Reservas"
        title="Gestao completa das reservas"
        description="Visualize ocupacao, origem da venda, status operacional e valores consolidados por reserva."
        action={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleOpenCreate}>
            Nova reserva
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
                <TableCell sx={{ fontWeight: 800 }}>Reserva</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Chale</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Periodo</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Operacao real</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Origem</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>Valor</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, pr: 3 }}>Acoes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservas.map((reserva) => (
                <TableRow
                  key={reserva.id}
                  hover
                  sx={{
                    "& td": {
                      borderColor: "rgba(15, 107, 99, 0.08)",
                      verticalAlign: "top"
                    }
                  }}
                >
                  <TableCell sx={{ minWidth: 110 }}>
                    <Typography fontWeight={700}>#{reserva.id}</Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 220 }}>{getClienteName(reserva.idCliente)}</TableCell>
                  <TableCell sx={{ minWidth: 180 }}>{getChaleName(reserva.idChale)}</TableCell>
                  <TableCell>
                    {safeValue(reserva.dataCheckinPrevisto) && safeValue(reserva.dataCheckoutPrevisto)
                      ? formatDateRange(reserva.dataCheckinPrevisto, reserva.dataCheckoutPrevisto)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      Check-in: {safeValue(reserva.dataCheckinReal) || "-"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Check-out: {safeValue(reserva.dataCheckoutReal) || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={capitalize(reserva.statusReserva) || "Sem status"}
                      color={statusColor[safeValue(reserva.statusReserva)] ?? "default"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{capitalize(reserva.origemReserva) || "-"}</TableCell>
                  <TableCell align="right">{formatCurrency(reserva.valorTotalReserva)}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap", pr: 2 }}>
                    <IconButton onClick={(event) => handleOpenMenu(event, reserva)} aria-label="Acoes da reserva">
                      <SettingsRoundedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </TableContainer>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl && activeReserva)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          disabled={
            !activeReserva ||
            Boolean(activeReserva.dataCheckinReal) ||
            activeReserva.statusReserva === "cancelada"
          }
          onClick={() => {
            if (!activeReserva) {
              return;
            }
            const target = activeReserva;
            handleCloseMenu();
            void handleRealCheckin(target);
          }}
        >
          <ListItemIcon>
            <FactCheckRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Registrar check-in real</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={
            !activeReserva ||
            !activeReserva.dataCheckinReal ||
            Boolean(activeReserva.dataCheckoutReal) ||
            activeReserva.statusReserva === "cancelada"
          }
          onClick={() => {
            if (!activeReserva) {
              return;
            }
            const target = activeReserva;
            handleCloseMenu();
            void handleRealCheckout(target);
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Registrar check-out real</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!activeReserva) {
              return;
            }
            handleCloseMenu();
            handleOpenEdit(activeReserva);
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!activeReserva) {
              return;
            }
            const target = activeReserva;
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
        <DialogTitle>{editingId ? "Editar reserva" : "Nova reserva"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              select
              label="Chale"
              value={form.idChale}
              onChange={(event) => {
                const nextChaleId = Number(event.target.value);
                setForm((current) => ({
                  ...current,
                  idChale: nextChaleId,
                  valorDiariaAplicada: syncChalePrice(nextChaleId)
                }));
              }}
            >
              {initialChales.map((chale) => (
                <MenuItem key={chale.id} value={chale.id}>
                  {chale.nome}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Cliente"
              value={form.idCliente}
              onChange={(event) =>
                setForm((current) => ({ ...current, idCliente: Number(event.target.value) }))
              }
            >
              {initialClientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nomeCompleto}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Check-in"
                type="date"
                value={form.dataCheckinPrevisto}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    dataCheckinPrevisto: event.target.value
                  }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Check-out"
                type="date"
                value={form.dataCheckoutPrevisto}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    dataCheckoutPrevisto: event.target.value
                  }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Check-in real"
                type="date"
                value={form.dataCheckinReal ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    dataCheckinReal: event.target.value
                  }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Check-out real"
                type="date"
                value={form.dataCheckoutReal ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    dataCheckoutReal: event.target.value
                  }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Adultos"
                type="number"
                value={form.qtdAdultos}
                onChange={(event) =>
                  setForm((current) => ({ ...current, qtdAdultos: Number(event.target.value) }))
                }
                fullWidth
              />
              <TextField
                label="Criancas"
                type="number"
                value={form.qtdCriancas}
                onChange={(event) =>
                  setForm((current) => ({ ...current, qtdCriancas: Number(event.target.value) }))
                }
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Valor da diaria"
                type="number"
                value={form.valorDiariaAplicada}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    valorDiariaAplicada: Number(event.target.value)
                  }))
                }
                fullWidth
              />
              <TextField
                label="Desconto"
                type="number"
                value={form.valorDesconto}
                onChange={(event) =>
                  setForm((current) => ({ ...current, valorDesconto: Number(event.target.value) }))
                }
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Taxa de limpeza"
                type="number"
                value={form.valorTaxaLimpeza}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    valorTaxaLimpeza: Number(event.target.value)
                  }))
                }
                fullWidth
              />
              <TextField
                label="Taxa extra"
                type="number"
                value={form.valorTaxaExtra}
                onChange={(event) =>
                  setForm((current) => ({ ...current, valorTaxaExtra: Number(event.target.value) }))
                }
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                select
                label="Status"
                value={form.statusReserva}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    statusReserva: event.target.value as ReservaInput["statusReserva"]
                  }))
                }
                fullWidth
              >
                <MenuItem value="pendente">Pendente</MenuItem>
                <MenuItem value="confirmada">Confirmada</MenuItem>
                <MenuItem value="hospedado">Hospedado</MenuItem>
                <MenuItem value="finalizada">Finalizada</MenuItem>
                <MenuItem value="cancelada">Cancelada</MenuItem>
                <MenuItem value="no_show">No show</MenuItem>
              </TextField>
              <TextField
                label="Origem"
                value={form.origemReserva}
                onChange={(event) =>
                  setForm((current) => ({ ...current, origemReserva: event.target.value }))
                }
                fullWidth
              />
            </Stack>
            <TextField
              label="Observacao"
              value={form.observacao}
              onChange={(event) =>
                setForm((current) => ({ ...current, observacao: event.target.value }))
              }
              multiline
              minRows={3}
            />
            <Typography variant="body2" color="text.secondary">
              O total da reserva e recalculado automaticamente pela API ao salvar.
            </Typography>
          </Stack>
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
