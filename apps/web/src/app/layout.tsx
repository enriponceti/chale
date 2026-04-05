import type { Metadata } from "next";
import { ReactNode } from "react";
import { AppFrame } from "../components/auth/app-frame";
import { AppThemeProvider } from "../theme/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Serra Admin",
  description: "Painel administrativo para operacao de chales"
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="pt-BR">
      <body>
        <AppThemeProvider>
          <AppFrame>{children}</AppFrame>
        </AppThemeProvider>
      </body>
    </html>
  );
}
