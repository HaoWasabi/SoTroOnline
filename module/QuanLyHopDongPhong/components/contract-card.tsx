"use client"

import { Badge } from "@/components/ui/badge"
import type { Contract } from "../types/contract"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { deleteContract, updateContract } from "../api/api-quan-ly-hop-dong"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Calendar, DollarSign, Download, Edit, FileText, MoreHorizontal, Trash2 } from "lucide-react"
import { useCallback, useState } from "react"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"
import { useRouter } from "next/navigation"

interface ContractComponentProps {
    contract: Contract;
    onUpdate?: () => void;
    onDelete?: () => void;
}

export default function ContractCardComponent({ contract, onUpdate, onDelete }: ContractComponentProps) {
    const { language } = useLanguageStore()
    const router = useRouter()
    const { toast, showSuccess, showError, removeToast } = useToast()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showUpdateDialog, setShowUpdateDialog] = useState(false)
    const [formData, setFormData] = useState({
        tienPhong: contract.tienPhong || '',
        tienCoc: contract.tienCoc || '',
        ngayBatDau: contract.ngayBatDau || '',
        ngayKetThuc: contract.ngayKetThuc || '',
        dvRac: contract.dvRac || false,
        dvWifi: contract.dvWifi || false,
        dvCap: contract.dvCap || false,
        dvKhac: contract.dvKhac || false
    })

    const getStatusColor = useCallback((status?: string | null) => {
        switch (status) {
        case "hoatDong":
            return "default"
        case "daXoa":
            return "outline"
        default:
            return "outline"
        }
    }, [])

    const handleDeleteClick = () => {
        if (!contract.maHopDongPhong) {
            showError(language === "vi" ? "Không thể xóa: Thiếu ID hợp đồng" : "Cannot delete: missing contract ID")
            return
        }
        setShowDeleteDialog(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true)
            const id = typeof contract.maHopDongPhong === "number" ? contract.maHopDongPhong : parseInt(String(contract.maHopDongPhong))
            const res = await deleteContract(Number(id))
            if (res.status === "success") {
                showSuccess(language === "vi" ? "Xóa hợp đồng thành công" : "Contract deleted successfully")
                onDelete?.();
                router.refresh();
                setShowDeleteDialog(false)
            } else {
                showError(res.message || (language === "vi" ? "Xóa thất bại" : "Delete failed"))
            }
        } catch (err) {
            console.error("Error deleting contract:", err)
            showError(language === "vi" ? "Có lỗi khi xóa hợp đồng" : "Error deleting contract")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleUpdateClick = () => {
        // Reset form data to current contract values
        setFormData({
            tienPhong: contract.tienPhong || '',
            tienCoc: contract.tienCoc || '',
            ngayBatDau: contract.ngayBatDau || '',
            ngayKetThuc: contract.ngayKetThuc || '',
            dvRac: contract.dvRac || false,
            dvWifi: contract.dvWifi || false,
            dvCap: contract.dvCap || false,
            dvKhac: contract.dvKhac || false
        })
        setShowUpdateDialog(true)
    }

    const handleUpdateConfirm = async () => {
        if (!contract.maHopDongPhong) {
            showError(language === "vi" ? "Không thể cập nhật: Thiếu ID hợp đồng" : "Cannot update: missing contract ID")
            return
        }

        try {
            setIsUpdating(true)
            const id = typeof contract.maHopDongPhong === "number" ? contract.maHopDongPhong : parseInt(String(contract.maHopDongPhong))
            const res = await updateContract(Number(id), formData)
            if (res.status === "success") {
                showSuccess(language === "vi" ? "Cập nhật hợp đồng thành công" : "Contract updated successfully")
                onUpdate?.();
                router.refresh();
                setShowUpdateDialog(false)
            } else {
                showError(res.message || (language === "vi" ? "Cập nhật thất bại" : "Update failed"))
            }
        } catch (err) {
            console.error("Error updating contract:", err)
            showError(language === "vi" ? "Có lỗi khi cập nhật hợp đồng" : "Error updating contract")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleFormChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <>
            <Card className="w-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{contract.maHopDongPhong}</h3>
                                <p className="text-sm text-gray-600">
                                {language === "vi" ? "Khách:" : "Customer:"} {contract.maKhachDaiDien} •{" "}
                                {language === "vi" ? "Phòng:" : "Room:"} {contract.maPhong}
                                </p>
                            </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                variant={getStatusColor(contract.trangThai)}
                                className={
                                    contract.trangThai === "hoatDong"
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : contract.trangThai === "daXoa"
                                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                                        : ""
                                }
                                >
                                {language === "vi"
                                    ? contract.trangThai === "hoatDong"
                                    ? "Đang hoạt động"
                                    : contract.trangThai === "daXoa"
                                        ? "Đã xóa"
                                        : ""
                                    : contract.trangThai === "hoatDong"
                                    ? "Active"
                                    : contract.trangThai === "daXoa"
                                        ? "Deleted"
                                        : contract.trangThai}
                                </Badge>
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>{language === "vi" ? "Tùy chọn" : "Actions"}</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={handleUpdateClick}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            {language === "vi" ? "Chỉnh sửa" : "Edit"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Download className="h-4 w-4 mr-2" />
                                            {language === "vi" ? "Tải file PDF" : "Download PDF"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={handleDeleteClick} 
                                            disabled={isDeleting}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            {isDeleting ? (language === "vi" ? "Đang xóa..." : "Deleting...") : (language === "vi" ? "Xóa" : "Delete")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                            <div>
                                <span className="text-gray-500">{language === "vi" ? "Ngày bắt đầu" : "Start Date"}</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{contract.ngayBatDau}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-500">{language === "vi" ? "Ngày kết thúc" : "End Date"}</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{contract.ngayKetThuc}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-500">{language === "vi" ? "Tiền phòng" : "Monthly Rent"}</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-green-600">{contract.tienPhong}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-500">{language === "vi" ? "Tiền cọc" : "Deposit Amount"}</span>
                                <div className="flex items-center gap-1 mt-1">
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-green-600">{contract.tienCoc}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <span className="text-gray-500 block text-sm">{language === "vi" ? "Dịch vụ" : "Services"}</span>
                            <div className="flex justify-start items-center gap-6">
                                {[
                                    { labelVi: "Rác", labelEn: "Trash", value: contract.dvRac },
                                    { labelVi: "Wifi", labelEn: "Wifi", value: contract.dvWifi },
                                    { labelVi: "Cáp", labelEn: "Cable", value: contract.dvCap },
                                    { labelVi: "Khác", labelEn: "Other", value: contract.dvKhac },
                                ].map((service, index) => (
                                    <label key={index} className="flex items-center gap-2">
                                    <input type="checkbox" checked={!!service.value} disabled className="w-4 h-4 accent-green-600" />
                                    <span className="text-sm">{language === "vi" ? service.labelVi : service.labelEn}</span>
                                    </label>
                                ))}
                            </div>
                        </div>


                    </div>
                </CardContent>
            </Card>
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {language === "vi" ? "Xác nhận xóa" : "Confirm Delete"}
                        </DialogTitle>
                        <DialogDescription>
                            {language === "vi" 
                                ? `Bạn có chắc muốn xóa hợp đồng ${contract.maHopDongPhong} không? Hành động này không thể hoàn tác.`
                                : `Are you sure you want to delete contract ${contract.maHopDongPhong}? This action cannot be undone.`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            {language === "vi" ? "Hủy" : "Cancel"}
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting 
                                ? (language === "vi" ? "Đang xóa..." : "Deleting...")
                                : (language === "vi" ? "Xóa" : "Delete")
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Dialog */}
            <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {language === "vi" ? "Cập nhật hợp đồng" : "Update Contract"}
                        </DialogTitle>
                        <DialogDescription>
                            {language === "vi" 
                                ? `Cập nhật thông tin cho hợp đồng ${contract.maHopDongPhong}`
                                : `Update information for contract ${contract.maHopDongPhong}`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Room Rate */}
                        <div className="space-y-2">
                            <Label htmlFor="tienPhong">
                                {language === "vi" ? "Tiền phòng" : "Room Rate"}
                            </Label>
                            <Input
                                id="tienPhong"
                                type="number"
                                value={formData.tienPhong}
                                onChange={(e) => handleFormChange('tienPhong', e.target.value)}
                                placeholder={language === "vi" ? "Nhập tiền phòng" : "Enter room rate"}
                            />
                        </div>

                        {/* Deposit */}
                        <div className="space-y-2">
                            <Label htmlFor="tienCoc">
                                {language === "vi" ? "Tiền cọc" : "Deposit"}
                            </Label>
                            <Input
                                id="tienCoc"
                                type="number"
                                value={formData.tienCoc}
                                onChange={(e) => handleFormChange('tienCoc', e.target.value)}
                                placeholder={language === "vi" ? "Nhập tiền cọc" : "Enter deposit amount"}
                            />
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2">
                            <Label htmlFor="ngayBatDau">
                                {language === "vi" ? "Ngày bắt đầu" : "Start Date"}
                            </Label>
                            <Input
                                id="ngayBatDau"
                                type="date"
                                value={formData.ngayBatDau}
                                onChange={(e) => handleFormChange('ngayBatDau', e.target.value)}
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <Label htmlFor="ngayKetThuc">
                                {language === "vi" ? "Ngày kết thúc" : "End Date"}
                            </Label>
                            <Input
                                id="ngayKetThuc"
                                type="date"
                                value={formData.ngayKetThuc}
                                onChange={(e) => handleFormChange('ngayKetThuc', e.target.value)}
                            />
                        </div>

                        {/* Services */}
                        <div className="space-y-3">
                            <Label>{language === "vi" ? "Dịch vụ" : "Services"}</Label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dvRac"
                                        checked={formData.dvRac}
                                        onCheckedChange={(checked) => handleFormChange('dvRac', !!checked)}
                                    />
                                    <Label htmlFor="dvRac" className="text-sm font-normal">
                                        {language === "vi" ? "Rác" : "Trash"}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dvWifi"
                                        checked={formData.dvWifi}
                                        onCheckedChange={(checked) => handleFormChange('dvWifi', !!checked)}
                                    />
                                    <Label htmlFor="dvWifi" className="text-sm font-normal">
                                        {language === "vi" ? "Wifi" : "Wifi"}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dvCap"
                                        checked={formData.dvCap}
                                        onCheckedChange={(checked) => handleFormChange('dvCap', !!checked)}
                                    />
                                    <Label htmlFor="dvCap" className="text-sm font-normal">
                                        {language === "vi" ? "Cáp" : "Cable"}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="dvKhac"
                                        checked={formData.dvKhac}
                                        onCheckedChange={(checked) => handleFormChange('dvKhac', !!checked)}
                                    />
                                    <Label htmlFor="dvKhac" className="text-sm font-normal">
                                        {language === "vi" ? "Khác" : "Other"}
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setShowUpdateDialog(false)}
                            disabled={isUpdating}
                        >
                            {language === "vi" ? "Hủy" : "Cancel"}
                        </Button>
                        <Button 
                            onClick={handleUpdateConfirm}
                            disabled={isUpdating}
                        >
                            {isUpdating 
                                ? (language === "vi" ? "Đang cập nhật..." : "Updating...")
                                : (language === "vi" ? "Cập nhật" : "Update")
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={removeToast} />}
        </>
    )
}