"use client"

import { useState, useEffect } from "react"
import { useTable } from "@/lib/db"
import { useFilter } from "@/lib/filter-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calculator, Download, RefreshCw } from "lucide-react"

export default function PromoROIPage() {
  const { markets, dateRange, pilotStoresOnly } = useFilter()
  const { data: promoData, isLoading: isLoadingPromo } = useTable("Promo_Calendar")
  const { data: skuData, isLoading: isLoadingSkus } = useTable("SKU_Master")
  const { data: financialData, isLoading: isLoadingFinancial } = useTable("SKU_Financials")

  const [selectedPromo, setSelectedPromo] = useState<string>("P-1001")
  const [discountPercent, setDiscountPercent] = useState<number>(20)
  const [isCalculating, setIsCalculating] = useState(false)

  // Mock data for promotions
  const promos = [
    { id: "P-1001", name: "Summer Snack Sale", type: "Discount", defaultDiscount: 20 },
    { id: "P-1002", name: "BOGO Chips Week", type: "BOGO", defaultDiscount: 50 },
    { id: "P-1003", name: "Snack & Beverage Bundle", type: "Bundle", defaultDiscount: 15 },
    { id: "P-1004", name: "Weekend Flash Sale", type: "Flash Sale", defaultDiscount: 30 },
    { id: "P-1005", name: "Holiday Snack Promotion", type: "Discount", defaultDiscount: 25 },
  ]

  // Mock data for ROI calculation
  const calculateROI = (promoId: string, discount: number) => {
    // Base values that will be adjusted by the discount
    const baseValuesData = {
      "P-1001": {
        baseUnits: 25000,
        incrementalUnits: 8750,
        baseRevenue: 125000,
        incrementalRevenue: 35000,
        baseCost: 62500,
        incrementalCost: 17500,
        marketingCost: 15000,
      },
      "P-1002": {
        baseUnits: 22000,
        incrementalUnits: 11000,
        baseRevenue: 110000,
        incrementalRevenue: 44000,
        baseCost: 55000,
        incrementalCost: 22000,
        marketingCost: 20000,
      },
      "P-1003": {
        baseUnits: 18000,
        incrementalUnits: 5400,
        baseRevenue: 90000,
        incrementalRevenue: 22950,
        baseCost: 45000,
        incrementalCost: 11475,
        marketingCost: 12000,
      },
      "P-1004": {
        baseUnits: 15000,
        incrementalUnits: 7500,
        baseRevenue: 75000,
        incrementalRevenue: 26250,
        baseCost: 37500,
        incrementalCost: 13125,
        marketingCost: 10000,
      },
      "P-1005": {
        baseUnits: 20000,
        incrementalUnits: 7000,
        baseRevenue: 100000,
        incrementalRevenue: 26250,
        baseCost: 50000,
        incrementalCost: 13125,
        marketingCost: 15000,
      },
    }

    // Get base values for the selected promo
    const base = baseValuesData[promoId]

    // Adjust values based on discount percentage
    const discountFactor = discount / 20 // Normalize against 20% baseline

    // Calculate adjusted values
    const adjustedIncrementalUnits = base.incrementalUnits * (1 + (discountFactor - 1) * 0.8)
    const adjustedIncrementalRevenue = base.incrementalRevenue * (1 + (discountFactor - 1) * 0.6)
    const adjustedIncrementalCost = base.incrementalCost * (1 + (discountFactor - 1) * 0.8)

    // Calculate ROI metrics
    const incrementalGrossMargin = adjustedIncrementalRevenue - adjustedIncrementalCost
    const roi = incrementalGrossMargin / base.marketingCost
    const paybackDays = (base.marketingCost / incrementalGrossMargin) * 30

    return {
      baseUnits: base.baseUnits,
      incrementalUnits: Math.round(adjustedIncrementalUnits),
      totalUnits: Math.round(base.baseUnits + adjustedIncrementalUnits),
      baseRevenue: base.baseRevenue,
      incrementalRevenue: Math.round(adjustedIncrementalRevenue),
      totalRevenue: Math.round(base.baseRevenue + adjustedIncrementalRevenue),
      baseCost: base.baseCost,
      incrementalCost: Math.round(adjustedIncrementalCost),
      totalCost: Math.round(base.baseCost + adjustedIncrementalCost),
      baseGrossMargin: base.baseRevenue - base.baseCost,
      incrementalGrossMargin: Math.round(incrementalGrossMargin),
      totalGrossMargin: Math.round(base.baseRevenue - base.baseCost + incrementalGrossMargin),
      marketingCost: base.marketingCost,
      roi: Number.parseFloat(roi.toFixed(2)),
      paybackDays: Math.round(paybackDays),
    }
  }

  // Initial ROI calculation
  const [roiData, setRoiData] = useState(calculateROI(selectedPromo, discountPercent))

  // Update ROI when promo or discount changes
  useEffect(() => {
    setIsCalculating(true)

    // Simulate calculation delay
    const timer = setTimeout(() => {
      setRoiData(calculateROI(selectedPromo, discountPercent))
      setIsCalculating(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [selectedPromo, discountPercent])

  // Update discount when promo changes
  useEffect(() => {
    const selectedPromoData = promos.find((p) => p.id === selectedPromo)
    if (selectedPromoData) {
      setDiscountPercent(selectedPromoData.defaultDiscount)
    }
  }, [selectedPromo])

  // Waterfall chart data
  const waterfallData = [
    { name: "Base GM", value: roiData.baseGrossMargin, fill: "#6F42C1" },
    { name: "Incremental Revenue", value: roiData.incrementalRevenue, fill: "#28A745" },
    { name: "Incremental COGS", value: -roiData.incrementalCost, fill: "#E0245E" },
    { name: "Marketing Cost", value: -roiData.marketingCost, fill: "#FF671F" },
    { name: "Net Impact", value: roiData.incrementalGrossMargin - roiData.marketingCost, fill: "#005CB9" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Promo ROI Quick-Calc Panel</h1>
        <p className="text-muted-foreground">Calculate ROI for promotions with dynamic adjustments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Promo Parameters</CardTitle>
            <CardDescription>Select a promotion and adjust parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="promo-select">Select Promotion</Label>
              <Select value={selectedPromo} onValueChange={setSelectedPromo}>
                <SelectTrigger id="promo-select">
                  <SelectValue placeholder="Select a promotion" />
                </SelectTrigger>
                <SelectContent>
                  {promos.map((promo) => (
                    <SelectItem key={promo.id} value={promo.id}>
                      <div className="flex items-center">
                        <span>{promo.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {promo.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="discount-slider">Discount Percentage</Label>
                <span className="text-sm font-medium">{discountPercent}%</span>
              </div>
              <Slider
                id="discount-slider"
                min={5}
                max={50}
                step={5}
                value={[discountPercent]}
                onValueChange={(value) => setDiscountPercent(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">ROI</span>
                <span
                  className={`text-lg font-bold ${roiData.roi >= 3 ? "text-[#28A745]" : roiData.roi >= 2 ? "text-[#FF671F]" : "text-[#E0245E]"}`}
                >
                  {isCalculating ? <span className="text-muted-foreground">Calculating...</span> : `${roiData.roi}x`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payback Period</span>
                <span
                  className={`text-lg font-bold ${roiData.paybackDays <= 10 ? "text-[#28A745]" : roiData.paybackDays <= 20 ? "text-[#FF671F]" : "text-[#E0245E]"}`}
                >
                  {isCalculating ? (
                    <span className="text-muted-foreground">Calculating...</span>
                  ) : (
                    `${roiData.paybackDays} days`
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Incremental GM</span>
                <span className="text-lg font-bold">
                  {isCalculating ? (
                    <span className="text-muted-foreground">Calculating...</span>
                  ) : (
                    `$${roiData.incrementalGrossMargin.toLocaleString()}`
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" className="w-full" disabled={isCalculating}>
                <Calculator className="mr-2 h-4 w-4" />
                Recalculate
              </Button>
              <Button className="w-full ml-2" disabled={isCalculating}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Promo ROI Waterfall</CardTitle>
            <CardDescription>Breakdown of financial impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              {isCalculating ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Calculating ROI...</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Math.abs(Number(value)).toLocaleString()}`, "Value"]} />
                    <Legend />
                    <ReferenceLine y={0} stroke="#000" />
                    <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Units</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Base:</div>
                  <div className="text-right">{roiData.baseUnits.toLocaleString()}</div>
                  <div className="text-muted-foreground">Incremental:</div>
                  <div className="text-right text-[#28A745]">+{roiData.incrementalUnits.toLocaleString()}</div>
                  <div className="text-muted-foreground font-medium">Total:</div>
                  <div className="text-right font-medium">{roiData.totalUnits.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Revenue</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Base:</div>
                  <div className="text-right">${roiData.baseRevenue.toLocaleString()}</div>
                  <div className="text-muted-foreground">Incremental:</div>
                  <div className="text-right text-[#28A745]">+${roiData.incrementalRevenue.toLocaleString()}</div>
                  <div className="text-muted-foreground font-medium">Total:</div>
                  <div className="text-right font-medium">${roiData.totalRevenue.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Cost</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Base COGS:</div>
                  <div className="text-right">${roiData.baseCost.toLocaleString()}</div>
                  <div className="text-muted-foreground">Incremental COGS:</div>
                  <div className="text-right text-[#E0245E]">+${roiData.incrementalCost.toLocaleString()}</div>
                  <div className="text-muted-foreground">Marketing:</div>
                  <div className="text-right text-[#E0245E]">+${roiData.marketingCost.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Gross Margin</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Base GM:</div>
                  <div className="text-right">${roiData.baseGrossMargin.toLocaleString()}</div>
                  <div className="text-muted-foreground">Incremental GM:</div>
                  <div className="text-right text-[#28A745]">+${roiData.incrementalGrossMargin.toLocaleString()}</div>
                  <div className="text-muted-foreground font-medium">Net Impact:</div>
                  <div className="text-right font-medium">
                    ${(roiData.incrementalGrossMargin - roiData.marketingCost).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
