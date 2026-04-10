import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 3,
        py: 6,
        background:
          "radial-gradient(circle at top left, rgba(15, 107, 99, 0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(217, 119, 6, 0.14), transparent 28%), #F4F1EA"
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        sx={{
          width: "100%",
          maxWidth: 520,
          textAlign: "center",
          p: 4,
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.86)",
          boxShadow: "0 24px 64px rgba(38, 46, 56, 0.12)"
        }}
      >
        <Typography variant="overline" color="primary.main">
          Erro 404
        </Typography>
        <Typography variant="h3">Pagina nao encontrada</Typography>
        <Typography color="text.secondary">
          O conteudo que voce tentou acessar nao existe ou foi movido dentro do painel.
        </Typography>
        <Button component={Link} href="/" variant="contained" size="large">
          Voltar ao painel
        </Button>
      </Stack>
    </Box>
  );
}
