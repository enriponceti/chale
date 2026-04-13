import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 3,
        background:
          "radial-gradient(circle at top, rgba(15, 107, 99, 0.14), transparent 42%), #F4F1EA"
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            width: 64,
            height: 64,
            display: "grid",
            placeItems: "center",
            borderRadius: 4,
            background: "linear-gradient(135deg, #0F6B63 0%, #D97706 100%)",
            color: "white"
          }}
        >
          <CottageOutlinedIcon fontSize="large" />
        </Box>
        <CircularProgress size={28} />
        <Typography color="text.secondary">Carregando painel administrativo...</Typography>
      </Stack>
    </Box>
  );
}
