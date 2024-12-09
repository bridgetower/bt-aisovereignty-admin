import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

// Define Zod schema
const schema = z.object({
  websiteName: z.string().min(1, 'Website Name is required'),
  websiteUrl: z.string().url('Enter a valid URL'),
  depth: z.string().min(1, 'Depth must be at least 1'),
});

// Type inference for form data based on Zod schema
type FormData = z.infer<typeof schema>;

type AddWebUrlsProps = {
  onAddWebUrls: (webUrls: FormData[]) => void;
  setError: any;
  listData: any[];
};

export const AddWebUrls: React.FC<AddWebUrlsProps> = (props) => {
  const { onAddWebUrls, setError, listData } = props;
  const [rows, setRows] = useState<FormData[]>(listData || []);

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      websiteName: '',
      websiteUrl: '',
      depth: '',
    },
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    if (setError) {
      setError(Object.keys(errors).length ? errors : null);
    }
  }, [errors, setError]);

  const addRow = async () => {
    const isValid = await trigger(); // Validate all fields
    if (isValid) {
      const values = getValues();
      setRows((prevRows) => [...prevRows, values]);
      onAddWebUrls([...rows, values]);
      reset(); // Clear form fields after adding a row
    }
  };

  const handleRemoveRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-xl border">
      {/* Table for Existing Rows */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Website Name</TableHead>
            <TableHead>Website URL</TableHead>
            <TableHead>Depth</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.websiteName}</TableCell>
              <TableCell>{row.websiteUrl}</TableCell>
              <TableCell>{row.depth}</TableCell>
              <TableCell>
                <X
                  size={20}
                  onClick={() => handleRemoveRow(index)}
                  className="text-red-500 cursor-pointer"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Form at the Footer */}
      <form>
        <Table>
          <TableBody>
            <TableRow>
              {/* Website Name */}
              <TableCell className="align-baseline">
                <Controller
                  name="websiteName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter Website Name"
                      className={errors.websiteName && ' border border-red-500'}
                    />
                  )}
                />
                {errors.websiteName && (
                  <p className="text-red-500 text-[10px]">
                    {errors.websiteName.message}
                  </p>
                )}
              </TableCell>

              {/* Website URL */}
              <TableCell className="align-baseline">
                <Controller
                  name="websiteUrl"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter Website URL"
                      className={errors.websiteUrl && ' border border-red-500'}
                    />
                  )}
                />
                {errors.websiteUrl && (
                  <p className="text-red-500 text-[10px]">
                    {errors.websiteUrl.message}
                  </p>
                )}
              </TableCell>

              {/* Depth */}
              <TableCell className="w-24 align-baseline">
                <Controller
                  name="depth"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter Depth"
                      className={errors.depth && ' border border-red-500'}
                    />
                  )}
                />
                {errors.depth && (
                  <p className="text-red-500 text-[10px]">
                    {errors.depth.message}
                  </p>
                )}
              </TableCell>

              {/* Add Button */}
              <TableCell>
                <Button
                  variant={'link'}
                  type="button"
                  onClick={addRow}
                  className="text-sky-600"
                >
                  {/* <Plus size={20} />  */}
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>
    </div>
  );
};
