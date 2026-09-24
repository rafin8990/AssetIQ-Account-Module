"use client";

import { useState } from "react";

export function defaultReportFromDate() {
  return `${new Date().getFullYear()}-01-01`;
}

export function defaultReportToDate() {
  return new Date().toISOString().slice(0, 10);
}

export function useReportPeriod() {
  const [fromDate, setFromDate] = useState(defaultReportFromDate);
  const [toDate, setToDate] = useState(defaultReportToDate);
  return { fromDate, toDate, setFromDate, setToDate };
}
