"use client"

import { useState } from "react"
import { useTable } from "@/lib/db"
import { useFilter } from "@/lib/filter-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function PilotKPIPage() {
  const { markets, dateRange, pilotStoresOnly } = useFilter()
  const { data: storeData, isLoading: isLoadingStores } = useTable("Store_Master")
  const { data: posData, isLoading: isLoadingPOS } = useTable("POS_Transactions")
  const { data: osaData, isLoading: isLoadingOSA } = useTable("Inventory_OSA")

  const [selectedStore, setSelectedStore] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for stores
  const stores = [
    {
      id: "S-1001",
      name: "7-Eleven Downtown",
      market: "Northeast",
      address: "123 Main St, New York, NY",
      salesIndex: 112,
      osa: 95.2,
      promoROI: 3.8,
      attachRate: 22.5,
      isPilot: true,
    },
    {
      id: "S-1002",
      name: "7-Eleven Midtown",
      market: "Northeast",
      address: "456 Park Ave, New York, NY",
      salesIndex: 108,
      osa: 92.7,
      promoROI: 3.5,
      attachRate: 21.8,
      isPilot: true,
    },
    {
      id: "S-1003",
      name: "7-Eleven Uptown",
      market: "Northeast",
      address: "789 Broadway, New York, NY",
      salesIndex: 105,
      osa: 91.5,
      promoROI: 3.2,
      attachRate: 20.5,
      isPilot: true,
    },
    {
      id: "S-1004",
      name: "7-Eleven Financial District",
      market: "Northeast",
      address: "101 Wall St, New York, NY",
      salesIndex: 118,
      osa: 97.8,
      promoROI: 4.1,
      attachRate: 24.2,
      isPilot: true,
    },
    {
      id: "S-1005",
      name: "7-Eleven Chelsea",
      market: "Northeast",
      address: "202 W 23rd St, New York, NY",
      salesIndex: 103,
      osa: 90.1,
      promoROI: 3.0,
      attachRate: 19.8,
      isPilot: true,
    },
    {
      id: "S-2001",
      name: "7-Eleven Downtown LA",
      market: "West",
      address: "123 Figueroa St, Los Angeles, CA",
      salesIndex: 115,
      osa: 96.3,
      promoROI: 3.9,
      attachRate: 23.1,
      isPilot: true,
    },
    {
      id: "S-2002",
      name: "7-Eleven Hollywood",
      market: "West",
      address: "456 Sunset Blvd, Los Angeles, CA",
      salesIndex: 110,
      osa: 93.5,
      promoROI: 3.6,
      attachRate: 22.0,
      isPilot: true,
    },
    {
      id: "S-3001",
      name: "7-Eleven Loop",
      market: "Midwest",
      address: "123 State St, Chicago, IL",
      salesIndex: 107,
      osa: 92.0,
      promoROI: 3.4,
      attachRate: 21.2,
      isPilot: true,
    },
    {
      id: "S-3002",
      name: "7-Eleven Magnificent Mile",
      market: "Midwest",
      address: "456 Michigan Ave, Chicago, IL",
      salesIndex: 114,
      osa: 95.8,
      promoROI: 3.8,
      attachRate: 22.8,
      isPilot: true,
    },
    {
      id: "S-4001",
      name: "7-Eleven Downtown Houston",
      market: "Southwest",
      address: "123 Main St, Houston, TX",
      salesIndex: 106,
      osa: 91.8,
      promoROI: 3.3,
      attachRate: 20.9,
      isPilot: true,
    },
  ]

  // Mock data for store performance over time
  const generateStorePerformanceData = (storeId: string) => {
    const baseData = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)

      // Generate random values with some consistency
      const salesIndex = 100 + Math.sin(i * 0.3) * 20 + Math.random() * 10
      const osa = 90 + Math.sin(i * 0.2) * 8 + Math.random() * 5
      const promoROI = 3 + Math.sin(i * 0.4) * 1.5 + Math.random() * 0.5
      const attachRate = 20 + Math.sin(i * 0.25) * 5 + Math.random() * 3

      baseData.push({
        date: date.toISOString().split("T")[0],
        salesIndex: Number.parseFloat(salesIndex.toFixed(1)),
        osa: Number.parseFloat(osa.toFixed(1)),
        promoROI: Number.parseFloat(promoROI.toFixed(2)),
        attachRate: Number.parseFloat(attachRate.toFixed(1)),
      })
    }

    return baseData
  }

  // Filter stores based on search term and market filter
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      searchTerm === "" ||
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMarket = markets.length === 0 || markets.includes(store.market)

    const matchesPilot = !pilotStoresOnly || store.isPilot

    return matchesSearch && matchesMarket && matchesPilot
  })

  // Get status badge color based on value
  const getStatusBadge = (value: number, thresholds: [number, number]) => {
    if (value >= thresholds[1]) return "success"
    if (value >= thresholds[0]) return "warning"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pilot-Cluster Store List & KPI Tracker</h1>
        <p className="text-muted-foreground">Track KPIs across pilot stores with detailed metrics</p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search stores by name, ID, or address..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">Export</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Store KPI Tracker</CardTitle>
          <CardDescription>Performance metrics for pilot stores</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store ID</TableHead>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead className="text-right">Sales Index</TableHead>
                  <TableHead className="text-right">OSA %</TableHead>
                  <TableHead className="text-right">Promo ROI</TableHead>
                  <TableHead className="text-right">Attach Rate %</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.map((store) => (
                  <TableRow
                    key={store.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedStore(store)}
                  >
                    <TableCell className="font-medium">{store.id}</TableCell>
                    <TableCell>{store.name}</TableCell>
                    <TableCell>{store.market}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusBadge(store.salesIndex, [100, 110])}>{store.salesIndex}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusBadge(store.osa, [90, 95])}>{store.osa}%</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusBadge(store.promoROI, [3, 3.5])}>{store.promoROI}x</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusBadge(store.attachRate, [20, 22])}>{store.attachRate}%</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedStore(store)
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Store details side panel */}
      <Sheet open={!!selectedStore} onOpenChange={(open) => !open && setSelectedStore(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selectedStore?.name}</SheetTitle>
            <SheetDescription>{selectedStore?.address}</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Store Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Store ID:</div>
                <div>{selectedStore?.id}</div>
                <div className="text-muted-foreground">Market:</div>
                <div>{selectedStore?.market}</div>
                <div className="text-muted-foreground">Pilot Status:</div>
                <div>{selectedStore?.isPilot ? "Pilot Store" : "Control Store"}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">KPI Trends (Last 30 Days)</h3>
              <div className="space-y-4">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={selectedStore ? generateStorePerformanceData(selectedStore.id) : []}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => value.split("-").slice(1).join("/")}
                      />
                      <YAxis domain={[80, 120]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="salesIndex" stroke="#005CB9" name="Sales Index" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={selectedStore ? generateStorePerformanceData(selectedStore.id) : []}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => value.split("-").slice(1).join("/")}
                      />
                      <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="osa" stroke="#FF671F" name="OSA %" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
