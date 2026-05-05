"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ChevronDown } from "lucide-react";

type Lead = {
  lead_id: string;
  lead_name: string;
  source: string;
  timestamp: string;
  form_completion_time_sec: string;
  state: string;
  pincode: string;
  phone_number: string;
  carrier_acceptance_status: "Accepted" | "Rejected" | string;
};

type ActionDecision = "SCALE" | "LIVE" | "CUT";

function decisionFromAcceptance(status: string): ActionDecision {
  const s = (status || "").toLowerCase();
  if (s === "accepted") return "SCALE";
  if (s === "rejected") return "CUT";
  return "LIVE";
}

function decisionBadgeVariant(decision: ActionDecision) {
  switch (decision) {
    case "SCALE":
      return "bg-emerald-600 hover:bg-emerald-600";
    case "CUT":
      return "bg-red-600 hover:bg-red-600";
    default:
      return "bg-amber-500 hover:bg-amber-500";
  }
}

function statusBadgeVariant(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "accepted") return "bg-emerald-600 hover:bg-emerald-600";
  if (s === "rejected") return "bg-red-600 hover:bg-red-600";
  return "bg-slate-500 hover:bg-slate-500";
}

export default function Dashboard() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [query, setQuery] = React.useState<string>("");
  const [decisionByLeadId, setDecisionByLeadId] = React.useState<
      Record<string, ActionDecision>
  >({});

  const [detailsLead, setDetailsLead] = React.useState<Lead | null>(null);

  React.useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
            "https://lead-backend-l34r.onrender.com/api/dashboard",
            { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const data = await res.json();

        const rows: Lead[] = Array.isArray(data) ? data : data?.data ?? [];
        if (!alive) return;

        setLeads(rows);

        // Initialize decisions (default derived from acceptance)
        const initial: Record<string, ActionDecision> = {};
        for (const l of rows) {
          initial[l.lead_id] = decisionFromAcceptance(l.carrier_acceptance_status);
        }
        setDecisionByLeadId(initial);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Something went wrong");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;

    return leads.filter((l) => {
      return (
          l.lead_id?.toLowerCase().includes(q) ||
          l.lead_name?.toLowerCase().includes(q) ||
          l.source?.toLowerCase().includes(q) ||
          l.state?.toLowerCase().includes(q) ||
          l.pincode?.toLowerCase().includes(q) ||
          l.carrier_acceptance_status?.toLowerCase().includes(q)
      );
    });
  }, [leads, query]);

  const totals = React.useMemo(() => {
    const total = leads.length;
    const accepted = leads.filter(
        (l) => (l.carrier_acceptance_status || "").toLowerCase() === "accepted"
    ).length;
    const rejected = leads.filter(
        (l) => (l.carrier_acceptance_status || "").toLowerCase() === "rejected"
    ).length;

    const acceptanceRate =
        total > 0 ? Math.round((accepted / total) * 100) : 0;

    return { total, accepted, rejected, acceptanceRate };
  }, [leads]);

  function setDecision(leadId: string, decision: ActionDecision) {
    setDecisionByLeadId((prev) => ({ ...prev, [leadId]: decision }));
  }

  return (
      <div className="p-6 grid gap-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Leads</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {loading ? "…" : totals.total.toLocaleString()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acceptance Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {loading ? "…" : `${totals.acceptanceRate}%`}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accepted</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {loading ? "…" : totals.accepted.toLocaleString()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rejected</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {loading ? "…" : totals.rejected.toLocaleString()}
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card className="overflow-hidden">
          <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid gap-1">
              <CardTitle>Leads</CardTitle>
              <div className="text-sm text-muted-foreground">
                Attractive table with per-row action dropdown (SCALE / LIVE / CUT)
              </div>
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, source, state, status…"
                  className="w-full sm:w-[320px]"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {error ? (
                <div className="p-6 text-sm text-red-600">{error}</div>
            ) : (
                <div className="max-h-[560px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                      <TableRow>
                        <TableHead className="w-[120px]">Lead ID</TableHead>
                        <TableHead className="min-w-[180px]">Name</TableHead>
                        <TableHead className="min-w-[200px]">Source</TableHead>
                        <TableHead className="min-w-[140px]">Timestamp</TableHead>
                        <TableHead className="min-w-[140px]">
                          Form Time (s)
                        </TableHead>
                        <TableHead className="min-w-[120px]">State</TableHead>
                        <TableHead className="min-w-[110px]">Pincode</TableHead>
                        <TableHead className="min-w-[130px]">Status</TableHead>
                        <TableHead className="min-w-[120px]">Decision</TableHead>
                        <TableHead className="w-[110px] text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {loading ? (
                          Array.from({ length: 8 }).map((_, i) => (
                              <TableRow key={i} className="animate-pulse">
                                <TableCell className="text-muted-foreground">…</TableCell>
                                <TableCell className="text-muted-foreground">…</TableCell>
                                <TableCell className="text-muted-foreground">…</TableCell>
                                <TableCell className="text-muted-foreground">…</TableCell>
                                <TableCell className="text-muted-foreground">…</TableCell>
                                <TableCell className="text-muted-foreground">…</TableCell>
                                <TableCell className="text-muted-foreground">…</TableCell>
                                <TableCell className="text-muted-foreground">…</TableCell>
                                <TableCell className="text-muted-foreground">…</TableCell>
                                <TableCell className="text-muted-foreground text-right">
                                  …
                                </TableCell>
                              </TableRow>
                          ))
                      ) : filtered.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={10} className="h-24 text-center">
                              No leads found.
                            </TableCell>
                          </TableRow>
                      ) : (
                          filtered.map((l) => {
                            const decision =
                                decisionByLeadId[l.lead_id] ??
                                decisionFromAcceptance(l.carrier_acceptance_status);

                            return (
                                <TableRow key={l.lead_id} className="hover:bg-muted/50">
                                  <TableCell className="font-medium">
                                    {l.lead_id}
                                  </TableCell>
                                  <TableCell>{l.lead_name}</TableCell>
                                  <TableCell className="font-mono text-xs text-muted-foreground">
                                    {l.source}
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {l.timestamp}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {l.form_completion_time_sec}
                                  </TableCell>
                                  <TableCell>{l.state}</TableCell>
                                  <TableCell className="font-mono text-sm">
                                    {l.pincode}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={statusBadgeVariant(l.carrier_acceptance_status)}>
                                      {l.carrier_acceptance_status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={decisionBadgeVariant(decision)}>
                                      {decision}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          Actions
                                          <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-44">
                                        <DropdownMenuItem
                                            onClick={() => setDecision(l.lead_id, "SCALE")}
                                        >
                                          Mark as SCALE
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setDecision(l.lead_id, "LIVE")}
                                        >
                                          Mark as LIVE
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setDecision(l.lead_id, "CUT")}
                                        >
                                          Mark as CUT
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDetailsLead(l)}>
                                          View details
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                            );
                          })
                      )}
                    </TableBody>
                  </Table>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={!!detailsLead} onOpenChange={(open) => !open && setDetailsLead(null)}>
          <DialogContent className="sm:max-w-[640px]">
            <DialogHeader>
              <DialogTitle>Lead details</DialogTitle>
            </DialogHeader>

            {detailsLead ? (
                <div className="grid gap-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md border p-3">
                      <div className="text-xs text-muted-foreground">Lead ID</div>
                      <div className="font-medium">{detailsLead.lead_id}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-xs text-muted-foreground">Name</div>
                      <div className="font-medium">{detailsLead.lead_name}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-xs text-muted-foreground">Source</div>
                      <div className="font-medium font-mono text-xs">
                        {detailsLead.source}
                      </div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-xs text-muted-foreground">Timestamp</div>
                      <div className="font-medium">{detailsLead.timestamp}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-xs text-muted-foreground">
                        Form completion time (s)
                      </div>
                      <div className="font-medium">
                        {detailsLead.form_completion_time_sec}
                      </div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-xs text-muted-foreground">State</div>
                      <div className="font-medium">{detailsLead.state}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-xs text-muted-foreground">Pincode</div>
                      <div className="font-medium font-mono">{detailsLead.pincode}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-xs text-muted-foreground">Status</div>
                      <div className="font-medium">
                        <Badge className={statusBadgeVariant(detailsLead.carrier_acceptance_status)}>
                          {detailsLead.carrier_acceptance_status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Phone</div>
                    <div className="font-medium font-mono">
                      {"[PHONE_NUMBER_HIDDEN]"}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Tip: avoid rendering full phone numbers in UI; mask or restrict access.
                    </div>
                  </div>
                </div>
            ) : null}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsLead(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}