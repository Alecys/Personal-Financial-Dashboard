// ========================================
// HEADER
// ========================================

export async function getHeaderData(data) {
  const currentMonth = data.currentMonth;

  // ========================================
  // CURRENT MONTH
  // ========================================

  const [year, month] = currentMonth.split("-").map(Number);

  const date = new Date(year, month - 1, 1);

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);

  // ========================================
  // PREVIOUS MONTH
  // ========================================

  const previousDate = new Date(year, month - 2, 1);

  const previousMonth = `${previousDate.getFullYear()}-${String(
    previousDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  // ========================================
  // NEXT MONTH
  // ========================================

  const nextDate = new Date(year, month, 1);

  const nextMonth = `${nextDate.getFullYear()}-${String(
    nextDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  // ========================================
  // RETURN
  // ========================================

  return {
    currentMonth,
    monthName,
    previousMonth,
    nextMonth,
  };
}
