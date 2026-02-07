import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/src/contexts/AppContext";
import "./globals.css";
import Header from "../components/layout/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luxion - Fitness Profesional",
  description:
    "Plataforma profesional de fitness con entrenadores certificados",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <>
      <Header />
      <html lang="es" className="dark">
        <body className={inter.className}>
          <App>
            <AppProvider>{children}</AppProvider>
          </App>
        </body>
      </html>
    </>
  );
}
