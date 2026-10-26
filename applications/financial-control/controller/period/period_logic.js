// ========================================
// PERIOD LOGIC
// ========================================

export function getPeriodData(data, targetMonth) {
  const currentDate = new Date();

  const currentMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  const targetExists = Boolean(data.months[targetMonth]);

  // ========================================
  // CURRENT / PAST MONTH
  // ========================================

  if (targetMonth <= currentMonth) {
    // ========================================
    // PAST MONTH
    // ========================================

    if (targetMonth < currentMonth && !targetExists) {
      return {
        status: "unavailable",
        month: targetMonth,
        reason: "month-not-found",
        isFuture: false,
      };
    }

    // ========================================
    // CURRENT MONTH
    // ========================================

    if (targetMonth === currentMonth && !targetExists) {
      const [year, month] = targetMonth.split("-").map(Number);

      const previousDate = new Date(year, month - 2, 1);

      const previousMonth = `${previousDate.getFullYear()}-${String(
        previousDate.getMonth() + 1,
      ).padStart(2, "0")}`;

      const previousExists = Boolean(data.months[previousMonth]);

      if (!previousExists) {
        return {
          status: "unavailable",
          month: targetMonth,
          reason: "previous-month-not-found",
          isFuture: false,
          previousMonth,
        };
      }

      return {
        status: "success",
        month: targetMonth,
        isFuture: false,
        exists: false,
        previousMonth,
      };
    }

    // ========================================
    // EXISTING CURRENT / PAST MONTH
    // ========================================

    return {
      status: "success",
      month: targetMonth,
      isFuture: false,
      exists: true,
    };
  }

  // ========================================
  // PREVIOUS MONTH
  // ========================================

  const [year, month] = targetMonth.split("-").map(Number);

  const previousDate = new Date(year, month - 2, 1);

  const previousMonth = `${previousDate.getFullYear()}-${String(
    previousDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  const previousExists = Boolean(data.months[previousMonth]);

  // ========================================
  // PREVIOUS MONTH UNAVAILABLE
  // ========================================

  if (!previousExists) {
    return {
      status: "unavailable",
      month: targetMonth,
      reason: "previous-month-not-found",
      isFuture: true,
      previousMonth,
    };
  }

  // ========================================
  // FUTURE MONTH
  // ========================================

  return {
    status: "success",
    month: targetMonth,
    isFuture: true,
    exists: targetExists,
    previousMonth,
  };
}
