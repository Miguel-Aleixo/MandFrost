import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sorveteria | Sabores Artesanais",
  description: "Descubra deliciosos sorvetes artesanais, sobremesas geladas e sabores únicos feitos para refrescar seu dia.",
  keywords: ["sorveteria", "sorvete artesanal", "sobremesas geladas", "sorvetes"],
  openGraph: {
    title: "Sorveteria | Sabores Artesanais",
    description: "Explore uma variedade de sorvetes artesanais e sobremesas geladas irresistíveis.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
