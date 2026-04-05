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
import { authorizedJson, type ComodidadeInput, type ComodidadeListItem } from "../../lib/api";
import { capitalize } from "../../lib/format";
import { PageHeader } from "../ui/page-header";

type Props = {
  initialComodidades: ComodidadeListItem[];
};

const emptyForm: ComodidadeInput = {
  nome: "",
  descricao: "",
  status: "ativo"
};

function validateComodidadeForm(form: ComodidadeInput) {
  const errors: string[] = [];

  if (form.nome.trim().length < 2) {
    errors.push("Nome deve ter pelo menos 2 caracteres.");
  }

  if (form.descricao.trim().length < 5) {
    errors.push("Descricao deve ter pelo menos 5 caracteres.");
  }

  if (form.status.trim().length < 2) {
    errors.push("Status deve ser informado.");
  }

  return errors;
}

export function ComodidadesManager({ initialComodidades }: Props) {
  const { session } = useAuth();
  const [comodidades, setComodidades] = useState(initialComodidades);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ComodidadeInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeComodidade, setActiveComodidade] = useState<ComodidadeListItem | null>(null);

  function handleOpenMenu(event: React.MouseEvent<HTMLElement>, comodidade: ComodidadeListItem) {
    setMenuAnchorEl(event.currentTarget);
    setActiveComodidade(comodidade);
  }

  function handleCloseMenu() {
    setMenuAnchorEl(null);
    setActiveComodidade(null);
  }

  function handleOpenCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setOpen(true);
  }

  function handleOpenEdit(comodidade: ComodidadeListItem) {
    setEditingId(comodidade.id);
    setForm({
      nome: comodidade.nome,
      descricao: comodidade.descricao,
      status: comodidade.status
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
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      status: form.status.trim()
    };

    const validationErrors = validateComodidadeForm(payload);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const nextItem = editingId
        ? await authorizedJson<ComodidadeListItem>(`/comodidades/${editingId}`, session.token, {
            method: "PUT",
            body: JSON.stringify(payload)
          })
        : await authorizedJson<ComodidadeListItem>("/comodidades", session.token, {
            method: "POST",
            body: JSON.stringify(payload)
          });

      setComodidades((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? nextItem : item))
          : [...current, nextItem].sort((a, b) => a.nome.localeCompare(b.nome))
      );
      setOpen(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel salvar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(comodidade: ComodidadeListItem) {
    if (!session?.token) {
      setError("Sessao expirada. Entre novamente.");
      return;
    }

    const confirmed = window.confirm(`Excluir a comodidade ${comodidade.nome}?`);
    if (!confirmed) {
      return;
    }

    try {
      await authorizedJson(`/comodidades/${comodidade.id}`, session.token, {
        method: "DELETE"
      });
      setComodidades((current) => current.filter((item) => item.id !== comodidade.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir.");
    }
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Comodidades"
        title="Cadastro de Comodidades"
        description="Cadastre os itens de comodidades usados na configuracao dos chales."
        action={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleOpenCreate}>
            Nova comodidade
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
        <Table sx={{ minWidth: 840 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Id</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Comodidade</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Descricao</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, pr: 3 }}>
                Acoes
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comodidades.map((comodidade) => (
              <TableRow
                key={comodidade.id}
                hover
                sx={{
                  "& td": {
                    borderColor: "rgba(15, 107, 99, 0.08)",
                    verticalAlign: "top"
                  }
                }}
              >
                <TableCell sx={{ width: 90 }}>
                  <Typography variant="body2" color="text.secondary">
                    {comodidade.id}
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 220 }}>
                  <Stack spacing={0.75}>
                    <Typography fontWeight={800}>{comodidade.nome}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {comodidade.descricao}
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: 160 }}>
                  <Chip
                    label={capitalize(comodidade.status)}
                    color={comodidade.status === "ativo" ? "success" : "warning"}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap", pr: 2 }}>
                  <IconButton
                    onClick={(event) => handleOpenMenu(event, comodidade)}
                    aria-label="Acoes da comodidade"
                  >
                    <SettingsRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl && activeComodidade)} onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            if (!activeComodidade) {
              return;
            }

            const target = activeComodidade;
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
            if (!activeComodidade) {
              return;
            }

            const target = activeComodidade;
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Editar comodidade" : "Nova comodidade"}</DialogTitle>
        <DialogContent>
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
              label="Nome"
              value={form.nome}
              onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <MenuItem value="ativo">Ativo</MenuItem>
              <MenuItem value="inativo">Inativo</MenuItem>
            </TextField>
            <TextField
              label="Descricao"
              multiline
              minRows={4}
              value={form.descricao}
              onChange={(event) =>
                setForm((current) => ({ ...current, descricao: event.target.value }))
              }
              sx={{ gridColumn: "1 / -1" }}
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
