import type { Lesson, LessonStep } from "../data/lessons";

import type {
  GeneratedLesson,
  GeneratedLessonStep,
} from "../types/lessonGeneration";

function adaptStep(step: GeneratedLessonStep): LessonStep {
  const baseStep: LessonStep = {
    chord: step.chord,
    title: step.title,
    instruction: step.instruction,
    tip: step.tip,
  };

  if (!step.transition) {
    return baseStep;
  }

  return {
    ...baseStep,

    transition: {
      from: step.transition.from,

      to: step.transition.to,

      instructions: [...step.transition.instructions],
    },
  };
}

export function generatedLessonToLesson(
  generatedLesson: GeneratedLesson,
): Lesson {
  return {
    id: generatedLesson.id,

    title: generatedLesson.title,

    description: generatedLesson.description,

    rhythm: {
      name: generatedLesson.rhythm.name,

      bpm: generatedLesson.rhythm.bpm,

      beats: [...generatedLesson.rhythm.beats],
    },

    steps: generatedLesson.steps.map(adaptStep),
  };
}
