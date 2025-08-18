// Convert to E.164 (e.g., +2348030671801)
module.exports = function normalizePhone(number) {
  const digits = (number || "").replace(/\D/g, "");
  if (!digits) return "";

  // If starts with '0' and looks like NG local, swap leading 0 with +234
  if (digits.length === 11 && digits.startsWith("0")) {
    return `+234${digits.slice(1)}`;
  }

  // If already starts with country code (234...) add '+'
  if (digits.startsWith("234")) {
    return `+${digits}`;
  }

  // If already has '+' and correct, just return as-is from the raw number:
  if (number.trim().startsWith("+")) return number.trim();

  // Fallback: assume it's already full; just add +
  return `+${digits}`;
};
