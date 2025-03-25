"use client";

import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { formatDate, formatDistanceToNow } from "date-fns";
import type { User } from "@/lib/utils/types";
import { Tooltip } from "../ui/Tooltip";


type UserTableProps = {
  users: User[];
  onSelectUsers: (userIds: string[]) => void;
  selectedUsers: string[];
};

const columnHelper = createColumnHelper<User>();

export function UserTable({
  users,
  onSelectUsers,
  selectedUsers,
}: UserTableProps) {
  // Create a proper row selection object from selectedUsers array
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  
  // Pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // Update rowSelection when selectedUsers changes
  useEffect(() => {
    const newRowSelection: Record<string, boolean> = {};
    selectedUsers.forEach(id => {
      newRowSelection[id] = true;
    });
    setRowSelection(newRowSelection);
  }, [selectedUsers]);

  const columns = [
    columnHelper.display({
      id: "selection",
      header: ({ table }) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            aria-label="Select all users"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            checked={row.getIsSelected()}
            onChange={(e) => {
              row.toggleSelected(e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${row.original.name}`}
          />
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <div className={`font-medium ${info.row.original.status === 'blocked' ? 'line-through text-gray-500' : ''}`}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email ↓",
      cell: (info) => (
        <div className={`font-medium ${info.row.original.status === 'blocked' ? 'text-gray-400' : ''}`}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("lastLogin", {
      header: "Last Seen",
      cell: (info) => (
        <Tooltip content={formatDate(new Date(info.getValue()),'PPpp')} position="bottom">
          <div className={`font-medium ${info.row.original.status === 'blocked' ? 'text-gray-400' : ''}`}>
            {formatDistanceToNow(new Date(info.getValue()), { addSuffix: true })}
          </div>
        </Tooltip>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium ${
              info.getValue() === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {info.getValue()}
          </span>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: {
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      let newSelection: Record<string, boolean>;
      
      if (typeof updater === "function") {
        newSelection = updater(rowSelection);
      } else {
        newSelection = updater;
      }   
      setRowSelection(newSelection);
    
      // Convert to array of IDs
      const selectedIds = Object.entries(newSelection)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id);
      
      onSelectUsers(selectedIds);
    },
    // Don't allow sorting changes - always use the initial sorting state
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <div className="flex flex-col w-full">
      {/* Responsive table with horizontal scroll */}
      <div className="overflow-x-auto shadow-indigo-500 shadow-sm ring-1 ring-gray-400  ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className={`py-3.5 px-3 text-left text-sm font-semibold text-gray-900 ${
                      header.id === "selection" ? "w-12" : ""
                    } ${header.id === "status" ? "text-center" : ""}`}
                  >
                    <div className={`flex items-center ${header.id === "status" ? "justify-center" : ""}`}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-indigo-50 ${row.getIsSelected() ? "bg-indigo-50" : ""}`}
                  onClick={() => row.toggleSelected(!row.getIsSelected())}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`whitespace-nowrap py-4 px-3 text-sm ${
                        cell.column.id === "name" ? "font-medium text-gray-900" : "text-gray-800"
                      } ${cell.column.id === "selection" || cell.column.id === "status" ? "text-center" : ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center text-sm text-gray-800">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 sm:px-6 mt-1 rounded-md">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
            disabled={!table.getCanPreviousPage()}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPageIndex(Math.min(table.getPageCount() - 1, pageIndex + 1))}
            disabled={!table.getCanNextPage()}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getPrePaginationRowModel().rows.length)}
              </span>{' '}
              of <span className="font-medium">{table.getPrePaginationRowModel().rows.length}</span> results
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative inline-block">
              <select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
                className="block w-full appearance-none rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                {[3,5,10,20,50].map(size => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 font-semibold"
              >
                <span className="sr-only">First</span>
                First
              </button>
              <button
                onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 font-semibold"
              >
                <span className="sr-only">Previous</span>
                &lt;
              </button>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                Page {pageIndex + 1} of {table.getPageCount()}
              </span>
              <button
                onClick={() => setPageIndex(Math.min(table.getPageCount() - 1, pageIndex + 1))}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 font-semibold"
              >
                <span className="sr-only">Next</span>
                &gt;
              </button>
              <button
                onClick={() => setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 font-semibold"
              >
                <span className="sr-only">Last</span>
                Last
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
