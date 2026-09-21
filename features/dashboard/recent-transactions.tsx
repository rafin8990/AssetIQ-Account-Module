import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { formatCurrency, formatDate, recentTransactions } from "./data";

export function RecentTransactions() {
  return (
    <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest movements across accounts</CardDescription>
          </div>
          <Badge variant="secondary" className="font-normal">
            {recentTransactions.length} shown
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="hidden md:table-cell">Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="pr-4 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="pl-4 text-muted-foreground tabular-nums">
                  {formatDate(tx.date)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-foreground">
                      {tx.description}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tx.id} · {tx.category}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {tx.account}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "border-0 capitalize",
                      tx.type === "income"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    )}
                  >
                    {tx.type}
                  </Badge>
                </TableCell>
                <TableCell
                  className={cn(
                    "pr-4 text-right font-semibold tabular-nums",
                    tx.type === "income" ? "text-emerald-700" : "text-rose-600"
                  )}
                >
                  {tx.type === "income" ? "+" : "−"}
                  {formatCurrency(tx.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
