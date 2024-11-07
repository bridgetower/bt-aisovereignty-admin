import React from 'react';

import { Button } from '../ui/button';

interface MiniPaginationProps {
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

export const MiniPagination: React.FC<MiniPaginationProps> = (props) => {
  const { onPageChange, currentPage, totalPages } = props;
  const goToPreviousPage = () => {
    const newPageIndex = currentPage - 1; // Decrease by 1 (since currentPage is 1-based)
    if (newPageIndex > 0) {
      onPageChange(newPageIndex);
    }
  };

  // Custom next page function
  const goToNextPage = () => {
    const newPageIndex = currentPage + 1; // Increase by 1 (since currentPage is 1-based)
    if (currentPage < totalPages) {
      onPageChange(newPageIndex);
    }
  };
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant={'secondary'}
        size={'sm'}
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <Button
        variant={'secondary'}
        size={'sm'}
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};
