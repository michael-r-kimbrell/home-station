import { createFileRoute } from "@tanstack/react-router";
import { HomeStation } from "@/components/home-station";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <HomeStation />;
}
