import { useMutation, useQuery } from '@apollo/client';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, MoreVertical, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import {
  FETCH_REFERENCES_BY_PROJECT_ID,
  UPDATE_PROJECT_STATUS_BY_ADMIN,
} from '@/apollo/schemas/projectSchemas';
import { DataTable } from '@/components/common/dataTable';
import Pagination from '@/components/common/pagination';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLoader } from '@/context/LoaderProvider';
import { ActionStatus, statusColor } from '@/types/ProjectData';
const requests = [
  {
    projectName: 'BridgeTower',
    userName: 'John Doe',
    fileName: 'report_2024.pdf',
    fileSize: '2.5 MB',
    addedOn: '2024-11-25',
    status: 'Pending',
  },
  {
    projectName: 'Meadowland UI',
    userName: 'Jane Smith',
    fileName: 'design_mockup.png',
    fileSize: '1.2 MB',
    addedOn: '2024-11-24',
    status: 'Rejected',
  },
  {
    projectName: 'GeneAI Admin',
    userName: 'Michael Brown',
    fileName: 'data_analysis.csv',
    fileSize: '3.8 MB',
    addedOn: '2024-11-23',
    status: 'Approved',
  },
  {
    projectName: 'Document Ingestion',
    userName: 'Emily Clark',
    fileName: 'requirements.docx',
    fileSize: '800 KB',
    addedOn: '2024-11-22',
    status: 'Pending',
  },
  {
    projectName: 'AI Sovereignty',
    userName: 'Daniel Wilson',
    fileName: 'architecture_diagram.pdf',
    fileSize: '5 MB',
    addedOn: '2024-11-21',
    status: 'Approved',
  },
  {
    projectName: 'BT Generative AI Proto',
    userName: 'Sophia Adams',
    fileName: 'training_data.json',
    fileSize: '7.5 MB',
    addedOn: '2024-11-20',
    status: 'Rejected',
  },
];

const tableColumnDef: ColumnDef<any>[] = [
  {
    accessorKey: 'projectName',
    header: 'Project Name',
  },
  {
    accessorKey: 'userName',
    header: 'User Name',
  },
  {
    accessorKey: 'name',
    header: 'File Name',
  },
  {
    accessorKey: 'size',
    header: 'File Size',
  },
  {
    accessorKey: 'createdat',
    header: 'Added On',
  },
  // {
  //   accessorKey: 'status',
  //   header: 'Request Status',
  // },
];
export const UserSFileRequestList: React.FC = () => {
  const pageLimit = 10;
  const [page, setPage] = useState(1);
  const [fileRequest, setFileRequest] = useState<any[]>([]);
  // const [loading, setLoading] = useState(false);
  // const { showLoader, hideLoader } = useLoader();
  const [status, setStatus] = useState('UPLOADED');
  const idToken = localStorage.getItem('idToken');
  const [updateReferenceStatusByAdminMutation, { loading: updating }] =
    useMutation(UPDATE_PROJECT_STATUS_BY_ADMIN);
  const { showLoader, hideLoader } = useLoader();
  const { data, refetch, loading } = useQuery(FETCH_REFERENCES_BY_PROJECT_ID, {
    variables: {
      limit: pageLimit,
      pageNo: page,
      refType: 'DOCUMENT',
      status: status,
    },
    context: {
      headers: {
        identity: idToken,
      },
    },
    fetchPolicy: 'network-only',
  });
  const memoizedFileRequest = React.useMemo(() => fileRequest, [fileRequest]);
  useEffect(() => {
    if (updating) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [updating]);
  useEffect(() => {
    if (!data) {
      return;
    }
    const { refs } = data.ListReference.data;
    const updatedRef = (refs || []).map((ref: any) => {
      return {
        ...ref,
        createdat: new Date(ref.createdat).toLocaleDateString(),
      };
    });
    setFileRequest(updatedRef);
  }, [data]);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const onActionMenuClick = (dataSet: any, action: string) => {
    // if (action === 'approved') {
    // console.log('Approve', dataSet);
    updateReferenceStatusByAdminMutation({
      variables: {
        fileId: dataSet?.id,
        status: action,
      },
    }).then((res) => {
      if (res.data?.UpdateReferenceStatusByAdmin?.status === '200') {
        toast.success(`File request ${action} successfully`);
        setStatus(action === 'rejected' ? 'REJECTED' : 'COMPLETED');
      }
    });
    // } else if (action === 'rejected') {
    //   console.log('Reject', dataSet);
    //   toast.success(`File request ${action} successfully`);
    //   setStatus('REJECTED');
    // }
  };
  const actionMenuColDef = {
    id: 'actions',
    header: 'Action',
    cell: ({ row }: any) => {
      const dataSet = row.original;

      return (
        <>
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
                disabled={dataSet.status !== 'UPLOADED'}
                className="flex gap-1"
                onClick={() => onActionMenuClick(dataSet, 'approved')}
              >
                <CheckCircle className="text-green-600" size={16} /> Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={dataSet.status !== 'UPLOADED'}
                className="flex gap-1"
                onClick={() => onActionMenuClick(dataSet, 'rejected')}
              >
                <XCircle className="text-destructive" size={16} /> Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  };
  const statusColDef = {
    id: 'status',
    header: 'Request Status',
    cell: ({ row }: any) => {
      const dataSet = row.original;
      console.log(dataSet);

      return (
        <>
          <Badge
            className={`text-sm ${statusColor[dataSet.status.toUpperCase() as ActionStatus].text + ' ' + statusColor[dataSet.status.toUpperCase() as ActionStatus].bg} hover:${statusColor[dataSet.status.toUpperCase() as ActionStatus].bg}`}
          >
            {dataSet.status.toUpperCase()}
          </Badge>
        </>
      );
    },
  };
  return (
    <>
      <Toaster />
      <div className="bg-card rounded-2xl p-4">
        <div className="flex justify-between pb-4">
          <div className="uppercase text-md text-[#486581]">
            File Add Requests
          </div>
        </div>

        <div>
          <Tabs defaultValue="UPLOADED" value={status} className="w-full">
            <TabsList>
              <TabsTrigger
                value="UPLOADED"
                className=""
                onClick={() => setStatus('UPLOADED')}
              >
                Uploaded
              </TabsTrigger>
              <TabsTrigger
                value="COMPLETED"
                onClick={() => setStatus('COMPLETED')}
              >
                Approved
              </TabsTrigger>
              <TabsTrigger
                value="REJECTED"
                onClick={() => setStatus('REJECTED')}
              >
                Rejected
              </TabsTrigger>
            </TabsList>
            <TabsContent value="UPLOADED">
              {loading ? (
                <SkeletonLoader />
              ) : (
                <DataTable
                  columns={[...tableColumnDef, statusColDef, actionMenuColDef]}
                  data={memoizedFileRequest}
                  rowSeletable={false}
                  actionMenu={true}
                  onActionMenuClick={() => {}}
                  noDataText="No data to show!"
                />
              )}
            </TabsContent>
            <TabsContent value="COMPLETED">
              {loading ? (
                <SkeletonLoader />
              ) : (
                <DataTable
                  columns={[...tableColumnDef, statusColDef]}
                  data={memoizedFileRequest}
                  rowSeletable={false}
                  actionMenu={true}
                  onActionMenuClick={() => {}}
                  noDataText="No data to show!"
                />
              )}
            </TabsContent>
            <TabsContent value="REJECTED">
              {loading ? (
                <SkeletonLoader />
              ) : (
                <DataTable
                  columns={[...tableColumnDef, statusColDef]}
                  data={memoizedFileRequest}
                  rowSeletable={false}
                  actionMenu={true}
                  onActionMenuClick={() => {}}
                  noDataText="No data to show!"
                />
              )}
            </TabsContent>
            <div className="flex justify-end">
              <Pagination
                totalItems={memoizedFileRequest.length}
                itemsPerPage={pageLimit}
                onPageChange={onPageChange}
              />
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
};

const SkeletonLoader: React.FC = () => {
  return (
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
  );
};
