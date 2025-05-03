"use client"

import { useState } from "react"
import { useTable } from "@/lib/db"
import { useFilter } from "@/lib/filter-store"
import { ChartWrapper } from "@/components/chart-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from "recharts"
import { GoogleMap, useJsApiLoader, Circle } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function MarketHeadroomPage() {
  const { markets, dateRange, pilotStoresOnly } = useFilter()
  const { data: marketData, isLoading: isLoadingMarket } = useTable("Synthetic_OBPPC_Dataset")
  const { data: competitorData, isLoading: isLoadingCompetitor } = useTable("Competitor_PPA")

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null)

  // Mock data for the bubble chart
  const bubbleData = [
    { x: 5.2, y: 12.5, z: 80, name: "Northeast" },
    { x: 7.8, y: 8.3, z: 65, name: "Southeast" },
    { x: 4.5, y: 10.2, z: 70, name: "Midwest" },
    { x: 8.9, y: 7.5, z: 55, name: "Southwest" },
    { x: 6.7, y: 11.8, z: 75, name: "West" },
    { x: 3.8, y: 9.5, z: 60, name: "Northwest" },
    { x: 5.5, y: 8.8, z: 50, name: "Central" },
    { x: 9.2, y: 6.5, z: 45, name: "Mountain" },
  ]

  // Mock data for the map
  const mapData = [
    { lat: 40.7128, lng: -74.006, tam: 2500000, name: "New York" },
    { lat: 34.0522, lng: -118.2437, tam: 2100000, name: "Los Angeles" },
    { lat: 41.8781, lng: -87.6298, tam: 1800000, name: "Chicago" },
    { lat: 29.7604, lng: -95.3698, tam: 1500000, name: "Houston" },
    { lat: 33.4484, lng: -112.074, tam: 1200000, name: "Phoenix" },
    { lat: 39.9526, lng: -75.1652, tam: 1100000, name: "Philadelphia" },
    { lat: 32.7767, lng: -96.797, tam: 950000, name: "Dallas" },
    { lat: 37.7749, lng: -122.4194, tam: 900000, name: "San Francisco" },
  ]

  // Mock data for city clusters
  const cityClusters = [
    {
      id: 1,
      name: "Northeast Urban",
      cities: "New York, Boston, Philadelphia",
      cagr: 7.2,
      missionGap: "Snack (+15%)",
    },
    {
      id: 2,
      name: "West Coast Tech",
      cities: "San Francisco, Seattle, Portland",
      cagr: 8.5,
      missionGap: "Beverage (+12%)",
    },
    {
      id: 3,
      name: "Southern Comfort",
      cities: "Atlanta, Charlotte, Nashville",
      cagr: 5.8,
      missionGap: "Meal (+8%)",
    },
    {
      id: 4,
      name: "Midwest Heartland",
      cities: "Chicago, Detroit, Minneapolis",
      cagr: 4.2,
      missionGap: "Pantry (+10%)",
    },
    {
      id: 5,
      name: "Southwest Sun",
      cities: "Phoenix, Las Vegas, Albuquerque",
      cagr: 9.1,
      missionGap: "Impulse (+18%)",
    },
  ]

  // Google Maps API loading
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "", // Would use env variable in production
  })

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  }

  const center = {
    lat: 39.8283,
    lng: -98.5795,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market & Mission Prioritisation Map</h1>
        <p className="text-muted-foreground">Geographic market analysis and mission prioritization</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartWrapper
          title="Market TAM Choropleth"
          description="Total addressable market by geographic region"
          isLoading={isLoadingMarket}
        >
          <div className="h-[400px] w-full">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={4}
                options={{
                  styles: [
                    {
                      featureType: "all",
                      elementType: "all",
                      stylers: [{ saturation: -100 }],
                    },
                  ],
                }}
              >
                {mapData.map((city, index) => (
                  <Circle
                    key={index}
                    center={{ lat: city.lat, lng: city.lng }}
                    radius={Math.sqrt(city.tam) * 100}
                    options={{
                      fillColor: "#005CB9",
                      fillOpacity: 0.35,
                      strokeColor: "#005CB9",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                    }}
                    onClick={() => {
                      setSelectedMarket(city.name)
                    }}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p>Loading map...</p>
              </div>
            )}
          </div>
        </ChartWrapper>

        <ChartWrapper
          title="Market Opportunity Matrix"
          description="CAGR vs Per-capita consumption with store density"
          isLoading={isLoadingMarket}
        >
          <div className="h-[400px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="CAGR (%)"
                  domain={[0, 10]}
                  label={{ value: "CAGR (%)", position: "bottom" }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Per-capita consumption"
                  domain={[0, 15]}
                  label={{ value: "Per-capita consumption", angle: -90, position: "left" }}
                />
                <ZAxis type="number" dataKey="z" range={[100, 500]} name="Store density" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name, props) => {
                    if (name === "Store density") {
                      return [`${value} stores`, name]
                    }
                    return [value, name]
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <p className="font-bold">{payload[0].payload.name}</p>
                          <p>CAGR: {payload[0].value}%</p>
                          <p>Per-capita: ${payload[1].value}</p>
                          <p>Store density: {payload[2].value} stores</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Scatter
                  name="Markets"
                  data={bubbleData}
                  fill="#FF671F"
                  onClick={(data) => {
                    setSelectedMarket(data.name)
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>
      </div>

      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full flex justify-between items-center"
        >
          City Clusters & Mission Gap Analysis
          {drawerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {drawerOpen && (
          <Card className="mt-2">
            <CardHeader>
              <CardTitle>City Clusters with CAGR and Mission Gap</CardTitle>
              <CardDescription>Analysis of city clusters by growth rate and mission opportunity</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cluster Name</TableHead>
                      <TableHead>Cities</TableHead>
                      <TableHead className="text-right">CAGR (%)</TableHead>
                      <TableHead>Primary Mission Gap</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cityClusters.map((cluster) => (
                      <TableRow
                        key={cluster.id}
                        className={selectedMarket && cluster.cities.includes(selectedMarket) ? "bg-primary/10" : ""}
                      >
                        <TableCell className="font-medium">{cluster.name}</TableCell>
                        <TableCell>{cluster.cities}</TableCell>
                        <TableCell className="text-right">{cluster.cagr}%</TableCell>
                        <TableCell>{cluster.missionGap}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
