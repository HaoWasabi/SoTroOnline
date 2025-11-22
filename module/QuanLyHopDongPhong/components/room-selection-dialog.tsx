"use client"

import React, { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Home, MapPin, DollarSign } from 'lucide-react'
import { useLanguageStore } from "@/zustand/language-tranlator"
import { RoomResponse } from "@/module/QuanLyPhong/api/api-quan-ly-phong"

// Use RoomResponse directly for better type consistency
export type AvailableRoom = RoomResponse

interface RoomSelectionDialogProps {
  availableRooms: AvailableRoom[]
  selectedRoom: AvailableRoom | null
  onRoomSelect: (room: AvailableRoom) => void
  loading?: boolean
  disabled?: boolean
  trigger?: React.ReactNode
}

export function RoomSelectionDialog({
  availableRooms,
  selectedRoom,
  onRoomSelect,
  loading = false,
  disabled = false,
  trigger
}: RoomSelectionDialogProps) {
  const { language } = useLanguageStore()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter rooms based on search term and available status
  const filteredRooms = useMemo(() => {
    if (!availableRooms) return []
    
    return availableRooms.filter((room) => {
      // Only show rooms with 'phongTrong' status (available for rent)
      const isAvailable = room.trangThai?.toLowerCase() === "phongtrong" || 
                         room.trangThai?.toLowerCase() === "phong_trong" ||
                         room.trangThai === "phongTrong"
      
      const matchesSearch = searchTerm === "" || [
        room.tenPhong,
        room.loaiPhong,
        room.diaChi,
        room.vatDung,
        room.maPhong?.toString(),
        room.hoTenQuanLy
      ].some(field => 
        field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )

      return isAvailable && matchesSearch
    })
  }, [availableRooms, searchTerm])

  const handleRoomSelect = (room: AvailableRoom) => {
    onRoomSelect(room)
    setOpen(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const calculateArea = (length: number, width: number) => {
    return (length * width).toFixed(1)
  }

  const defaultTrigger = (
    <Button variant="outline" disabled={disabled}>
      <Home className="h-4 w-4 mr-2" />
      {selectedRoom ? 
        `${selectedRoom.tenPhong} (ID: ${selectedRoom.maPhong})` : 
        (language === "vi" ? "Chọn phòng" : "Select Room")
      }
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {language === "vi" ? "Chọn phòng trống" : "Select Available Room"}
          </DialogTitle>
          <DialogDescription>
            {language === "vi" ? 
              "Chọn một phòng trống để tạo hợp đồng thuê." : 
              "Choose an available room to create a rental contract."
            }
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="room-search">
            {language === "vi" ? "Tìm kiếm phòng" : "Search Rooms"}
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="room-search"
              placeholder={language === "vi" ? "Tìm theo tên, loại, địa chỉ..." : "Search by name, type, address..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Room List */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-600">
                {language === "vi" ? "Đang tải phòng..." : "Loading rooms..."}
              </p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>
                {searchTerm ? 
                  (language === "vi" ? "Không tìm thấy phòng phù hợp" : "No matching rooms found") :
                  (language === "vi" ? "Không có phòng trống" : "No available rooms")
                }
              </p>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <Card 
                key={room.maPhong} 
                className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                  selectedRoom?.maPhong === room.maPhong ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleRoomSelect(room)}
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Room Basic Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{room.tenPhong}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {language === "vi" ? "Phòng trống" : "Available"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">ID:</span>
                        <span className="ml-1">{room.maPhong}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{room.diaChi}</span>
                      </div>

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">
                          {language === "vi" ? "Loại:" : "Type:"}
                        </span>
                        <span className="ml-1">{room.loaiPhong}</span>
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">
                          {language === "vi" ? "Diện tích:" : "Area:"}
                        </span>
                        <span className="ml-1">
                          {calculateArea(room.chieuDai, room.chieuRong)} m² 
                          ({room.chieuDai}m × {room.chieuRong}m)
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="font-medium text-green-600">
                          {formatPrice(room.giaThueCoBan)} VND
                        </span>
                      </div>

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">
                          {language === "vi" ? "Vật dụng:" : "Amenities:"}
                        </span>
                        <span className="ml-1">{room.vatDung || "-"}</span>
                      </div>

                      {room.hoTenQuanLy && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">
                            {language === "vi" ? "Quản lý:" : "Manager:"}
                          </span>
                          <span className="ml-1">{room.hoTenQuanLy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}