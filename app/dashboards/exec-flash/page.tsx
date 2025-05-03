"use client"

import { useState } from "react"
import { useFilter } from "@/lib/filter-store"
import { KPIChip } from "@/components/kpi-chip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { AlertTriangle, ArrowUpRight, Download, Mail, Percent, TrendingUp } from "lucide-react"

export default function ExecFlashPage() {
  const { markets, dateRange, pilotStoresOnly } = useFilter()
  const [isExporting, setIsExporting] = useState(false)

  // Mock KPI data
  const kpiData = {
    salesIndex: {
      value: 112.5,
      change: 8.3,
      status: "positive" as const,
    },
    osa: {
      value: 94.8,
      change: 2.1,
      status: "positive" as const,
    },
    promoLift: {
      value: 35.2,
      change: -5.4,
      status: "negative" as const,
    },
    roi: {
      value: 3.2,
      change: 0.4,
      status: "positive" as const,
    },
    redFlags: {
      value: 3,
      change: -2,
      status: "positive" as const,
    },
  }

  // Mock trend data
  const trendData = [
    { week: "W1", sales: 100, target: 100 },
    { week: "W2", sales: 105, target: 102 },
    { week: "W3", sales: 110, target: 104 },
    { week: "W4", sales: 108, target: 106 },
    { week: "W5", sales: 115, target: 108 },
    { week: "W6", sales: 120, target: 110 },
    { week: "W7", sales: 118, target: 112 },
    { week: "W8", sales: 125, target: 114 },
  ]

  // Mock category data
  const categoryData = [
    { name: "Chips", value: 45 },
    { name: "Pretzels", value: 20 },
    { name: "Nuts", value: 15 },
    { name: "Popcorn", value: 12 },
    { name: "Crackers", value: 8 },
  ]

  // Mock red flags
  const redFlags = [
    {
      id: 1,
      title: "OSA Below Threshold",
      description: "3 stores in Southwest market below 85% OSA",
      severity: "high",
    },
    {
      id: 2,
      title: "Promo ROI Underperforming",
      description: "Weekend Flash Sale ROI at 1.8x vs 3.0x target",
      severity: "medium",
    },
    {
      id: 3,
      title: "Planogram Compliance Issue",
      description: "7-Eleven Downtown LA at 78% compliance",
      severity: "medium",
    },
  ]

  // Handle export
  const handleExport = () => {
    setIsExporting(true)

    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false)
      // In a real app, this would trigger a PDF download
      alert("Executive summary exported successfully!")
    }, 1500)
  }

  // Handle email
  const handleEmail = () => {
    // In a real app, this would open an email dialog
    alert("Email feature would be implemented here!")
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive KPI Flash</h1>
          <p className="text-muted-foreground">Mobile-first summary of key performance indicators</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEmail}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button size="sm" onClick={handleExport} disabled={isExporting}>
            <Download className={`mr-2 h-4 w-4 ${isExporting ? "animate-spin" : ""}`} />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KPIChip
          title="Sales Index"
          value={kpiData.salesIndex.value.toString()}
          change={kpiData.salesIndex.change}
          status={kpiData.salesIndex.status}
          icon={<TrendingUp className="h-4 w-4" />}
          className="lg:col-span-1"
        />
        <KPIChip
          title="OSA %"
          value={`${kpiData.osa.value}%`}
          change={kpiData.osa.change}
          status={kpiData.osa.status}
          icon={<ArrowUpRight className="h-4 w-4" />}
          className="lg:col-span-1"
        />
        <KPIChip
          title="Promo Lift"
          value={`${kpiData.promoLift.value}%`}
          change={kpiData.promoLift.change}
          status={kpiData.promoLift.status}
          icon={<Percent className="h-4 w-4" />}
          className="lg:col-span-1"
        />
        <KPIChip
          title="ROI"
          value={`${kpiData.roi.value}x`}
          change={kpiData.roi.change}
          status={kpiData.roi.status}
          icon={<TrendingUp className="h-4 w-4" />}
          className="md:col-span-1"
        />
        <KPIChip
          title="Red Flags"
          value={kpiData.redFlags.value.toString()}
          change={kpiData.redFlags.change}
          status={kpiData.redFlags.status}
          icon={<AlertTriangle className="h-4 w-4" />}
          className="md:col-span-1"
        />
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sales Index Trend (8 Weeks)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[90, 130]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#005CB9" name="Sales Index" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="target" stroke="#FF671F" strokeDasharray="5 5" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                    <Legend />
                    <Bar dataKey="value" name="Category Share %" fill="#005CB9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Red Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {redFlags.map((flag) => (
                  <Card key={flag.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 rounded-full p-1 ${
                            flag.severity === "high"
                              ? "bg-[#E0245E]/10 text-[#E0245E]"
                              : flag.severity === "medium"
                                ? "bg-[#FF671F]/10 text-[#FF671F]"
                                : "bg-[#28A745]/10 text-[#28A745]"
                          }`}
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{flag.title}</h3>
                          <p className="text-sm text-muted-foreground">{flag.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
