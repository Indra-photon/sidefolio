import clsx from "clsx";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        className,
        "prose prose-md p-8 prose-blue max-w-none prose-p:text-neutral-300 prose-headings:text-primary"
      )}
    >
      {children}
    </div>
  );
}
