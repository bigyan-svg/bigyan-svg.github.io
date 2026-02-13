import { PublishStatus } from "@prisma/client";

export function publishedFilter() {
  const now = new Date();
  return {
    OR: [
      {
        status: PublishStatus.PUBLISHED,
        OR: [{ publishAt: null }, { publishAt: { lte: now } }]
      },
      {
        status: PublishStatus.SCHEDULED,
        publishAt: { lte: now }
      }
    ]
  };
}

export function parsePublishAt(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}
