"use client";

import {
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

type Row = {
  id: number;
  cliente: string;
  chale: string;
  periodo: string;
  status: string;
  origem: string;
  valor: string;
};

const statusColor: Record<string, "success" | "warning" | "info" | "default"> = {
  Confirmada: "success",
  Pendente: "warning",
  Hospedado: "info",
  Finalizada: "default",
  Cancelada: "default"
};

type Props = {
  rows: Row[];
  title: string;
};

export function ReservationsTable({ rows, title }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">{title}</Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reserva</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Chale</TableCell>
                <TableCell>Periodo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Origem</TableCell>
                <TableCell align="right">Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>#{row.id}</TableCell>
                  <TableCell>{row.cliente}</TableCell>
                  <TableCell>{row.chale}</TableCell>
                  <TableCell>{row.periodo}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={statusColor[row.status] ?? "info"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{row.origem}</TableCell>
                  <TableCell align="right">{row.valor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      </CardContent>
    </Card>
  );
}
