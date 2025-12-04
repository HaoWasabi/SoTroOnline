"use client"

import { Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useLanguageStore } from "@/zustand/language-tranlator";

interface FilterComponentProps {
    menu: {
        vietnamItem: string;
        englishItem: string;
        value?: string;
    }[];
    onFilterChange?: (value: string) => void;
    selectedFilter?: string;
}

export default function FilterComponent({ menu, onFilterChange, selectedFilter }: FilterComponentProps) {

    const { language } = useLanguageStore();

    const handleFilterClick = (item: { vietnamItem: string; englishItem: string; value?: string }) => {
        if (onFilterChange) {
            // Pass the value (not the display text) for backend compatibility
            const filterValue = item.value || item.englishItem;
            // If the same filter is clicked, clear it; otherwise set the new filter
            onFilterChange(selectedFilter === filterValue ? "" : filterValue);
        }
    };

    const getSelectedLabel = () => {
        if (!selectedFilter) return null;
        // Find the menu item by value and return the appropriate display text
        const selectedItem = menu.find(item => (item.value || item.englishItem) === selectedFilter);
        if (selectedItem) {
            return language === 'vi' ? selectedItem.vietnamItem : selectedItem.englishItem;
        }
        return selectedFilter;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-fit">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedFilter 
                        ? getSelectedLabel() 
                        : (language === 'vi' ? 'Thêm bộ lọc' : 'More filters')
                    }
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    {language === 'vi' ? 'Lọc theo trạng thái' : 'Filter by status'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className={`font-semibold cursor-pointer ${!selectedFilter ? 'bg-blue-50' : ''}`}
                    onClick={() => onFilterChange?.("")}
                >
                    {language === 'vi' ? 'Tất cả' : 'All'}
                </DropdownMenuItem>
                {menu.map(item => {
                    const displayText = language === 'vi' ? item.vietnamItem : item.englishItem;
                    const itemValue = item.value || item.englishItem;
                    return (
                        <DropdownMenuItem 
                            key={item.value || item.englishItem} 
                            className={`font-semibold cursor-pointer ${selectedFilter === itemValue ? 'bg-blue-50' : ''}`}
                            onClick={() => handleFilterClick(item)}
                        >
                            {displayText}   
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}