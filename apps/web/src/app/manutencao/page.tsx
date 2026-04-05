import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import { PageHeader } from "../../components/ui/page-header";

const tickets = [
  {
    chale: "Cabana da Serra",
    problema: "Vazamento no banheiro principal",
    status: "Em andamento",
    prioridade: "Alta"
  },
  {
    chale: "Chale das Araucarias",
    problema: "Revisao preventiva do aquecedor",
    status: "Agendada",
    prioridade: "Media"
  },
  {
    chale: "Chale Vista do Vale",
    problema: "Troca de fechadura eletronica",
    status: "Aberta",
    prioridade: "Alta"
  }
];

export default function ManutencaoPage() {
  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Manutencao"
        title="Operacao tecnica dos chales"
        description="Acompanhe chamados, priorizacao, responsaveis e impacto na disponibilidade operacional."
      />

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(3, minmax(0, 1fr))"
          }
        }}
      >
        {tickets.map((ticket) => (
          <Box key={`${ticket.chale}-${ticket.problema}`}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <BuildCircleOutlinedIcon color="primary" />
                    <Chip
                      icon={<WarningAmberRoundedIcon />}
                      label={ticket.prioridade}
                      color={ticket.prioridade === "Alta" ? "warning" : "info"}
                      variant="outlined"
                    />
                  </Stack>
                  <Typography variant="h6">{ticket.chale}</Typography>
                  <Typography color="text.secondary">{ticket.problema}</Typography>
                  <Typography fontWeight={700}>{ticket.status}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
