import InvoiceCard from "@/module/QuanLyHoaDon/components/invoice-card";


const invoices: Invoice[] = [
  {
    invoice_id: "INV-202509-001",
    tenalt_name: "Tran Van A",
    room_name: "Room 101",
    room_cost: 4500000,
    total_cost: 5000000,
    deposited_amount: 2000000,
    amount_owed: 3000000,
    payment_date: "2025-09-10",
    start_date: "2025-09-01",
    expired_at: "2025-09-30",
    status: "Pending",
  },
  {
    invoice_id: "INV-202509-002",
    tenalt_name: "Nguyen Thi B",
    room_name: "Room 202",
    room_cost: 5200000,
    total_cost: 5500000,
    deposited_amount: 5500000,
    amount_owed: 0,
    payment_date: "2025-09-05",
    start_date: "2025-09-01",
    expired_at: "2025-09-30",
    status: "Paid",
  },
  {
    invoice_id: "INV-202509-003",
    tenalt_name: "Pham Van C",
    room_name: "Room 303",
    room_cost: 4800000,
    total_cost: 5000000,
    deposited_amount: 0,
    amount_owed: 5000000,
    payment_date: "",
    start_date: "2025-08-01",
    expired_at: "2025-08-31",
    status: "Overdue",
  },
  {
    invoice_id: "INV-202509-004",
    tenalt_name: "Le Thi D",
    room_name: "Room 105",
    room_cost: 4600000,
    total_cost: 4800000,
    deposited_amount: 2500000,
    amount_owed: 2300000,
    payment_date: "2025-09-12",
    start_date: "2025-09-01",
    expired_at: "2025-09-30",
    status: "Pending",
  },
  {
    invoice_id: "INV-202509-005",
    tenalt_name: "Hoang Van E",
    room_name: "Room 401",
    room_cost: 6000000,
    total_cost: 6200000,
    deposited_amount: 6200000,
    amount_owed: 0,
    payment_date: "2025-09-03",
    start_date: "2025-09-01",
    expired_at: "2025-09-30",
    status: "Paid",
  },
];

export default function GridOfContractCard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoices.map(invoice => (
                <InvoiceCard key={invoice.invoice_id} invoice={invoice} />
            ))}
        </div>
    )
}