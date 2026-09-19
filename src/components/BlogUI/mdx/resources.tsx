import { cn } from "@/lib/utils";

export type ResourceItem = {
  url: string;
  domain: string;
  title: string;
  description?: string;
};

/** Row list used at the bottom of each post and inline via `<LinkList>`. */
export function ResourceList({
  resources,
  className,
}: {
  resources: ResourceItem[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {resources.map((resource) => (
        <li key={resource.url}>
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="-mx-2.5 flex items-center gap-3 rounded-md px-2.5 py-2.5 transition-colors hover:bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://www.google.com/s2/favicons?domain=${resource.domain}&sz=64`}
              alt=""
              width={16}
              height={16}
              loading="lazy"
              className="size-4 shrink-0 rounded-[3px]"
            />
            <span className="min-w-0 truncate text-body text-muted-foreground">
              <span className="text-foreground">{resource.title}</span>
              {resource.description && <span> - {resource.description}</span>}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Resources({ resources }: { resources: ResourceItem[] }) {
  if (resources.length === 0) return null;
  return (
    <section className="mt-14">
      <h2 className="text-card-header font-medium text-foreground">Resources</h2>
      <ResourceList className="mt-3" resources={resources} />
    </section>
  );
}

/** Inline list of links in prose. `domain` is derived from the URL when omitted. */
export function LinkList({
  links,
}: {
  links: { url: string; title: string; description?: string; domain?: string }[];
}) {
  return (
    <ResourceList
      className="my-4"
      resources={links.map((link) => ({
        ...link,
        domain: link.domain ?? new URL(link.url).hostname,
      }))}
    />
  );
}
