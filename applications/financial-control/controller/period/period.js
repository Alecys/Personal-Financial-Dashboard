// ========================================
// PERIOD
// ========================================

export async function navigateToMonth(targetMonth) {
  const { getFinancialControlData } = await import(
    globalThis.path.financialControl.data.js
  );

  const { getPeriodData } = await import(
    globalThis.path.financialControl.controller.period.logic
  );

  const { synchronizeFutureMonth } = await import(
    globalThis.path.financialControl.controller.period.sync
  );

  const { notifyFinancialControlLogic } = await import(
    globalThis.path.financialControl.notify.logic
  );

  const { notifyFinancialControlView } = await import(
    globalThis.path.financialControl.notify.view
  );

  const { saveFinancialControlData } = await import(
    globalThis.path.financialControl.data.save
  );

  // ========================================
  // DATA
  // ========================================

  const data = getFinancialControlData();

  // ========================================
  // PERIOD
  // ========================================

  const periodData = getPeriodData(data, targetMonth);

  // ========================================
  // UNAVAILABLE
  // ========================================

  if (periodData.status === "unavailable") {
    return periodData;
  }

  // ========================================
  // SYNCHRONIZE MONTH
  // ========================================

  if (periodData.isFuture || (!periodData.isFuture && !periodData.exists)) {
    await synchronizeFutureMonth(data, targetMonth, periodData.previousMonth);
  }

  // ========================================
  // CURRENT MONTH
  // ========================================

  data.currentMonth = targetMonth;

  // ========================================
  // NOTIFY LOGIC
  // ========================================

  await notifyFinancialControlLogic(data);

  // ========================================
  // NOTIFY VIEW
  // ========================================

  await notifyFinancialControlView(data);

  // ========================================
  // SAVE
  // ========================================

  await saveFinancialControlData(data);

  // ========================================
  // SUCCESS
  // ========================================

  return {
    status: "success",

    month: targetMonth,
  };
}
