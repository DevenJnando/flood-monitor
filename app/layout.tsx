import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
    variable: "--font-lato",
    weight: "300",
    subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Flood and River Monitoring Service",
  description: "This app gives comprehensive breakdowns of all areas of flooding within the UK. " +
      "Details can be obtained with just a click. You can also view the levels and flow rates of every " +
      "river, coast, tipping bucket and groundwater monitoring station in the country.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
