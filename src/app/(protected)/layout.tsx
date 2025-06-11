// app/(protected)/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authentication")?.value;

  try {
    const res = await fetch("/api/auth/validate", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Unauthorized");
  } catch (error) {
    redirect("/login");
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();

  return (
    <div className="protected-layout">
      <header>Protected Area</header>
      <main>{children}</main>
    </div>
  );
}