import { EditIcon, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '../ui/button';

type Props = {
  data: any[];
  columns: any[];
  onDelete: (item: any) => void;
  onEdit: (item: any) => void;
  actions: {
    edit: boolean;
    delete: boolean;
  };
  onSelect: (id: string, action?: string) => void;
};

interface SortConfig {
  key: string;
  direction: string;
}
const DataTable: React.FC<Props> = ({
  data,
  columns,
  onDelete,
  onEdit,
  actions,
  onSelect,
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filterText, setFilterText] = useState('');

  // Sorting Logic
  const sortData = (key: string) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    if (sortConfig) {
      const sortedData = [...filteredData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setFilteredData(sortedData);
    }
  }, [sortConfig]);

  // Filter Logic
  useEffect(() => {
    const lowercasedFilter = filterText.toLowerCase();
    const filtered = data.filter((item) =>
      columns.some((column) =>
        item[column.key]?.toString().toLowerCase().includes(lowercasedFilter),
      ),
    );
    setFilteredData(filtered);
  }, [filterText, data, columns]);

  // Handle Selection
  const handleSelectRow = (id: string) => {
    setSelectedRows((prevSelectedRows: any) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId: string) => rowId !== id)
        : [...prevSelectedRows, id],
    );
    onSelect(id);
  };

  return (
    <div className="container mx-auto p-4 rounded-xl">
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Filter by any field..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border p-2 rounded w-full lg:w-1/3 dark:bg-[#333] "
        />
      </div>
      <table className="table-auto w-full border-collapse border rounded-xl  border-black h-7 ">
        <thead>
          <tr>
            <th className="p-2 dark:bg-[#333] text-start ">
              <input
                type="checkbox"
                className="h-4 w-4 flex items-center justify-start"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRows(
                      filteredData.map((item) => item[columns[0].key]),
                    );
                    for (const data of filteredData) {
                      onSelect(data[columns[0].key]);
                    }
                  } else {
                    setSelectedRows([]);
                    onSelect('', 'clear');
                  }
                }}
                checked={selectedRows.length === filteredData.length}
              />
            </th>
            {columns.map((column) => (
              <>
                {column.key !== 'Sr' && (
                  <th
                    key={column.key}
                    className=" p-2 cursor-pointer dark:bg-[#333]  text-start text-xs"
                    onClick={() => sortData(column.key)}
                  >
                    {column.label}{' '}
                    {sortConfig?.key === column.key &&
                      (sortConfig?.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                )}
              </>
            ))}
            {actions && (
              <th className="p-2 dark:bg-[#333]  text-start text-sm">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {filteredData.map((item) => (
            <tr
              key={item[columns[0].key]}
              className={`${
                selectedRows.includes(item[columns[0].key]) ? 'bg-black' : ''
              }`}
            >
              <td className="border-t border-black p-2">
                <input id="checkbox1" className="hidden peer" type="checkbox" />
                <div
                  onClick={() => handleSelectRow(item[columns[0].key])}
                  className="w-4 h-4 bg-black/80 rounded-sm flex items-center justify-center peer-checked:border-transparent peer-checked:text-white  "
                >
                  <svg
                    className={`${
                      selectedRows.includes(item[columns[0].key])
                        ? ''
                        : 'hidden'
                    } peer-checked:block w-3 h-3 font-semibold`}
                    fill="none"
                    stroke="#223f86"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </td>
              {columns.map((column) => (
                <>
                  {column.key !== 'Sr' && (
                    <td
                      onClick={() => handleSelectRow(item[columns[0].key])}
                      key={column.key}
                      title={item[column.key]}
                      className={`border-t text-xs border-black p-2 max-w-[450px] truncate cursor-pointer`}
                    >
                      {item[column.key]}
                    </td>
                  )}
                </>
              ))}
              {/* Actions Column */}
              {actions && (
                <td className="border-t border-black p-2">
                  {actions.edit && (
                    <Button
                      variant={'default'}
                      onClick={() => onEdit(item)}
                      className="  px-2 py-1 mr-2"
                    >
                      <EditIcon size={24} />
                    </Button>
                  )}
                  {actions.delete && (
                    <Button
                      variant={'destructive'}
                      onClick={() => {
                        if (selectedRows.length === 0) onDelete(item);
                      }}
                      className={`px-2 py-1 ${
                        selectedRows.length > 0
                          ? 'cursor-not-allowed opacity-50'
                          : ''
                      }`}
                    >
                      <Trash2 size={20} />
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="mt-4">
        <p>Selected Rows: {JSON.stringify(selectedRows)}</p>
      </div> */}
    </div>
  );
};

export default DataTable;
