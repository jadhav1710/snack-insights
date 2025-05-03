# Snack Insights

Interactive dashboard suite for the PepsiCo × 7-Eleven Salty-Snacks program.

## Features

- **8 Interactive Dashboards**: Comprehensive analytics for sales, market analysis, store performance, promotions, and more
- **Real-time Monitoring**: Live sell-out tracking with auto-refresh capabilities
- **Dynamic Filtering**: Cross-dashboard filtering by market, date range, and store type
- **Mobile-first Design**: Responsive layouts optimized for all device sizes
- **Interactive Charts**: Visualize data with Recharts (Bar, Line, Area, Pie, Radar, Scatter) and Google Maps choropleth
- **Data Processing**: CSV ingestion with DuckDB for performant client-side data analysis

## Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18
- **Styling**: TailwindCSS + shadcn/ui component library
- **Charts**: Recharts, @react-google-maps/api
- **State Management**: TanStack Query for async data loading, Zustand for cross-dashboard filters
- **Data Processing**: PapaParse for CSV parsing, DuckDB WASM for client-side data analysis
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/your-username/snack-insights.git
cd snack-insights
\`\`\`

2. Install dependencies:

\`\`\`bash
pnpm install
\`\`\`

3. Create a `.env.local` file in the root directory with the following variables:

\`\`\`
# Add any environment variables here
\`\`\`

4. Start the development server:

\`\`\`bash
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

\`\`\`
snack-insights/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   └── csv-loader/     # CSV loading API
│   ├── dashboards/         # Dashboard pages
│   │   ├── baseline/       # Baseline Sales & Shopper Metrics
│   │   ├── market-headroom/# Market & Mission Prioritisation Map
│   │   ├── pilot-kpi/      # Pilot-Cluster Store List & KPI Tracker
│   │   ├── calendar/       # Promo & SKU Calendar
│   │   ├── velocity/       # Real-Time Sell-out Monitor
│   │   ├── shelf/          # Shelf Availability & Planogram Compliance
│   │   ├── promo-roi/      # Promo ROI Quick-Calc Panel
│   │   └── exec-flash/     # Executive KPI Flash
│   ├── layout.tsx          # Root layout with FilterBar
│   └── page.tsx            # Home page
├── components/             # Reusable components
│   ├── chart-wrapper.tsx   # Generic chart container
│   ├── filter-bar.tsx      # Global filter bar
│   ├── kpi-chip.tsx        # KPI indicator component
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and shared code
│   ├── db.ts               # DuckDB setup and data access
│   ├── filter-store.tsx    # Zustand store for filters
│   └── utils.ts            # Helper functions
├── public/                 # Static assets
└── data/                   # CSV data files (not included in repo)
\`\`\`

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check for code issues
- `pnpm test` - Run Jest tests

## Data Files

The application expects CSV files in the `/data` directory. All files should be pipe-delimited (`|`).

Expected files:
- `Store_Master.csv` - Store information
- `SKU_Master.csv` - Product information
- `POS_Transactions.csv` - Point of sale transaction data
- `Inventory_OSA.csv` - On-shelf availability data
- `Loyalty_Panel.csv` - Customer loyalty data
- `Promo_Calendar.csv` - Promotional calendar
- `SKU_Financials.csv` - Financial data for SKUs
- `Planogram_Compliance.csv` - Shelf compliance data
- `Competitor_PPA.csv` - Competitor price and share data
- `Synthetic_OBPPC_Dataset.csv` - Market opportunity data

## Definition of Done

- `pnpm install && pnpm dev` loads all CSVs without error (<5s cold)
- Lighthouse performance ≥ 90 on desktop and mobile
- Filters apply within 150ms across all dashboards
- `pnpm test` passes

## License

This project is proprietary and confidential.
