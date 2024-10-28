'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { useEffect, useMemo, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface DataTableProps<
  TData extends { icon?: keyof typeof dynamicIconImports; doctype?: string },
  TValue,
> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSeletable?: boolean;
  actionMenu?: boolean;
  onActionMenuClick?: (data: TData, action: string) => void;
}

export function DataTable<
  TData extends { icon?: keyof typeof dynamicIconImports; doctype?: string },
  TValue,
>({
  columns = [],
  data,
  rowSeletable,
  actionMenu,
  onActionMenuClick,
}: DataTableProps<TData, TValue>) {
  const [columnsState, setColumnsState] =
    useState<ColumnDef<TData, TValue>[]>(columns);
  const [rowSelection, setRowSelection] = useState({});
  const memoizedData = useMemo(() => data, [data]);
  useEffect(() => {
    if (columns.length > 0) {
      let updatedColumns: any[] = [...columns];
      if (rowSeletable) {
        updatedColumns = [rowSelectorColDef, ...updatedColumns];
      }
      if (actionMenu) {
        updatedColumns = [...updatedColumns, actionMenuColDef];
      }
      setColumnsState(
        updatedColumns.length ? (updatedColumns as any) : columns,
      );
    } else {
      setColumnsState(columns);
    }
  }, [rowSeletable, columns, actionMenu, memoizedData]);

  const actionMenuColDef = {
    id: 'actions',
    onActionMenuClick,
    cell: ({ row }: any) => {
      const dataSet = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                onActionMenuClick && onActionMenuClick(dataSet, 'edit')
              }
            >
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const table = useReactTable({
    data: memoizedData,
    columns: columnsState,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div className="rounded-md border">
      <Table key={JSON.stringify(data)}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    {index === (rowSeletable ? 1 : 0) &&
                      row.original.doctype && (
                        <div className="text-muted-foreground flex items-center gap-1">
                          File{' '}
                          {index === (rowSeletable ? 1 : 0) &&
                            row.original.icon}
                        </div>
                      )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const rowSelectorColDef: ColumnDef<any, any> = {
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};
