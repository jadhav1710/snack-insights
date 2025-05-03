"use client"

import { useState } from "react"
import { useTable } from "@/lib/db"
import { useFilter } from "@/lib/filter-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import Link from "next/link"

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

export default function CalendarPage() {
  const { markets, dateRange, pilotStoresOnly } = useFilter()
  const { data: promoData, isLoading: isLoadingPromo } = useTable("Promo_Calendar")
  const { data: skuData, isLoading: isLoadingSkus } = useTable("SKU_Master")

  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  // Mock data for promotions
  const promos = [
    {
      id: "P-1001",
      title: "Summer Snack Sale",
      start: new Date(2025, 4, 1),
      end: new Date(2025, 4, 15),
      promoType: "Discount",
      discount: 20,
      skus: [
        { id: "SKU-101", name: "Lay's Classic", expectedUplift: 35 },
        { id: "SKU-102", name: "Doritos Nacho Cheese", expectedUplift: 42 },
        { id: "SKU-103", name: "Cheetos Crunchy", expectedUplift: 28 },
      ],
    },
    {
      id: "P-1002",
      title: "BOGO Chips Week",
      start: new Date(2025, 4, 20),
      end: new Date(2025, 4, 27),
      promoType: "BOGO",
      discount: 50,
      skus: [
        { id: "SKU-101", name: "Lay's Classic", expectedUplift: 65 },
        { id: "SKU-104", name: "Ruffles Original", expectedUplift: 58 },
      ],
    },
    {
      id: "P-1003",
      title: "Snack & Beverage Bundle",
      start: new Date(2025, 5, 5),
      end: new Date(2025, 5, 12),
      promoType: "Bundle",
      discount: 15,
      skus: [
        { id: "SKU-102", name: "Doritos Nacho Cheese", expectedUplift: 45 },
        { id: "SKU-105", name: "Tostitos Scoops", expectedUplift: 40 },
      ],
    },
    {
      id: "P-1004",
      title: "Weekend Flash Sale",
      start: new Date(2025, 5, 20),
      end: new Date(2025, 5, 22),
      promoType: "Flash Sale",
      discount: 30,
      skus: [
        { id: "SKU-103", name: "Cheetos Crunchy", expectedUplift: 55 },
        { id: "SKU-106", name: "Fritos Original", expectedUplift: 48 },
      ],
    },
    {
      id: "P-1005",
      title: "Holiday Snack Promotion",
      start: new Date(2025, 6, 1),
      end: new Date(2025, 6, 15),
      promoType: "Discount",
      discount: 25,
      skus: [
        { id: "SKU-101", name: "Lay's Classic", expectedUplift: 38 },
        { id: "SKU-102", name: "Doritos Nacho Cheese", expectedUplift: 45 },
        { id: "SKU-107", name: "Cheetos Flamin' Hot", expectedUplift: 52 },
      ],
    },
  ]

  // Get color based on promo type
  const getPromoColor = (promoType: string) => {
    const colors: Record<string, string> = {
      Discount: "#005CB9",
      BOGO: "#FF671F",
      Bundle: "#28A745",
      "Flash Sale": "#E0245E",
    }
    return colors[promoType] || "#6F42C1"
  }

  // Format events for the calendar
  const calendarEvents = promos.map((promo) => ({
    ...promo,
    allDay: true,
    backgroundColor: getPromoColor(promo.promoType),
  }))

  // Custom event component for the calendar
  const EventComponent = ({ event }: { event: any }) => (
    <div
      style={{
        backgroundColor: getPromoColor(event.promoType),
        color: "white",
        padding: "2px 5px",
        borderRadius: "4px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: "0.85em",
      }}
    >
      {event.title}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Promo & SKU Calendar</h1>
        <p className="text-muted-foreground">Promotional calendar with SKU details and expected uplift</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotional Calendar</CardTitle>
          <CardDescription>View and manage upcoming promotions and associated SKUs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              views={["month", "week"]}
              components={{
                event: EventComponent,
              }}
              onSelectEvent={(event) => setSelectedEvent(event)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Promo details dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge style={{ backgroundColor: getPromoColor(selectedEvent.promoType) }} className="text-white">
                    {selectedEvent.promoType}
                  </Badge>
                  <span className="text-sm">
                    {moment(selectedEvent.start).format("MMM D")} - {moment(selectedEvent.end).format("MMM D, YYYY")}
                  </span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Promotion Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Promo ID:</div>
                  <div>{selectedEvent.id}</div>
                  <div className="text-muted-foreground">Discount:</div>
                  <div>{selectedEvent.discount}%</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">SKUs in Promotion</h3>
                <div className="space-y-3">
                  {selectedEvent.skus.map((sku: any) => (
                    <Card key={sku.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{sku.name}</div>
                          <div className="text-xs text-muted-foreground">{sku.id}</div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          +{sku.expectedUplift}% Uplift
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                <Button asChild>
                  <Link href="/dashboards/promo-roi">
                    View ROI Analysis <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
