"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
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
  getChaleComodidades,
  getComodidades,
  type ChaleComodidadeItem,
  type ChaleInput,
  type ChaleListItem,
  type ComodidadeListItem
} from "../../lib/api";
import { capitalize, formatCurrency } from "../../lib/format";
import { PageHeader } from "../ui/page-header";

type Props = {
  initialChales: ChaleListItem[];
};

const emptyForm: ChaleInput = {
  codigo: "",
  nome: "",
  descricao: "",
  status: "ativo",
  capacidadeMaxima: 2,
  qtdQuartos: 1,
  qtdBanheiros: 1,
  qtdCamasCasal: 1,
  qtdCamasSolteiro: 0,
  valorDiariaBase: 0,
  areaM2: 45,
  localizacaoInterna: "",
  checkinPadrao: "14:00",
  checkoutPadrao: "12:00"
};

function validateChaleForm(form: ChaleInput) {
  const errors: Partial<Record<keyof ChaleInput, string>> = {};

  if (form.codigo.trim().length < 2) {
    errors.codigo = "Codigo deve ter pelo menos 2 caracteres.";
  }

  if (form.nome.trim().length < 3) {
    errors.nome = "Nome deve ter pelo menos 3 caracteres.";
  }

  if (form.descricao.trim().length < 5) {
    errors.descricao = "Descricao deve ter pelo menos 5 caracteres.";
  }

  if (!Number.isInteger(form.capacidadeMaxima) || form.capacidadeMaxima <= 0) {
    errors.capacidadeMaxima = "Capacidade maxima deve ser um numero inteiro maior que zero.";
  }

  if (!Number.isInteger(form.qtdQuartos) || form.qtdQuartos <= 0) {
    errors.qtdQuartos = "Quantidade de quartos deve ser um numero inteiro maior que zero.";
  }

  if (!Number.isInteger(form.qtdBanheiros) || form.qtdBanheiros <= 0) {
    errors.qtdBanheiros = "Quantidade de banheiros deve ser um numero inteiro maior que zero.";
  }

  if (!Number.isInteger(form.qtdCamasCasal) || form.qtdCamasCasal < 0) {
    errors.qtdCamasCasal = "Quantidade de camas de casal deve ser zero ou mais.";
  }

  if (!Number.isInteger(form.qtdCamasSolteiro) || form.qtdCamasSolteiro < 0) {
    errors.qtdCamasSolteiro = "Quantidade de camas de solteiro deve ser zero ou mais.";
  }

  if (!Number.isFinite(form.valorDiariaBase) || form.valorDiariaBase <= 0) {
    errors.valorDiariaBase = "Valor da diaria deve ser maior que zero.";
  }

  if (!Number.isFinite(form.areaM2) || form.areaM2 <= 0) {
    errors.areaM2 = "Area em m2 deve ser maior que zero.";
  }

  if (form.localizacaoInterna.trim().length < 2) {
    errors.localizacaoInterna = "Localizacao interna deve ter pelo menos 2 caracteres.";
  }

  if (!/^\d{2}:\d{2}$/.test(form.checkinPadrao)) {
    errors.checkinPadrao = "Check-in padrao deve estar no formato HH:MM.";
  }

  if (!/^\d{2}:\d{2}$/.test(form.checkoutPadrao)) {
    errors.checkoutPadrao = "Checkout padrao deve estar no formato HH:MM.";
  }

  return errors;
}

function formatCurrencyInput(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function ChalesManager({ initialChales }: Props) {
  const { session } = useAuth();
  const [chales, setChales] = useState(initialChales);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ChaleInput>(emptyForm);
  const [valorDiariaDisplay, setValorDiariaDisplay] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ChaleInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeChale, setActiveChale] = useState<ChaleListItem | null>(null);
  const [openComodidadesDialog, setOpenComodidadesDialog] = useState(false);
  const [comodidades, setComodidades] = useState<ComodidadeListItem[]>([]);
  const [selectedComodidades, setSelectedComodidades] = useState<Record<number, string>>({});
  const [isLoadingComodidades, setIsLoadingComodidades] = useState(false);

  function handleOpenMenu(event: React.MouseEvent<HTMLElement>, chale: ChaleListItem) {
    setMenuAnchorEl(event.currentTarget);
    setActiveChale(chale);
  }

  function handleCloseMenu() {
    setMenuAnchorEl(null);
  }

  function handleCloseAllMenus() {
    setMenuAnchorEl(null);
    setActiveChale(null);
  }

  async function handleOpenComodidadesDialog(chale: ChaleListItem) {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    setActiveChale(chale);
    setOpenComodidadesDialog(true);
    setIsLoadingComodidades(true);
    setError(null);

    try {
      const [allComodidades, linkedComodidades] = await Promise.all([
        getComodidades(),
        getChaleComodidades(chale.id)
      ]);

      const selectedMap = linkedComodidades.reduce<Record<number, string>>((acc, item) => {
        acc[item.idComodidade] = item.observacao ?? "";
        return acc;
      }, {});

      setComodidades(allComodidades);
      setSelectedComodidades(selectedMap);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Nao foi possivel carregar comodidades.");
    } finally {
      setIsLoadingComodidades(false);
    }
  }

  function toggleComodidade(idComodidade: number, checked: boolean) {
    setSelectedComodidades((current) => {
      const next = { ...current };

      if (checked) {
        next[idComodidade] = current[idComodidade] ?? "";
      } else {
        delete next[idComodidade];
      }

      return next;
    });
  }

  function updateComodidadeObservacao(idComodidade: number, observacao: string) {
    setSelectedComodidades((current) => ({
      ...current,
      [idComodidade]: observacao
    }));
  }

  async function handleSaveComodidades() {
    if (!session?.token || !activeChale) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    setIsLoadingComodidades(true);
    setError(null);

    try {
      await authorizedJson<ChaleComodidadeItem[]>(`/chales/${activeChale.id}/comodidades`, session.token, {
        method: "PUT",
        body: JSON.stringify({
          itens: Object.entries(selectedComodidades).map(([idComodidade, observacao]) => ({
            idComodidade: Number(idComodidade),
            observacao
          }))
        })
      });

      setOpenComodidadesDialog(false);
      setActiveChale(null);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Nao foi possivel salvar as comodidades do chalé."
      );
    } finally {
      setIsLoadingComodidades(false);
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setValorDiariaDisplay("");
    setError(null);
    setFormError(null);
    setFieldErrors({});
    setOpen(true);
  }

  function handleOpenEdit(chale: ChaleListItem) {
    setEditingId(chale.id);
    setForm({
      codigo: chale.codigo,
      nome: chale.nome,
      descricao: chale.descricao,
      status: chale.status as ChaleInput["status"],
      capacidadeMaxima: chale.capacidadeMaxima,
      qtdQuartos: chale.qtdQuartos,
      qtdBanheiros: chale.qtdBanheiros,
      qtdCamasCasal: chale.qtdCamasCasal,
      qtdCamasSolteiro: chale.qtdCamasSolteiro,
      valorDiariaBase: chale.valorDiariaBase,
      areaM2: chale.areaM2,
      localizacaoInterna: chale.localizacaoInterna,
      checkinPadrao: chale.checkinPadrao,
      checkoutPadrao: chale.checkoutPadrao
    });
    setValorDiariaDisplay(formatCurrencyInput(chale.valorDiariaBase));
    setError(null);
    setFormError(null);
    setFieldErrors({});
    setOpen(true);
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    setOpen(false);
    setValorDiariaDisplay("");
    setFormError(null);
    setFieldErrors({});
  }

  function handleValorDiariaChange(value: string) {
    const digitsOnly = value.replace(/\D/g, "");
    const parsedValue = digitsOnly ? Number(digitsOnly) / 100 : 0;

    setForm((current) => ({
      ...current,
      valorDiariaBase: parsedValue
    }));

    setValorDiariaDisplay(digitsOnly ? formatCurrencyInput(parsedValue) : "");
  }

  async function handleSubmit() {
    if (!session?.token) {
      setFormError("Sessao expirada. Entre novamente.");
      return;
    }

    try {
      const payload = {
        ...form,
        codigo: form.codigo.trim(),
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        localizacaoInterna: form.localizacaoInterna.trim(),
        capacidadeMaxima: Number(form.capacidadeMaxima),
        qtdQuartos: Number(form.qtdQuartos),
        qtdBanheiros: Number(form.qtdBanheiros),
        qtdCamasCasal: Number(form.qtdCamasCasal),
        qtdCamasSolteiro: Number(form.qtdCamasSolteiro),
        valorDiariaBase: Number(form.valorDiariaBase),
        areaM2: Number(form.areaM2)
      };

      const validationErrors = validateChaleForm(payload);
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        setFormError("Preencha os campos obrigatorios destacados para continuar.");
        return;
      }

      setIsSubmitting(true);
      setError(null);
      setFormError(null);
      setFieldErrors({});

      const nextItem = editingId
        ? await authorizedJson<ChaleListItem>(`/chales/${editingId}`, session.token, {
            method: "PUT",
            body: JSON.stringify(payload)
          })
        : await authorizedJson<ChaleListItem>("/chales", session.token, {
            method: "POST",
            body: JSON.stringify(payload)
          });

      setChales((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? nextItem : item))
          : [...current, nextItem].sort((a, b) => a.nome.localeCompare(b.nome))
      );
      setOpen(false);
      setValorDiariaDisplay("");
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : "Nao foi possivel salvar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(chale: ChaleListItem) {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    const confirmed = window.confirm(`Excluir o chale ${chale.nome}?`);
    if (!confirmed) {
      return;
    }

    try {
      await authorizedJson(`/chales/${chale.id}`, session.token, {
        method: "DELETE"
      });
      setChales((current) => current.filter((item) => item.id !== chale.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir.");
    }
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Chalés"
        title="Cadastro de Chalés"
        description="Mantenha o cadastro dos chalés sempre atualizados."
        action={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleOpenCreate}>
            Novo chale
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
        <Table sx={{ minWidth: 980 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Chale</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Capacidade</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Estrutura</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Horario</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Diaria</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Localizacao</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, pr: 3 }}>
                Acoes
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chales.map((chale) => (
              <TableRow
                key={chale.id}
                hover
                sx={{
                  "& td": {
                    borderColor: "rgba(15, 107, 99, 0.08)",
                    verticalAlign: "top"
                  }
                }}
              >
                <TableCell sx={{ minWidth: 240 }}>
                  <Stack spacing={0.75}>
                    <Typography fontWeight={800}>{chale.nome}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {chale.codigo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {chale.descricao}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={capitalize(chale.status)}
                    color={chale.status === "ativo" ? "success" : "warning"}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>{chale.capacidadeMaxima} pessoas</TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {chale.qtdQuartos} quartos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {chale.qtdBanheiros} banheiros
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {chale.qtdCamasCasal} casal · {chale.qtdCamasSolteiro} solteiro
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {chale.areaM2} m2
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    Check-in {chale.checkinPadrao}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Checkout {chale.checkoutPadrao}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={700}>{formatCurrency(chale.valorDiariaBase)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {chale.localizacaoInterna}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", pr: 2 }}>
                  <IconButton onClick={(event) => handleOpenMenu(event, chale)} aria-label="Acoes do chale">
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
        open={Boolean(menuAnchorEl && activeChale)}
        onClose={handleCloseAllMenus}
      >
        <MenuItem
          onClick={() => {
            if (!activeChale) {
              return;
            }
            handleCloseAllMenus();
            handleOpenEdit(activeChale);
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!activeChale) {
              return;
            }
            const target = activeChale;
            setMenuAnchorEl(null);
            void handleOpenComodidadesDialog(target);
          }}
        >
          <ListItemIcon>
            <AppsRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Comodidades</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!activeChale) {
              return;
            }
            const target = activeChale;
            handleCloseAllMenus();
            void handleDelete(target);
          }}
        >
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={openComodidadesDialog}
        onClose={() => {
          setOpenComodidadesDialog(false);
          setActiveChale(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Comodidades do chalé</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography fontWeight={700}>{activeChale?.nome ?? "Chalé"}</Typography>
            {isLoadingComodidades ? (
              <Typography color="text.secondary">Carregando comodidades...</Typography>
            ) : (
              comodidades.map((comodidade) => {
                const checked = Object.prototype.hasOwnProperty.call(
                  selectedComodidades,
                  comodidade.id
                );

                return (
                  <Box
                    key={comodidade.id}
                    sx={{
                      p: 2,
                      border: "1px solid rgba(15, 107, 99, 0.08)",
                      borderRadius: 2
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Checkbox
                          checked={checked}
                          onChange={(event) =>
                            toggleComodidade(comodidade.id, event.target.checked)
                          }
                        />
                        <Box sx={{ pt: 0.75 }}>
                          <Typography fontWeight={700}>{comodidade.nome}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {comodidade.descricao}
                          </Typography>
                        </Box>
                      </Stack>

                      {checked ? (
                        <TextField
                          label="Observacao da comodidade"
                          value={selectedComodidades[comodidade.id] ?? ""}
                          onChange={(event) =>
                            updateComodidadeObservacao(comodidade.id, event.target.value)
                          }
                          fullWidth
                        />
                      ) : null}
                    </Stack>
                  </Box>
                );
              })
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              setOpenComodidadesDialog(false);
              setActiveChale(null);
            }}
            disabled={isLoadingComodidades}
          >
            Fechar
          </Button>
          <Button onClick={handleSaveComodidades} variant="contained" disabled={isLoadingComodidades}>
            Salvar comodidades
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Editar chale" : "Novo chale"}</DialogTitle>
        <DialogContent>
          {formError ? (
            <Alert severity="error" sx={{ mt: 1 }}>
              {formError}
            </Alert>
          ) : null}
          <Box
            sx={{
              pt: 1,
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))"
              }
            }}
          >
            <TextField
              label="Codigo *"
              value={form.codigo}
              onChange={(event) => setForm((current) => ({ ...current, codigo: event.target.value }))}
              error={Boolean(fieldErrors.codigo)}
              helperText={fieldErrors.codigo}
            />
            <TextField
              label="Nome *"
              value={form.nome}
              onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
              error={Boolean(fieldErrors.nome)}
              helperText={fieldErrors.nome}
            />
            <TextField
              label="Descricao *"
              sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}
              value={form.descricao}
              onChange={(event) =>
                setForm((current) => ({ ...current, descricao: event.target.value }))
              }
              multiline
              minRows={3}
              error={Boolean(fieldErrors.descricao)}
              helperText={fieldErrors.descricao}
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as ChaleInput["status"]
                }))
              }
            >
              <MenuItem value="ativo">Ativo</MenuItem>
              <MenuItem value="inativo">Inativo</MenuItem>
              <MenuItem value="manutencao">Manutenção</MenuItem>
            </TextField>
            <TextField
              label="Capacidade maxima *"
              type="number"
              value={form.capacidadeMaxima}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  capacidadeMaxima: Number(event.target.value)
                }))
              }
              error={Boolean(fieldErrors.capacidadeMaxima)}
              helperText={fieldErrors.capacidadeMaxima}
            />
            <TextField
              label="Qtd. quartos *"
              type="number"
              value={form.qtdQuartos}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  qtdQuartos: Number(event.target.value)
                }))
              }
              error={Boolean(fieldErrors.qtdQuartos)}
              helperText={fieldErrors.qtdQuartos}
            />
            <TextField
              label="Qtd. banheiros *"
              type="number"
              value={form.qtdBanheiros}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  qtdBanheiros: Number(event.target.value)
                }))
              }
              error={Boolean(fieldErrors.qtdBanheiros)}
              helperText={fieldErrors.qtdBanheiros}
            />
            <TextField
              label="Camas de casal *"
              type="number"
              value={form.qtdCamasCasal}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  qtdCamasCasal: Number(event.target.value)
                }))
              }
              error={Boolean(fieldErrors.qtdCamasCasal)}
              helperText={fieldErrors.qtdCamasCasal}
            />
            <TextField
              label="Camas de solteiro *"
              type="number"
              value={form.qtdCamasSolteiro}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  qtdCamasSolteiro: Number(event.target.value)
                }))
              }
              error={Boolean(fieldErrors.qtdCamasSolteiro)}
              helperText={fieldErrors.qtdCamasSolteiro}
            />
            <TextField
              label="Valor da diaria *"
              value={valorDiariaDisplay}
              onChange={(event) => handleValorDiariaChange(event.target.value)}
              error={Boolean(fieldErrors.valorDiariaBase)}
              helperText={fieldErrors.valorDiariaBase}
              inputMode="numeric"
              placeholder="R$ 0,00"
            />
            <TextField
              label="Area em m2 *"
              type="number"
              value={form.areaM2}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  areaM2: Number(event.target.value)
                }))
              }
              error={Boolean(fieldErrors.areaM2)}
              helperText={fieldErrors.areaM2}
            />
            <TextField
              label="Localizacao interna *"
              sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}
              value={form.localizacaoInterna}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  localizacaoInterna: event.target.value
                }))
              }
              error={Boolean(fieldErrors.localizacaoInterna)}
              helperText={fieldErrors.localizacaoInterna}
            />
            <TextField
              label="Check-in padrao *"
              type="time"
              value={form.checkinPadrao}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  checkinPadrao: event.target.value
                }))
              }
              InputLabelProps={{ shrink: true }}
              error={Boolean(fieldErrors.checkinPadrao)}
              helperText={fieldErrors.checkinPadrao}
            />
            <TextField
              label="Checkout padrao *"
              type="time"
              value={form.checkoutPadrao}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  checkoutPadrao: event.target.value
                }))
              }
              InputLabelProps={{ shrink: true }}
              error={Boolean(fieldErrors.checkoutPadrao)}
              helperText={fieldErrors.checkoutPadrao}
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
