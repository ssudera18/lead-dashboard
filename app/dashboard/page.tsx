// app/dashboard/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="p-6 grid gap-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Leads</CardTitle>
          </CardHeader>
          <CardContent>120,000</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acceptance Rate</CardTitle>
          </CardHeader>
          <CardContent>42%</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Source</CardTitle>
          </CardHeader>
          <CardContent>Google Ads</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Worst Source</CardTitle>
          </CardHeader>
          <CardContent>Affiliate XYZ</CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Source Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>Source</th>
                <th>Leads</th>
                <th>Acceptance</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Facebook</td>
                <td>12000</td>
                <td>42%</td>
                <td>
                  <Badge className="bg-green-500">SCALE</Badge>
                </td>
              </tr>
              <tr>
                <td>Affiliate XYZ</td>
                <td>8000</td>
                <td>12%</td>
                <td>
                  <Badge variant="destructive">CUT</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}