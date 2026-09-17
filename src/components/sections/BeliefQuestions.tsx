import { QuestionCard } from "./BeliefFrame";
import { BELIEF_QUESTIONS } from "./beliefContent";

/**
 * Frame 05 questions on screens without room for the node network: the pinned
 * arrival viewport keeps the headline, and the six questions follow directly in
 * normal flow before Frame 06. Hidden on large screens, where they orbit the node.
 */
export default function BeliefQuestions() {
  return (
    <div className="relative bg-[var(--void-black)] px-[var(--gutter-x)] pt-4 pb-16 lg:hidden">
      <ul aria-label="The questions that come first" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BELIEF_QUESTIONS.map((question) => (
          <li key={question.label}>
            <QuestionCard {...question} />
          </li>
        ))}
      </ul>
    </div>
  );
}
