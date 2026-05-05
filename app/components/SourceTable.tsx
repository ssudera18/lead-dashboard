import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
//import { getDecision } from "@/lib/decision";

export default function SourceTable({ data }: any) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Leads</TableHead>
          <TableHead>Acceptance</TableHead>
          <TableHead>Valid Phone</TableHead>
          <TableHead>Decision</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row: any, i: number) => {
          //const decision = getDecision(row);

          return (
            <TableRow key={i}>
              <TableCell>{row.source}</TableCell>
              <TableCell>{row.total_leads}</TableCell>
              <TableCell>{(row.acceptance_rate * 100).toFixed(1)}%</TableCell>
              <TableCell>{(row.valid_phone_rate * 100).toFixed(1)}%</TableCell>
              <TableCell>
                {/* <Badge
                  className={
                    decision === "SCALE"
                      ? "bg-green-600"
                      : decision === "CUT"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                  }
                >
                  {decision}
                </Badge> */}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}