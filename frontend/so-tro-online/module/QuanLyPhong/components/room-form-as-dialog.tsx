
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
import { Edit, Plus } from "lucide-react"
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
                soLuongKhachToiDa: parseInt(formData.get('max_tenants') as string) || 4,
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
            <DialogContent className="min-w-4xl rounded-2xl border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-2 pb-4 border-b border-gray-100">
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                            {isEditMode ? (
                                <Edit className="h-5 w-5 text-white" />
                            ) : (
                                <Plus className="h-5 w-5 text-white" />
                            )}
                        </div>
                        {isEditMode 
                            ? (language === 'vi' ? `Chỉnh sửa phòng ${room.name}` : `Edit Room ${room.name}`)
                            : (language === 'vi' ? 'Thêm phòng mới' : 'Add New Room')
                        }
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 ml-10">
                        {isEditMode
                            ? (language === 'vi' ? 'Cập nhật thông tin phòng của bạn.' : 'Update your room information.')
                            : (language === 'vi' ? 'Điền thông tin phòng của bạn vào biểu mẫu bên dưới.' : 'Fill out the form below with your room information.')
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="py-1">
                    <div className="space-y-4">
                        {/* Basic Information Section */}
                        <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                <h4 className="font-bold text-base text-gray-900">
                                    {language === 'vi' ? 'Thông tin cơ bản' : 'Basic Information'}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100 space-y-2">
                                    <Label htmlFor="room_name" className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
                                        <span className="text-xs">🏠</span>
                                        {language === 'vi' ? 'Tên phòng' : 'Room Name'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="room_name"
                                        name="room_name"
                                        defaultValue={room?.name || ""}
                                        placeholder="Room 101"
                                        required
                                        className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                            validationErrors.room_name 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-indigo-200 focus:border-indigo-400 bg-indigo-50/30'
                                        }`}
                                    />
                                    {validationErrors.room_name && (
                                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.room_name}</p>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100 space-y-2">
                                    <Label htmlFor="room_status" className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                                        <span className="text-xs">🔄</span>
                                        {language === 'vi' ? 'Trạng thái phòng' : 'Room Status'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={roomStatus} onValueChange={setRoomStatus}>
                                        <SelectTrigger className="rounded-lg border-2 border-emerald-200 focus:border-emerald-400 bg-emerald-50/30 font-medium text-sm">
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
                                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.room_status}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Type and Address Section */}
                        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                <h4 className="font-bold text-base text-gray-900">
                                    {language === 'vi' ? 'Loại phòng & Địa chỉ' : 'Room Type & Address'}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100 space-y-2">
                                    <Label htmlFor="room_type" className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                                        <span className="text-xs">🛋️</span>
                                        {language === 'vi' ? 'Loại phòng' : 'Room Type'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Select name="room_type" value={roomType} onValueChange={setRoomType}>
                                        <SelectTrigger className="rounded-lg border-2 border-blue-200 focus:border-blue-400 bg-blue-50/30 font-medium text-sm">
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
                                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.room_type}</p>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100 space-y-2">
                                    <Label htmlFor="address" className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                                        <span className="text-xs">📍</span>
                                        {language === 'vi' ? 'Địa chỉ' : 'Address'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        defaultValue={room?.address || ""}
                                        placeholder={language === 'vi' ? 'Nhập địa chỉ ở đây!' : 'Enter address here!'}
                                        required
                                        className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                            validationErrors.address 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-amber-200 focus:border-amber-400 bg-amber-50/30'
                                        }`}
                                    />
                                    {validationErrors.address && (
                                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.address}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dimensions Section */}
                        <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                <h4 className="font-bold text-base text-gray-900">
                                    {language === 'vi' ? 'Kích thước phòng' : 'Room Dimensions'}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100 space-y-2">
                                    <Label htmlFor="length" className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                                        <span className="text-xs">📐</span>
                                        {language === 'vi' ? 'Chiều dài (m)' : 'Length (m)'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="length"
                                        name="length"
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        max="1000"
                                        defaultValue={room?.height?.toString() || ""}
                                        placeholder={language === 'vi' ? 'Nhập chiều dài ở đây!' : 'Enter length here!'}
                                        required
                                        className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                            validationErrors.length 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-purple-200 focus:border-purple-400 bg-purple-50/30'
                                        }`}
                                    />
                                    {validationErrors.length && (
                                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.length}</p>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-100 space-y-2">
                                    <Label htmlFor="width" className="text-sm font-semibold text-cyan-700 flex items-center gap-2">
                                        <span className="text-xs">📏</span>
                                        {language === 'vi' ? 'Chiều rộng (m)' : 'Width (m)'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="width"
                                        name="width"
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        max="1000"
                                        defaultValue={room?.width?.toString() || ""}
                                        placeholder={language === 'vi' ? 'Nhập chiều rộng ở đây!' : 'Enter width here!'}
                                        required
                                        className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                            validationErrors.width 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-cyan-200 focus:border-cyan-400 bg-cyan-50/30'
                                        }`}
                                    />
                                    {validationErrors.width && (
                                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.width}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                                <h4 className="font-bold text-base text-gray-900">
                                    {language === 'vi' ? 'Giá thuê' : 'Rental Pricing'}
                                </h4>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100 space-y-2 max-w-md">
                                <Label htmlFor="rent_price" className="text-sm font-semibold text-green-700 flex items-center gap-2">
                                    <span className="text-xs">💰</span>
                                    {language === 'vi' ? 'Giá thuê (VND)' : 'Rent Price (VND)'} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="rent_price"
                                    name="rent_price"
                                    type="number"
                                    step="1000"
                                    min="0"
                                    max="9999999"
                                    defaultValue={room?.baseRent?.toString() || ""}
                                    placeholder={language === 'vi' ? 'Nhập giá thuê ở đây!' : 'Enter rent price here!'}
                                    required
                                    className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm ${
                                        validationErrors.rent_price 
                                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                            : 'border-green-200 focus:border-green-400 bg-green-50/30'
                                    }`}
                                />
                                {validationErrors.rent_price && (
                                    <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{validationErrors.rent_price}</p>
                                )}
                            </div>
                        </div>

                        {/* Maximum Tenants Section */}
                        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                <h4 className="font-bold text-base text-gray-900">
                                    {language === 'vi' ? 'Số lượng khách thuê tối đa' : 'Maximum Tenants'}
                                </h4>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 space-y-2 max-w-md">
                                <Label htmlFor="max_tenants" className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                                    <span className="text-xs">👥</span>
                                    {language === 'vi' ? 'Số người tối đa' : 'Maximum People'} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="max_tenants"
                                    name="max_tenants"
                                    type="number"
                                    min="1"
                                    max="10"
                                    defaultValue={room?.maxTenants?.toString() || "4"}
                                    placeholder={language === 'vi' ? 'Số người tối đa có thể ở' : 'Maximum number of people'}
                                    required
                                    className={`rounded-lg border-2 font-medium transition-all duration-200 text-sm border-blue-200 focus:border-blue-400 bg-blue-50/30`}
                                />
                                <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                                    {language === 'vi' 
                                        ? 'Số lượng khách thuê tối đa có thể ở trong phòng này (1-10 người)'
                                        : 'Maximum number of tenants allowed in this room (1-10 people)'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Room Items Section */}
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-slate-500 to-gray-500"></div>
                                <h4 className="font-bold text-base text-gray-900">
                                    {language === 'vi' ? 'Nội thất phòng' : 'Room Items'}
                                    {roomType === 'Phòng trống' && (
                                        <span className="ml-2 text-sm text-gray-500 font-normal">
                                            ({language === 'vi' ? 'Không có nội thất cho phòng trống' : 'No furniture for empty rooms'})
                                        </span>
                                    )}
                                </h4>
                            </div>
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-100">
                                <ListOfRoomItems room={room} disabled={roomType === 'Phòng trống'} />
                            </div>
                        </div>

                        {/* Manager Information Section */}
                        <div className="bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"></div>
                                <h4 className="font-bold text-base text-gray-900">
                                    {language === 'vi' ? 'Thông tin quản lý' : 'Manager Information'}
                                </h4>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-100">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-teal-600 font-medium">
                                                {language === 'vi' ? 'Người quản lý hiện tại:' : 'Current Manager:'}
                                            </span>
                                            <span className="text-teal-800 font-bold">
                                                {taikhoan?.taiKhoan?.hoTen || 'Unknown Manager'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-teal-600 font-medium">
                                                {language === 'vi' ? 'Mã quản lý:' : 'Manager ID:'}
                                            </span>
                                            <span className="text-teal-800 font-bold">
                                                {taikhoan?.taiKhoan?.maTaiKhoan || 'N/A'}
                                            </span>
                                        </div>
                                        {isEditMode && room?.managerId && (
                                            <div className="pt-2 border-t border-teal-200">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-teal-600 font-medium">
                                                        {language === 'vi' ? 'Quản lý gốc:' : 'Original Manager:'}
                                                    </span>
                                                    <span className="text-teal-700">
                                                        {room.managerName || `Manager #${room.managerId}`}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                                    <p className="text-xs text-blue-700">
                                        <strong>{language === 'vi' ? 'Lưu ý:' : 'Note:'}</strong> 
                                        {language === 'vi' 
                                            ? ' Phòng sẽ được gán cho người quản lý hiện tại.' 
                                            : ' Room will be assigned to the current manager.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-3 pt-4 border-t border-gray-100">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="rounded-lg px-4 py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-medium transition-all duration-200 text-sm">
                                {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </Button>
                        </DialogClose>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="rounded-lg px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium shadow-lg shadow-indigo-200 transition-all duration-200 min-w-24 disabled:opacity-50 text-sm"
                        >
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
