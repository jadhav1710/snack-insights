"use client"

import { useQuery } from "@tanstack/react-query"
import * as duckdb from "@duckdb/duckdb-wasm"
import { useEffect, useState } from "react"

// Initialize DuckDB
let db: duckdb.AsyncDuckDB | null = null
let conn: duckdb.AsyncDuckDBConnection | null = null

async function initDuckDB() {
  if (db) return { db, conn }

  // Load the WASM bundle
  const JSDELIVR_BUNDLES = {
    mvp: {
      mainModule: "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.27.0/dist/duckdb-mvp.wasm",
      mainWorker: "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.27.0/dist/duckdb-browser-mvp.worker.js",
    },
  }

  // Select a bundle based on browser capability
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES)

  // Instantiate the asynchronous version of DuckDB
  const worker = new Worker(bundle.mainWorker)
  const logger = new duckdb.ConsoleLogger()
  db = new duckdb.AsyncDuckDB(logger, worker)
  await db.instantiate(bundle.mainModule)

  // Create a connection
  conn = await db.connect()

  return { db, conn }
}

// Function to load a CSV file into DuckDB
async function loadCSV(fileName: string) {
  try {
    const response = await fetch(`/api/csv-loader?file=${fileName}`)
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error loading CSV:", error)
    throw error
  }
}

// Hook to use a DuckDB table
export function useTable(tableName: string) {
  const [isReady, setIsReady] = useState(false)

  // Query to load the CSV data
  const { data, isLoading, error } = useQuery({
    queryKey: ["csv", tableName],
    queryFn: () => loadCSV(tableName),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Initialize DuckDB when the component mounts
  useEffect(() => {
    const init = async () => {
      await initDuckDB()
      setIsReady(true)
    }
    init()
  }, [])

  // Execute a SQL query against the table
  const executeQuery = async (sql: string) => {
    if (!conn || !isReady) {
      throw new Error("DuckDB is not initialized")
    }

    try {
      const result = await conn.query(sql)
      return result.toArray()
    } catch (error) {
      console.error("Error executing query:", error)
      throw error
    }
  }

  return {
    data,
    isLoading,
    error,
    isReady,
    executeQuery,
  }
}
