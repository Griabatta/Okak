// app/(public)/layout.tsx
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-layout">
      <header>Public Header</header>
      <main>{children}</main>
    </div>
  );
}