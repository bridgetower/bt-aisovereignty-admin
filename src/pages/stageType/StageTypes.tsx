import { useLazyQuery } from '@apollo/client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreVertical, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { GET_PROJECT_STAGE_AND_STEP_TYPES } from '@/apollo/schemas/masterTableSchemas';
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
import { useLoader } from '@/context/LoaderProvider';
import { IStageType } from '@/types/StageType';

import { AddEditSatgeType } from './AddEditStageType';
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
    accessorKey: 'createdat',
    header: 'Added on',
  },
];
export const StageTypeList: React.FC = () => {
  const pageLimit = 10;
  const [page, setPage] = useState(1);
  const [stageTypes, setstageTypes] = useState<IStageType[]>([]);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [getList, { refetch, loading }] = useLazyQuery(
    GET_PROJECT_STAGE_AND_STEP_TYPES,
  );
  const memoizedstageTypes = React.useMemo(() => stageTypes, [stageTypes]);
  const idToken = localStorage.getItem('idToken');
  useEffect(() => {
    if (!idToken) {
      return;
    }
    showLoader();
    getList({
      variables: {
        limit: pageLimit,
        pageNo: page,
        type: 'STAGETYPE',
      },
      context: {
        headers: {
          identity: idToken,
        },
      },
    })
      .then((res) => {
        setstageTypes(res.data?.ListStageTypeAndStepType?.data?.refs || []);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        hideLoader();
      });
  }, [idToken, page]);

  const onPageChange = (page: number) => {
    setPage(page);
  };
  const onClose = () => {
    setIsAddEditOpen(false);
    refetch();
  };
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
      <AddEditSatgeType isOpen={isAddEditOpen} onClose={onClose} />
      <div className="bg-card rounded-2xl p-4">
        <div className="flex justify-between pb-4">
          <div className="uppercase text-md text-[#486581]">Stage Types</div>
          <Button variant={'secondary'} onClick={() => setIsAddEditOpen(true)}>
            <Plus size={20} /> Add new
          </Button>
        </div>
        {loading ? (
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
              data={memoizedstageTypes}
              rowSeletable={true}
              actionMenu={true}
              onActionMenuClick={() => {}}
              noDataText="No stage types found"
            />
            <div className="flex justify-end">
              <Pagination
                totalItems={memoizedstageTypes.length}
                itemsPerPage={pageLimit}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
