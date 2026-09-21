import {
  agingRows,
  balanceSheet,
  budgetVsActualRows,
  cashBankRows,
  cashFlow,
  expenseRows,
  generalLedgerRows,
  incomeRows,
  journalRows,
  payableRows,
  profitLoss,
  receivableRows,
  trialBalanceRows,
  vatTaxRows,
} from "./data";
import { StatementReport } from "./statement-report";
import { TableReport } from "./table-report";

export function TrialBalanceReport() {
  return (
    <TableReport
      title="Trial Balance"
      description="Debit and credit balances of all ledger accounts for the selected period."
      columns={[
        { key: "account", label: "Account" },
        { key: "debit", label: "Debit", align: "right" },
        { key: "credit", label: "Credit", align: "right" },
      ]}
      rows={trialBalanceRows}
      currencyKeys={["debit", "credit"]}
    />
  );
}

export function ProfitLossReport() {
  return (
    <StatementReport
      title="Profit & Loss Statement"
      description="Income and expense summary for the reporting period."
      sections={profitLoss}
      netLabel="Net Profit"
      netAmount={190620 - 124680}
      footerNote="Prepared under Accrual basis · Dummy management figures"
    />
  );
}

export function BalanceSheetReport() {
  return (
    <StatementReport
      title="Balance Sheet"
      description="Assets, liabilities, and equity position as of period end."
      sections={balanceSheet}
      footerNote={`Assets ${(928830).toLocaleString()} = Liabilities + Equity ${(40130 + 888700).toLocaleString()}`}
    />
  );
}

export function CashFlowReport() {
  return (
    <StatementReport
      title="Cash Flow Statement"
      description="Cash movements from operating, investing, and financing activities."
      sections={cashFlow}
      netLabel="Net Change in Cash"
      netAmount={71240 - 20500 + 2000}
    />
  );
}

export function GeneralLedgerReport() {
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
      rows={generalLedgerRows}
      currencyKeys={["debit", "credit", "balance"]}
    />
  );
}

export function JournalReport() {
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
      rows={journalRows}
      currencyKeys={["debit", "credit"]}
    />
  );
}

export function IncomeReport() {
  return (
    <TableReport
      title="Income Report"
      description="Income breakdown by category."
      columns={[
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount", align: "right" },
        { key: "share", label: "Share", align: "right" },
      ]}
      rows={incomeRows}
      currencyKeys={["amount"]}
    />
  );
}

export function ExpenseReport() {
  return (
    <TableReport
      title="Expense Report"
      description="Expense breakdown by category."
      columns={[
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount", align: "right" },
        { key: "share", label: "Share", align: "right" },
      ]}
      rows={expenseRows}
      currencyKeys={["amount"]}
    />
  );
}

export function ReceivableReport() {
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
      rows={receivableRows}
      currencyKeys={["outstanding", "overdue"]}
    />
  );
}

export function PayableReport() {
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
      rows={payableRows}
      currencyKeys={["outstanding", "overdue"]}
    />
  );
}

export function AgingReport() {
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
      rows={agingRows}
      currencyKeys={["current", "d30", "d60", "d90", "total"]}
    />
  );
}

export function CashBankReport() {
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
      rows={cashBankRows}
      currencyKeys={["opening", "inflows", "outflows", "closing"]}
    />
  );
}

export function VatTaxReport() {
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
      rows={vatTaxRows}
      currencyKeys={["taxable", "tax"]}
    />
  );
}

export function BudgetVsActualReport() {
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
      rows={budgetVsActualRows}
      currencyKeys={["budget", "actual", "variance"]}
    />
  );
}
