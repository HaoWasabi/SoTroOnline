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

    const handleFilterClick = (value: string) => {
        if (onFilterChange) {
            // If the same filter is clicked, clear it; otherwise set the new filter
            onFilterChange(selectedFilter === value ? "" : value);
        }
    };

    const getSelectedLabel = () => {
        if (!selectedFilter) return null;
        const selectedItem = menu.find(item => item.value === selectedFilter);
        return selectedItem ? (language === 'vi' ? selectedItem.vietnamItem : selectedItem.englishItem) : null;
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
                    onClick={() => handleFilterClick("")}
                >
                    {language === 'vi' ? 'Tất cả' : 'All'}
                </DropdownMenuItem>
                {menu.map(item => (
                    <DropdownMenuItem 
                        key={item.value || item.englishItem} 
                        className={`font-semibold cursor-pointer ${selectedFilter === item.value ? 'bg-blue-50' : ''}`}
                        onClick={() => handleFilterClick(item.value || "")}
                    >
                        {language === 'vi' ? item.vietnamItem : item.englishItem}   
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}