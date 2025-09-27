"use client"

import { Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useLanguageStore } from "@/zustand/language-tranlator";


export default function FilterComponent({menu}: {menu: {vietnamItem: string, englishItem: string}[]}) {

    const {language} = useLanguageStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-fit">
                    <Filter className="h-4 w-4 mr-2" />
                    {language === 'vi' ? 'Thêm bộ lọc' : 'More filters'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {menu.map(item => (
                    <DropdownMenuItem key={item.englishItem} className="font-semibold">
                        {language === 'vi' ? item.vietnamItem : item.englishItem}   
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}