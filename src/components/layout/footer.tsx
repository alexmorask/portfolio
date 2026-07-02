interface FooterProps {
  children?: React.ReactNode;
}

export function Footer({ children }: FooterProps) {
  return (
    <footer className="flex items-center justify-between border-t border-white/8 px-5 py-6 lg:px-14 lg:py-8">
      <span className="font-mono text-xs text-text-faint">
        &copy; 2026 Alex Morask &middot; Remote
      </span>
      {children}
    </footer>
  );
}
