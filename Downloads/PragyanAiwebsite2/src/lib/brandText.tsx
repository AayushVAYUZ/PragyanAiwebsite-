/**
 * Brand rule: "ai" is always lowercase. Uppercase-styled labels opt the word out of the
 * text transform so the rule holds wherever the design sets type in capitals.
 */
export function keepAiLowercase(text: string) {
  return text.split(/\b(ai)\b/g).map((part, i) =>
    part === "ai" ? (
      <span key={i} className="normal-case">
        ai
      </span>
    ) : (
      part
    ),
  );
}
