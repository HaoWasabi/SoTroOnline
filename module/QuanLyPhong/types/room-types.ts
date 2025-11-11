// Frontend Room interface for compatibility with existing components
export interface Room {
  room_id: number;
  name: string;
  typeOfRoom: string;
  address: string;
  width: number;
  height: number;
  furnitures: string[];
  baseRent: number;
  roomStatus: string;
  managerId: number;
  managerName: string;
  status: string;
}

// Backend Room response interface  
export interface RoomResponse {
  maPhong: number;
  hoTenQuanLy: string;
  maQuanLy: number;
  tenPhong: string;
  loaiPhong: string;
  diaChi: string;
  chieuDai: number;
  chieuRong: number;
  vatDung: string;
  giaThueCoBan: number;
  trangThai: string;
}

// Convert backend response to frontend interface
export const mapRoomResponseToRoom = (roomResponse: RoomResponse): Room => {
  return {
    room_id: roomResponse.maPhong,
    name: roomResponse.tenPhong,
    typeOfRoom: roomResponse.loaiPhong,
    address: roomResponse.diaChi,
    width: roomResponse.chieuDai,
    height: roomResponse.chieuRong,
    furnitures: roomResponse.vatDung ? roomResponse.vatDung.split(', ') : [],
    baseRent: roomResponse.giaThueCoBan,
    roomStatus: roomResponse.trangThai, // Use the backend status directly
    managerId: roomResponse.maQuanLy,
    managerName: roomResponse.hoTenQuanLy,
    status: roomResponse.trangThai, // Keep the raw status as well
  };
};

// Pagination interfaces
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}