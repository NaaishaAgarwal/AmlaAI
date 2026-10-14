import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import { ProgressProvider } from "@/lib/progress-context";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amla AI",
  description: "Amla AI helps you learn artificial intelligence one step at a time.",
  openGraph: {
    title: "Amla AI",
    description: "Amla AI helps you learn artificial intelligence one step at a time.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${atkinson.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var raw=localStorage.getItem("meet-ai-progress-v1");if(!raw)return;var size=JSON.parse(raw).textSize;if(size)document.documentElement.dataset.textSize=size;}catch(e){}',
          }}
        />
      </head>
      <body className="min-h-full bg-paper text-ink">
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
