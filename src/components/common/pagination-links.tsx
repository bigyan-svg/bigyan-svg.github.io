import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

type Pagination = {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export function PaginationLinks(props: {
  pagination: Pagination;
  buildHref: (page: number) => string;
}) {
  const { pagination, buildHref } = props;
  return (
    <div className="mt-10 flex items-center justify-between">
      {pagination.hasPrev ? (
        <Link className={buttonVariants({ variant: "outline" })} href={buildHref(pagination.page - 1)}>
          Previous
        </Link>
      ) : (
        <Button variant="outline" disabled>
          Previous
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        Page {pagination.page} of {pagination.totalPages}
      </p>
      {pagination.hasNext ? (
        <Link className={buttonVariants({ variant: "outline" })} href={buildHref(pagination.page + 1)}>
          Next
        </Link>
      ) : (
        <Button variant="outline" disabled>
          Next
        </Button>
      )}
    </div>
  );
}
