"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Filters({ onFilterChange }: any) {
  return (
    <div className="flex gap-4">
      <Select onValueChange={(val) => onFilterChange("source", val)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Lead Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Lead Sources</SelectItem>
          <SelectItem value="facebook">Facebook Leads</SelectItem>
          <SelectItem value="google">Google Leads</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}