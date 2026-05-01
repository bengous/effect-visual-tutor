import { createFileRoute } from "@tanstack/react-router";
import { LessonApp } from "../lesson-ui/LessonApp";

export const Route = createFileRoute("/")({
  component: HomePage,
});

export function HomePage() {
  return <LessonApp />;
}
