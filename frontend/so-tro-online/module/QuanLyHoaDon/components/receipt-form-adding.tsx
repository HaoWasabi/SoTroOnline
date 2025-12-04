"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Plus } from "lucide-react"
import { createReceipt } from "../api/api-quan-ly-hoa-don"
import { useToast } from "@/hook/useToast"
import { Toast } from "@/components/toast"

export function ReceiptFormAsDialog({ maHoaDon, onSuccess }: { maHoaDon: number; onSuccess?: () => void }) {
  const { language } = useLanguageStore()
  const { toast, showError, showSuccess, removeToast } = useToast()
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [amount, setAmount] = useState<string>("")
  const [note, setNote] = useState<string>("")

  const validate = () => {
    const a = Number(String(amount).replace(/,/g, ""))
    if (!a || isNaN(a) || a <= 0) {
      showError(language === "vi" ? "Số tiền không hợp lệ" : "Invalid amount")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsCreating(true)
    try {
      const soTienThu = Number(String(amount).replace(/,/g, ""))
      const res = await createReceipt({ maHoaDon, soTienThu, ghiChu: note || undefined })
      if (res.status === "success") {
        showSuccess(language === "vi" ? "Tạo phiếu thu thành công" : "Receipt created successfully")
        setAmount("")
        setNote("")
        setOpen(false)
        onSuccess?.()
      } else {
        showError(res.message || (language === "vi" ? "Tạo thất bại" : "Create failed"))
      }
    } catch (err) {
      console.error(err)
      showError(language === "vi" ? "Lỗi khi tạo phiếu thu" : "Error creating receipt")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {language === "vi" ? "Tạo phiếu thu" : "Create Receipt"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:min-w-[420px] lg:min-w-[520px]">
        <DialogHeader>
          <DialogTitle>{language === "vi" ? "Tạo phiếu thu" : "Create Receipt"}</DialogTitle>
          <DialogDescription>
            {language === "vi"
              ? "Nhập số tiền và ghi chú cho phiếu thu."
              : "Enter amount and an optional note for the receipt."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 max-h-[60vh] overflow-y-auto">
            <CardContent className="space-y-4 p-0">
              <div className="px-4 space-y-2">
                <Label>{language === "vi" ? "Số tiền (VND)" : "Amount (VND)"} <span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={language === "vi" ? "Nhập số tiền" : "Enter amount"}
                />
              </div>

              <div className="px-4 space-y-2">
                <Label>{language === "vi" ? "Ghi chú" : "Note"}</Label>
                <Input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={language === "vi" ? "Ghi chú (tuỳ chọn)" : "Note (optional)"}
                />
              </div>
            </CardContent>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isCreating}>{language === "vi" ? "Hủy" : "Cancel"}</Button>
            </DialogClose>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (language === "vi" ? "Đang tạo..." : "Creating...") : (language === "vi" ? "Tạo phiếu thu" : "Create Receipt")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {toast && <Toast {...toast} onClose={removeToast} />}
    </Dialog>
  )
}