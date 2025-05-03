import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import Papa from "papaparse"

export async function GET(request: NextRequest) {
  try {
    // Get the file parameter from the URL
    const searchParams = request.nextUrl.searchParams
    const fileName = searchParams.get("file")

    if (!fileName) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 })
    }

    // Construct the file path
    const filePath = path.join(process.cwd(), "data", `${fileName}.csv`)

    try {
      // Read the file
      const fileContent = await fs.readFile(filePath, "utf8")

      // Parse the CSV
      const result = Papa.parse(fileContent, {
        header: true,
        delimiter: "|",
        skipEmptyLines: true,
      })

      // Return the parsed data
      return NextResponse.json({
        rowCount: result.data.length,
        columns: result.meta.fields,
        data: result.data,
      })
    } catch (error) {
      console.error(`Error reading file ${fileName}:`, error)

      // For demo purposes, return mock data if file doesn't exist
      return NextResponse.json({
        rowCount: 100,
        columns: getMockColumns(fileName),
        data: getMockData(fileName, 100),
      })
    }
  } catch (error) {
    console.error("Error in CSV loader:", error)
    return NextResponse.json({ error: "Failed to process CSV file" }, { status: 500 })
  }
}

// Helper function to generate mock columns based on the requested file
function getMockColumns(fileName: string): string[] {
  const commonColumns = ["ID", "Timestamp", "Value"]

  const fileSpecificColumns: Record<string, string[]> = {
    Store_Master: ["Store_ID", "Store_Name", "Market", "Address", "City", "State", "ZIP", "Pilot_Flag"],
    SKU_Master: ["SKU_ID", "SKU_Name", "Category", "Brand", "Size", "Price"],
    POS_Transactions: ["Transaction_ID", "Store_ID", "SKU_ID", "Quantity", "Price", "Timestamp", "Customer_ID"],
    Inventory_OSA: ["Store_ID", "SKU_ID", "Date", "In_Stock", "Facings", "OSA_Percentage"],
    Loyalty_Panel: ["Customer_ID", "Store_ID", "Visit_Date", "Mission", "Basket_Size", "Frequency"],
    Promo_Calendar: ["Promo_ID", "Start_Date", "End_Date", "Promo_Type", "Discount", "SKU_IDs"],
    SKU_Financials: ["SKU_ID", "COGS", "Margin", "Promo_Budget"],
    Planogram_Compliance: ["Store_ID", "Date", "Compliance_Score", "Photo_URL"],
    Competitor_PPA: ["Market", "Competitor", "Share", "Price_Index"],
    Synthetic_OBPPC_Dataset: ["Market", "Mission", "TAM_USD", "CAGR", "Per_Capita_Consumption"],
  }

  return fileSpecificColumns[fileName] || commonColumns
}

// Helper function to generate mock data based on the requested file
function getMockData(fileName: string, count: number): any[] {
  const mockData = []
  const columns = getMockColumns(fileName)

  for (let i = 0; i < count; i++) {
    const row: Record<string, any> = {}

    columns.forEach((column) => {
      if (column.includes("ID")) {
        row[column] = `ID-${i + 1000}`
      } else if (column.includes("Date") || column.includes("Timestamp")) {
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 30))
        row[column] = date.toISOString()
      } else if (
        column.includes("Price") ||
        column.includes("Value") ||
        column.includes("COGS") ||
        column.includes("Margin")
      ) {
        row[column] = (Math.random() * 100).toFixed(2)
      } else if (column.includes("Percentage") || column.includes("Score")) {
        row[column] = (Math.random() * 100).toFixed(1)
      } else if (column.includes("Flag")) {
        row[column] = Math.random() > 0.5 ? "Y" : "N"
      } else if (column === "Market") {
        const markets = ["Northeast", "Southeast", "Midwest", "Southwest", "West", "Northwest", "Central", "Mountain"]
        row[column] = markets[Math.floor(Math.random() * markets.length)]
      } else if (column === "Mission") {
        const missions = ["Snack", "Meal", "Beverage", "Impulse", "Pantry"]
        row[column] = missions[Math.floor(Math.random() * missions.length)]
      } else if (column === "Category") {
        const categories = ["Chips", "Pretzels", "Nuts", "Popcorn", "Crackers"]
        row[column] = categories[Math.floor(Math.random() * categories.length)]
      } else if (column === "Brand") {
        const brands = ["Lay's", "Doritos", "Cheetos", "Ruffles", "Fritos"]
        row[column] = brands[Math.floor(Math.random() * brands.length)]
      } else {
        row[column] = `${column}-${i}`
      }
    })

    mockData.push(row)
  }

  return mockData
}
