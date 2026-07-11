import Link from "next/link";

interface FooterProps {
  readonly showContact?: boolean;
}

export function Footer({ showContact = false }: FooterProps) {
  return (
    <footer className="flex flex-col items-center gap-3 border-t border-white/8 px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-8">
      <span className="text-center font-mono text-xs text-text-faint">
        &copy; 2026 Alex Morask &middot; Chicago, IL
      </span>

      <div className="flex flex-col items-center gap-[10px] lg:flex-row lg:items-center lg:gap-6">
        <Link
          href="https://github.com/alexmorask"
          className="font-mono text-xs font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
        >
          github.com/alexmorask
        </Link>
        <Link
          href="https://linkedin.com/in/alexmorask"
          className="font-mono text-xs font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
        >
          linkedin.com/in/alexmorask
        </Link>

        {showContact && (
          <Link
            href="/contact"
            className="font-mono text-xs font-semibold text-primary transition-colors duration-150 hover:text-foreground"
          >
            Get in touch &rarr;
          </Link>
        )}
      </div>
    </footer>
  );
}
