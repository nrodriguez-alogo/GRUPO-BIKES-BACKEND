import { randomInt, createHash } from "node:crypto";
export function recoveryCode() {
  const lower = "abcdefghijklmnopqrstuvwxyz",
    upper = lower.toUpperCase(),
    digits = "0123456789",
    symbols = ".-$";
  const pick = (s) => s[randomInt(s.length)];
  const chars = [
    pick(lower),
    pick(upper),
    pick(digits),
    pick(symbols),
    pick(symbols),
  ];
  while (chars.length < 10) chars.push(pick(lower + upper + digits));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}
export const hashCode = (code) =>
  createHash("sha256").update(code).digest("hex");
