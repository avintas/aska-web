import { MotivatorPersonaPage } from "@/components/MotivatorPersonaPage";

export default function BenchBossPage(): JSX.Element {
  return (
    <MotivatorPersonaPage
      title="Bench Boss"
      subtitle="Daily motivators. Placeholder content for grid testing."
      headerEmoji="💪"
      dailyEmoji="📋"
      themes={[
        {
          id: "theme-1",
          title: "Theme One",
          emoji: "🏋️",
          blurb: "Placeholder theme card content.",
        },
        {
          id: "theme-2",
          title: "Theme Two",
          emoji: "🧠",
          blurb: "Placeholder theme card content.",
        },
        {
          id: "theme-3",
          title: "Theme Three",
          emoji: "🧊",
          blurb: "Placeholder theme card content.",
        },
        {
          id: "theme-4",
          title: "Theme Four",
          emoji: "🏒",
          blurb: "Placeholder theme card content.",
        },
      ]}
    />
  );
}
