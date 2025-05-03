"use client"
import { useTable } from "@/lib/db"
import { useFilter } from "@/lib/filter-store"
import { ChartWrapper } from "@/components/chart-wrapper"
import { KPIChip } from "@/components/kpi-chip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, ShoppingBag, ShoppingCart, Users } from "lucide-react"

export default function BaselinePage() {
  const { markets, dateRange, pilotStoresOnly } = useFilter()
  const { data: posData, isLoading: isLoadingPOS } = useTable("POS_Transactions")
  const { data: loyaltyData, isLoading: isLoadingLoyalty } = useTable("Loyalty_Panel")
  const { data: skuData, isLoading: isLoadingSkus } = useTable("SKU_Master")

  // Mock data for charts
  const revenueData = [
    { month: "Jan", revenue: 65000, units: 12500 },
    { month: "Feb", revenue: 72000, units: 13800 },
    { month: "Mar", revenue: 68000, units: 13200 },
    { month: "Apr", revenue: 75000, units: 14500 },
    { month: "May", revenue: 82000, units: 15800 },
    { month: "Jun", revenue: 87000, units: 16700 },
    { month: "Jul", revenue: 84000, units: 16200 },
    { month: "Aug", revenue: 86000, units: 16500 },
    { month: "Sep", revenue: 90000, units: 17300 },
    { month: "Oct", revenue: 95000, units: 18200 },
    { month: "Nov", revenue: 102000, units: 19500 },
    { month: "Dec", revenue: 110000, units: 21000 },
  ]

  const missionData = [
    { name: "Snack", value: 35 },
    { name: "Meal", value: 25 },
    { name: "Beverage", value: 20 },
    { name: "Impulse", value: 15 },
    { name: "Pantry", value: 5 },
  ]

  const dayPartMissionData = [
    { dayPart: "Morning", Snack: 15, Meal: 30, Beverage: 40, Impulse: 10, Pantry: 5 },
    { dayPart: "Midday", Snack: 40, Meal: 35, Beverage: 15, Impulse: 5, Pantry: 5 },
    { dayPart: "Afternoon", Snack: 45, Meal: 10, Beverage: 20, Impulse: 20, Pantry: 5 },
    { dayPart: "Evening", Snack: 30, Meal: 40, Beverage: 15, Impulse: 10, Pantry: 5 },
    { dayPart: "Night", Snack: 25, Meal: 20, Beverage: 15, Impulse: 35, Pantry: 5 },
  ]

  const topSkus = [
    { id: 1, name: "Lay's Classic", category: "Chips", revenue: 125000, units: 25000 },
    { id: 2, name: "Doritos Nacho Cheese", category: "Chips", revenue: 118000, units: 22000 },
    { id: 3, name: "Cheetos Crunchy", category: "Chips", revenue: 95000, units: 19000 },
    { id: 4, name: "Ruffles Cheddar & Sour Cream", category: "Chips", revenue: 82000, units: 16000 },
    { id: 5, name: "Fritos Original", category: "Chips", revenue: 75000, units: 15000 },
    { id: 6, name: "Lay's Sour Cream & Onion", category: "Chips", revenue: 72000, units: 14000 },
    { id: 7, name: "Doritos Cool Ranch", category: "Chips", revenue: 68000, units: 13000 },
    { id: 8, name: "Tostitos Scoops", category: "Chips", revenue: 65000, units: 12500 },
    { id: 9, name: "Cheetos Flamin' Hot", category: "Chips", revenue: 62000, units: 12000 },
    { id: 10, name: "Ruffles Original", category: "Chips", revenue: 58000, units: 11000 },
  ]

  const COLORS = ["#005CB9", "#FF671F", "#28A745", "#E0245E", "#6F42C1"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Baseline Sales & Shopper Metrics</h1>
        <p className="text-muted-foreground">Key sales metrics, revenue trends, and shopper behavior analysis</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPIChip
          title="YTD Units"
          value="1.2M"
          change={8.5}
          status="positive"
          icon={<ShoppingBag className="h-4 w-4" />}
          isLoading={isLoadingPOS}
        />
        <KPIChip
          title="YTD Revenue"
          value="$5.4M"
          change={12.3}
          status="positive"
          icon={<DollarSign className="h-4 w-4" />}
          isLoading={isLoadingPOS}
        />
        <KPIChip
          title="Avg Ticket"
          value="$14.75"
          change={3.2}
          status="positive"
          icon={<ShoppingCart className="h-4 w-4" />}
          isLoading={isLoadingPOS}
        />
        <KPIChip
          title="Trips"
          value="367K"
          change={-2.1}
          status="negative"
          icon={<Users className="h-4 w-4" />}
          isLoading={isLoadingLoyalty}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartWrapper
          title="Revenue vs Units"
          description="Monthly trend of revenue and units sold"
          isLoading={isLoadingPOS}
          className="md:col-span-2"
        >
          <div className="h-[350px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#005CB9"
                  activeDot={{ r: 8 }}
                  name="Revenue ($)"
                />
                <Line yAxisId="right" type="monotone" dataKey="units" stroke="#FF671F" name="Units" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>

        <ChartWrapper
          title="Mission Share"
          description="Distribution of shopping missions"
          isLoading={isLoadingLoyalty}
        >
          <div className="h-[300px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={missionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {missionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>

        <Card>
          <CardHeader>
            <CardTitle>Day-part × Mission Heatmap</CardTitle>
            <CardDescription>Distribution of missions across different day parts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day Part</TableHead>
                    <TableHead>Snack</TableHead>
                    <TableHead>Meal</TableHead>
                    <TableHead>Beverage</TableHead>
                    <TableHead>Impulse</TableHead>
                    <TableHead>Pantry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dayPartMissionData.map((row) => (
                    <TableRow key={row.dayPart}>
                      <TableCell className="font-medium">{row.dayPart}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-4 rounded bg-[#005CB9]" style={{ width: `${row.Snack}%` }}></div>
                          <span className="ml-2">{row.Snack}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-4 rounded bg-[#FF671F]" style={{ width: `${row.Meal}%` }}></div>
                          <span className="ml-2">{row.Meal}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-4 rounded bg-[#28A745]" style={{ width: `${row.Beverage}%` }}></div>
                          <span className="ml-2">{row.Beverage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-4 rounded bg-[#E0245E]" style={{ width: `${row.Impulse}%` }}></div>
                          <span className="ml-2">{row.Impulse}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-4 rounded bg-[#6F42C1]" style={{ width: `${row.Pantry}%` }}></div>
                          <span className="ml-2">{row.Pantry}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 SKUs by Revenue</CardTitle>
          <CardDescription>Best performing products by revenue and units sold</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>SKU Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSkus.map((sku, index) => (
                  <TableRow key={sku.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{sku.name}</TableCell>
                    <TableCell>{sku.category}</TableCell>
                    <TableCell className="text-right">${sku.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{sku.units.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
