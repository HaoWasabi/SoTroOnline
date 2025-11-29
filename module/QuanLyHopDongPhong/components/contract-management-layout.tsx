"use client"

import type { Contract } from "../types/contract";
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Search, Calendar } from "lucide-react"
import { useState } from "react";
import TypeOfContractStatus from "./type-of-contract-status"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import FilterComponent from "@/components/filter-component"
import { ContractFormAsDialog } from "./contract-form-adding"
import GridOfContractCard from "./grid-of-contract"


const menu = [
    {
        vietnamItem: "Đang hoạt động",
        englishItem: "Active"
    },
    {
        vietnamItem: "Đã hết hạn",
        englishItem: "Expired"
    },
]

export default function ContractManagementLayout() {
    const {language} = useLanguageStore()
    const [refreshKey, setRefreshKey] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedFilter, setSelectedFilter] = useState("")
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)
    const [isStartDateOpen, setIsStartDateOpen] = useState(false)
    const [isEndDateOpen, setIsEndDateOpen] = useState(false)

    const handleContractUpdate = () => {
        // Force refresh of the grid component
        setRefreshKey(prev => prev + 1)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleFilterChange = (filter: string) => {
        setSelectedFilter(filter)
    }

    const handleStartDateChange = (date: Date | undefined) => {
        setStartDate(date)
        setIsStartDateOpen(false)
    }

    const handleEndDateChange = (date: Date | undefined) => {
        setEndDate(date)
        setIsEndDateOpen(false)
    }

    const clearDateFilters = () => {
        setStartDate(undefined)
        setEndDate(undefined)
    }

    const formatDateForDisplay = (date: Date | undefined) => {
        if (!date) return language === 'vi' ? 'Chọn ngày' : 'Select date'
        return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')
    }

    return (
        <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {language === 'vi' ? 'Quản lý hợp đồng' : 'Contract Management'}
                    </h1>
                    <p className="text-gray-600">
                        {language === 'vi' ? 'Quản lý hợp đồng cho thuê và hợp đồng thuê nhà' : 'Manage rental agreements and lease contracts'}
                    </p>
                </div>
                <ContractFormAsDialog onSuccess={handleContractUpdate} />
            </div>
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4">
                        {/* Search and Status Filter Row */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder={
                                        language === 'vi' 
                                            ? "Tìm kiếm theo mã hợp đồng hoặc mã phòng..."
                                            : "Search by contract ID or room ID..."
                                    }
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <FilterComponent 
                                menu={menu} 
                                onFilterChange={handleFilterChange}
                                selectedFilter={selectedFilter}
                            />
                        </div>
                        
                        {/* Date Range Filter Row */}
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    {language === 'vi' ? 'Tìm theo thời gian hợp đồng:' : 'Search by contract period:'}
                                </label>
                                <div className="flex gap-2 items-center">
                                    {/* Start Date */}
                                    <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full sm:w-48 justify-start text-left font-normal"
                                            >
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {formatDateForDisplay(startDate)}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={startDate}
                                                onSelect={handleStartDateChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    
                                    <span className="text-gray-500">{language === 'vi' ? 'đến' : 'to'}</span>
                                    
                                    {/* End Date */}
                                    <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full sm:w-48 justify-start text-left font-normal"
                                            >
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {formatDateForDisplay(endDate)}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={endDate}
                                                onSelect={handleEndDateChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    
                                    {/* Clear Dates Button */}
                                    {(startDate || endDate) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearDateFilters}
                                            className="px-2"
                                        >
                                            ✕
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Active Filters Display */}
                        {(searchTerm || selectedFilter || startDate || endDate) && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-sm text-gray-600">
                                    {language === 'vi' ? 'Bộ lọc đang áp dụng:' : 'Active filters:'}
                                </span>
                                {searchTerm && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                        {language === 'vi' ? 'Tìm kiếm:' : 'Search:'} "{searchTerm}"
                                    </span>
                                )}
                                {selectedFilter && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                        {language === 'vi' ? 'Trạng thái:' : 'Status:'} {selectedFilter}
                                    </span>
                                )}
                                {startDate && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                        {language === 'vi' ? 'Từ ngày:' : 'From:'} {startDate.toLocaleDateString()}
                                    </span>
                                )}
                                {endDate && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                        {language === 'vi' ? 'Đến ngày:' : 'To:'} {endDate.toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            
            {/* Use the paginated grid component */}
            <GridOfContractCard 
                refreshTrigger={refreshKey} 
                searchTerm={searchTerm}
                selectedFilter={selectedFilter}
                startDate={startDate}
                endDate={endDate}
            />
        </main>
    )
}