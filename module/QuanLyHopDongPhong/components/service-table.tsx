"use client"

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguageStore } from "@/zustand/language-tranlator"

export default function ServiceTable() {

    const {language} = useLanguageStore()

    return (
        <Table>
            <TableCaption></TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">
                    {language === 'vi' ? 'Mã dịch vụ' : 'Service ID'}
                </TableHead>
                <TableHead>
                    {language === 'vi' ? 'Tên dịch vụ' : 'Service Name'}
                </TableHead>
                <TableHead>
                    {language === 'vi' ? 'Đơn vị tính' : 'Unit'}
                </TableHead>
                <TableHead className="text-right">
                    {language === 'vi' ? 'Giá dịch vụ' : 'Service Price'}
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {/* {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">{invoice.invoice}</TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                </TableRow>
                ))} */}
            </TableBody>
            <TableFooter>
                {/* <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow> */}
            </TableFooter>
        </Table>
    )
}