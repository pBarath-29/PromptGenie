import React from 'react';
import Button from './Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  return (
    <div className="flex justify-center items-center space-x-4 pt-4">
      <Button
        variant="secondary"
        onClick={handlePrev}
        disabled={currentPage === 1}
        icon={<ArrowLeft size={16} />}
      >
        Previous
      </Button>
      <span className="font-medium text-gray-700 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="secondary"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="!flex-row-reverse" // To put icon on the right
        icon={<ArrowRight size={16} />}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
