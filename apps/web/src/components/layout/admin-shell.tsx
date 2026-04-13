"use client";

import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import BookOnlineRoundedIcon from "@mui/icons-material/BookOnlineRounded";
import CabinRoundedIcon from "@mui/icons-material/CabinRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import {
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";
import { sidebarItems } from "../../lib/data";
import { useAuth } from "../auth/auth-provider";

type Props = {
  children: ReactNode;
};

const drawerWidth = 260;

const itemIcons: Record<string, ReactNode> = {
  "/": <DashboardRoundedIcon fontSize="small" />,
  "/reservas": <BookOnlineRoundedIcon fontSize="small" />,
  "/chales": <CabinRoundedIcon fontSize="small" />,
  "/comodidades": <AppsRoundedIcon fontSize="small" />,
  "/clientes": <PeopleAltRoundedIcon fontSize="small" />,
  "/manutencao": <HandymanRoundedIcon fontSize="small" />,
  "/checklists": <ChecklistRoundedIcon fontSize="small" />,
  "/financeiro": <WalletRoundedIcon fontSize="small" />
};

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Dashboard",
    subtitle: "Painel geral da operacao"
  },
  "/reservas": {
    title: "Reservas",
    subtitle: "Controle de entradas, saidas e ocupacao"
  },
  "/chales": {
    title: "Chales",
    subtitle: "Cadastro, estrutura e precificacao"
  },
  "/clientes": {
    title: "Clientes",
    subtitle: "Base de hospedes e relacionamento"
  },
  "/comodidades": {
    title: "Comodidades",
    subtitle: "Inventario de itens vinculados aos chales"
  },
  "/manutencao": {
    title: "Manutenção",
    subtitle: "Chamados tecnicos e disponibilidade"
  },
  "/checklists": {
    title: "Checklists",
    subtitle: "Modelos e execucao de checklists operacionais"
  },
  "/financeiro": {
    title: "Financeiro",
    subtitle: "Receita, pagamentos e indicadores"
  }
};

function SidebarContent({
  pathname,
  userName,
  onClose
}: {
  pathname: string;
  userName: string;
  onClose?: () => void;
}) {
  return (
    <Stack sx={{ height: "100%" }}>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          px: 2,
          py: 2,
          minHeight: 64,
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            display: "grid",
            placeItems: "center",
            borderRadius: 1.5,
            bgcolor: "rgba(255,255,255,0.12)"
          }}
        >
          <CottageOutlinedIcon fontSize="small" />
        </Box>
        <Box>
          <Typography fontWeight={700} fontSize="1.1rem">
            Chalés AdminLTE
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)" }}>
            Hospedagem e operacao
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <Avatar sx={{ width: 34, height: 34, bgcolor: "#5a6268", fontSize: "0.95rem" }}>
          {userName.slice(0, 1).toUpperCase()}
        </Avatar>
        <Box>
          <Typography fontWeight={600} fontSize="0.95rem">
            {userName}
          </Typography>
          <Typography variant="caption" sx={{ color: "#00a65a" }}>
            Online
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ px: 2, py: 1.5 }}>
        <TextField
          size="small"
          placeholder="Buscar"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: "rgba(255,255,255,0.55)", fontSize: 18 }} />
              </InputAdornment>
            )
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.08)",
              color: "white",
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.08)"
              }
            },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255,255,255,0.55)",
              opacity: 1
            }
          }}
        />
      </Box>

      <Typography
        variant="caption"
        sx={{ px: 2, pb: 1, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}
      >
        MENU PRINCIPAL
      </Typography>

      <List disablePadding sx={{ px: 1.5, display: "grid", gap: 0.5 }}>
        {sidebarItems.map((item) => {
          const active = pathname === item.href;

          return (
            <ListItem key={item.href} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={onClose}
                sx={{
                  minHeight: 42,
                  px: 1.5,
                  borderRadius: 1,
                  color: active ? "white" : "rgba(255,255,255,0.82)",
                  bgcolor: active ? "var(--adminlte-sidebar-active)" : "transparent",
                  "&:hover": {
                    bgcolor: active ? "var(--adminlte-sidebar-active)" : "var(--adminlte-sidebar-hover)"
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 34,
                    color: "inherit"
                  }}
                >
                  {itemIcons[item.href]}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 400,
                    fontSize: "0.96rem"
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
}

export function AdminShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, session } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const userName = session?.user.nome ?? "Admin";
  const currentPage = useMemo(
    () =>
      pageMeta[pathname] ?? {
        title: "Painel administrativo",
        subtitle: "Gerencie a operacao diaria do sistema"
      },
    [pathname]
  );

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: "none",
            bgcolor: "var(--adminlte-sidebar-bg)",
            color: "white"
          }
        }}
      >
        <SidebarContent pathname={pathname} userName={userName} onClose={() => setMobileOpen(false)} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: "none",
            bgcolor: "var(--adminlte-sidebar-bg)",
            color: "white",
            boxShadow: "2px 0 8px rgba(0,0,0,0.15)"
          }
        }}
      >
        <SidebarContent pathname={pathname} userName={userName} />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box
          sx={{
            height: 57,
            px: { xs: 2, md: 3 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "var(--adminlte-topbar-bg)",
            borderBottom: "1px solid var(--adminlte-border)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "inline-flex", lg: "none" } }}
            >
              <MenuRoundedIcon />
            </IconButton>
            <Typography fontWeight={600}>{currentPage.title}</Typography>
            <Chip
              label={currentPage.subtitle}
              size="small"
              sx={{
                display: { xs: "none", md: "inline-flex" },
                bgcolor: "#e9f3f9",
                color: "primary.main",
                borderRadius: 1
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton>
              <Badge color="error" badgeContent={3}>
                <NotificationsNoneRoundedIcon />
              </Badge>
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <Chip
              label={session?.user.perfil ?? "admin"}
              size="small"
              sx={{ bgcolor: "#f8f9fa", borderRadius: 1 }}
            />
            <IconButton onClick={handleLogout}>
              <LogoutRoundedIcon />
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
