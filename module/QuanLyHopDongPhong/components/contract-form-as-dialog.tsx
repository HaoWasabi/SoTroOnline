

import DatePickerWithCustomLabel from "@/components/date-picker-with-custom-label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import Combobox from "@/module/QuanLyPhong/components/combobox"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Plus } from "lucide-react"

export function ContractFormAsDialog() {

    const {language} = useLanguageStore()
    
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'vi' ? 'Thêm hợp đồng mới' : 'Add Contract'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:min-w-[640px] lg:min-w-[800px]">
                    <DialogHeader>
                        <DialogTitle className="text-3xl">
                            {language === 'vi' ? 'Thêm hợp đồng mới' : 'Add New Contract'}
                        </DialogTitle>
                        <DialogDescription>
                            {language === 'vi' ? 'Điền thông tin hợp đồng của bạn vào biểu mẫu bên dưới.' : 'Fill out the form below with your contract information.'}
                        </DialogDescription>
                    </DialogHeader>
                <div className="grid gap-4">
                    <form>
                        <CardContent className="space-y-4 p-0">

                            <h2 className="text-xl font-semibold">{language === 'vi' ? 'Thông tin hợp đồng' : 'Contract Information'}</h2>

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
                            </div>

                            <div className="px-4 space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <DatePickerWithCustomLabel 
                                        english_label="Check-in Date" 
                                        vietnamese_label="Ngày khách vào" 
                                        htmlFor="start_date"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <DatePickerWithCustomLabel 
                                        vietnamese_label="Thời hạn hợp đồng"
                                        english_label="Contract Duration"
                                        htmlFor="end_date"
                                    />
                                </div>
                            </div>

                            <div className="px-4 space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="rent_price">
                                        { language === 'vi' ? 'Giá thuê' : 'Rent price'}
                                    </Label>
                                    <Input
                                        //ref={addressRef}
                                        id="rent_price"
                                        type="number"
                                        placeholder={ language === 'vi' ? 'Nhập giá thuê ở đây!' : 'Enter rent price here!'}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deposit_price">
                                        { language === 'vi' ? 'Giá đặt cọc' : 'Deposit price'}
                                    </Label>
                                    <Input
                                        //ref={addressRef}
                                        id="deposit_price"
                                        type="number"
                                        placeholder={ language === 'vi' ? 'Nhập giá đặt cọc ở đây!' : 'Enter deposit price here!'}
                                        required
                                    />
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold">{language === 'vi' ? 'Thông tin khách hàng' : 'Customer Information'}</h2>

                            <div className="px-4 space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="rent_price">
                                        { language === 'vi' ? 'Chọn khách thuê' : 'Select tenant'}
                                    </Label>
                                    <Combobox 
                                        data={null}
                                        button_message={language === 'vi' ? 'Chọn khách thuê...' : 'Select tenant...'}
                                        no_data_found_english_message="No tenant found."
                                        no_data_found_vietname_message="Không tìm thấy khách thuê."
                                    />
                                </div>
                            </div>
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
