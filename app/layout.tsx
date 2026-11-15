import type { Metadata } from "next";
import "./globals.css"
import { Orbitron, Montserrat } from 'next/font/google'
import TopBar from './topBar/page'

const orbitron = Orbitron({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-orbitron"
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-montserrat"
})

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className = {`${orbitron.variable} ${montserrat.variable}`}>
      <body>
        <TopBar/>
        <main>{children}</main>
      </body>
    </html>
  );
}
