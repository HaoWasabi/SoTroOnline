"use client"

import type React from "react"
import type { Contract as ContractType } from "../types/contract"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { updateContract } from "../api/api-quan-ly-hop-dong"
import ServiceTable from "./service-table"
import { useState, useEffect, useCallback, useRef } from "react"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"

interface ContractFormEditingProps {
  contract: ContractType
  children: React.ReactNode
  onUpdate?: () => void
}

export function ContractFormEditing({ contract, children, onUpdate }: ContractFormEditingProps) {
  const { language } = useLanguageStore()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const { toast, showSuccess, showError, removeToast } = useToast()
  
  // Service state
  const [services, setServices] = useState({
    dvRac: false,
    dvWifi: false, 
    dvCap: false,
    dvKhac: false
  })

  const toStr = (v: any) => (v === undefined || v === null ? "" : String(v))

  const originalValuesRef = useRef({
    maPhong: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    tienPhong: "",
    tienCoc: "",
  })

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "maPhong":
        // Room code is read-only, no validation needed
        return null
      case "ngayBatDau":
        // Skip validation for readonly date fields - they use original values
        return ""
      case "ngayKetThuc":
        // Skip validation for readonly date fields - they use original values
        return ""
      case "tienPhong":
        if (!value.trim()) {
          return language === "vi" ? "Tiền phòng là bắt buộc" : "Room fee is required"
        }
        if (isNaN(Number(value)) || Number(value) <= 0) {
          return language === "vi" ? "Tiền phòng phải là số dương" : "Room fee must be a positive number"
        }
        break
      case "tienCoc":
        if (!value.trim()) {
          return language === "vi" ? "Tiền cọc là bắt buộc" : "Deposit is required"
        }
        if (isNaN(Number(value)) || Number(value) <= 0) {
          return language === "vi" ? "Tiền cọc phải là số dương" : "Deposit must be a positive number"
        }
        break
    }
    return null
  }

  useEffect(() => {
    if (isOpen) {
      originalValuesRef.current = {
        maPhong: toStr(contract.maPhong),
        ngayBatDau: contract.ngayBatDau ? new Date(contract.ngayBatDau).toISOString().split("T")[0] : "",
        ngayKetThuc: contract.ngayKetThuc ? new Date(contract.ngayKetThuc).toISOString().split("T")[0] : "",
        tienPhong: toStr(contract.tienPhong).replace(/[^\d]/g, "") || "",
        tienCoc: toStr(contract.tienCoc).replace(/[^\d]/g, "") || "",
      }
      setHasChanges(false)
      setValidationErrors({})
      
      // Set initial services
      setServices({
        dvRac: !!contract.dvRac,
        dvWifi: !!contract.dvWifi,
        dvCap: !!contract.dvCap,
        dvKhac: !!contract.dvKhac
      })
    }
  }, [isOpen, contract])



  // Check if there are any changes compared to original values
  const checkForChanges = useCallback(() => {
    // Check form field changes
    const formElement = document.querySelector('form');
    if (formElement) {
      const formData = new FormData(formElement);
      const editableFields = ["tienPhong", "tienCoc"];
      const hasFormChanges = editableFields.some((key) => {
        const currentValue = (formData.get(key) as string) || ""
        const originalValue = originalValuesRef.current[key as keyof typeof originalValuesRef.current]
        return currentValue !== originalValue
      });
      
      // Check service changes
      const originalServices = {
        dvRac: !!contract.dvRac,
        dvWifi: !!contract.dvWifi,
        dvCap: !!contract.dvCap,
        dvKhac: !!contract.dvKhac
      };
      
      const hasServiceChanges = Object.keys(services).some(key => 
        services[key as keyof typeof services] !== originalServices[key as keyof typeof originalServices]
      );
      
      setHasChanges(hasFormChanges || hasServiceChanges);
    }
  }, [services, contract]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      
      // Skip handling for read-only fields
      if (name === "maPhong") {
        return;
      }
      
      const originalValue = originalValuesRef.current[name as keyof typeof originalValuesRef.current]

      const error = validateField(name, value)
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }))

      // Use the centralized change checking
      setTimeout(checkForChanges, 0);
    },
    [checkForChanges],
  )
  
  const handleServiceChange = (newServices: Record<string, boolean>) => {
    setServices(prev => ({ ...prev, ...newServices }))
    // Use the centralized change checking
    setTimeout(checkForChanges, 0);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!contract.maHopDongPhong) {
      showError(language === "vi" ? "Không thể cập nhật: Thiếu ID hợp đồng" : "Cannot update: Missing contract ID")
      return
    }

    const formData = new FormData(e.currentTarget)
    const updatedData = {
      maPhong: contract.maPhong || "", // Use original contract value since field is read-only
      // Use original date values since these fields are readonly
      ngayBatDau: originalValuesRef.current.ngayBatDau,
      ngayKetThuc: originalValuesRef.current.ngayKetThuc,
      tienPhong: formData.get("tienPhong") as string,
      tienCoc: formData.get("tienCoc") as string,
      dvRac: services.dvRac,
      dvWifi: services.dvWifi,
      dvCap: services.dvCap,
      dvKhac: services.dvKhac,
      trangThai: "hoatDong",
    }

    const errors: Record<string, string> = {}
    // Only validate editable fields
    const editableFields = ["tienPhong", "tienCoc"];
    editableFields.forEach((key) => {
      const value = updatedData[key as keyof typeof updatedData] as string;
      const error = validateField(key, value)
      if (error) {
        errors[key] = error
      }
    })

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      showError(
        language === "vi" ? "Vui lòng kiểm tra lại thông tin đã nhập." : "Please check the information entered.",
      )
      return
    }

    setValidationErrors({})

      try {
      setIsUpdating(true)
  console.log("Attempting to update contract with ID:", contract.maHopDongPhong, "Data:", updatedData)

  const contractId = typeof contract.maHopDongPhong === 'number' ? contract.maHopDongPhong : parseInt(String(contract.maHopDongPhong))
  const result = await updateContract(Number(contractId), updatedData)
      console.log("Update result:", result)
      console.log("Result status:", result.status)
      console.log("Result message:", result.message)

      // Check if the API call was successful
      // The backend returns ApiResponseV2 with status field "success" or "error"
      if (result.status === 'success') {
        showSuccess(language === "vi" ? "Cập nhật hợp đồng thành công!" : "Contract updated successfully!")
        setIsOpen(false)
        setHasChanges(false)
        setValidationErrors({})
        onUpdate?.()
      } else {
        // Handle error response
        const errorMessage = result.message || (language === "vi" ? "Cập nhật thất bại" : "Update failed");
        console.log("Showing error:", errorMessage);
        showError(errorMessage);
      }
    } catch (error) {
      console.error("Error updating contract:", error)
      showError(
        language === "vi"
          ? "Có lỗi xảy ra khi cập nhật hợp đồng. Vui lòng thử lại."
          : "An error occurred while updating the contract. Please try again.",
      )
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:min-w-[900px] max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">✏️</span>
            </div>
            {language === "vi" ? "Chỉnh sửa hợp đồng" : "Edit Contract"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base mt-2">
            {language === "vi"
              ? "Cập nhật thông tin hợp đồng của bạn vào biểu mẫu bên dưới."
              : "Update your contract information in the form below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto" id="contract-edit-form">
          <div className="space-y-6">
            {/* Room Information Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🏠</span>
                </div>
                <h3 className="text-lg font-semibold text-emerald-700">
                  {language === "vi" ? "Thông tin phòng" : "Room Information"}
                </h3>
              </div>
              <div className="space-y-3">
                <Label htmlFor="maPhong" className="text-emerald-700 font-medium">
                  {language === "vi" ? "Mã phòng" : "Room Code"}
                </Label>
                <Input
                  id="maPhong"
                  name="maPhong"
                  placeholder={language === "vi" ? "P101" : "P101"}
                  defaultValue={contract.maPhong || ""}
                  className="bg-gray-50 text-gray-600 cursor-not-allowed border-gray-300"
                  disabled={true}
                  readOnly={true}
                  title={language === "vi" ? "Mã phòng không thể thay đổi" : "Room code cannot be modified"}
                />
                <p className="text-xs text-gray-500 mt-1 italic">
                  {language === "vi" ? "Mã phòng không thể thay đổi sau khi tạo hợp đồng" : "Room code cannot be changed after contract creation"}
                </p>
                {validationErrors.maPhong && <p className="text-sm text-red-500 mt-1">{validationErrors.maPhong}</p>}
              </div>
            </div>

            {/* Contract Duration Section */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-purple-700">
                  {language === "vi" ? "Thời hạn hợp đồng" : "Contract Duration"}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <Label htmlFor="ngayBatDau" className="text-purple-700 font-medium">
                    {language === "vi" ? "Ngày bắt đầu" : "Start Date"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ngayBatDau"
                    name="ngayBatDau"
                    type="date"
                    defaultValue={contract.ngayBatDau ? new Date(contract.ngayBatDau).toISOString().split("T")[0] : ""}
                    onChange={handleInputChange}
                    className={`bg-purple-50 text-purple-600 cursor-not-allowed border-purple-200 ${validationErrors.ngayBatDau ? "border-red-500 focus:ring-red-500" : ""}`}
                    readOnly
                    required
                  />
                  {validationErrors.ngayBatDau && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.ngayBatDau}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="ngayKetThuc" className="text-purple-700 font-medium">
                    {language === "vi" ? "Ngày kết thúc" : "End Date"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ngayKetThuc"
                    name="ngayKetThuc"
                    type="date"
                    defaultValue={
                      contract.ngayKetThuc ? new Date(contract.ngayKetThuc).toISOString().split("T")[0] : ""
                    }
                    onChange={handleInputChange}
                    className={`bg-purple-50 text-purple-600 cursor-not-allowed border-purple-200 ${validationErrors.ngayKetThuc ? "border-red-500 focus:ring-red-500" : ""}`}
                    readOnly
                    required
                  />
                  {validationErrors.ngayKetThuc && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.ngayKetThuc}</p>
                  )}
                </div>
              </div>

              {/* Enhanced Note about readonly date fields */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">ℹ️</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      {language === "vi" ? "Lưu ý quan trọng" : "Important Note"}
                    </p>
                    <p className="text-sm text-blue-700">
                      {language === "vi" 
                        ? "Ngày bắt đầu và ngày kết thúc không thể chỉnh sửa trong form này. Để thay đổi thời hạn hợp đồng, vui lòng sử dụng chức năng 'Gia hạn hợp đồng'."
                        : "Start date and end date cannot be edited in this form. To change contract dates, please use the 'Renew Contract' functionality."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-amber-700">
                  {language === "vi" ? "Thông tin tài chính" : "Financial Information"}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="tienPhong" className="text-amber-700 font-medium">
                    {language === "vi" ? "Tiền phòng (VND)" : "Room Fee (VND)"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tienPhong"
                    name="tienPhong"
                    type="number"
                    placeholder={language === "vi" ? "5000000" : "5000000"}
                    defaultValue={toStr(contract.tienPhong).replace(/[^\d]/g, "") || ""}
                    onChange={handleInputChange}
                    className={`bg-white border-amber-200 focus:ring-amber-500 focus:border-amber-500 ${validationErrors.tienPhong ? "border-red-500 focus:ring-red-500" : ""}`}
                    disabled={true}
                  />
                  {validationErrors.tienPhong && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.tienPhong}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tienCoc" className="text-amber-700 font-medium">
                    {language === "vi" ? "Tiền cọc (VND)" : "Deposit (VND)"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tienCoc"
                    name="tienCoc"
                    type="number"
                    placeholder={language === "vi" ? "10000000" : "10000000"}
                    defaultValue={toStr(contract.tienCoc).replace(/[^\d]/g, "") || ""}
                    onChange={handleInputChange}
                    className={`bg-white border-amber-200 focus:ring-amber-500 focus:border-amber-500 ${validationErrors.tienCoc ? "border-red-500 focus:ring-red-500" : ""}`}
                    required
                  />
                  {validationErrors.tienCoc && <p className="text-sm text-red-500 mt-1">{validationErrors.tienCoc}</p>}
                </div>
              </div>
            </div>
              
            {/* Services Section */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⚙️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {language === "vi" ? "Dịch vụ bao gồm" : "Included Services"}
                </h3>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <ServiceTable
                  onChange={handleServiceChange}
                  initialValues={services}
                />
              </div>
            </div>
          </div>
        </form>
        
        <DialogFooter className="border-t border-gray-100 pt-6 mt-6 backdrop-blur-sm">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => setIsOpen(false)} 
            disabled={isUpdating}
            className="hover:bg-gray-50 border-gray-300"
          >
            {language === "vi" ? "Hủy" : "Cancel"}
          </Button>
          <Button 
            type="submit" 
            form="contract-edit-form"
            disabled={isUpdating || !hasChanges} 
            className="min-w-32 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isUpdating
              ? language === "vi"
                ? "Đang cập nhật..."
                : "Updating..."
              : language === "vi"
                ? "Cập nhật hợp đồng"
                : "Update Contract"}
          </Button>
        </DialogFooter>
      </DialogContent>
      {toast && <Toast {...toast} onClose={removeToast} />}
    </Dialog>
  )
}