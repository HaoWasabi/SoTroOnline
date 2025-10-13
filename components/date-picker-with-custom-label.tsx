"use client"

import { useLanguageStore } from "@/zustand/language-tranlator"
import { Calendar } from "./ui/calendar"
import { Label } from "./ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { ChevronDownIcon } from "lucide-react"
import React from "react"

export default function DatePickerWithCustomLabel({htmlFor, english_label, vietnamese_label}: {htmlFor: string, english_label: string, vietnamese_label: string}) {
    const {language} = useLanguageStore()
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor={htmlFor} className="px-1">
                {language === 'vi' ? vietnamese_label : english_label}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date"
                    className="w-full justify-between font-normal"
                >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                    setDate(date)
                    setOpen(false)
                    }}
                />
                </PopoverContent>
            </Popover>
        </div>
    )
}
