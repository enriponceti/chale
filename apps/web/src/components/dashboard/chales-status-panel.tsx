"use client";

import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import { Box, Card, CardContent, Chip, Link, Stack, Tooltip, Typography } from "@mui/material";

type ChaleStatusCard = {
  id: number;
  codigo: string;
  nome: string;
  status: "disponivel" | "reservado" | "manutencao";
  detalhe: string;
  clienteNome?: string;
  clienteTelefone?: string;
};

type Props = {
  cards: ChaleStatusCard[];
};

const statusMap = {
  disponivel: {
    label: "Disponivel",
    color: "success" as const
  },
  reservado: {
    label: "Reservado",
    color: "warning" as const
  },
  manutencao: {
    label: "Manutenção",
    color: "default" as const
  }
};

export function ChalesStatusPanel({ cards }: Props) {
  return (
    <Card sx={{ borderTop: "3px solid", borderTopColor: "primary.main" }}>
      <CardContent sx={{ p: 0 }}>
        <Stack spacing={0}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Painel de reservas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status atual de todos os chales cadastrados
              </Typography>
            </Box>
            <Chip
              label={`${cards.length} chales`}
              size="small"
              sx={{ bgcolor: "#eef3f7", color: "primary.main", borderRadius: 1 }}
            />
          </Stack>

          <Box
            sx={{
              px: 2.5,
              pb: 2.5,
              display: "grid",
              gap: 1.5,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
                xl: "repeat(4, minmax(0, 1fr))"
              }
            }}
          >
            {cards.map((card) => {
              const currentStatus = statusMap[card.status];
              const borderColor =
                card.status === "disponivel"
                  ? "success.main"
                  : card.status === "reservado"
                    ? "warning.main"
                    : "text.secondary";

              return (
                <Box
                  key={card.id}
                  sx={{
                    p: 1.75,
                    borderRadius: 1.5,
                    borderTop: "3px solid",
                    borderTopColor: borderColor,
                    borderInline: "1px solid #dee2e6",
                    borderBottom: "1px solid #dee2e6",
                    backgroundColor: "#fff"
                  }}
                >
                  <Stack spacing={1.25}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={700}>
                          {card.codigo}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                          {card.nome}
                        </Typography>
                      </Box>
                      <MeetingRoomRoundedIcon color="primary" fontSize="small" sx={{ mt: 0.25 }} />
                    </Stack>

                    <Chip
                      label={currentStatus.label}
                      color={currentStatus.color}
                      size="small"
                      variant="outlined"
                      sx={{ width: "fit-content", borderRadius: 1 }}
                    />

                    <Typography variant="body2" color="text.secondary">
                      {card.detalhe}
                    </Typography>

                    {card.status === "reservado" && card.clienteNome ? (
                      <Tooltip
                        arrow
                        placement="top-start"
                        title={
                          <Stack spacing={0.5}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: "white" }}>
                              {card.clienteNome}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "white" }}>
                              {card.clienteTelefone || "Telefone nao informado"}
                            </Typography>
                          </Stack>
                        }
                      >
                        <Link
                          component="button"
                          type="button"
                          underline="hover"
                          sx={{
                            width: "fit-content",
                            p: 0,
                            border: "none",
                            background: "transparent",
                            color: "primary.main",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          Ver cliente da reserva
                        </Link>
                      </Tooltip>
                    ) : null}
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
