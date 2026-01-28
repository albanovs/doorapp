import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
      <body className={`${montserrat.variable} ${lato.variable} bg-[#F7F7F7] antialiased font-lato`}>
        <div className="min-h-screen">
          <Sidebar />
          <main className="lg:ml-21  p-2 my-20 lg:p-0 lg:my-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
