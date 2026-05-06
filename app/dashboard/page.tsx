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
import LeadScatter from "../components/charts/LeadScatter";
import LeadTrend from "../components/charts/LeadTrend";
import StateBubble from "../components/charts/StateBubble";

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

      const initial: Record<string, ActionDecision> = {};

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
    <div className="relative min-h-screen overflow-hidden bg-[#0B1120] text-white">

      {/* BACKGROUND GLOWS */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative z-10 p-6 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Lead Intelligence Dashboard
            </h1>

            <p className="text-slate-400 mt-1">
              Analyze lead quality, conversions and source performance
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
            <div className="text-xs text-slate-400">Environment</div>

            <div className="font-semibold text-emerald-300">
              Production
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">

          {[
            {
              label: "Total Leads",
              value: totals.total,
              color: "text-indigo-300",
              glow: "from-indigo-500/20",
            },
            {
              label: "Acceptance Rate",
              value: `${acceptanceRate}%`,
              color: "text-green-300",
              glow: "from-green-500/20",
            },
            {
              label: "Accepted",
              value: totals.accepted,
              color: "text-emerald-300",
              glow: "from-emerald-500/20",
            },
            {
              label: "Rejected",
              value: totals.rejected,
              color: "text-red-300",
              glow: "from-red-500/20",
            },
          ].map((kpi, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/10"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${kpi.glow} to-transparent opacity-40`}
              />

              <CardHeader className="relative z-10">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {kpi.label}
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className={`text-4xl font-bold ${kpi.color}`}>
                  {loading ? "…" : kpi.value}
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  Updated just now
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ADVANCED ANALYTICS */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* LEFT */}
          <div className="xl:col-span-2 space-y-6">

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">
                    Avg Form Completion
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-4xl font-bold text-cyan-300">
                    {Math.round(
                      leads.reduce(
                        (acc, l) =>
                          acc + Number(l.form_completion_time_sec || 0),
                        0
                      ) / (leads.length || 1)
                    )}s
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    Avg user submission duration
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">
                    Suspicious Leads
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-4xl font-bold text-red-300">
                    {
                      leads.filter(
                        (l) =>
                          Number(l.form_completion_time_sec) > 0 &&
                          Number(l.form_completion_time_sec) < 5
                      ).length
                    }
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    Submitted under 5 seconds
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-400">
                    Top State
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-3xl font-bold text-purple-300">
                    {
                      Object.entries(
                        leads.reduce((acc: any, l) => {
                          acc[l.state] = (acc[l.state] || 0) + 1;
                          return acc;
                        }, {})
                      ).sort((a: any, b: any) => b[1] - a[1])[0]?.[0]
                    }
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    Highest lead contribution
                  </div>
                </CardContent>
              </Card>

            </div>
            {/* CHARTS */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">
                    Lead Status Distribution
                  </CardTitle>

                  <p className="text-sm text-slate-400">
                    Accepted vs rejected breakdown
                  </p>
                </CardHeader>

                <CardContent>
                  <StatusPie
                    accepted={totals.accepted}
                    rejected={totals.rejected}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">
                    Lead Sources
                  </CardTitle>

                  <p className="text-sm text-slate-400">
                    Source-wise lead generation
                  </p>
                </CardHeader>

                <CardContent>
                  <SourceBar data={leads} />
                </CardContent>
              </Card>

            </div>

            {/* AI INSIGHTS */}
            <Card className="rounded-3xl border border-indigo-500/10 bg-indigo-500/5 backdrop-blur-2xl shadow-2xl">

              <CardHeader>
                <CardTitle className="text-white">
                  AI Insights
                </CardTitle>

                <p className="text-sm text-slate-400">
                  Auto-generated intelligence from lead behavior
                </p>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-500/10 p-4">
                  <div className="font-semibold text-emerald-300">
                    🚀 Best Lead Source
                  </div>

                  <div className="mt-1 text-sm text-slate-300">
                    {
                      Object.entries(
                        leads.reduce((acc: any, l) => {
                          acc[l.source] = (acc[l.source] || 0) + 1;
                          return acc;
                        }, {})
                      ).sort((a: any, b: any) => b[1] - a[1])[0]?.[0]
                    }{" "}
                    is generating the highest lead volume.
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-400/10 bg-indigo-500/10 p-4">
                  <div className="font-semibold text-indigo-300">
                    📈 Conversion Trend
                  </div>

                  <div className="mt-1 text-sm text-slate-300">
                    Acceptance rate currently stands at{" "}
                    <span className="font-semibold text-white">
                      {acceptanceRate}%
                    </span>.
                  </div>
                </div>

                <div className="rounded-2xl border border-red-400/10 bg-red-500/10 p-4">
                  <div className="font-semibold text-red-300">
                    ⚠ Fraud Alert
                  </div>

                  <div className="mt-1 text-sm text-slate-300">
                    {
                      leads.filter(
                        (l) =>
                          Number(l.form_completion_time_sec) > 0 &&
                          Number(l.form_completion_time_sec) < 5
                      ).length
                    }{" "}
                    suspicious leads detected with ultra-fast submissions.
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">




            <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">

              <CardHeader>
                <CardTitle className="text-white">
                  Acceptance Ratio
                </CardTitle>
              </CardHeader>

              <CardContent>

                <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
                    style={{ width: `${acceptanceRate}%` }}
                  />
                </div>

                <div className="mt-4 flex justify-between text-sm">
                  <div>
                    <div className="text-slate-400">
                      Accepted
                    </div>

                    <div className="text-emerald-300 font-semibold">
                      {totals.accepted}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400">
                      Rejected
                    </div>

                    <div className="text-red-300 font-semibold">
                      {totals.rejected}
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">

              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">
                  State-wise Lead Intelligence
                </CardTitle>

                <p className="text-sm text-slate-400">
                  Lead volume and conversion quality by region
                </p>
              </CardHeader>

              <CardContent className="h-[360px]">
                <StateBubble data={leads} />
              </CardContent>

            </Card>

          </div>
        </div>



        {/* TABLE */}
        <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden">

          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10">

            <div>
              <CardTitle className="text-white text-2xl">
                Lead Management
              </CardTitle>

              <p className="text-sm text-slate-400 mt-1">
                Track and manage lead quality in real-time
              </p>
            </div>

            <Input
              placeholder="🔍 Search leads..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-[320px] rounded-2xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 backdrop-blur-xl focus-visible:ring-1 focus-visible:ring-indigo-400"
            />
          </CardHeader>

          <CardContent className="p-0">

            <div className="max-h-[650px] overflow-auto">

              <Table>
                <TableHeader className="sticky top-0 bg-white/5 backdrop-blur-xl">

                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-300">ID</TableHead>
                    <TableHead className="text-slate-300">Name & Phone</TableHead>
                    <TableHead className="text-slate-300">Form Time</TableHead>
                    <TableHead className="text-slate-300">Location</TableHead>
                    <TableHead className="text-slate-300">Source</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Decision</TableHead>
                    <TableHead className="text-right text-slate-300">
                      Action
                    </TableHead>
                  </TableRow>

                </TableHeader>

                <TableBody>

                  {filtered.map((l) => {
                    const decision =
                      decisionByLeadId[l.lead_id] ??
                      decisionFromAcceptance(l.carrier_acceptance_status);

                    return (
                      <TableRow
                        key={l.lead_id}
                        className="border-white/5 hover:bg-white/5 transition-all duration-200"
                      >

                        <TableCell className="font-medium text-white">
                          {l.lead_id}
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-white">
                              {l.lead_name}
                            </span>

                            <span className="text-xs text-slate-400">
                              {l.phone_number}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-slate-300">
                          {l.form_completion_time_sec} sec
                        </TableCell>

                        <TableCell className="text-slate-300">
                          {l.state} | {l.pincode}
                        </TableCell>

                        <TableCell className="text-xs text-slate-400">
                          {l.source}
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={
                              l.carrier_acceptance_status === "Accepted"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/20"
                                : "bg-red-500/20 text-red-300 border border-red-400/20"
                            }
                          >
                            {l.carrier_acceptance_status}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={
                              decision === "SCALE"
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-400/20"
                                : decision === "CUT"
                                  ? "bg-red-500/20 text-red-300 border border-red-400/20"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-400/20"
                            }
                          >
                            {decision}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">

                          <DropdownMenu>

                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl"
                              >
                                Actions
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="border-white/10 bg-[#111827]/95 text-white backdrop-blur-2xl"
                            >

                              <DropdownMenuItem
                                onClick={() =>
                                  setDecision(l.lead_id, "SCALE")
                                }
                              >
                                SCALE
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  setDecision(l.lead_id, "LIVE")
                                }
                              >
                                LIVE
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  setDecision(l.lead_id, "CUT")
                                }
                              >
                                CUT
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => setDetailsLead(l)}
                              >
                                View Details
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
        <Dialog
          open={!!detailsLead}
          onOpenChange={() => setDetailsLead(null)}
        >
          <DialogContent className="rounded-3xl border border-white/10 bg-[#111827]/95 text-white backdrop-blur-2xl">

            <DialogHeader>
              <DialogTitle className="text-2xl">
                Lead Details
              </DialogTitle>
            </DialogHeader>

            {detailsLead && (
              <div className="grid gap-4 text-sm">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-slate-400">Name</div>

                  <div className="font-semibold text-white">
                    {detailsLead.lead_name}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-slate-400">Phone</div>

                  <div className="font-semibold text-white">
                    {detailsLead.phone_number}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-slate-400">Location</div>

                  <div className="font-semibold text-white">
                    {detailsLead.state} | {detailsLead.pincode}
                  </div>
                </div>

              </div>
            )}

            <DialogFooter>
              <Button
                onClick={() => setDetailsLead(null)}
                className="rounded-xl bg-indigo-500 hover:bg-indigo-600"
              >
                Close
              </Button>
            </DialogFooter>

          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}