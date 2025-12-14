import { MotivatorPersonaPage } from "@/components/MotivatorPersonaPage";

export default function PenaltyBoxPhilosopherPage(): JSX.Element {
  return (
    <MotivatorPersonaPage
      title="Penalty Box Philosopher"
      subtitle={
        <>
          The game starts before the puck drops. Whether you need a pre-game
          boost or a post-game high five, we&apos;ve got the perfect message
          ready to text. Find the words, make them yours, and send the ❤️ love.
        </>
      }
      headerEmoji="🎓"
      dailyEmoji="💭"
      themes={[
        {
          id: "theme-1",
          title: "Theme One",
          emoji: "🧩",
          blurb: "Placeholder theme card content.",
        },
        {
          id: "theme-2",
          title: "Theme Two",
          emoji: "📚",
          blurb: "Placeholder theme card content.",
        },
        {
          id: "theme-3",
          title: "Theme Three",
          emoji: "🕯️",
          blurb: "Placeholder theme card content.",
        },
        {
          id: "theme-4",
          title: "Theme Four",
          emoji: "🧠",
          blurb: "Placeholder theme card content.",
        },
      ]}
    />
  );
}
