
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Plus } from "lucide-react"
import ListOfRoomItems from "./list-of-room-items"
import { Room } from "../types/room-types"
import { ReactNode, useState } from "react"
import { roomApi } from "../api/api-quan-ly-phong"
import { useToast } from "@/hook/useToast"
import { validateRoomForm, RoomValidationErrors } from "../utils"
import { useTaiKhoanStore } from "@/zustand/taikhoan-store"

const rooms = [
    {
        label_vietnam_name: "Phòng trống",
        label_english_name: "Available",
        value: "Phòng trống",
    },
    {
        label_vietnam_name: "Phòng có nội thất",
        label_english_name: "Furnished Room",
        value: "Phòng có nội thất",
    },
]

const roomStatusOptions = [
    {
        label_vietnam_name: "Phòng trống",
        label_english_name: "Available",
        value: "phongTrong",
    },
    {
        label_vietnam_name: "Đã thuê",
        label_english_name: "Occupied",
        value: "hoatDong",
    },
    {
        label_vietnam_name: "Bảo trì",
        label_english_name: "Maintenance",
        value: "baoTri",
    },
]

interface RoomFormAsDialogProps {
    children?: ReactNode;
    room?: Room;
    onUpdate?: () => void;
}

export function RoomFormAsDialog({ children, room, onUpdate }: RoomFormAsDialogProps) {

    const {language} = useLanguageStore();
    const { showSuccess, showError } = useToast();
    const isEditMode = !!room;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [roomStatus, setRoomStatus] = useState(room?.status || room?.roomStatus || "phongTrong");
    const [roomType, setRoomType] = useState(room?.typeOfRoom || "Phòng trống");
    const [validationErrors, setValidationErrors] = useState<RoomValidationErrors>({});
    const taikhoan = useTaiKhoanStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setValidationErrors({}); // Clear previous errors

        try {
            const formData = new FormData(e.currentTarget);
            
            // Validate form data
            const errors = validateRoomForm(formData, roomStatus, language);
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                showError(
                    language === 'vi' 
                        ? 'Vui lòng kiểm tra lại thông tin nhập vào!' 
                        : 'Please check your input information!'
                );
                setIsSubmitting(false);
                return;
            }
            
            // Extract form data
            const roomItemsArray = formData.getAll('room_items') as string[];
            const roomItemsString = roomItemsArray.join(', ');
            
            const roomData = {
                tenPhong: (formData.get('room_name') as string).trim(),
                loaiPhong: roomType,
                diaChi: (formData.get('address') as string).trim(),
                chieuDai: parseFloat(formData.get('length') as string),
                chieuRong: parseFloat(formData.get('width') as string),
                giaThueCoBan: parseFloat(formData.get('rent_price') as string),
                trangThai: roomStatus, // Send as string - backend should handle enum conversion
                vatDung: roomItemsString,
                maQuanLy: taikhoan.taiKhoan?.maTaiKhoan as number // TODO: Get from current user context
            };


            if (isEditMode && room) {
                // Update existing room
                await roomApi.updateRoom(room.room_id, roomData);
                showSuccess(
                    language === 'vi' 
                        ? `Cập nhật phòng ${roomData.tenPhong} thành công!` 
                        : `Room ${roomData.tenPhong} updated successfully!`
                );
            } else {
                // Create new room
                const response = await roomApi.createRoom(roomData);
                showSuccess(
                    language === 'vi' 
                        ? `Tạo phòng ${roomData.tenPhong} thành công!` 
                        : `Room ${roomData.tenPhong} created successfully!`
                );
            }

            // Close dialog and refresh parent component
            setOpen(false);
            onUpdate?.();
            
        } catch (error) {
            
            // Extract error message from API response if available
            let errorMessage = language === 'vi' 
                ? 'Có lỗi xảy ra khi lưu thông tin phòng!' 
                : 'An error occurred while saving room information!';
            
            if (error instanceof Error) {
                // Check if error contains specific backend validation messages
                if (error.message.includes('did not match parameter type')) {
                    errorMessage = language === 'vi' 
                        ? 'Dữ liệu trạng thái phòng không hợp lệ!' 
                        : 'Invalid room status data!';
                } else if (error.message.includes('Failed to create room')) {
                    errorMessage = language === 'vi' 
                        ? 'Không thể tạo phòng. Vui lòng kiểm tra lại thông tin!' 
                        : 'Failed to create room. Please check your information!';
                } else if (error.message.includes('Failed to update room')) {
                    errorMessage = language === 'vi' 
                        ? 'Không thể cập nhật phòng. Vui lòng kiểm tra lại thông tin!' 
                        : 'Failed to update room. Please check your information!';
                }
            }
            
            showError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            console.log('Dialog open state changed to:', newOpen);
            setOpen(newOpen);
        }}>
            <DialogTrigger asChild>
                {children || (
                    <Button onClick={() => console.log('Add room button clicked!')}>
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'vi' ? 'Thêm phòng mới' : 'Add Room'}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:min-w-[640px] lg:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode 
                            ? (language === 'vi' ? `Chỉnh sửa phòng ${room.name}` : `Edit Room ${room.name}`)
                            : (language === 'vi' ? 'Thêm phòng mới' : 'Add New Room')
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? (language === 'vi' ? 'Cập nhật thông tin phòng của bạn.' : 'Update your room information.')
                            : (language === 'vi' ? 'Điền thông tin phòng của bạn vào biểu mẫu bên dưới.' : 'Fill out the form below with your room information.')
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <CardContent className="space-y-4">
                        <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="room_name">
                                    {language === 'vi' ? 'Tên phòng' : 'Room name'}
                                </Label>
                                <Input
                                    id="room_name"
                                    name="room_name"
                                    defaultValue={room?.name || ""}
                                    placeholder="Room 101"
                                    required
                                    className={validationErrors.room_name ? 'border-red-500' : ''}
                                />
                                {validationErrors.room_name && (
                                    <p className="text-sm text-red-500">{validationErrors.room_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="room_status">
                                    { language === 'vi' ? 'Trạng thái phòng' : 'Room status'}
                                </Label>
                                <Select value={roomStatus} onValueChange={setRoomStatus}>
                                    <SelectTrigger className={validationErrors.room_status ? 'border-red-500' : ''}>
                                        <SelectValue placeholder={language === 'vi' ? 'Chọn trạng thái phòng' : 'Select room status'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roomStatusOptions.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {language === 'vi' ? status.label_vietnam_name : status.label_english_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {validationErrors.room_status && (
                                    <p className="text-sm text-red-500">{validationErrors.room_status}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="room_type">
                                    {language === 'vi' ? 'Loại phòng' : 'Room type'}
                                </Label>
                                <Select name="room_type" value={roomType} onValueChange={setRoomType}>
                                    <SelectTrigger className={validationErrors.room_type ? 'border-red-500' : ''}>
                                        <SelectValue placeholder={language === 'vi' ? 'Chọn loại phòng' : 'Select room type'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {language === 'vi' ? type.label_vietnam_name : type.label_english_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {validationErrors.room_type && (
                                    <p className="text-sm text-red-500">{validationErrors.room_type}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">{language === 'vi' ? 'Địa chỉ' : 'Address'}</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    defaultValue={room?.address || ""}
                                    placeholder={ language === 'vi' ? 'Nhập địa chỉ ở đây!' : 'Enter address here!'}
                                    required
                                    className={validationErrors.address ? 'border-red-500' : ''}
                                />
                                {validationErrors.address && (
                                    <p className="text-sm text-red-500">{validationErrors.address}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="length">
                                    { language === 'vi' ? 'Chiều dài' : 'Length'}
                                </Label>
                                <Input
                                    id="length"
                                    name="length"
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max="1000"
                                    defaultValue={room?.height?.toString() || ""}
                                    placeholder={ language === 'vi' ? 'Nhập chiều dài ở đây!' : 'Enter length here!'}
                                    required
                                    className={validationErrors.length ? 'border-red-500' : ''}
                                />
                                {validationErrors.length && (
                                    <p className="text-sm text-red-500">{validationErrors.length}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="width">
                                    { language === 'vi' ? 'Chiều rộng' : 'Width'}
                                </Label>
                                <Input
                                    id="width"
                                    name="width"
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max="1000"
                                    defaultValue={room?.width?.toString() || ""}
                                    placeholder={ language === 'vi' ? 'Nhập chiều rộng ở đây!' : 'Enter width here!'}
                                    required
                                    className={validationErrors.width ? 'border-red-500' : ''}
                                />
                                {validationErrors.width && (
                                    <p className="text-sm text-red-500">{validationErrors.width}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rent_price">
                                    { language === 'vi' ? 'Giá thuê' : 'Rent price'}
                                </Label>
                                <Input
                                    id="rent_price"
                                    name="rent_price"
                                    type="number"
                                    step="1000"
                                    min="0"
                                    max="9999999"
                                    defaultValue={room?.baseRent?.toString() || ""}
                                    placeholder={ language === 'vi' ? 'Nhập giá thuê ở đây!' : 'Enter rent price here!'}
                                    required
                                    className={validationErrors.rent_price ? 'border-red-500' : ''}
                                />
                                {validationErrors.rent_price && (
                                    <p className="text-sm text-red-500">{validationErrors.rent_price}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Label htmlFor="room_items" className={roomType === 'Phòng trống' ? 'text-gray-400' : ''}>
                                { language === 'vi' ? 'Nội thất phòng' : 'Room items'}
                                {roomType === 'Phòng trống' && (
                                    <span className="ml-2 text-sm text-gray-500">
                                        ({language === 'vi' ? 'Không có nội thất cho phòng trống' : 'No furniture for empty rooms'})
                                    </span>
                                )}
                            </Label>
                            <ListOfRoomItems room={room} disabled={roomType === 'Phòng trống'} />
                        </div>
                    </CardContent>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">{language === 'vi' ? 'Hủy' : 'Cancel'}</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (language === 'vi' ? 'Đang xử lý...' : 'Processing...') : (
                                isEditMode 
                                    ? (language === 'vi' ? 'Cập nhật phòng' : 'Update room')
                                    : (language === 'vi' ? 'Thêm phòng' : 'Add room')
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
