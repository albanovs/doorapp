import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import Providers from "./store/Providers";

const montserrat = Montserrat({
  subsets: ["cyrillic"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const lato = Lato({
  subsets: ["cyrillic"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata = {
  title: "Приложение Двери",
  description: "XO web студия",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable} ${lato.variable}  antialiased font-lato`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
