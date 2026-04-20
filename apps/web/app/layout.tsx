import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DHP 商户履约风险控制台",
  description: "Design Handoff Protocol demo generated with Next.js and shadcn/ui compatible components."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
