"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";

export type ColumnDef<T> = {
  header: string;
  accessorKey?: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
};

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  searchKey?: string;
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
  // Sorting
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string, order: "asc" | "desc") => void;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  // Selection
  selectedIds?: string[];
  onSelectChange?: (ids: string[]) => void;
  getRowId?: (item: T) => string;
  renderRowDetails?: (item: T) => React.ReactNode;
  expandedRowId?: string;
};

function DataTableInner<T>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  onSearchChange,
  sortKey,
  sortOrder,
  onSort,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 20,
  onPageSizeChange,
  pageSizeOptions = [20, 50, 100],
  selectedIds = [],
  onSelectChange,
  getRowId,
  renderRowDetails,
  expandedRowId,
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchValue);
    }
  }, [onSearchChange, searchValue]);

  const handleSortClick = useCallback((accessorKey?: string) => {
    if (!accessorKey || !onSort) return;
    const isCurrent = sortKey === accessorKey;
    const nextOrder = isCurrent && sortOrder === "asc" ? "desc" : "asc";
    onSort(accessorKey, nextOrder);
  }, [onSort, sortKey, sortOrder]);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (!onSelectChange || !getRowId) return;
    if (checked) {
      const allIds = data.map((item) => getRowId(item));
      onSelectChange(allIds);
    } else {
      onSelectChange([]);
    }
  }, [data, getRowId, onSelectChange]);

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    if (!onSelectChange) return;
    if (checked) {
      onSelectChange([...selectedIds, id]);
    } else {
      onSelectChange(selectedIds.filter((item) => item !== id));
    }
  }, [onSelectChange, selectedIds]);

  const allSelected = useMemo(() => {
    return data.length > 0 && !!getRowId && data.every((item) => selectedIds.includes(getRowId(item)));
  }, [data, getRowId, selectedIds]);

  return (
    <div className="space-y-4 font-sans text-sm w-full">
      {/* Top Toolbar */}
      {(onSearchChange || searchKey) && (
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-250 focus:border-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full max-w-sm transition-all duration-200"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      )}

      {/* Main Table Border Wrapper */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse" aria-label="Data Table">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500 h-11">
                {onSelectChange && getRowId && (
                  <th className="px-4 w-12 text-center" scope="col">
                    <input
                      type="checkbox"
                      aria-label="Select all rows"
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-350 bg-white text-blue-600 focus:ring-blue-550/20 w-4 h-4 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={`px-4 py-3 font-semibold ${
                      col.sortable && onSort ? "cursor-pointer select-none hover:text-slate-900" : ""
                    }`}
                    onClick={() => col.sortable && handleSortClick(col.accessorKey as string)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && onSort && col.accessorKey === sortKey && (
                        <span aria-hidden="true">
                          {sortOrder === "asc" ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-700">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onSelectChange ? 1 : 0)} className="text-center py-10 text-slate-400">
                    No records found.
                  </td>
                </tr>
              ) : (
                data.map((item, rIdx) => {
                  const id = getRowId ? getRowId(item) : "";
                  const selected = selectedIds.includes(id);
                  const isExpanded = expandedRowId === id;

                  return (
                    <React.Fragment key={id || rIdx}>
                      <tr
                        className={`hover:bg-slate-50 transition-colors h-12 ${
                          selected ? "bg-blue-50/60" : ""
                        }`}
                      >
                        {onSelectChange && getRowId && (
                          <td className="px-4 w-12 text-center">
                            <input
                              type="checkbox"
                              aria-label={`Select row ${rIdx + 1}`}
                              checked={selected}
                              onChange={(e) => handleSelectRow(id, e.target.checked)}
                              className="rounded border-slate-350 bg-white text-blue-600 focus:ring-blue-550/20 w-4 h-4 cursor-pointer"
                            />
                          </td>
                        )}
                        {columns.map((col, cIdx) => (
                          <td key={cIdx} className="px-4 py-3">
                            {col.cell
                              ? col.cell(item)
                              : col.accessorKey
                              ? String(item[col.accessorKey as keyof T] || "")
                              : ""}
                          </td>
                        ))}
                      </tr>
                      {isExpanded && renderRowDetails && (
                        <tr className="bg-slate-50/70 border-b border-slate-200">
                          <td colSpan={columns.length + (onSelectChange ? 1 : 0)} className="px-6 py-4">
                            {renderRowDetails(item)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Controls */}
        {onPageChange && (
          <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              {onPageSizeChange && (
                <div className="flex items-center gap-2">
                  <label htmlFor="rows-per-page-select">Rows per page:</label>
                  <select
                    id="rows-per-page-select"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-slate-800"
                  >
                    {pageSizeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <span>Page {currentPage} of {totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5" aria-label="Pagination Navigation">
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(1)}
                aria-label="First page"
                className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-30 disabled:hover:border-slate-200 flex items-center justify-center text-slate-650 cursor-pointer"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous page"
                className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-30 disabled:hover:border-slate-200 flex items-center justify-center text-slate-650 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next page"
                className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-30 disabled:hover:border-slate-200 flex items-center justify-center text-slate-650 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(totalPages)}
                aria-label="Last page"
                className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-30 disabled:hover:border-slate-200 flex items-center justify-center text-slate-650 cursor-pointer"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const DataTable = React.memo(DataTableInner) as typeof DataTableInner;

