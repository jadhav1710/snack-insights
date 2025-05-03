import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BarChart3, Calendar, LineChart, MapPin, PieChart, ShoppingBag, Smartphone } from "lucide-react"

export default function Home() {
  const dashboards = [
    {
      title: "Baseline Sales & Shopper Metrics",
      description: "Key sales metrics, revenue trends, and shopper behavior analysis",
      icon: <LineChart className="h-6 w-6" />,
      href: "/dashboards/baseline",
    },
    {
      title: "Market & Mission Prioritisation Map",
      description: "Geographic market analysis and mission prioritization",
      icon: <MapPin className="h-6 w-6" />,
      href: "/dashboards/market-headroom",
    },
    {
      title: "Pilot-Cluster Store List & KPI Tracker",
      description: "Track KPIs across pilot stores with detailed metrics",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "/dashboards/pilot-kpi",
    },
    {
      title: "Promo & SKU Calendar",
      description: "Promotional calendar with SKU details and expected uplift",
      icon: <Calendar className="h-6 w-6" />,
      href: "/dashboards/calendar",
    },
    {
      title: "Real-Time Sell-out Monitor",
      description: "Live monitoring of sell-out rates with auto-refresh",
      icon: <ShoppingBag className="h-6 w-6" />,
      href: "/dashboards/velocity",
    },
    {
      title: "Shelf Availability & Planogram Compliance",
      description: "Track shelf availability and planogram compliance",
      icon: <PieChart className="h-6 w-6" />,
      href: "/dashboards/shelf",
    },
    {
      title: "Promo ROI Quick-Calc Panel",
      description: "Calculate ROI for promotions with dynamic adjustments",
      icon: <LineChart className="h-6 w-6" />,
      href: "/dashboards/promo-roi",
    },
    {
      title: "Executive KPI Flash",
      description: "Mobile-first executive summary of key performance indicators",
      icon: <Smartphone className="h-6 w-6" />,
      href: "/dashboards/exec-flash",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-12 w-12 rounded-full bg-[#005CB9]"></div>
          <span className="text-2xl font-bold">×</span>
          <div className="h-12 w-12 rounded-full bg-[#FF671F]"></div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Snack Insights Dashboard</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Interactive dashboard suite for the PepsiCo × 7-Eleven Salty-Snacks program
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {dashboards.map((dashboard) => (
          <Card key={dashboard.href} className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2 text-primary">{dashboard.icon}</div>
                <CardTitle className="text-xl">{dashboard.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{dashboard.description}</CardDescription>
              <Button asChild className="w-full">
                <Link href={dashboard.href}>
                  View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
