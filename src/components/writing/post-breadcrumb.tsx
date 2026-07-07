import Link from "next/link";

export function PostBreadcrumb({ title }: { title: string }) {
  return (
    <div className="px-5 pt-[18px] lg:px-14">
      <Link
        href="/"
        className="font-mono text-xs text-text-faint transition-colors duration-150 hover:text-primary"
      >
        Home
      </Link>
      <span className="font-mono text-xs text-text-faint"> / </span>
      <Link
        href="/writing"
        className="font-mono text-xs text-text-faint transition-colors duration-150 hover:text-primary"
      >
        Writing
      </Link>
      <span className="font-mono text-xs text-text-faint"> / </span>
      <span className="font-mono text-xs text-muted-foreground">
        <span className="hidden lg:inline">{title}</span>
        <span className="lg:hidden">{title.length > 30 ? `${title.slice(0, 30)}...` : title}</span>
      </span>
    </div>
  );
}
