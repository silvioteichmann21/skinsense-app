export type QuizAnswers = {
  concerns: string[];
  skinType: string | null;
  routine: string | null;
  ageRange: string | null;
  goals: string[];
};

export const emptyQuizAnswers = (): QuizAnswers => ({
  concerns: [],
  skinType: null,
  routine: null,
  ageRange: null,
  goals: [],
});
