// ========================================
// FINANCIAL CONTROL FORMATTER
// ========================================

// ========================================
// CURRENCY
// Default: R$ 2,000.00 / R$ -2,000.00
// ========================================

export function formatCurrency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  }).format(Math.abs(amount));

  return amount < 0
    ? formatted.replace("R$", "R$ -")
    : formatted.replace("R$", "R$ ");
}

// ========================================
// CURRENCY SIGNED
// + R$ 2,000.00 / − R$ 2,000.00
// ========================================

export function formatCurrencySigned(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  const sign = amount < 0 ? "−" : "+";

  return `${sign} ${formatCurrency(Math.abs(amount))}`;
}

// ========================================
// ========================================

export function formatPercentage(value) {
  if (value === null) {
    return "—";
  }

  const prefix = value > 0 ? "+" : "";

  return `${prefix}${value.toFixed(2)}%`;
}

// ========================================
// MONEY OPERATIONS
// ========================================

export function addMoney(valueA, valueB) {
  return (
    (Math.round(Number(valueA) * 100) + Math.round(Number(valueB) * 100)) / 100
  );
}

export function subtractMoney(valueA, valueB) {
  return (
    (Math.round(Number(valueA) * 100) - Math.round(Number(valueB) * 100)) / 100
  );
}

// ========================================
// DATE
// ========================================

export function formatDateShort(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();

  return `${day} ${month}`;
}

// ========================================
// DATE
// ========================================

export function formatDateDayMonth(day, month) {
  const [year, monthNumber] = month.split("-");

  const months = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];

  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = months[Number(monthNumber) - 1];

  return `${formattedDay} ${formattedMonth}`;
}
