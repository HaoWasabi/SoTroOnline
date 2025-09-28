"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { AlertCircle, Calendar, DollarSign, Download, Edit, Eye, MoreHorizontal, Receipt } from "lucide-react";
import { useCallback } from "react";


export default function InvoiceCard({invoice}: {invoice: Invoice}) {

    const {language} = useLanguageStore();

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'Paid':
                return 'default';
            case 'Pending':
                return 'secondary';
            case 'Overdue':
                return 'destructive';
            default:
                return 'outline';
        }
    }, [])

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                                invoice.status === 'Paid' ? 'bg-green-50' :
                                invoice.status === 'Overdue' ? 'bg-red-50' : 'bg-blue-50'
                            }`}>
                                {/* {invoice.status === 'Overdue' && (
                                    <AlertCircle className={`h-6 w-6 ${
                                        invoice.status === 'Paid' ? 'text-green-600' :
                                        invoice.status === 'Overdue' ? 'text-red-600' : 'text-blue-600'
                                    }`} />
                                ) : (
                                    <Receipt className={`h-6 w-6 ${
                                    invoice.status === 'Paid' ? 'text-green-600' :
                                    invoice.status === 'Overdue' ? 'text-red-600' : 'text-blue-600'
                                    }`} />
                                )} */}
                                {
                                    invoice.status === 'Paid' ? <Receipt className="w-6 h-6 text-green-600" /> :
                                    invoice.status === 'Overdue' ? <AlertCircle className="w-6 h-6 text-red-600" /> : <AlertCircle className="w-6 h-6 text-blue-600" />
                                }
                                
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {invoice.total_cost}
                                </h3>
                                <p className="text-gray-600">{invoice.tenalt_name} • {invoice.room_name}</p>
                            </div>
                            <Badge variant={getStatusColor(invoice.status)} className={invoice.status === 'Paid' ? 'bg-green-500' : ''}>
                                {
                                    language === 'vi' ? (
                                        invoice.status === 'Paid' ? "Đã thanh toán" :
                                        invoice.status === 'Overdue' ? "Qúa hạn" : "Đang chờ"
                                    ) : invoice.status
                                }
                            </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex flex-col">
                                <span className="text-gray-500">
                                    {language === 'vi' ? 'Tổng tiền': 'Amount'}
                                </span>
                                <div className="flex items-center gap-1 mt-1">
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-lg">{invoice.total_cost}</span>
                                </div>
                            </div>
                            {/* <div>
                                <span className="text-gray-500">Type</span>
                                <div className="mt-1">
                                    <span className="font-medium">{invoice.type}</span>
                                </div>
                            </div> */}
                            <div className="">
                                <span className="text-gray-500">
                                    {language === 'vi' ? 'Ngày bắt đầu': 'Start Date'}
                                </span>
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{invoice.start_date}</span>
                                </div>
                            </div>
                            <div className="">
                                <span className="text-gray-500">
                                    {language === 'vi' ? 'Ngày đến hạn': 'End Date'}
                                </span>
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className={`font-medium ${
                                        invoice.status === 'Overdue' ? 'text-red-600' : ''
                                    }`}>
                                    {invoice.expired_at}
                                    </span>
                                </div>
                            </div>
                            <div className="">
                                <span className="text-gray-500">
                                    {language === 'vi' ? 'Ngày thanh toán': 'Payment Date'}
                                </span>
                                <div className="mt-1">
                                    <span className="font-medium">
                                        {invoice.payment_date ? invoice.payment_date : 'Not paid'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                {language === 'vi' ? 'Hành động': 'Actions'}
                            </DropdownMenuLabel>
                            <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                                {language === 'vi' ? 'Xem hóa đơn': 'View Invoice'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                                {language === 'vi' ? 'Chỉnh sửa hóa đơn': 'Edit Invoice'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                                {language === 'vi' ? 'Tải file PDF': 'Download PDF'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                            Mark as Paid
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}