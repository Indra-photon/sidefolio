import { cn } from "@/lib/utils";

/** Figure that frames an interactive example inside prose. */
export function Demo({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "my-8 flex min-h-48 flex-col items-center justify-center gap-6 rounded-2xl bg-card px-6 py-10 shadow-border",
        className,
      )}
    >
      {children}
    </figure>
  );
}
