import { useTable } from "@/lib/db"
import { renderHook } from "@testing-library/react-hooks"
import { jest } from "@jest/globals"

// Mock the fetch function
global.fetch = jest.fn()

describe("useTable hook", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call the CSV loader API with the correct table name", async () => {
    // Mock the fetch response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rowCount: 10, columns: ["id", "name"] }),
    })

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useTable("Store_Master"))

    // Wait for the query to resolve
    await waitForNextUpdate()

    // Check if fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith("/api/csv-loader?file=Store_Master")

    // Check if the data is returned correctly
    expect(result.current.data).toEqual({ rowCount: 10, columns: ["id", "name"] })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
