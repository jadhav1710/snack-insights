"use client"

import { useState, useEffect } from "react"
import { useTable } from "@/lib/db"
import { useFilter } from "@/lib/filter-store"
import { ChartWrapper } from "@/components/chart-wrapper"
import { KPIChip } from "@/components/kpi-chip"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Clock, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VelocityPage() {
  const { markets, dateRange, pilotStoresOnly } = useFilter()
  const { data: posData, isLoading: isLoadingPOS } = useTable("POS_Transactions")

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock data for real-time sell-out
  const generateSelloutData = () => {
    const data = []
    const now = new Date()
    const baseValue = 100 + Math.random() * 20

    for (let i = 0; i < 24; i++) {
      const time = new Date(now)
      time.setMinutes(now.getMinutes() - (23 - i) * 15)

      // Generate a pattern with morning and evening peaks
      const hourFactor = time.getHours()
      let multiplier = 0.5

      // Morning peak (7-9 AM)
      if (hourFactor >= 7 && hourFactor <= 9) {
        multiplier = 1.5
      }
      // Lunch peak (12-2 PM)
      else if (hourFactor >= 12 && hourFactor <= 14) {
        multiplier = 1.8
      }
      // Evening peak (5-7 PM)
      else if (hourFactor >= 17 && hourFactor <= 19) {
        multiplier = 2.0
      }
      // Late night (10 PM - 6 AM)
      else if (hourFactor >= 22 || hourFactor <= 6) {
        multiplier = 0.3
      }

      const value = baseValue * multiplier + (Math.random() * 20 - 10)
      const benchmark = baseValue * multiplier * 0.85 + (Math.random() * 10 - 5)

      data.push({
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        units: Math.max(0, Math.round(value)),
        benchmark: Math.max(0, Math.round(benchmark)),
      })
    }

    return data
  }

  const [selloutData, setSelloutData] = useState(generateSelloutData())

  // Mock data for top SKUs velocity
  const topSkuVelocity = [
    { name: "Lay's Classic", units: 125 },
    { name: "Doritos Nacho Cheese", units: 118 },
    { name: "Cheetos Crunchy", units: 95 },
    { name: "Ruffles Cheddar & Sour Cream", units: 82 },
    { name: "Fritos Original", units: 75 },
  ]

  // Auto-refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    setIsRefreshing(true)

    // Simulate API call delay
    setTimeout(() => {
      setSelloutData(generateSelloutData())
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Sell-out Monitor</h1>
          <p className="text-muted-foreground">Live monitoring of sell-out rates with auto-refresh</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <Button size="sm" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <KPIChip
          title="Minute Lag"
          value="2.3"
          change={-15.4}
          status="positive"
          icon={<Clock className="h-4 w-4" />}
          isLoading={isRefreshing}
        />
        <KPIChip
          title="Sell-out Rate"
          value="118.5"
          change={8.2}
          status="positive"
          icon={<TrendingUp className="h-4 w-4" />}
          isLoading={isRefreshing}
        />
        <KPIChip
          title="Stock Alerts"
          value="3"
          change={-2}
          status="positive"
          icon={<AlertCircle className="h-4 w-4" />}
          isLoading={isRefreshing}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartWrapper
          title="Units Sold (15-min intervals)"
          description="Real-time units sold compared to benchmark"
          isLoading={isRefreshing}
          className="md:col-span-2"
        >
          <div className="h-[350px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selloutData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="units"
                  name="Units Sold"
                  stroke="#005CB9"
                  fill="#005CB9"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  name="Benchmark"
                  stroke="#FF671F"
                  fill="#FF671F"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>

        <ChartWrapper
          title="Top 5 SKUs Velocity"
          description="Units sold per hour for top performing SKUs"
          isLoading={isRefreshing}
        >
          <div className="h-[300px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSkuVelocity} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" scale="band" width={150} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="units" name="Units/Hour" fill="#005CB9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>
      </div>
    </div>
  )
}
