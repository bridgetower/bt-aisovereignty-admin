import { ColumnDef } from '@tanstack/react-table';
import { MoreVertical, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { DataTable } from '@/components/common/dataTable';
import Pagination from '@/components/common/pagination';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { IStageType } from '@/types/StageTypes';
import { stages } from '@/utils/data/dummyData';

import { AddEditStatusType } from './AddEditStatusType';
const tableColumnDef: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: 'File name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'addedon',
    header: 'Added on',
  },
];
export const StatusTypeList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statusTypes, setStatusTypes] = useState<IStageType[]>(stages);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const memoizedStatusTypes = React.useMemo(() => statusTypes, [statusTypes]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  const onActionMenuClick = (dataSet: any, action: string) => {};
  const actionMenuColDef = {
    id: 'actions',
    cell: ({ row }: any) => {
      const dataSet = row.original;

      return (
        <>
          {dataSet.name ? (
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
                  className="flex gap-1"
                  onClick={() => onActionMenuClick(dataSet, 'remove')}
                >
                  <Trash2 className="text-destructive" size={20} /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <></>
          )}
        </>
      );
    },
  };
  return (
    <>
      <AddEditStatusType
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
      />
      <div className="bg-card rounded-2xl p-4">
        <div className="flex justify-between pb-4">
          <div className="uppercase text-md text-[#486581]">Status Types</div>
          <Button variant={'secondary'} onClick={() => setIsAddEditOpen(true)}>
            <Plus size={20} /> Add new
          </Button>
        </div>
        {isLoading ? (
          <>
            <div>
              <Skeleton className="h-12" />
              {[...Array(7)].map((_, idx) => (
                <div className="" key={idx}>
                  <div className="flex justify-between mt-2 gap-3">
                    <Skeleton className="h-16 w-1/4" />
                    <Skeleton className="h-16 w-2/3" />
                    <Skeleton className="h-16 w-1/12" />
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-1 mt-4">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-12" />
                <Skeleton className="h-10 w-12" />
                <Skeleton className="h-10 w-12" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </>
        ) : (
          <div>
            <DataTable
              columns={[...tableColumnDef, actionMenuColDef]}
              data={memoizedStatusTypes}
              rowSeletable={true}
              actionMenu={true}
              onActionMenuClick={() => {}}
              noDataText=" Drag & Drop files here"
            />
            <div className="flex justify-end">
              <Pagination
                totalItems={12}
                itemsPerPage={10}
                onPageChange={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
