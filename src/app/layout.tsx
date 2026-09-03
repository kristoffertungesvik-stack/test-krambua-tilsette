import type { Metadata, Viewport } from "next";
import { DataProvider } from "@/lib/store";
import SWRegister from "@/components/SWRegister";
import { BASE_PATH } from "@/lib/base-path";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krambua i Skånevik",
  description: "Tilsett-app og leiarvising for Krambua i Skånevik.",
  manifest: `${BASE_PATH}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Krambua",
  },
  icons: {
    icon: [
      { url: `${BASE_PATH}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${BASE_PATH}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: `${BASE_PATH}/icons/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#161826",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nn">
      <body>
        <DataProvider>{children}</DataProvider>
        <SWRegister />
      </body>
    </html>
  );
}
