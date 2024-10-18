import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';

import { useDocKnowledgeBase } from '@/context/DocKnowledgeBaseProvider';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

interface FileData {
  fileName: string;
  fileContent: string;
  contentType: string;
}
const ModalWithDragDrop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [base64Files, setBase64Files] = useState<FileData[]>([]);
  const [uploading, setUploading] = useState(false);
  const { createDoc } = useDocKnowledgeBase();
  // Toggle modal visibility
  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setBase64Files([]);
    }
  };

  // Dropzone file handler
  const onDrop = (acceptedFiles: File[]) => {
    convertFilesToBase64(acceptedFiles);
  };

  const convertFilesToBase64 = (files: File[]) => {
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          resolve({
            fileName: file.name,
            fileContent: replaceBase64(reader.result as string),
            contentType: file.type,
          });
        reader.onerror = reject;
      });
    });

    Promise.all(promises).then((base64Files) => {
      setBase64Files(base64Files as FileData[]);
    });
  };

  const replaceBase64 = (base64: string) => {
    const newstr = base64.replace(/^data:[^;]+;base64,/, '');
    return newstr;
  };

  const onUpload = () => {
    if (!uploading) {
      if (base64Files.length > 0) {
        setUploading(true);
        createDoc({
          refType: 'DOCUMENT',
          websiteName: '',
          websiteUrl: '',
          file: {
            fileContent: base64Files[0].fileContent,
            fileName: base64Files[0].fileName,
            contentType: base64Files[0].contentType,
          },
        })
          .then(() => {
            toast.success('File uploaded successfully');
            toggleModal();
          })
          .catch((error) => {
            toast.error('Failed to upload file');
          })
          .finally(() => {
            setUploading(false);
          });
      } else {
        toast.error('Please select files to upload');
      }
    }
  };
  // Dropzone settings
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <Toaster />
      <Button variant={'default'} className="" onClick={toggleModal}>
        Upload File
      </Button>

      {/* Modal */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={toggleModal}>
          <DialogContent className="dark:bg-[#222222]">
            <DialogHeader className="text-primary">Upload File</DialogHeader>

            {/* Drag and Drop Area */}
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-black p-10 mt-5 text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-white/80 hover:text-white/90 ">
                Drag & Drop files here, or click to select files
              </p>
            </div>

            {/* Uploaded Files (Base64) */}
            {base64Files.length > 0 && (
              <div className="mt-5">
                <h3 className="font-semibold text-sm text-start text-primary">
                  Selected Files
                </h3>
                <ul className="list-disc list-inside text-start text-primary">
                  {base64Files.map((file, index) => (
                    <li key={index} className="break-words text-xs font-thin">
                      <strong>{file.fileName}:</strong>
                      {/* {file.base64} */}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Close button */}
            <div className="flex justify-center mt-10">
              <Button
                size={'sm'}
                variant={'default'}
                className={` flex justify-between items-center ${
                  uploading && 'cursor-not-allowed opacity-70'
                }`}
                onClick={onUpload}
              >
                Upload
                {uploading && (
                  <Loader2Icon
                    size={18}
                    className="text-black/90 animate-spin"
                  />
                )}
              </Button>
              <Button
                variant={'secondary'}
                onClick={toggleModal}
                className=" ml-3"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ModalWithDragDrop;
