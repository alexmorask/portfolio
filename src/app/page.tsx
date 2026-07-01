import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">alexmorask.com</h1>
      <p className="text-muted-foreground">Under construction.</p>
      <Button
        nativeButton={false}
        render={<a href="https://github.com/alexmorask/portfolio">View source</a>}
      />
    </main>
  );
}
