import { AuthProvider } from "@/providers/AuthProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "My Next.js App",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
         <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}