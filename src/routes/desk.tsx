import { createFileRoute } from "@tanstack/react-router";
import { HomeStation } from "@/components/home-station";

type DeskSearch = { sample?: string };

export const Route = createFileRoute("/desk")({
  validateSearch: (search: Record<string, unknown>): DeskSearch => {
    if (typeof search.sample !== "string" || search.sample.length === 0) return {};
    return { sample: search.sample };
  },
  component: DeskPage,
});

function DeskPage() {
  const { sample } = Route.useSearch();
  return <HomeStation sampleId={sample} />;
}
