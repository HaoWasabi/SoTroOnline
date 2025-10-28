

import DatePickerWithCustomLabel from "@/components/date-picker-with-custom-label"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ServiceTable from "@/module/QuanLyHopDongPhong/components/service-table"
import Combobox from "@/module/QuanLyPhong/components/combobox"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Plus } from "lucide-react"


const months = [
    { label_vietnam_name: "Tháng 1", label_english_name: "January", value: "01" },
    { label_vietnam_name: "Tháng 2", label_english_name: "February", value: "02" },
    { label_vietnam_name: "Tháng 3", label_english_name: "March", value: "03" },
    { label_vietnam_name: "Tháng 4", label_english_name: "April", value: "04" },
    { label_vietnam_name: "Tháng 5", label_english_name: "May", value: "05" },
    { label_vietnam_name: "Tháng 6", label_english_name: "June", value: "06" },
    { label_vietnam_name: "Tháng 7", label_english_name: "July", value: "07" },
    { label_vietnam_name: "Tháng 8", label_english_name: "August", value: "08" },
    { label_vietnam_name: "Tháng 9", label_english_name: "September", value: "09" },
    { label_vietnam_name: "Tháng 10", label_english_name: "October", value: "10" },
    { label_vietnam_name: "Tháng 11", label_english_name: "November", value: "11" },
    { label_vietnam_name: "Tháng 12", label_english_name: "December", value: "12" },
]

export function InvoiceFormAsDialog() {

    const {language} = useLanguageStore()
    
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'vi' ? 'Thêm hóa đơn mới' : 'Add Invoice'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:min-w-[640px] lg:min-w-[800px]">
                    <DialogHeader>
                        <DialogTitle className="text-3xl">
                            {language === 'vi' ? 'Thêm hóa đơn mới' : 'Add New Invoice'}
                        </DialogTitle>
                        {/* <DialogDescription>
                            {language === 'vi' ? 'Điền thông tin hóa đơn của bạn vào biểu mẫu bên dưới.' : 'Fill out the form below with your invoice information.'}
                        </DialogDescription> */}
                    </DialogHeader>
                <div className="grid gap-4">
                    <form>
                        <CardContent className="space-y-4 p-0">
                            <div className="px-4 space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="room">
                                        {language === 'vi' ? 'Chọn phòng' : 'Select Room'}
                                    </Label>
                                    <Combobox 
                                        data={null}
                                        no_data_found_english_message="No room found."
                                        no_data_found_vietname_message="Không tìm thấy phòng."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="month">
                                        {language === 'vi' ? 'Chọn tháng' : 'Select Month'}
                                    </Label>
                                    <Combobox 
                                        data={months}
                                        no_data_found_english_message="No month found."
                                        no_data_found_vietname_message="Không tìm thấy tháng."
                                    />
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold">{language === 'vi' ? 'Thông tin phòng' : 'Room Information'}</h2>

                            <div className="px-4 space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tenant_name">
                                        {language === 'vi' ? 'Khách thuê' : 'Tenant'}
                                    </Label>
                                    <Input 
                                        id="tenant_name"
                                        type="text"
                                        //placeholder={language === 'vi' ? 'Nhập giá phòng ở đây!' : 'Enter room price here!'}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rent_price">
                                        {language === 'vi' ? 'Giá thuê' : 'Rent Price'}
                                    </Label>
                                    <Input 
                                        id="rent_price"
                                        type="number"
                                        //placeholder={language === 'vi' ? 'Nhập giá phòng ở đây!' : 'Enter room price here!'}
                                        required
                                    />
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold">{language === 'vi' ? 'Tổng tiền' : 'Total Amount'}</h2>

                            <ServiceTable />
                        </CardContent>
                        
                    </form>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button variant="outline">{language === 'vi' ? 'Hủy' : 'Cancel'}</Button>
                    </DialogClose>
                    <Button type="submit">{language === 'vi' ? 'Thêm phòng' : 'Add room'}</Button>
                </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
