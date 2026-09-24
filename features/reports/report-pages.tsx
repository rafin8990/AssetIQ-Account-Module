"use client";

import { useEffect, useState } from "react";

import type { ReportRow, StatementSection } from "./data";
import {
  fetchBalanceSheet,
  fetchCashFlow,
  fetchGeneralLedger,
  fetchJournal,
  fetchProfitLoss,
  fetchTrialBalance,
} from "./api/financial-reports";
import {
  buildAgingReportRows,
  buildCashBankReportRows,
  buildExpenseReportRows,
  buildIncomeReportRows,
  buildPayableReportRows,
  buildReceivableReportRows,
} from "./api/operational-reports";
import { StatementReport } from "./statement-report";
import { TableReport } from "./table-report";
import { useReportPeriod } from "./use-report-period";

function useLiveRows(
  loader: (fromDate: string, toDate: string) => Promise<ReportRow[]>,
  fromDate: string,
  toDate: string,
  deps: unknown[] = []
) {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const result = await loader(fromDate, toDate);
        if (cancelled) return;
        setRows(result);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setRows([]);
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, ...deps]);

  return { rows, loading, error };
}

export function TrialBalanceReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const { rows, loading, error } = useLiveRows(
    fetchTrialBalance,
    fromDate,
    toDate
  );

  return (
    <TableReport
      title="Trial Balance"
      description="Debit and credit balances of all ledger accounts for the selected period."
      columns={[
        { key: "account", label: "Account" },
        { key: "debit", label: "Debit", align: "right" },
        { key: "credit", label: "Credit", align: "right" },
      ]}
      rows={rows}
      currencyKeys={["debit", "credit"]}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      loading={loading}
      error={error}
    />
  );
}

export function ProfitLossReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const [sections, setSections] = useState<StatementSection[]>([]);
  const [netAmount, setNetAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const result = await fetchProfitLoss(fromDate, toDate);
        if (cancelled) return;
        setSections(result.sections);
        setNetAmount(result.netAmount);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setSections([]);
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fromDate, toDate]);

  return (
    <StatementReport
      title="Profit & Loss Statement"
      description="Income and expense summary for the reporting period."
      sections={sections}
      netLabel="Net Profit"
      netAmount={netAmount}
      footerNote="Prepared under Accrual basis from posted vouchers"
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      loading={loading}
      error={error}
    />
  );
}

export function BalanceSheetReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const [sections, setSections] = useState<StatementSection[]>([]);
  const [footerNote, setFooterNote] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const result = await fetchBalanceSheet(toDate);
        if (cancelled) return;
        setSections(result.sections);
        setFooterNote(result.footerNote);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setSections([]);
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toDate]);

  return (
    <StatementReport
      title="Balance Sheet"
      description="Assets, liabilities, and equity position as of period end."
      sections={sections}
      footerNote={footerNote}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      loading={loading}
      error={error}
    />
  );
}

export function CashFlowReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const [sections, setSections] = useState<StatementSection[]>([]);
  const [netAmount, setNetAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const result = await fetchCashFlow(fromDate, toDate);
        if (cancelled) return;
        setSections(result.sections);
        setNetAmount(result.netAmount);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setSections([]);
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fromDate, toDate]);

  return (
    <StatementReport
      title="Cash Flow Statement"
      description="Cash movements from operating, investing, and financing activities."
      sections={sections}
      netLabel="Net Change in Cash"
      netAmount={netAmount}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      loading={loading}
      error={error}
    />
  );
}

export function GeneralLedgerReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const { rows, loading, error } = useLiveRows(
    fetchGeneralLedger,
    fromDate,
    toDate
  );

  return (
    <TableReport
      title="General Ledger"
      description="Account movements with running balances."
      columns={[
        { key: "date", label: "Date" },
        { key: "account", label: "Account" },
        { key: "reference", label: "Reference" },
        { key: "debit", label: "Debit", align: "right" },
        { key: "credit", label: "Credit", align: "right" },
        { key: "balance", label: "Balance", align: "right" },
      ]}
      rows={rows}
      currencyKeys={["debit", "credit", "balance"]}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      loading={loading}
      error={error}
    />
  );
}

export function JournalReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const { rows, loading, error } = useLiveRows(fetchJournal, fromDate, toDate);

  return (
    <TableReport
      title="Journal Report"
      description="Chronological journal entry lines for the selected period."
      columns={[
        { key: "date", label: "Date" },
        { key: "entryNo", label: "Entry No" },
        { key: "account", label: "Account" },
        { key: "debit", label: "Debit", align: "right" },
        { key: "credit", label: "Credit", align: "right" },
      ]}
      rows={rows}
      currencyKeys={["debit", "credit"]}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      loading={loading}
      error={error}
    />
  );
}

export function IncomeReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const { rows, loading, error } = useLiveRows(
    buildIncomeReportRows,
    fromDate,
    toDate
  );

  return (
    <TableReport
      title="Income Report"
      description="Income breakdown by category."
      columns={[
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount", align: "right" },
        { key: "share", label: "Share", align: "right" },
      ]}
      rows={rows}
      currencyKeys={["amount"]}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      loading={loading}
      error={error}
    />
  );
}

export function ExpenseReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const { rows, loading, error } = useLiveRows(
    buildExpenseReportRows,
    fromDate,
    toDate
  );

  return (
    <TableReport
      title="Expense Report"
      description="Expense breakdown by category."
      columns={[
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount", align: "right" },
        { key: "share", label: "Share", align: "right" },
      ]}
      rows={rows}
      currencyKeys={["amount"]}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      loading={loading}
      error={error}
    />
  );
}

export function ReceivableReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const result = await buildReceivableReportRows();
        if (cancelled) return;
        setRows(result);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <TableReport
      title="Receivable Report"
      description="Customer outstanding and overdue balances."
      columns={[
        { key: "customer", label: "Customer" },
        { key: "invoices", label: "Invoices", align: "right" },
        { key: "outstanding", label: "Outstanding", align: "right" },
        { key: "overdue", label: "Overdue", align: "right" },
      ]}
      rows={rows}
      currencyKeys={["outstanding", "overdue"]}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      showDates={false}
      loading={loading}
      error={error}
    />
  );
}

export function PayableReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const result = await buildPayableReportRows();
        if (cancelled) return;
        setRows(result);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <TableReport
      title="Payable Report"
      description="Supplier outstanding and overdue balances."
      columns={[
        { key: "supplier", label: "Supplier" },
        { key: "bills", label: "Bills", align: "right" },
        { key: "outstanding", label: "Outstanding", align: "right" },
        { key: "overdue", label: "Overdue", align: "right" },
      ]}
      rows={rows}
      currencyKeys={["outstanding", "overdue"]}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      showDates={false}
      loading={loading}
      error={error}
    />
  );
}

export function AgingReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const result = await buildAgingReportRows();
        if (cancelled) return;
        setRows(result);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <TableReport
      title="Aging Reports"
      description="Receivable and payable aging across current, 1–30, 31–60, and 61–90+ buckets."
      columns={[
        { key: "party", label: "Party" },
        { key: "type", label: "Type" },
        { key: "current", label: "Current", align: "right" },
        { key: "d30", label: "1-30", align: "right" },
        { key: "d60", label: "31-60", align: "right" },
        { key: "d90", label: "61-90+", align: "right" },
        { key: "total", label: "Total", align: "right" },
      ]}
      rows={rows}
      currencyKeys={["current", "d30", "d60", "d90", "total"]}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      showDates={false}
      loading={loading}
      error={error}
    />
  );
}

export function CashBankReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();
  const { rows, loading, error } = useLiveRows(
    buildCashBankReportRows,
    fromDate,
    toDate
  );

  return (
    <TableReport
      title="Cash / Bank Report"
      description="Opening, inflows, outflows, and closing balances by cash and bank account."
      columns={[
        { key: "account", label: "Account" },
        { key: "opening", label: "Opening", align: "right" },
        { key: "inflows", label: "Inflows", align: "right" },
        { key: "outflows", label: "Outflows", align: "right" },
        { key: "closing", label: "Closing", align: "right" },
      ]}
      rows={rows}
      currencyKeys={["opening", "inflows", "outflows", "closing"]}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      loading={loading}
      error={error}
    />
  );
}

export function VatTaxReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();

  return (
    <TableReport
      title="VAT & Tax Report"
      description="Output VAT, input VAT, net payable, and withholding tax summary."
      columns={[
        { key: "taxType", label: "Tax Type" },
        { key: "taxable", label: "Taxable Amount", align: "right" },
        { key: "rate", label: "Rate", align: "right" },
        { key: "tax", label: "Tax", align: "right" },
      ]}
      rows={[]}
      currencyKeys={["taxable", "tax"]}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      dataBadge="Not connected"
      emptyMessage="VAT/tax module is not connected yet. This report will populate once tax fields are available on invoices and bills."
    />
  );
}

export function BudgetVsActualReport() {
  const { fromDate, toDate, setFromDate, setToDate } = useReportPeriod();

  return (
    <TableReport
      title="Budget vs Actual"
      description="Compare planned budget against actual spend by category."
      columns={[
        { key: "category", label: "Category" },
        { key: "budget", label: "Budget", align: "right" },
        { key: "actual", label: "Actual", align: "right" },
        { key: "variance", label: "Variance", align: "right" },
      ]}
      rows={[]}
      currencyKeys={["budget", "actual", "variance"]}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={setFromDate}
      onToDateChange={setToDate}
      dataBadge="Not connected"
      emptyMessage="Budget module is not connected yet. This report will populate once budgets are available in Accounts."
    />
  );
}
