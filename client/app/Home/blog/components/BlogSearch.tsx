import { Search } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Reveal } from "@/app/components/ui/reveal";

type BlogSearchProps = {
  onQueryChange: (value: string) => void;
  query: string;
  resultCount: number;
};

export default function BlogSearch({ onQueryChange, query, resultCount }: BlogSearchProps) {
  return (
    <Reveal variant="left">
      <div className="space-y-4">
        <Badge className="w-fit">
          <Search className="h-4 w-4 text-accent-foreground" />
          Search articles
        </Badge>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/36" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search finance workflows, dashboards, approvals..."
            className="h-14 rounded-[1.35rem] pl-11"
          />
        </div>
        <p className="text-sm text-foreground/58">
          {resultCount} article{resultCount === 1 ? "" : "s"} matching your current view.
        </p>
      </div>
    </Reveal>
  );
}
