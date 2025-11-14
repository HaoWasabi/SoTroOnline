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

  const toStr = (v: any) => (v === undefined || v === null ? "" : String(v))

  const originalValuesRef = useRef({
    maPhong: "",
    maKhachThue: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    tienPhong: "",
    tienCoc: "",
  })

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "maPhong":
        if (!value.trim()) {
          return language === "vi" ? "Mã phòng là bắt buộc" : "Room code is required"
        }
        break
      case "maKhachThue":
        if (!value.trim()) {
          return language === "vi" ? "Mã khách đại diện là bắt buộc" : "Tenant code is required"
        }
        break
      case "ngayBatDau":
        if (!value) {
          return language === "vi" ? "Ngày bắt đầu là bắt buộc" : "Start date is required"
        }
        break
      case "ngayKetThuc":
        if (!value) {
          return language === "vi" ? "Ngày kết thúc là bắt buộc" : "End date is required"
        }
        const startDate = new Date(originalValuesRef.current.ngayBatDau || "")
        const endDate = new Date(value)
        if (endDate <= startDate) {
          return language === "vi" ? "Ngày kết thúc phải sau ngày bắt đầu" : "End date must be after start date"
        }
        break
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
        maKhachThue: toStr(contract.maKhachThue),
        ngayBatDau: contract.ngayBatDau ? new Date(contract.ngayBatDau).toISOString().split("T")[0] : "",
        ngayKetThuc: contract.ngayKetThuc ? new Date(contract.ngayKetThuc).toISOString().split("T")[0] : "",
        tienPhong: toStr(contract.tienPhong).replace(/[^\d]/g, "") || "",
        tienCoc: toStr(contract.tienCoc).replace(/[^\d]/g, "") || "",
      }
      setHasChanges(false)
      setValidationErrors({})
    }
  }, [isOpen, contract])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      const originalValue = originalValuesRef.current[name as keyof typeof originalValuesRef.current]

      const error = validateField(name, value)
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }))

      if (value !== originalValue) {
        if (!hasChanges) {
          setHasChanges(true)
        }
        return
      }

      const form = e.target.form
      if (form) {
        const formData = new FormData(form)
        const hasAnyChanges = Object.keys(originalValuesRef.current).some((key) => {
          const currentValue = (formData.get(key) as string) || ""
          const originalValue = originalValuesRef.current[key as keyof typeof originalValuesRef.current]
          return currentValue !== originalValue
        })

        setHasChanges(hasAnyChanges)
      }
    },
    [hasChanges],
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!contract.maHopDongPhong) {
      showError(language === "vi" ? "Không thể cập nhật: Thiếu ID hợp đồng" : "Cannot update: Missing contract ID")
      return
    }

      const formData = new FormData(e.currentTarget)
    const updatedData = {
      maPhong: formData.get("maPhong") as string,
      maKhachThue: formData.get("maKhachThue") as string,
      ngayBatDau: formData.get("ngayBatDau") as string,
      ngayKetThuc: formData.get("ngayKetThuc") as string,
      tienPhong: formData.get("tienPhong") as string,
      tienCoc: formData.get("tienCoc") as string,
      trangThai: "hoatDong",
    }

    const errors: Record<string, string> = {}
    Object.keys(updatedData).forEach((key) => {
      const error = validateField(key, updatedData[key as keyof typeof updatedData] as string)
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

      const statusCode = Number(result.status)
      if (!isNaN(statusCode) && statusCode >= 200 && statusCode < 300) {
        showSuccess(language === "vi" ? "Cập nhật hợp đồng thành công!" : "Contract updated successfully!")
        setIsOpen(false)
        setHasChanges(false)
        setValidationErrors({})
        onUpdate?.()
      } else {
        if (result.message) {
          showError(result.message)
        } else {
          showError(language === "vi" ? "Cập nhật thất bại" : "Update failed")
        }
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
      <DialogContent className="sm:min-w-[800px]">
        <DialogHeader>
          <DialogTitle>{language === "vi" ? "Chỉnh sửa hợp đồng" : "Edit Contract"}</DialogTitle>
          <DialogDescription>
            {language === "vi"
              ? "Cập nhật thông tin hợp đồng của bạn vào biểu mẫu bên dưới."
              : "Update your contract information in the form below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <CardContent className="space-y-4">
              <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="maPhong">
                    {language === "vi" ? "Mã phòng" : "Room Code"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="maPhong"
                    name="maPhong"
                    placeholder={language === "vi" ? "P101" : "P101"}
                    defaultValue={contract.maPhong || ""}
                    onChange={handleInputChange}
                    className={validationErrors.maPhong ? "border-red-500 focus:ring-red-500" : ""}
                    required
                  />
                  {validationErrors.maPhong && <p className="text-sm text-red-500 mt-1">{validationErrors.maPhong}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maKhachThue">
                    {language === "vi" ? "Mã khách đại diện" : "Tenant Code"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="maKhachThue"
                    name="maKhachThue"
                    placeholder={language === "vi" ? "KD001" : "KD001"}
                    defaultValue={contract.maKhachThue || ""}
                    onChange={handleInputChange}
                    className={validationErrors.maKhachThue ? "border-red-500 focus:ring-red-500" : ""}
                    required
                  />
                  {validationErrors.maKhachThue && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.maKhachThue}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="ngayBatDau">
                    {language === "vi" ? "Ngày bắt đầu" : "Start Date"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ngayBatDau"
                    name="ngayBatDau"
                    type="date"
                    defaultValue={contract.ngayBatDau ? new Date(contract.ngayBatDau).toISOString().split("T")[0] : ""}
                    onChange={handleInputChange}
                    className={validationErrors.ngayBatDau ? "border-red-500 focus:ring-red-500" : ""}
                    required
                  />
                  {validationErrors.ngayBatDau && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.ngayBatDau}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ngayKetThuc">
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
                    className={validationErrors.ngayKetThuc ? "border-red-500 focus:ring-red-500" : ""}
                    required
                  />
                  {validationErrors.ngayKetThuc && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.ngayKetThuc}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="tienPhong">
                    {language === "vi" ? "Tiền phòng (VND)" : "Room Fee (VND)"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tienPhong"
                    name="tienPhong"
                    type="number"
                    placeholder={language === "vi" ? "5000000" : "5000000"}
                    defaultValue={toStr(contract.tienPhong).replace(/[^\d]/g, "") || ""}
                    onChange={handleInputChange}
                    className={validationErrors.tienPhong ? "border-red-500 focus:ring-red-500" : ""}
                    required
                  />
                  {validationErrors.tienPhong && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.tienPhong}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tienCoc">
                    {language === "vi" ? "Tiền cọc (VND)" : "Deposit (VND)"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tienCoc"
                    name="tienCoc"
                    type="number"
                    placeholder={language === "vi" ? "10000000" : "10000000"}
                    defaultValue={toStr(contract.tienCoc).replace(/[^\d]/g, "") || ""}
                    onChange={handleInputChange}
                    className={validationErrors.tienCoc ? "border-red-500 focus:ring-red-500" : ""}
                    required
                  />
                  {validationErrors.tienCoc && <p className="text-sm text-red-500 mt-1">{validationErrors.tienCoc}</p>}
                </div>
              </div>
            </CardContent>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)} disabled={isUpdating}>
                {language === "vi" ? "Hủy" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isUpdating || !hasChanges} className="min-w-24">
                {isUpdating
                  ? language === "vi"
                    ? "Đang cập nhật..."
                    : "Updating..."
                  : language === "vi"
                    ? "Cập nhật"
                    : "Update"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
      {toast && <Toast {...toast} onClose={removeToast} />}
    </Dialog>
  )
}