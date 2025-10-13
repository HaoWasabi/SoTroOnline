
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
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Plus } from "lucide-react"
import Combobox from "./combobox"
import ListOfRoomItems from "./list-of-room-items"
import ListOfRoomServices from "./list-of-room-service"

const rooms = [
    {
        label_vietnam_name: "Phòng trống",
        label_english_name: "Available",
        value: "available",
    },
    {
        label_vietnam_name: "Phòng có nội thất",
        label_english_name: "Furnished Room",
        value: "furnished",
    },
]

export function RoomFormAsDialog() {

    const {language} = useLanguageStore()
    

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'vi' ? 'Thêm phòng mới' : 'Add Room'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:min-w-[640px] lg:min-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>
                            {language === 'vi' ? 'Thêm phòng mới' : 'Add New Room'}
                        </DialogTitle>
                        <DialogDescription>
                            {language === 'vi' ? 'Điền thông tin phòng của bạn vào biểu mẫu bên dưới.' : 'Fill out the form below with your room information.'}
                        </DialogDescription>
                    </DialogHeader>
                <div className="grid gap-4">
                    <form>
                    <CardContent className="space-y-4">
                        <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="room_name">
                                    {language === 'vi' ? 'Tên phòng' : 'Room name'}
                                </Label>
                                <Input
                                    //ref={userNameRef}
                                    id="room_name"
                                    placeholder="John"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="room_type">{language === 'vi' ? 'Loại phòng' : 'Room type'}</Label>
                                <Combobox 
                                    data={rooms} 
                                    button_message={language === 'vi' ? 'Chọn loại phòng...' : 'Select room type...'}
                                    no_data_found_english_message="No room type found."
                                    no_data_found_vietname_message="Không tìm thấy loại phòng."
                                />
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="address">{language === 'vi' ? 'Địa chỉ' : 'Address'}</Label>
                                <Input
                                    //ref={cccdRef}
                                    id="address"
                                    type="text"
                                    placeholder={ language === 'vi' ? 'Nhập địa chỉ ở đây!' : 'Enter address here!'}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="length">
                                    { language === 'vi' ? 'Chiều dài' : 'Length'}
                                </Label>
                                <Input
                                    //ref={phoneRef}
                                    id="length"
                                    type="text"
                                    placeholder={ language === 'vi' ? 'Nhập chiều dài ở đây!' : 'Enter length here!'}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="width">
                                    { language === 'vi' ? 'Chiều rộng' : 'Width'}
                                </Label>
                                <Input
                                    //ref={addressRef}
                                    id="width"
                                    type="text"
                                    placeholder={ language === 'vi' ? 'Nhập chiều rộng ở đây!' : 'Enter width here!'}
                                    required
                                />
                            </div>

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
                        </div>

                        <div className="flex flex-col gap-4">
                            <Label htmlFor="room_items">
                                { language === 'vi' ? 'Nội thất phòng' : 'Room items'}
                            </Label>
                            <ListOfRoomItems />
                        </div>

                        <div className="flex flex-col gap-4">
                            <Label htmlFor="room_services">
                                { language === 'vi' ? 'Dịch vụ phòng' : 'Room services'}
                            </Label>
                            <ListOfRoomServices />
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
