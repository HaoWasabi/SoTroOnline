interface Invoice {
    invoice_id: string,
    tenalt_name: string,
    room_name: string,
    room_cost: number,
    total_cost: number,
    deposited_amount: number,
    amount_owed: number,
    payment_date: string,
    start_date: string,
    expired_at: string,
    status: 'Paid' | 'Overdue' | 'Pending'
}