"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export default function Combobox({data, button_message, no_data_found_english_message, no_data_found_vietname_message}: {
    data: Array<{label_vietnam_name: string, label_english_name: string, value: string}> | null,
    button_message?: string,
    no_data_found_english_message?: string
    no_data_found_vietname_message?: string
}) {

    const {language} = useLanguageStore()
    const [open, setOpen] = React.useState(false)
    const [fieldValue, setFieldValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                >
                {fieldValue
                    ? data?.find((info) => fieldValue === info.value)?.label_vietnam_name
                    : button_message}
                <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>{language === 'vi' ? no_data_found_vietname_message : no_data_found_english_message}</CommandEmpty>
                        <CommandGroup>
                        {data?.map((info) => (
                            <CommandItem
                            key={info.value}
                            value={info.value}
                            onSelect={(currentValue) => {
                                setFieldValue(currentValue === fieldValue ? "" : currentValue)
                                setOpen(false)
                            }}
                            >
                            {language === 'vi' ? info.label_vietnam_name : info.label_english_name}
                            <Check
                                className={cn(
                                "ml-auto",
                                fieldValue === info.value ? "opacity-100" : "opacity-0"
                                )}
                            />
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover> 
    )
}