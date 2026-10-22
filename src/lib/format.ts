const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Accepts "YYYY-M-D" or "YYYY-MM-DD" and avoids timezone shifts from Date parsing.
export function formatNewsDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day || month < 1 || month > 12) return value;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
