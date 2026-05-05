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

import StatusPie from "../components/charts/StatusPie";
import SourceBar from "../components/charts/SourceBar";

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
      return "bg-emerald-500 text-white shadow-md";
    case "CUT":
      return "bg-red-500 text-white shadow-md";
    default:
      return "bg-yellow-400 text-black shadow-md";
  }
}

function statusBadgeVariant(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "accepted") return "bg-green-100 text-green-700";
  if (s === "rejected") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

export default function Dashboard() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [decisionByLeadId, setDecisionByLeadId] = React.useState<
      Record<string, ActionDecision>
  >({});
  const [detailsLead, setDetailsLead] = React.useState<Lead | null>(null);

  React.useEffect(() => {
    async function load() {
      const res = await fetch(
          "https://lead-backend-l34r.onrender.com/api/dashboard"
      );
      const data = await res.json();
      setLeads(data);

      const initial: any = {};
      data.forEach((l: Lead) => {
        initial[l.lead_id] = decisionFromAcceptance(
            l.carrier_acceptance_status
        );
      });

      setDecisionByLeadId(initial);
      setLoading(false);
    }

    load();
  }, []);

  const filtered = leads.filter((l) =>
      JSON.stringify(l).toLowerCase().includes(query.toLowerCase())
  );

  const totals = {
    total: leads.length,
    accepted: leads.filter(
        (l) => l.carrier_acceptance_status === "Accepted"
    ).length,
    rejected: leads.filter(
        (l) => l.carrier_acceptance_status === "Rejected"
    ).length,
  };

  const acceptanceRate =
      totals.total > 0 ? Math.round((totals.accepted / totals.total) * 100) : 0;

  function setDecision(id: string, decision: ActionDecision) {
    setDecisionByLeadId((prev) => ({ ...prev, [id]: decision }));
  }

  return (
  <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 min-h-screen">

    {/* KPI */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: "Total Leads", value: totals.total, color: "text-indigo-600" },
        { label: "Acceptance Rate", value: `${acceptanceRate}%`, color: "text-green-600" },
        { label: "Accepted", value: totals.accepted, color: "text-emerald-600" },
        { label: "Rejected", value: totals.rejected, color: "text-red-600" },
      ].map((kpi, i) => (
        <Card key={i} className="rounded-2xl shadow-lg border-0 bg-white/70 backdrop-blur hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">{kpi.label}</CardTitle>
          </CardHeader>
          <CardContent className={`text-3xl font-bold ${kpi.color}`}>
            {loading ? "…" : kpi.value}
          </CardContent>
        </Card>
      ))}
    </div>

    {/* ✅ CHARTS SECTION (NEW) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <Card className="rounded-2xl shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusPie
            accepted={totals.accepted}
            rejected={totals.rejected}
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle>Leads by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <SourceBar data={leads} />
        </CardContent>
      </Card>

    </div>

    {/* TABLE */}
    <Card className="rounded-2xl shadow-xl border-0 bg-white">
      <CardHeader className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <CardTitle>Leads</CardTitle>
          <p className="text-sm text-gray-500">
            Manage and analyze lead performance
          </p>
        </div>

        <Input
          placeholder="🔍 Search leads..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-[320px] rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500"
        />
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[560px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-gradient-to-r from-indigo-50 to-blue-50">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name & Phone</TableHead>
                <TableHead>Form Filled Duration</TableHead>
                <TableHead>State | Postal Code</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((l) => {
                const decision =
                  decisionByLeadId[l.lead_id] ??
                  decisionFromAcceptance(l.carrier_acceptance_status);

                return (
                  <TableRow key={l.lead_id} className="hover:bg-indigo-50 transition">
                    <TableCell>{l.lead_id}</TableCell>
                    <TableCell>{l.lead_name}, {l.phone_number}</TableCell>
                    <TableCell>{l.form_completion_time_sec} sec</TableCell>
                    <TableCell>{l.state} | {l.pincode}</TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {l.source}
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
                          <Button size="sm" className="rounded-lg">
                            Actions <ChevronDown className="ml-2 w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDecision(l.lead_id, "SCALE")}>
                            SCALE
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDecision(l.lead_id, "LIVE")}>
                            LIVE
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDecision(l.lead_id, "CUT")}>
                            CUT
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDetailsLead(l)}>
                            View
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    {/* DIALOG */}
    <Dialog open={!!detailsLead} onOpenChange={() => setDetailsLead(null)}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
        </DialogHeader>

        {detailsLead && (
          <div className="grid gap-3 text-sm">
            <div><b>Name:</b> {detailsLead.lead_name}</div>
            <div><b>Phone:</b> {detailsLead.phone_number}</div>
            <div><b>State:</b> {detailsLead.state}</div>
            <div><b>Pincode:</b> {detailsLead.pincode}</div>
            <div><b>Status:</b> {detailsLead.carrier_acceptance_status}</div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => setDetailsLead(null)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
);
}