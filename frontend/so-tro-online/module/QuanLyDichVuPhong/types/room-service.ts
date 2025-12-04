interface RoomService {
    service_code: string,
    manager_name: string,
    service_name: string,
    base_cost: number,
    description: string,
    status: 'Active' | 'Maintenance'
}