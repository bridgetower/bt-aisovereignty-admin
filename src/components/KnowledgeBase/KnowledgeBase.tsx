import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { useDocKnowledgeBase } from '@/context/DocKnowledgeBaseProvider';

import { ConfirmationDialog } from '../common/confirmationDialog';
import DataTable from '../common/dataTable';
import Pagination from '../common/pagination';
import ModalWithDragDrop from './uploadFiles';

export const KnowledgeBase: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const { docs, limit, setPage, totalPages } = useDocKnowledgeBase();
  const [knowledgeBaseList, setKnowledgeBaseList] = useState<any[]>([]); // Add this
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deleteDescription, setDeleteDescription] = useState('');
  const [selectedToDelete, setSelectedTodelete] = useState<string | null>(null);
  const { deleteDoc, setLoading, loading } = useDocKnowledgeBase();
  useEffect(() => {
    if (docs.length) {
      const newData = docs
        .filter((e) => e.reftype === 'DOCUMENT')
        .map((item: any) => {
          return {
            Id: item.id,
            'File Name': item.name,
            ['Size']: item.size,
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

  const onSelectionChange = (items: string, action?: string) => {
    if (action === 'clear') {
      setSelectedRows([]);
    } else {
      const item =
        items &&
        knowledgeBaseList.filter((item: any) => item[columns[0].key] === items);

      setSelectedRows((prevSelectedRows: any) =>
        prevSelectedRows.includes(item[0])
          ? prevSelectedRows.filter((e: any) => e[columns[0].key] !== items)
          : [item[0], ...prevSelectedRows],
      );
    }
  };
  const handleDelete = (item: any) => {
    // const itemToDelete: string =
    //   selectedRows && selectedRows.length
    //     ? selectedRows.map((row) => row['File Name']).join(',')
    //     : item['File Name'];
    setSelectedTodelete(item.Id);
    setDeleteDescription(
      `Are you sure you want to delete ${
        item ? item['File Name'] : ' all selected items'
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
  const proceedToDelete = () => {
    if (selectedToDelete) {
      setLoading(true);
      deleteDoc(selectedToDelete)
        .then(() => {
          // refetchDocs();
        })
        .finally(() => {
          setShowConfirmationDialog(false);
          setLoading(false);
        });
    }
  };
  return (
    <>
      <Toaster />
      <ConfirmationDialog
        open={showConfirmationDialog}
        onCancel={onConfirmationDialogClose}
        description={deleteDescription}
        onConfirm={proceedToDelete}
        loading={loading}
      />
      <div className=" dark:bg-[#222222] min-h-full p-4 rounded-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Documents</h1>
          <div className="flex">
            <div className="relative max-w-[150px] overflow-hidden">
              {/* <input type="file" className="border p-2 rounded max-w-[100px] opacity-0 cursor-pointer absolute right-0 top-0" /> */}
              {/* <button className=" bg-orange-400 text-white px-4 py-2 rounded-md">
            Upload
          </button> */}
              <ModalWithDragDrop />
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
          onSelect={onSelectionChange}
          onEdit={() => null}
          rowSelection={false}
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
