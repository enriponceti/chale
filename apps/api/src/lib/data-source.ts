import { env } from "../config/env.js";

export function isMockMode() {
  return env.USE_MOCK_DATA;
}
