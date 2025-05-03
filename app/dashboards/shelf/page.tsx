"use client"

import { useState } from "react"
import { useTable } from "@/lib/db"
import { useFilter } from "@/lib/filter-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function ShelfPage() {
  const { markets, dateRange, pilotStoresOnly } = useFilter()
  const { data: osaData, isLoading: isLoadingOSA } = useTable("Inventory_OSA")
  const { data: planogramData, isLoading: isLoadingPlanogram } = useTable("Planogram_Compliance")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedStore, setSelectedStore] = useState<any>(null)

  // Mock data for stores with OSA and planogram compliance
  const stores = [
    {
      id: "S-1001",
      name: "7-Eleven Downtown",
      market: "Northeast",
      osa: 95.2,
      facingsVariance: 2,
      complianceScore: 92,
      lastUpdated: "2025-05-02",
      image: "/placeholder.svg?key=uxq4v",
    },
    {
      id: "S-1002",
      name: "7-Eleven Midtown",
      market: "Northeast",
      osa: 92.7,
      facingsVariance: -1,
      complianceScore: 88,
      lastUpdated: "2025-05-02",
      image: "/placeholder.svg?key=hjk0y",
    },
    {
      id: "S-1003",
      name: "7-Eleven Uptown",
      market: "Northeast",
      osa: 91.5,
      facingsVariance: 0,
      complianceScore: 90,
      lastUpdated: "2025-05-01",
      image: "/placeholder.svg?key=udewf",
    },
    {
      id: "S-1004",
      name: "7-Eleven Financial District",
      market: "Northeast",
      osa: 97.8,
      facingsVariance: 3,
      complianceScore: 95,
      lastUpdated: "2025-05-02",
      image: "/placeholder.svg?key=epgpn",
    },
    {
      id: "S-1005",
      name: "7-Eleven Chelsea",
      market: "Northeast",
      osa: 90.1,
      facingsVariance: -2,
      complianceScore: 85,
      lastUpdated: "2025-05-01",
      image: "/placeholder.svg?key=gy7t8",
    },
    {
      id: "S-2001",
      name: "7-Eleven Downtown LA",
      market: "West",
      osa: 96.3,
      facingsVariance: 1,
      complianceScore: 93,
      lastUpdated: "2025-05-02",
      image: "/placeholder.svg?key=suff4",
    },
    {
      id: "S-2002",
      name: "7-Eleven Hollywood",
      market: "West",
      osa: 93.5,
      facingsVariance: 0,
      complianceScore: 91,
      lastUpdated: "2025-05-01",
      image: "/placeholder.svg?key=er0u1",
    },
    {
      id: "S-3001",
      name: "7-Eleven Loop",
      market: "Midwest",
      osa: 92.0,
      facingsVariance: -1,
      complianceScore: 87,
      lastUpdated: "2025-05-02",
      image: "/placeholder.svg?key=pafwn",
    },
    {
      id: "S-3002",
      name: "7-Eleven Magnificent Mile",
      market: "Midwest",
      osa: 95.8,
      facingsVariance: 2,
      complianceScore: 94,
      lastUpdated: "2025-05-02",
      image: "/placeholder.svg?key=bkcee",
    },
    {
      id: "S-4001",
      name: "7-Eleven Downtown Houston",
      market: "Southwest",
      osa: 91.8,
      facingsVariance: -1,
      complianceScore: 89,
      lastUpdated: "2025-05-01",
      image: "/placeholder.svg?key=sviez",
    },
    {
      id: "S-4002",
      name: "7-Eleven Galleria",
      market: "Southwest",
      osa: 94.5,
      facingsVariance: 1,
      complianceScore: 92,
      lastUpdated: "2025-05-02",
      image: "/placeholder.svg?height=600&width=800&query=snack aisle with pepsico products",
    },
    {
      id: "S-5001",
      name: "7-Eleven Downtown Seattle",
      market: "Northwest",
      osa: 96.7,
      facingsVariance: 2,
      complianceScore: 95,
      lastUpdated: "2025-05-02",
      image: "/placeholder.svg?height=600&width=800&query=convenience store snack display",
    },
  ]

  // Filter stores based on search term and market filter
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      searchTerm === "" ||
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMarket = markets.length === 0 || markets.includes(store.market)

    return matchesSearch && matchesMarket
  })

  // Get status color based on OSA percentage
  const getOsaStatusColor = (osa: number) => {
    if (osa >= 95) return "bg-[#28A745]"
    if (osa >= 90) return "bg-[#FF671F]"
    return "bg-[#E0245E]"
  }

  // Get status color based on compliance score
  const getComplianceStatusColor = (score: number) => {
    if (score >= 90) return "bg-[#28A745]"
    if (score >= 85) return "bg-[#FF671F]"
    return "bg-[#E0245E]"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shelf Availability & Planogram Compliance</h1>
        <p className="text-muted-foreground">Track shelf availability and planogram compliance across stores</p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search stores..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map((store) => (
              <Card key={store.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                  <CardDescription>
                    {store.id} • {store.market}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">OSA</span>
                        <span className="text-sm font-medium">{store.osa}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full ${getOsaStatusColor(store.osa)}`}
                          style={{ width: `${store.osa}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Facings Variance</span>
                        <span
                          className={`text-sm font-medium ${store.facingsVariance > 0 ? "text-[#28A745]" : store.facingsVariance < 0 ? "text-[#E0245E]" : ""}`}
                        >
                          {store.facingsVariance > 0 ? "+" : ""}
                          {store.facingsVariance}
                        </span>
                      </div>
                      <Progress value={50 + store.facingsVariance * 10} max={100} />
                    </div>

                    <div
                      className="relative h-32 w-full rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(store.image)}
                    >
                      <Image
                        src={store.image || "/placeholder.svg"}
                        alt={`Shelf photo for ${store.name}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                        <ImageIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="text-xs text-muted-foreground">
                    Updated: {new Date(store.lastUpdated).toLocaleDateString()}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedStore(store)}>
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Store</th>
                      <th className="text-left p-4">Market</th>
                      <th className="text-center p-4">OSA %</th>
                      <th className="text-center p-4">Facings Var.</th>
                      <th className="text-center p-4">Compliance</th>
                      <th className="text-right p-4">Last Updated</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStores.map((store) => (
                      <tr key={store.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="font-medium">{store.name}</div>
                          <div className="text-xs text-muted-foreground">{store.id}</div>
                        </td>
                        <td className="p-4">{store.market}</td>
                        <td className="p-4 text-center">
                          <Badge className={getOsaStatusColor(store.osa) + " text-white"}>{store.osa}%</Badge>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={
                              store.facingsVariance > 0
                                ? "text-[#28A745]"
                                : store.facingsVariance < 0
                                  ? "text-[#E0245E]"
                                  : ""
                            }
                          >
                            {store.facingsVariance > 0 ? "+" : ""}
                            {store.facingsVariance}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <Badge className={getComplianceStatusColor(store.complianceScore) + " text-white"}>
                            {store.complianceScore}%
                          </Badge>
                        </td>
                        <td className="p-4 text-right text-sm">{new Date(store.lastUpdated).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mr-2"
                            onClick={() => setSelectedImage(store.image)}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedStore(store)}>
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Shelf Photo</DialogTitle>
            <DialogDescription>Planogram compliance visual reference</DialogDescription>
          </DialogHeader>
          <div className="relative h-[500px] w-full">
            {selectedImage && (
              <Image src={selectedImage || "/placeholder.svg"} alt="Shelf photo" fill className="object-contain" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Store details dialog */}
      <Dialog open={!!selectedStore} onOpenChange={(open) => !open && setSelectedStore(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedStore?.name}</DialogTitle>
            <DialogDescription>
              {selectedStore?.id} • {selectedStore?.market}
            </DialogDescription>
          </DialogHeader>

          {selectedStore && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">OSA & Compliance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-3">
                    <div className="text-sm font-medium mb-1">OSA Percentage</div>
                    <div className="text-2xl font-bold">{selectedStore.osa}%</div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-sm font-medium mb-1">Compliance Score</div>
                    <div className="text-2xl font-bold">{selectedStore.complianceScore}%</div>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Facings Variance</h3>
                <div className="flex items-center">
                  <span className="w-20 text-sm">-5</span>
                  <div className="flex-1">
                    <Progress value={50 + selectedStore.facingsVariance * 10} max={100} />
                  </div>
                  <span className="w-20 text-right text-sm">+5</span>
                </div>
                <div className="text-center mt-1 text-sm font-medium">
                  Current: {selectedStore.facingsVariance > 0 ? "+" : ""}
                  {selectedStore.facingsVariance}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Shelf Photo</h3>
                <div
                  className="relative h-48 w-full rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(selectedStore.image)}
                >
                  <Image
                    src={selectedStore.image || "/placeholder.svg"}
                    alt={`Shelf photo for ${selectedStore.name}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <ImageIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
