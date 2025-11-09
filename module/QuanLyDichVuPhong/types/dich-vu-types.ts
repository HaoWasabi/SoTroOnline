export interface RoomService {
    service_code: string;
    manager_name: string;
    service_name: string;
    base_cost: number;
    description: string;
    status: string;
}

export interface DichVuResponse {
    maDichVu: number;
    donGiaDien: number;
    donGiaNuoc: number;
    donGiaRac: number;
}

export interface DichVuRequest {
    donGiaDien: number;
    donGiaNuoc: number;
    donGiaRac: number;
}