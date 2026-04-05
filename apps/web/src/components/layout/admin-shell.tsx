"use client";

import BookOnlineRoundedIcon from "@mui/icons-material/BookOnlineRounded";
import CabinRoundedIcon from "@mui/icons-material/CabinRounded";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";
import { useAuth } from "../auth/auth-provider";
import { sidebarItems } from "../../lib/data";

type Props = {
  children: ReactNode;
};

const drawerWidth = 280;

const itemIcons: Record<string, ReactNode> = {
  "/": <DashboardRoundedIcon fontSize="small" />,
  "/reservas": <BookOnlineRoundedIcon fontSize="small" />,
  "/chales": <CabinRoundedIcon fontSize="small" />,
  "/comodidades": <AppsRoundedIcon fontSize="small" />,
  "/clientes": <PeopleAltRoundedIcon fontSize="small" />,
  "/manutencao": <HandymanRoundedIcon fontSize="small" />,
  "/financeiro": <WalletRoundedIcon fontSize="small" />
};

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Dashboard operacional",
    subtitle: "Visao consolidada de reservas, ocupacao e rotina do empreendimento."
  },
  "/reservas": {
    title: "Gestao de reservas",
    subtitle: "Acompanhe entradas, saidas, disponibilidade e status de confirmacao."
  },
  "/chales": {
    title: "Cadastro de chales",
    subtitle: "Mantenha inventario, capacidade, configuracao e precificacao sempre coerentes."
  },
  "/clientes": {
    title: "Base de clientes",
    subtitle: "Centralize contatos, relacionamento e historico comercial dos hospedes."
  },
  "/comodidades": {
    title: "Cadastro de comodidades",
    subtitle: "Gerencie os itens que compoem a estrutura e os diferenciais dos chales."
  },
  "/manutencao": {
    title: "Operacao tecnica",
    subtitle: "Controle manutencoes, pendencias de unidade e impacto na disponibilidade."
  },
  "/financeiro": {
    title: "Painel financeiro",
    subtitle: "Monitore receita, pagamentos e indicadores de faturamento da hospedagem."
  }
};

export function AdminShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, session } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const userName = session?.user.nome ?? "Admin";
  const initials = userName
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
  const currentPage = useMemo(
    () =>
      pageMeta[pathname] ?? {
        title: "Painel administrativo",
        subtitle: "Gerencie a operacao diaria do sistema."
      },
    [pathname]
  );
  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short"
      }).format(new Date()),
    []
  );

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const drawerContent = (
    <Stack
      spacing={3}
      sx={{
        height: "100%",
        p: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 4,
          color: "common.white",
          background:
            "linear-gradient(160deg, rgba(14,46,56,1) 0%, rgba(16,88,98,1) 54%, rgba(205,125,38,1) 100%)"
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                display: "grid",
                placeItems: "center",
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.16)"
              }}
            >
              <CottageOutlinedIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Serra Admin
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.82 }}>
                Hospedagem e operacao
              </Typography>
            </Box>
          </Stack>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.1)"
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.76, letterSpacing: "0.08em" }}>
              AMBIENTE
            </Typography>
            <Typography fontWeight={700}>Painel administrativo principal</Typography>
          </Box>
        </Stack>
      </Paper>

      <Box>
        <Typography
          variant="overline"
          sx={{
            px: 1.5,
            color: "text.secondary",
            letterSpacing: "0.12em"
          }}
        >
          Navegacao
        </Typography>
        <List disablePadding sx={{ display: "grid", gap: 0.75, mt: 1 }}>
          {sidebarItems.map((item) => {
            const active = pathname === item.href;

            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  minHeight: 50,
                  borderRadius: 3,
                  px: 1.5,
                  py: 1,
                  bgcolor: active ? "rgba(15, 107, 99, 0.12)" : "transparent",
                  color: active ? "primary.main" : "text.primary",
                  border: active
                    ? "1px solid rgba(15, 107, 99, 0.16)"
                    : "1px solid transparent"
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    color: active ? "primary.main" : "text.secondary"
                  }}
                >
                  {itemIcons[item.href]}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: active ? 800 : 600 }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Paper
        elevation={0}
        sx={{
          mt: "auto",
          p: 2,
          borderRadius: 4,
          border: "1px solid rgba(15, 107, 99, 0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(248,244,237,0.94) 100%)"
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Sessao ativa
        </Typography>
        <Typography fontWeight={800} sx={{ mt: 0.5 }}>
          {userName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Perfil {session?.user.perfil ?? "admin"}
        </Typography>
      </Paper>
    </Stack>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(15,107,99,0.08), transparent 20%), linear-gradient(180deg, #f7f4ee 0%, #f1ece4 100%)"
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(15, 107, 99, 0.08)",
            backgroundColor: "#FCFAF6"
          }
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(15, 107, 99, 0.08)",
            backgroundColor: "#FCFAF6"
          }
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              mx: { xs: 2, md: 3 },
              mt: { xs: 2, md: 3 },
              p: { xs: 1.5, md: 2 },
              borderRadius: 4,
              border: "1px solid rgba(15, 107, 99, 0.08)",
              backgroundColor: "rgba(252,250,246,0.82)",
              backdropFilter: "blur(16px)"
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{ display: { xs: "inline-flex", lg: "none" } }}
                >
                  <MenuRoundedIcon />
                </IconButton>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {currentPage.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentPage.subtitle}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap">
                <TextField
                  size="small"
                  placeholder="Buscar reserva, cliente ou chale"
                  sx={{ width: { xs: "100%", md: 320 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
                <Chip label={formattedDate} variant="outlined" />
                <Chip label="Sistema online" color="success" variant="outlined" />
                <IconButton>
                  <NotificationsNoneRoundedIcon />
                </IconButton>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <Typography fontWeight={700}>{userName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {session?.user.perfil ?? "admin"}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>{initials}</Avatar>
                  <Tooltip title="Sair">
                    <Button
                      onClick={handleLogout}
                      color="inherit"
                      startIcon={<LogoutRoundedIcon />}
                      sx={{ display: { xs: "none", md: "inline-flex" } }}
                    >
                      Sair
                    </Button>
                  </Tooltip>
                </Stack>
              </Stack>
            </Stack>
          </Paper>

          <Box
            sx={{
              px: { xs: 2, md: 3 },
              pb: { xs: 3, md: 4 }
            }}
          >
            <Box sx={{ maxWidth: 1480, mx: "auto" }}>{children}</Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
