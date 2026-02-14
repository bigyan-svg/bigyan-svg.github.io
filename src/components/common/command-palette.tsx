"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { usePortfolioContent } from "@/components/content/content-provider";
import { cn } from "@/lib/utils";

type GroupName = "Pages" | "Sections" | "Actions";

const groups: GroupName[] = ["Pages", "Sections", "Actions"];

export function CommandPalette({ compact = false, className }: { compact?: boolean; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { commandItems } = usePortfolioContent();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const groupedItems = useMemo(() => {
    return groups.map((group) => ({
      group,
      items: commandItems.filter((item) => item.group === group)
    }));
  }, [commandItems]);

  const navigate = (href: string) => {
    const [path, hash] = href.split("#");
    const targetPath = path || "/";

    if (hash && pathname === targetPath) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (window.location.hash !== `#${hash}`) {
        window.history.pushState(null, "", `${targetPath}#${hash}`);
      }
      return;
    }

    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "items-center gap-2 rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground",
          compact ? "inline-flex h-10 w-10 justify-center px-0" : "inline-flex",
          className
        )}
        aria-label="Open command palette"
      >
        <Search className="size-3.5" />
        {!compact ? (
          <>
            Search
            <span className="rounded-md border border-border/70 px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</span>
          </>
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 p-4 pt-20 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-xl"
            >
              <Command
                label="Command palette"
                className="overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-[0_30px_80px_-45px_rgba(4,18,42,0.52)]"
              >
                <div className="flex items-center border-b border-border/70 px-3">
                  <Search className="size-4 text-muted-foreground" />
                  <Command.Input
                    autoFocus
                    placeholder="Jump to page or section..."
                    className="h-12 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>

                <Command.List className="max-h-[360px] overflow-y-auto p-2">
                  <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No result found.
                  </Command.Empty>

                  {groupedItems.map(({ group, items }) => (
                    <Command.Group key={group} heading={group}>
                      <div className="px-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {group}
                      </div>
                      {items.map((item) => (
                        <Command.Item
                          key={item.id}
                          value={item.label}
                          onSelect={() => {
                            navigate(item.href);
                            setOpen(false);
                          }}
                          className={cn(
                            "mt-1 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground",
                            "data-[selected=true]:bg-primary/15 data-[selected=true]:text-primary"
                          )}
                        >
                          <span>{item.label}</span>
                          <span className="text-xs text-muted-foreground">{item.href}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ))}
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
