import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { useDocKnowledgeBase } from '@/context/DocKnowledgeBaseProvider';

import { ConfirmationDialog } from '../common/confirmationDialog';
import DataTable from '../common/dataTable';
import Pagination from '../common/pagination';
import { Button } from '../ui/button';
import AddWebsiteDialog from './addWebsiteDialog';

export const KnowledgeBaseWebsites: React.FC = () => {
  const { docs, limit, setPage, totalPages, refetchDocs } =
    useDocKnowledgeBase();
  const [knowledgeBaseList, setKnowledgeBaseList] = useState<any[]>([]); // Add this
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deleteDescription, setDeleteDescription] = useState('');

  useEffect(() => {
    if (docs.length) {
      const newData = docs
        .filter((e) => e.reftype === 'WEBSITE')
        .map((item: any, i) => {
          return {
            Sr: item.id,
            URL: item.url,
            ['Depth']: item.depth,
            Ingested: item.ingested ? 'Yes' : 'No',
            'Added At': new Date(item['createdat']).toLocaleString(),
          };
        });
      setKnowledgeBaseList(newData); // Add this line
    } else {
      setKnowledgeBaseList([]);
    }
  }, [docs]);

  const columns = knowledgeBaseList.length
    ? Object.keys(knowledgeBaseList[0]).map((key) => ({ key, label: key }))
    : [];
  const handleDelete = (item: any) => {
    setDeleteDescription(
      `Are you sure you want to delete ${
        item ? item['URL'] : ' all selected items'
      }?`,
    );
    setShowConfirmationDialog(true);
  };
  const handlePageChange = (page: number) => {
    setPage(page);
  };
  const onConfirmationDialogClose = () => {
    setShowConfirmationDialog(false);
    setDeleteDescription('');
  };
  const proceedToDelete = () => {};
  return (
    <>
      <Toaster />
      <ConfirmationDialog
        open={showConfirmationDialog}
        onCancel={onConfirmationDialogClose}
        description={deleteDescription}
        onConfirm={proceedToDelete}
      />
      <div className=" dark:bg-[#222222] min-h-full p-4 rounded-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Websites</h1>
          <div className="flex">
            <div className="flex justify-end">
              {/* <input type="file" className="border p-2 rounded max-w-[100px] opacity-0 cursor-pointer absolute right-0 top-0" /> */}
              <Button
                variant={'ghost'}
                className="mr-2"
                title="Refresh"
                onClick={() => refetchDocs()}
              >
                <RefreshCcw />
              </Button>
              <AddWebsiteDialog />
            </div>
            {/* <Button
              variant={'destructive'}
              onClick={() => handleDelete('')}
              className={` ml-4 disabled:opacity-70 disabled:cursor-not-allowed`}
              disabled={!selectedRows || !selectedRows?.length}
            >
              Delete All
            </Button> */}
          </div>
        </div>
        <hr className="border-t border-neutral-200 my-4" />
        <DataTable
          data={knowledgeBaseList}
          columns={columns}
          actions={{ edit: false, delete: true }}
          onDelete={handleDelete}
          onEdit={() => null}
          rowSelection={true}
        />
        {/* <hr className="border-t border-neutral-200 my-2" /> */}
        <div className="">
          <div className="flex justify-end px-4">
            <Pagination
              totalItems={totalPages}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};
