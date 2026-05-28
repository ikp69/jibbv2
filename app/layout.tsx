import "./globals.css";

// This is the absolute root layout.
// It only provides the <html> and <body> tags.
// All locale-specific logic is in app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
