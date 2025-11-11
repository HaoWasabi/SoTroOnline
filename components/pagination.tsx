"use client"

import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export default function PaginationComponent({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNext, 
  hasPrevious 
}: PaginationProps) {
  const { language } = useLanguageStore();

  const generatePageNumbers = () => {
    const pages = [];
    const delta = 1; // Number of pages to show on each side of current page
    
    for (let i = Math.max(0, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-gray-700">
        {language === 'vi' ? 
          `Trang ${currentPage + 1} / ${totalPages}` :
          `Page ${currentPage + 1} of ${totalPages}`
        }
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          {language === 'vi' ? 'Trước' : 'Previous'}
        </Button>

        {/* First page */}
        {currentPage > 2 && (
          <>
            <Button
              variant={0 === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(0)}
            >
              1
            </Button>
            {currentPage > 3 && (
              <div className="flex items-center">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            )}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </Button>
        ))}

        {/* Last page */}
        {currentPage < totalPages - 3 && (
          <>
            {currentPage < totalPages - 4 && (
              <div className="flex items-center">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            )}
            <Button
              variant={totalPages - 1 === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(totalPages - 1)}
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
        >
          {language === 'vi' ? 'Sau' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}