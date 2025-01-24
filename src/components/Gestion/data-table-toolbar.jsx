import React from "react"
import { Search, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { cargo, statuses, turn } from "@/lib/data"

export function DataTableToolbar({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0

  const renderFacetedFilter = (columnId, title, options) => {
    const column = table.getColumn(columnId)
    return column ? <DataTableFacetedFilter column={column} title={title} options={options} /> : null
  }

  const getFilterValue = (columnId) => {
    const column = table.getColumn(columnId)
    return column ? column.getFilterValue() || "" : ""
  }

  const handleSearchChange = (value) => {
    const nameColumn = table.getColumn("name")
    const tagNameColumn = table.getColumn("tagName")
    const userNameColumn = table.getColumn("userName")

    if (nameColumn) {
      nameColumn.setFilterValue(value)
    } else if (tagNameColumn) {
      tagNameColumn.setFilterValue(value)
    }else if (userNameColumn) {
      userNameColumn.setFilterValue(value)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 left-2.5 h-4 w-4 text-zinc-300" />
          <Input
            placeholder="Buscar..."
            value={getFilterValue("name") || getFilterValue("tagName") || getFilterValue("userName")}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="pl-8 md:w-[200px] lg:w-[250px]"
          />
        </div>
      </div>
      <div className="flex items-center gap-1">
        {renderFacetedFilter("role", "Rol", statuses)}
        {renderFacetedFilter("cargo", "Cargo", cargo)}
        {renderFacetedFilter("shift", "Turno", turn)}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2 lg:px-3 text-red-500 hover:bg-red-50"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

