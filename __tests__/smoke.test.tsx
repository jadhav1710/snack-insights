import type React from "react"
import { render, screen } from "@testing-library/react"
import HomePage from "@/app/page"
import BaselinePage from "@/app/dashboards/baseline/page"
import MarketHeadroomPage from "@/app/dashboards/market-headroom/page"
import PilotKPIPage from "@/app/dashboards/pilot-kpi/page"
import CalendarPage from "@/app/dashboards/calendar/page"
import VelocityPage from "@/app/dashboards/velocity/page"
import ShelfPage from "@/app/dashboards/shelf/page"
import PromoROIPage from "@/app/dashboards/promo-roi/page"
import ExecFlashPage from "@/app/dashboards/exec-flash/page"

// Mock the hooks and components used by the pages
jest.mock("@/lib/filter-store", () => ({
  useFilter: () => ({
    markets: [],
    dateRange: { start: null, end: null },
    pilotStoresOnly: false,
    searchQuery: "",
    setMarkets: jest.fn(),
    setDateRange: jest.fn(),
    setPilotStoresOnly: jest.fn(),
    setSearchQuery: jest.fn(),
    resetFilters: jest.fn(),
  }),
}))

jest.mock("@/lib/db", () => ({
  useTable: () => ({
    data: null,
    isLoading: true,
    error: null,
    isReady: false,
    executeQuery: jest.fn(),
  }),
}))

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

jest.mock("@/components/ui/chart", () => ({
  Chart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Smoke tests for each page
describe("Smoke Tests", () => {
  it("renders the home page without crashing", () => {
    render(<HomePage />)
    expect(screen.getByText(/Snack Insights Dashboard/i)).toBeInTheDocument()
  })

  it("renders the baseline page without crashing", () => {
    render(<BaselinePage />)
    expect(screen.getByText(/Baseline Sales & Shopper Metrics/i)).toBeInTheDocument()
  })

  it("renders the market headroom page without crashing", () => {
    render(<MarketHeadroomPage />)
    expect(screen.getByText(/Market & Mission Prioritisation Map/i)).toBeInTheDocument()
  })

  it("renders the pilot KPI page without crashing", () => {
    render(<PilotKPIPage />)
    expect(screen.getByText(/Pilot-Cluster Store List & KPI Tracker/i)).toBeInTheDocument()
  })

  it("renders the calendar page without crashing", () => {
    render(<CalendarPage />)
    expect(screen.getByText(/Promo & SKU Calendar/i)).toBeInTheDocument()
  })

  it("renders the velocity page without crashing", () => {
    render(<VelocityPage />)
    expect(screen.getByText(/Real-Time Sell-out Monitor/i)).toBeInTheDocument()
  })

  it("renders the shelf page without crashing", () => {
    render(<ShelfPage />)
    expect(screen.getByText(/Shelf Availability & Planogram Compliance/i)).toBeInTheDocument()
  })

  it("renders the promo ROI page without crashing", () => {
    render(<PromoROIPage />)
    expect(screen.getByText(/Promo ROI Quick-Calc Panel/i)).toBeInTheDocument()
  })

  it("renders the exec flash page without crashing", () => {
    render(<ExecFlashPage />)
    expect(screen.getByText(/Executive KPI Flash/i)).toBeInTheDocument()
  })
})
