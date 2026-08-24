import { RadarScoreCard } from "./RadarScoreCard";
import { AutonomyCalculator } from "./AutonomyCalculator";

export function QuizAndAutonomy() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-6">
        <RadarScoreCard />
        <AutonomyCalculator />
      </div>
    </section>
  );
}
