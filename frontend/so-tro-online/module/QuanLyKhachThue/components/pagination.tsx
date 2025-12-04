import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    onPageChange: (page: number) => void;
    totalElements: number;
    size: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    hasNext,
    hasPrevious,
    onPageChange,
    totalElements,
    size
}: PaginationProps) {
    const { language } = useLanguageStore();

    const startIndex = currentPage * size + 1;
    const endIndex = Math.min((currentPage + 1) * size, totalElements);

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                {language === 'vi' 
                    ? `Hiển thị ${startIndex}-${endIndex} trong tổng số ${totalElements} mục`
                    : `Showing ${startIndex}-${endIndex} of ${totalElements} entries`
                }
            </div>
            
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevious}
                >
                    <ChevronLeft className="h-4 w-4" />
                    {language === 'vi' ? 'Trước' : 'Previous'}
                </Button>
                
                <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        
                        if (totalPages <= 5) {
                            pageNumber = i;
                        } else if (currentPage < 3) {
                            pageNumber = i;
                        } else if (currentPage > totalPages - 3) {
                            pageNumber = totalPages - 5 + i;
                        } else {
                            pageNumber = currentPage - 2 + i;
                        }

                        return (
                            <Button
                                key={pageNumber}
                                variant={currentPage === pageNumber ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(pageNumber)}
                                className="w-8 h-8 p-0"
                            >
                                {pageNumber + 1}
                            </Button>
                        );
                    })}
                </div>
                
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