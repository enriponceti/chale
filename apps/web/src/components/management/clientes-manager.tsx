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
import { authorizedJson, type ClienteInput, type ClienteListItem } from "../../lib/api";
import { capitalize } from "../../lib/format";
import { PageHeader } from "../ui/page-header";

type Props = {
  initialClientes: ClienteListItem[];
};

const emptyForm: ClienteInput = {
  nomeCompleto: "",
  cpf: "",
  rg: "",
  documentoEstrangeiro: "",
  dataNascimento: "",
  telefone: "",
  email: "",
  celular: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
  pais: "Brasil",
  status: "ativo",
  observacao: ""
};

function validateClienteForm(form: ClienteInput) {
  const errors: string[] = [];

  if (form.nomeCompleto.trim().length < 3) {
    errors.push("Nome completo deve ter pelo menos 3 caracteres.");
  }

  if (form.cpf.trim().length < 11) {
    errors.push("CPF deve ter pelo menos 11 caracteres.");
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.push("E-mail invalido.");
  }

  if (form.dataNascimento && !/^\d{4}-\d{2}-\d{2}$/.test(form.dataNascimento)) {
    errors.push("Data de nascimento deve estar no formato YYYY-MM-DD.");
  }

  if (form.status.trim().length < 2) {
    errors.push("Status deve ser informado.");
  }

  return errors;
}

function sectionTitle(title: string, description: string) {
  return (
    <Box sx={{ gridColumn: "1 / -1", pt: 1 }}>
      <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.1em" }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}

function safeValue(value?: string | null) {
  return value && value.trim() ? value : "";
}

export function ClientesManager({ initialClientes }: Props) {
  const { session } = useAuth();
  const [clientes, setClientes] = useState(initialClientes);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ClienteInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeCliente, setActiveCliente] = useState<ClienteListItem | null>(null);

  function handleOpenMenu(event: React.MouseEvent<HTMLElement>, cliente: ClienteListItem) {
    setMenuAnchorEl(event.currentTarget);
    setActiveCliente(cliente);
  }

  function handleCloseMenu() {
    setMenuAnchorEl(null);
    setActiveCliente(null);
  }

  function handleOpenCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setOpen(true);
  }

  function handleOpenEdit(cliente: ClienteListItem) {
    setEditingId(cliente.id);
    setForm({
      nomeCompleto: safeValue(cliente.nomeCompleto),
      cpf: safeValue(cliente.cpf),
      rg: safeValue(cliente.rg),
      documentoEstrangeiro: safeValue(cliente.documentoEstrangeiro),
      dataNascimento: safeValue(cliente.dataNascimento),
      telefone: safeValue(cliente.telefone),
      email: safeValue(cliente.email),
      celular: safeValue(cliente.celular),
      logradouro: safeValue(cliente.logradouro),
      numero: safeValue(cliente.numero),
      complemento: safeValue(cliente.complemento),
      bairro: safeValue(cliente.bairro),
      cidade: safeValue(cliente.cidade),
      estado: safeValue(cliente.estado),
      cep: safeValue(cliente.cep),
      pais: safeValue(cliente.pais) || "Brasil",
      status: safeValue(cliente.status) || "ativo",
      observacao: safeValue(cliente.observacao)
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

    const payload = {
      ...form,
      nomeCompleto: form.nomeCompleto.trim(),
      cpf: form.cpf.trim(),
      rg: form.rg.trim(),
      documentoEstrangeiro: form.documentoEstrangeiro.trim(),
      dataNascimento: form.dataNascimento,
      telefone: form.telefone.trim(),
      email: form.email.trim(),
      celular: form.celular.trim(),
      logradouro: form.logradouro.trim(),
      numero: form.numero.trim(),
      complemento: form.complemento.trim(),
      bairro: form.bairro.trim(),
      cidade: form.cidade.trim(),
      estado: form.estado.trim(),
      cep: form.cep.trim(),
      pais: form.pais.trim(),
      status: form.status.trim(),
      observacao: form.observacao.trim()
    };

    const validationErrors = validateClienteForm(payload);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const nextItem = editingId
        ? await authorizedJson<ClienteListItem>(`/clientes/${editingId}`, session.token, {
            method: "PUT",
            body: JSON.stringify(payload)
          })
        : await authorizedJson<ClienteListItem>("/clientes", session.token, {
            method: "POST",
            body: JSON.stringify(payload)
          });

      setClientes((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? nextItem : item))
          : [...current, nextItem].sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto))
      );
      setOpen(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel salvar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(cliente: ClienteListItem) {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    const confirmed = window.confirm(`Excluir o cliente ${cliente.nomeCompleto}?`);
    if (!confirmed) {
      return;
    }

    try {
      await authorizedJson(`/clientes/${cliente.id}`, session.token, {
        method: "DELETE"
      });
      setClientes((current) => current.filter((item) => item.id !== cliente.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir.");
    }
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Clientes"
        title="Cadastro de Clientes"
        description="Mantenha os dados do cliente sempre atualizados."
        action={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleOpenCreate}>
            Novo cliente
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
              <TableCell sx={{ fontWeight: 800 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>CPF</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Contato</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Cidade / UF</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, pr: 3 }}>
                Acoes
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow
                key={cliente.id}
                hover
                sx={{
                  "& td": {
                    borderColor: "rgba(15, 107, 99, 0.08)",
                    verticalAlign: "top"
                  }
                }}
              >
                <TableCell sx={{ minWidth: 240 }}>
                  <Typography fontWeight={700}>{safeValue(cliente.nomeCompleto) || "-"}</Typography>
                  {safeValue(cliente.observacao) ? (
                    <Typography variant="body2" color="text.secondary">
                      {cliente.observacao}
                    </Typography>
                  ) : null}
                </TableCell>
                <TableCell>{safeValue(cliente.cpf) || "-"}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {safeValue(cliente.celular) || safeValue(cliente.telefone) || "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {safeValue(cliente.email) || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{safeValue(cliente.cidade) || "-"}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {safeValue(cliente.estado) || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={capitalize(cliente.status) || "Sem status"}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", pr: 2 }}>
                  <IconButton onClick={(event) => handleOpenMenu(event, cliente)} aria-label="Acoes do cliente">
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
        open={Boolean(menuAnchorEl && activeCliente)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() => {
            if (!activeCliente) {
              return;
            }
            handleCloseMenu();
            handleOpenEdit(activeCliente);
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!activeCliente) {
              return;
            }
            const target = activeCliente;
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
        <DialogTitle>{editingId ? "Editar cliente" : "Novo cliente"}</DialogTitle>
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
            {sectionTitle("Identificacao", "Dados principais e documentos do cliente.")}
            <TextField
              label="Nome completo"
              value={form.nomeCompleto}
              onChange={(event) =>
                setForm((current) => ({ ...current, nomeCompleto: event.target.value }))
              }
            />
            <TextField
              label="CPF"
              value={form.cpf}
              onChange={(event) => setForm((current) => ({ ...current, cpf: event.target.value }))}
            />
            <TextField
              label="RG"
              value={form.rg}
              onChange={(event) => setForm((current) => ({ ...current, rg: event.target.value }))}
            />
            <TextField
              label="Documento estrangeiro"
              value={form.documentoEstrangeiro}
              onChange={(event) =>
                setForm((current) => ({ ...current, documentoEstrangeiro: event.target.value }))
              }
            />
            <TextField
              label="Data de nascimento"
              type="date"
              value={form.dataNascimento}
              onChange={(event) =>
                setForm((current) => ({ ...current, dataNascimento: event.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <MenuItem value="ativo">Ativo</MenuItem>
              <MenuItem value="vip">Vip</MenuItem>
              <MenuItem value="inativo">Inativo</MenuItem>
              <MenuItem value="corporativo">Corporativo</MenuItem>
              <MenuItem value="recorrente">Recorrente</MenuItem>
            </TextField>

            {sectionTitle("Contato", "Canais principais para comunicacao e confirmacao de reserva.")}
            <TextField
              label="Telefone"
              value={form.telefone}
              onChange={(event) =>
                setForm((current) => ({ ...current, telefone: event.target.value }))
              }
            />
            <TextField
              label="Celular"
              value={form.celular}
              onChange={(event) =>
                setForm((current) => ({ ...current, celular: event.target.value }))
              }
            />
            <TextField
              label="E-mail"
              type="email"
              sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />

            {sectionTitle("Endereco", "Endereco principal para cadastro e referencia operacional.")}
            <TextField
              label="Logradouro"
              value={form.logradouro}
              onChange={(event) =>
                setForm((current) => ({ ...current, logradouro: event.target.value }))
              }
            />
            <TextField
              label="Numero"
              value={form.numero}
              onChange={(event) => setForm((current) => ({ ...current, numero: event.target.value }))}
            />
            <TextField
              label="Complemento"
              value={form.complemento}
              onChange={(event) =>
                setForm((current) => ({ ...current, complemento: event.target.value }))
              }
            />
            <TextField
              label="Bairro"
              value={form.bairro}
              onChange={(event) => setForm((current) => ({ ...current, bairro: event.target.value }))}
            />
            <TextField
              label="Cidade"
              value={form.cidade}
              onChange={(event) => setForm((current) => ({ ...current, cidade: event.target.value }))}
            />
            <TextField
              label="Estado"
              value={form.estado}
              onChange={(event) => setForm((current) => ({ ...current, estado: event.target.value }))}
            />
            <TextField
              label="CEP"
              value={form.cep}
              onChange={(event) => setForm((current) => ({ ...current, cep: event.target.value }))}
            />
            <TextField
              label="Pais"
              value={form.pais}
              onChange={(event) => setForm((current) => ({ ...current, pais: event.target.value }))}
            />

            {sectionTitle("Observacoes", "Notas livres relevantes para atendimento e operacao.")}
            <TextField
              label="Observacao"
              sx={{ gridColumn: "1 / -1" }}
              value={form.observacao}
              onChange={(event) =>
                setForm((current) => ({ ...current, observacao: event.target.value }))
              }
              multiline
              minRows={3}
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
