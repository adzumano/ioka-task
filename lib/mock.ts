type MockScenario = "success" | "empty" | "error";

const MOCK_SCENARIO: MockScenario | "random" = "random";

const RANDOM_WEIGHTS = {
  success: 0.7, // 70% — нормальный ответ
  empty: 0.15, // 15% — пустой массив
  error: 0.15, // 15% — 500 ошибка
};

export const getScenario = (): MockScenario => {
  if (MOCK_SCENARIO !== "random") return MOCK_SCENARIO;

  const rand = Math.random();
  if (rand < RANDOM_WEIGHTS.success) return "success";
  if (rand < RANDOM_WEIGHTS.success + RANDOM_WEIGHTS.empty) return "empty";
  return "error";
};
