"use client";

import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { FormEvent, startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/auth/auth-provider";

const defaultCredentials = {
  email: "admin@serra.local",
  senha: "admin123"
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState(defaultCredentials.email);
  const [senha, setSenha] = useState(defaultCredentials.senha);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, senha });
      startTransition(() => {
        router.replace("/");
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel entrar.");
      setIsSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 3,
        py: 6,
        background:
          "radial-gradient(circle at top left, rgba(15, 107, 99, 0.22), transparent 34%), radial-gradient(circle at bottom right, rgba(217, 119, 6, 0.18), transparent 28%), #F4F1EA"
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1080 }}>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            alignItems: "stretch",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.1fr) minmax(360px, 440px)"
            }
          }}
        >
          <Card
            sx={{
              display: { xs: "none", md: "block" },
              overflow: "hidden",
              position: "relative",
              backgroundImage:
                "linear-gradient(160deg, rgba(6, 33, 31, 0.72) 0%, rgba(6, 33, 31, 0.56) 45%, rgba(128, 76, 12, 0.42) 100%), url('/fortim_login.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "common.white"
            }}
          >
            <CardContent sx={{ p: 5, height: "100%", position: "relative", zIndex: 1 }}>
              <Stack justifyContent="space-between" sx={{ height: "100%" }}>
                <Stack spacing={3}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 4,
                      bgcolor: "rgba(255,255,255,0.14)"
                    }}
                  >
                    <CottageOutlinedIcon fontSize="large" />
                  </Box>
                  <Stack spacing={1.5}>
                    <Typography variant="overline" sx={{ letterSpacing: "0.18em", opacity: 0.8 }}>
                      Chalés Mahalo J
                    </Typography>
                    <Typography variant="h3">Operação central das suas hospedagens</Typography>
                    <Typography sx={{ maxWidth: 420, opacity: 0.82 }}>
                      Entre no painel para administrar reservas, disponibilidade, clientes e a rotina
                      dos chalés.
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                <Stack spacing={1}>
                  <Typography variant="h4">Entrar no painel</Typography>
                  <Typography color="text.secondary">
                    Faça login para liberar operacoes de escrita e administracao.
                  </Typography>
                </Stack>


                {error ? <Alert severity="error">{error}</Alert> : null}

                <TextField
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />

                <TextField
                  label="Senha"
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  autoComplete="current-password"
                  required
                />

                <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <CircularProgress size={18} color="inherit" />
                      <span>Entrando...</span>
                    </Stack>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
