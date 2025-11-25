"use client"

import { Badge } from "@/components/ui/badge"
import type { Contract } from "../types/contract"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { deleteContract, downloadContractDOCX } from "../api/api-quan-ly-hop-dong"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Calendar, DollarSign, Download, Edit, FileText, MoreHorizontal, Trash2, Users, CalendarDays } from "lucide-react"
import { useCallback, useState } from "react"
import * as React from "react"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"
import { useRouter } from "next/navigation"
import ContractTenantManagement from "./contract-tenant-management"
import ContractRenewalDialog from "./contract-renewal-dialog"
import { ContractFormEditing } from "./contract-form-editing"

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
    const [isDownloading, setIsDownloading] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showTenantDialog, setShowTenantDialog] = useState(false)
    const [showRenewalDialog, setShowRenewalDialog] = useState(false)

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

    const handleDownloadDOCX = async () => {
        if (!contract.maHopDongPhong) {
            showError(language === "vi" ? "Không thể tải: Thiếu ID hợp đồng" : "Cannot download: missing contract ID")
            return
        }
        
        try {
            setIsDownloading(true)
            const id = typeof contract.maHopDongPhong === "number" ? contract.maHopDongPhong : parseInt(String(contract.maHopDongPhong))
            const result = await downloadContractDOCX(Number(id))
            
            if (result.status === "success") {
                showSuccess(language === "vi" ? "Tải file DOCX thành công" : "DOCX downloaded successfully")
            } else {
                showError(result.message || (language === "vi" ? "Tải file thất bại" : "Download failed"))
            }
        } catch (err) {
            console.error("Error downloading DOCX:", err)
            showError(language === "vi" ? "Có lỗi khi tải file DOCX" : "Error downloading DOCX")
        } finally {
            setIsDownloading(false)
        }
    }









    return (
        <>
            <Card className="w-full hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-sm">
                <CardContent className="p-8">
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-5">
                            <div className="relative h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <FileText className="h-8 w-8 text-white" />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
                                    {language === "vi" ? "Hợp đồng" : "Contract"} #{contract.maHopDongPhong}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {language === "vi" ? "Khách:" : "Customer:"} <span className="font-medium text-gray-700">{contract.maKhachDaiDien}</span>
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        {language === "vi" ? "Phòng:" : "Room:"} <span className="font-medium text-gray-700">{contract.maPhong}</span>
                                    </span>
                                </div>
                            </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge
                                variant={getStatusColor(contract.trangThai)}
                                className={
                                    contract.trangThai === "hoatDong"
                                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg shadow-green-200"
                                    : contract.trangThai === "daXoa"
                                        ? "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg shadow-red-200"
                                        : "bg-gradient-to-r from-gray-400 to-slate-500 text-white border-0 px-3 py-1 text-xs font-semibold"
                                }
                                >
                                <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${
                                        contract.trangThai === "hoatDong" ? "bg-white/80" : "bg-white/60"
                                    }`}></div>
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
                                </div>
                                </Badge>
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100 hover:shadow-md transition-all duration-200">
                                            <MoreHorizontal className="h-5 w-5 text-gray-600" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>{language === "vi" ? "Tùy chọn" : "Actions"}</DropdownMenuLabel>
                                        <ContractFormEditing contract={contract} onUpdate={onUpdate}>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                {language === "vi" ? "Chỉnh sửa" : "Edit"}
                                            </DropdownMenuItem>
                                        </ContractFormEditing>
                                        <DropdownMenuItem 
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                setShowRenewalDialog(true);
                                            }}
                                        >
                                            <CalendarDays className="h-4 w-4 mr-2" />
                                            {language === "vi" ? "Gia hạn hợp đồng" : "Renew Contract"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                setShowTenantDialog(true);
                                            }}
                                        >
                                            <Users className="h-4 w-4 mr-2" />
                                            {language === "vi" ? "Quản lý khách thuê" : "Manage Tenants"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={handleDownloadDOCX}
                                            disabled={isDownloading}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            {isDownloading 
                                                ? (language === "vi" ? "Đang tải..." : "Downloading...") 
                                                : (language === "vi" ? "Tải file DOCX" : "Download DOCX")
                                            }
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

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{language === "vi" ? "Bắt đầu" : "Start"}</span>
                                </div>
                                <span className="font-bold text-gray-900 text-sm">{contract.ngayBatDau}</span>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-purple-600" />
                                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">{language === "vi" ? "Kết thúc" : "End"}</span>
                                </div>
                                <span className="font-bold text-gray-900 text-sm">{contract.ngayKetThuc}</span>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="h-4 w-4 text-emerald-600" />
                                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{language === "vi" ? "Tiền phòng" : "Rent"}</span>
                                </div>
                                <span className="font-bold text-emerald-700 text-sm">{contract.tienPhong}</span>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="h-4 w-4 text-amber-600" />
                                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">{language === "vi" ? "Cọc" : "Deposit"}</span>
                                </div>
                                <span className="font-bold text-amber-700 text-sm">{contract.tienCoc}</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-5 border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{language === "vi" ? "Dịch vụ bao gồm" : "Included Services"}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { labelVi: "Rác", labelEn: "Trash", value: contract.dvRac, icon: "🗑️" },
                                    { labelVi: "Wifi", labelEn: "Wifi", value: contract.dvWifi, icon: "📶" },
                                    { labelVi: "Cáp", labelEn: "Cable", value: contract.dvCap, icon: "📺" },
                                    { labelVi: "Khác", labelEn: "Other", value: contract.dvKhac, icon: "⚡" },
                                ].map((service, index) => (
                                    <div key={index} className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                                        service.value 
                                            ? "bg-gradient-to-r from-green-100 to-emerald-50 border border-green-200" 
                                            : "bg-gray-100 border border-gray-200 opacity-60"
                                    }`}>
                                        <span className="text-lg">{service.icon}</span>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                            service.value 
                                                ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500" 
                                                : "bg-gray-200 border-gray-300"
                                        }`}>
                                            {service.value && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                        </div>
                                        <span className={`text-sm font-medium ${
                                            service.value ? "text-gray-700" : "text-gray-500"
                                        }`}>
                                            {language === "vi" ? service.labelVi : service.labelEn}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>




                    </div>
                </CardContent>
            </Card>
            
            {/* Tenant Management Dialog - Controlled externally */}
            <ContractTenantManagement 
                contract={contract} 
                onUpdate={onUpdate}
                open={showTenantDialog}
                onOpenChange={setShowTenantDialog}
            />
            
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

            <ContractRenewalDialog
                contract={contract}
                open={showRenewalDialog}
                onOpenChange={setShowRenewalDialog}
                onUpdate={onUpdate}
            />
            
            {toast && <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={removeToast} />}
        </>
    )
}