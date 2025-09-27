interface Contract {
    contract_id: string,
    manager_name: string,
    room_name: string,
    contract_tenant: string,
    base_rent: string,
    start_date: string,
    end_date: string,
    status: 'Active' | 'Pending' | 'Expired'
}