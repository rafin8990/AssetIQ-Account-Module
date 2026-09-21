"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { activityLog, auditTrail, makerCheckerMatrix } from "./data";

export function MakerCheckerView() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Maker–Checker–Approver
        </h2>
        <p className="text-sm text-muted-foreground">
          Role matrix defining who creates, checks, and finally approves each
          document type.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {["Maker", "Checker", "Approver"].map((role) => (
          <Card
            key={role}
            className="border-0 bg-card/90 shadow-sm ring-border/60"
          >
            <CardContent className="pt-5">
              <Badge variant="secondary" className="mb-2">
                {role}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {role === "Maker"
                  ? "Creates and submits the document"
                  : role === "Checker"
                    ? "Reviews accuracy and supporting docs"
                    : "Final authority based on amount limits"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Workflow matrix</CardTitle>
          <CardDescription>Dummy configuration by module</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Module</TableHead>
                <TableHead>Maker</TableHead>
                <TableHead>Checker</TableHead>
                <TableHead className="pr-4">Approver</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {makerCheckerMatrix.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="pl-4 font-medium">{row.module}</TableCell>
                  <TableCell>{row.maker}</TableCell>
                  <TableCell>{row.checker}</TableCell>
                  <TableCell className="pr-4">{row.approver}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function AuditTrailView() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Audit Trail</h2>
        <p className="text-sm text-muted-foreground">
          Immutable record of create, update, approve, and reject events.
        </p>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Recent audit events</CardTitle>
          <CardDescription>{auditTrail.length} event(s)</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead className="pr-4">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditTrail.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="pl-4 text-muted-foreground tabular-nums">
                    {row.timestamp}
                  </TableCell>
                  <TableCell className="font-medium">{row.user}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.action}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span>{row.entity}</span>
                      <span className="text-xs text-muted-foreground">
                        {row.reference}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="pr-4 text-muted-foreground">
                    {row.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function ActivityLogView() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Activity Log</h2>
        <p className="text-sm text-muted-foreground">
          User session and navigation activity across the accounts workspace.
        </p>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Recent activity</CardTitle>
          <CardDescription>{activityLog.length} event(s)</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Module</TableHead>
                <TableHead className="pr-4">IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLog.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="pl-4 text-muted-foreground tabular-nums">
                    {row.timestamp}
                  </TableCell>
                  <TableCell className="font-medium">{row.user}</TableCell>
                  <TableCell>{row.activity}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.module}</Badge>
                  </TableCell>
                  <TableCell className="pr-4 font-mono text-xs">
                    {row.ip}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
