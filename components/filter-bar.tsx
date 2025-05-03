"use client"

import { useState, useEffect } from "react"
import { useFilter } from "@/lib/filter-store"
import { useTable } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, FilterIcon, Search, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export function FilterBar() {
  const {
    markets,
    dateRange,
    pilotStoresOnly,
    searchQuery,
    setMarkets,
    setDateRange,
    setPilotStoresOnly,
    setSearchQuery,
    resetFilters,
  } = useFilter()

  const [isOpen, setIsOpen] = useState(false)
  const [availableMarkets, setAvailableMarkets] = useState<string[]>([])
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [marketSelectorOpen, setMarketSelectorOpen] = useState(false)

  // Load store data to get available markets
  const { data: storeData, isLoading: isLoadingStores } = useTable("Store_Master")

  // Simulate loading markets from the Store_Master table
  useEffect(() => {
    if (!isLoadingStores && storeData) {
      // In a real app, this would come from the actual data
      setAvailableMarkets([
        "Northeast",
        "Southeast",
        "Midwest",
        "Southwest",
        "West",
        "Northwest",
        "Central",
        "Mountain",
      ])
    }
  }, [isLoadingStores, storeData])

  // Count active filters
  const activeFilterCount =
    (markets.length > 0 ? 1 : 0) +
    (dateRange.start !== null || dateRange.end !== null ? 1 : 0) +
    (pilotStoresOnly ? 1 : 0) +
    (searchQuery ? 1 : 0)

  return (
    <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <a href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="h-6 w-6 rounded-full bg-[#005CB9]"></div>
              <span className="font-bold">×</span>
              <div className="h-6 w-6 rounded-full bg-[#FF671F]"></div>
            </div>
            <span className="hidden font-bold sm:inline-block">Snack Insights</span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SKU or Store..."
                className="pl-8 md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter button */}
            <Button variant="outline" size="sm" className="relative md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <FilterIcon className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {/* Desktop filters */}
            <div className="hidden md:flex md:items-center md:gap-2">
              {/* Market selector */}
              <Popover open={marketSelectorOpen} onOpenChange={setMarketSelectorOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    Markets
                    {markets.length > 0 && (
                      <Badge variant="secondary" className="ml-1 rounded-full px-1">
                        {markets.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search markets..." />
                    <CommandList>
                      <CommandEmpty>No markets found.</CommandEmpty>
                      <CommandGroup>
                        {availableMarkets.map((market) => (
                          <CommandItem
                            key={market}
                            onSelect={() => {
                              setMarkets(
                                markets.includes(market) ? markets.filter((m) => m !== market) : [...markets, market],
                              )
                            }}
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                markets.includes(market)
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible",
                              )}
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>{market}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Date range picker */}
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 justify-start text-left font-normal",
                      !dateRange.start && !dateRange.end && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.start && dateRange.end ? (
                      <>
                        {format(dateRange.start, "LLL dd, y")} - {format(dateRange.end, "LLL dd, y")}
                      </>
                    ) : (
                      <span>Date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.start || new Date()}
                    selected={{
                      from: dateRange.start || undefined,
                      to: dateRange.end || undefined,
                    }}
                    onSelect={(range) =>
                      setDateRange({
                        start: range?.from || null,
                        end: range?.to || null,
                      })
                    }
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              {/* Pilot stores toggle */}
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="pilot-stores"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Pilot stores only
                </Label>
                <Switch id="pilot-stores" checked={pilotStoresOnly} onCheckedChange={setPilotStoresOnly} />
              </div>

              {/* Reset filters */}
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={resetFilters}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter panel */}
      {isOpen && (
        <div className="border-t p-4 md:hidden">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="markets-mobile">Markets</Label>
              <Select
                onValueChange={(value) => {
                  if (value && !markets.includes(value)) {
                    setMarkets([...markets, value])
                  }
                }}
              >
                <SelectTrigger id="markets-mobile">
                  <SelectValue placeholder="Select markets" />
                </SelectTrigger>
                <SelectContent>
                  {availableMarkets.map((market) => (
                    <SelectItem key={market} value={market}>
                      {market}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {markets.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {markets.map((market) => (
                    <Badge key={market} variant="secondary" className="flex items-center gap-1">
                      {market}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => setMarkets(markets.filter((m) => m !== market))}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {market}</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date-range-mobile">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-range-mobile"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.start && !dateRange.end && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.start && dateRange.end ? (
                      <>
                        {format(dateRange.start, "LLL dd, y")} - {format(dateRange.end, "LLL dd, y")}
                      </>
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.start || new Date()}
                    selected={{
                      from: dateRange.start || undefined,
                      to: dateRange.end || undefined,
                    }}
                    onSelect={(range) =>
                      setDateRange({
                        start: range?.from || null,
                        end: range?.to || null,
                      })
                    }
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <Switch id="pilot-stores-mobile" checked={pilotStoresOnly} onCheckedChange={setPilotStoresOnly} />
              <Label htmlFor="pilot-stores-mobile">Pilot stores only</Label>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetFilters()
                  setIsOpen(false)
                }}
              >
                Reset filters
              </Button>
              <Button size="sm" onClick={() => setIsOpen(false)}>
                Apply filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
