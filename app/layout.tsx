import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Devtrine — Mostre o que você construiu",
  description: "Descubra projetos reais e conheça as pessoas que os criaram.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
