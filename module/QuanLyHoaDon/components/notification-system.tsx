import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
    Bell, 
    Send, 
    Mail, 
    MessageSquare, 
    Phone,
    AlertTriangle,
    CheckCircle,
    Clock,
    User,
    Calendar,
    DollarSign,
    Settings,
    History
} from "lucide-react"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { useToast } from "@/hook/useToast"
import { getAllActiveInvoices } from "../api/api-quan-ly-hoa-don"
import type { Invoice } from "../types/invoice"

interface NotificationTemplate {
    id: string
    name: string
    type: 'email' | 'sms' | 'in-app'
    subject: string
    content: string
    variables: string[]
}

interface NotificationRecipient {
    maHoaDon: number
    tenKhachThue: string
    email?: string
    dienThoai?: string
    tienConNo: number
    monthsOverdue: number
    selected: boolean
}

interface NotificationHistory {
    id: string
    timestamp: Date
    type: 'email' | 'sms' | 'in-app'
    recipients: number
    template: string
    status: 'sent' | 'failed' | 'pending'
}

export default function NotificationSystem() {
    const { language } = useLanguageStore()
    const { showSuccess, showError } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("send")
    const [isLoading, setIsLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    
    // Notification data
    const [recipients, setRecipients] = useState<NotificationRecipient[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<string>("")
    const [customMessage, setCustomMessage] = useState("")
    const [notificationType, setNotificationType] = useState<'email' | 'sms' | 'in-app'>('email')
    const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([])
    
    // Template management
    const [templates, setTemplates] = useState<NotificationTemplate[]>([])
    const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
    const [newTemplate, setNewTemplate] = useState<Partial<NotificationTemplate>>({})

    // Default templates
    const defaultTemplates: NotificationTemplate[] = [
        {
            id: "overdue_reminder",
            name: language === "vi" ? "Nhắc nhở thanh toán quá hạn" : "Overdue Payment Reminder",
            type: "email",
            subject: language === "vi" ? "Nhắc nhở thanh toán hóa đơn quá hạn - {tenPhong}" : "Overdue Payment Reminder - {tenPhong}",
            content: language === "vi" 
                ? `Kính gửi {tenKhachThue},\n\nChúng tôi nhận thấy hóa đơn #{maHoaDon} của quý khách đã quá hạn thanh toán {monthsOverdue} tháng.\n\nSố tiền cần thanh toán: {tienConNo} VNĐ\nKỳ thanh toán: {thang}/{nam}\n\nVui lòng liên hệ để thanh toán trong thời gian sớm nhất.\n\nTrân trọng,\nBan quản lý`
                : `Dear {tenKhachThue},\n\nWe notice that your invoice #{maHoaDon} is {monthsOverdue} months overdue.\n\nAmount due: {tienConNo} VND\nPeriod: {thang}/{nam}\n\nPlease contact us for payment as soon as possible.\n\nBest regards,\nManagement Team`,
            variables: ["tenKhachThue", "maHoaDon", "monthsOverdue", "tienConNo", "thang", "nam", "tenPhong"]
        },
        {
            id: "payment_due",
            name: language === "vi" ? "Thông báo đến hạn thanh toán" : "Payment Due Notice",
            type: "sms",
            subject: "",
            content: language === "vi"
                ? "TB: Hóa đơn #{maHoaDon} sẽ đến hạn thanh toán. Số tiền: {tienConNo}đ. Vui lòng thanh toán để tránh phụ phí."
                : "Notice: Invoice #{maHoaDon} payment is due. Amount: {tienConNo}đ. Please pay to avoid late fees.",
            variables: ["maHoaDon", "tienConNo"]
        },
        {
            id: "payment_received",
            name: language === "vi" ? "Xác nhận đã nhận thanh toán" : "Payment Received Confirmation",
            type: "email",
            subject: language === "vi" ? "Xác nhận thanh toán hóa đơn #{maHoaDon}" : "Payment Confirmation for Invoice #{maHoaDon}",
            content: language === "vi"
                ? `Kính gửi {tenKhachThue},\n\nChúng tôi xác nhận đã nhận được thanh toán cho hóa đơn #{maHoaDon}.\n\nSố tiền đã thanh toán: {soTienThu} VNĐ\nNgày thanh toán: {ngayThu}\n\nCảm ơn quý khách đã thanh toán đúng hạn.\n\nTrân trọng,\nBan quản lý`
                : `Dear {tenKhachThue},\n\nWe confirm receipt of payment for invoice #{maHoaDon}.\n\nAmount paid: {soTienThu} VND\nPayment date: {ngayThu}\n\nThank you for your timely payment.\n\nBest regards,\nManagement Team`,
            variables: ["tenKhachThue", "maHoaDon", "soTienThu", "ngayThu"]
        }
    ]

    useEffect(() => {
        setTemplates(defaultTemplates)
    }, [language])

    const loadOverdueInvoices = async () => {
        setIsLoading(true)
        try {
            const result = await getAllActiveInvoices()
            if (result.status === "success" && result.data) {
                const currentDate = new Date()
                const currentMonth = currentDate.getMonth() + 1
                const currentYear = currentDate.getFullYear()
                
                const overdueRecipients: NotificationRecipient[] = result.data
                    .filter(invoice => 
                        (invoice.trangThai === "CON_NO" || invoice.trangThai === "quaHan") && 
                        invoice.tienConNo > 0
                    )
                    .map(invoice => {
                        const monthsDiff = (currentYear - invoice.nam) * 12 + (currentMonth - invoice.thang)
                        return {
                            maHoaDon: invoice.maHoaDon,
                            tenKhachThue: invoice.tenKhachThue || "Unknown Tenant",
                            email: "", // Would need to fetch from tenant data
                            dienThoai: "", // Would need to fetch from tenant data
                            tienConNo: invoice.tienConNo,
                            monthsOverdue: Math.max(0, monthsDiff),
                            selected: monthsDiff > 0 // Auto-select overdue ones
                        }
                    })
                
                setRecipients(overdueRecipients)
            } else {
                showError(result.message || (language === "vi" ? "Không thể tải danh sách hóa đơn" : "Failed to load invoices"))
            }
        } catch (error) {
            showError(language === "vi" ? "Lỗi khi tải dữ liệu" : "Error loading data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen && activeTab === "send") {
            loadOverdueInvoices()
        }
    }, [isOpen, activeTab])

    const handleToggleRecipient = (maHoaDon: number) => {
        setRecipients(prev => 
            prev.map(r => 
                r.maHoaDon === maHoaDon 
                    ? { ...r, selected: !r.selected }
                    : r
            )
        )
    }

    const handleToggleAll = () => {
        const allSelected = recipients.every(r => r.selected)
        setRecipients(prev => 
            prev.map(r => ({ ...r, selected: !allSelected }))
        )
    }

    const handleSendNotifications = async () => {
        const selectedRecipients = recipients.filter(r => r.selected)
        if (selectedRecipients.length === 0) {
            showError(language === "vi" ? "Vui lòng chọn ít nhất một người nhận" : "Please select at least one recipient")
            return
        }

        if (!selectedTemplate && !customMessage.trim()) {
            showError(language === "vi" ? "Vui lòng chọn mẫu tin nhắn hoặc nhập nội dung tùy chỉnh" : "Please select a template or enter custom message")
            return
        }

        setIsSending(true)
        
        try {
            // Simulate API call for sending notifications
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            const newHistoryItem: NotificationHistory = {
                id: Date.now().toString(),
                timestamp: new Date(),
                type: notificationType,
                recipients: selectedRecipients.length,
                template: selectedTemplate || "Custom Message",
                status: "sent"
            }
            
            setNotificationHistory(prev => [newHistoryItem, ...prev])
            
            showSuccess(
                language === "vi" 
                    ? `Đã gửi thông báo cho ${selectedRecipients.length} người nhận`
                    : `Sent notifications to ${selectedRecipients.length} recipients`
            )
            
            // Reset form
            setCustomMessage("")
            setSelectedTemplate("")
            setRecipients(prev => prev.map(r => ({ ...r, selected: false })))
            
        } catch (error) {
            showError(language === "vi" ? "Lỗi khi gửi thông báo" : "Error sending notifications")
        } finally {
            setIsSending(false)
        }
    }

    const handleCreateTemplate = () => {
        if (!newTemplate.name?.trim() || !newTemplate.content?.trim()) {
            showError(language === "vi" ? "Vui lòng điền tên và nội dung mẫu" : "Please fill template name and content")
            return
        }

        const template: NotificationTemplate = {
            id: Date.now().toString(),
            name: newTemplate.name,
            type: newTemplate.type || 'email',
            subject: newTemplate.subject || '',
            content: newTemplate.content,
            variables: []
        }

        setTemplates(prev => [...prev, template])
        setNewTemplate({})
        setIsCreatingTemplate(false)
        
        showSuccess(language === "vi" ? "Đã tạo mẫu tin nhắn mới" : "Template created successfully")
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'email':
                return <Mail className="h-4 w-4" />
            case 'sms':
                return <MessageSquare className="h-4 w-4" />
            case 'in-app':
                return <Bell className="h-4 w-4" />
            default:
                return <Bell className="h-4 w-4" />
        }
    }

    const getUrgencyColor = (monthsOverdue: number) => {
        if (monthsOverdue > 3) return "bg-red-100 text-red-700"
        if (monthsOverdue > 1) return "bg-orange-100 text-orange-700"
        if (monthsOverdue > 0) return "bg-yellow-100 text-yellow-700"
        return "bg-blue-100 text-blue-700"
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-medium transition-all duration-200 rounded-xl">
                    <Bell className="h-4 w-4 mr-2" />
                    {language === "vi" ? "Gửi thông báo" : "Send Notifications"}
                </Button>
            </DialogTrigger>

            <DialogContent className="min-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        {language === "vi" ? "Hệ thống thông báo" : "Notification System"}
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="send">{language === "vi" ? "Gửi thông báo" : "Send Notifications"}</TabsTrigger>
                        <TabsTrigger value="templates">{language === "vi" ? "Quản lý mẫu" : "Manage Templates"}</TabsTrigger>
                        <TabsTrigger value="history">{language === "vi" ? "Lịch sử" : "History"}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="send" className="space-y-6">
                        {/* Notification Type Selection */}
                        <div className="flex items-center gap-4">
                            <Label className="font-semibold">{language === "vi" ? "Loại thông báo:" : "Notification Type:"}</Label>
                            <div className="flex gap-2">
                                {[
                                    { value: 'email', label: 'Email', icon: Mail },
                                    { value: 'sms', label: 'SMS', icon: MessageSquare },
                                    { value: 'in-app', label: language === "vi" ? "Ứng dụng" : "In-App", icon: Bell }
                                ].map(type => (
                                    <Button
                                        key={type.value}
                                        variant={notificationType === type.value ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setNotificationType(type.value as any)}
                                        className="flex items-center gap-2"
                                    >
                                        <type.icon className="h-4 w-4" />
                                        {type.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recipients Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            {language === "vi" ? "Người nhận" : "Recipients"}
                                        </span>
                                        <Badge variant="secondary">
                                            {recipients.filter(r => r.selected).length}/{recipients.length}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {isLoading ? (
                                        <div className="text-center py-8 text-gray-600">
                                            {language === "vi" ? "Đang tải..." : "Loading..."}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <Checkbox 
                                                    checked={recipients.length > 0 && recipients.every(r => r.selected)}
                                                    onCheckedChange={handleToggleAll}
                                                />
                                                <label className="text-sm font-medium">
                                                    {language === "vi" ? "Chọn tất cả" : "Select All"}
                                                </label>
                                            </div>

                                            <div className="max-h-64 overflow-y-auto space-y-2">
                                                {recipients.map((recipient) => (
                                                    <div key={recipient.maHoaDon} className="flex items-center gap-3 p-3 border rounded-lg">
                                                        <Checkbox
                                                            checked={recipient.selected}
                                                            onCheckedChange={() => handleToggleRecipient(recipient.maHoaDon)}
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium">{recipient.tenKhachThue}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {language === "vi" ? "HĐ:" : "Invoice:"} #{recipient.maHoaDon} • 
                                                                {recipient.tienConNo.toLocaleString("vi-VN")}₫
                                                            </p>
                                                        </div>
                                                        <Badge className={getUrgencyColor(recipient.monthsOverdue)}>
                                                            {recipient.monthsOverdue} {language === "vi" ? "tháng" : "months"}
                                                        </Badge>
                                                    </div>
                                                ))}
                                                
                                                {recipients.length === 0 && (
                                                    <div className="text-center py-8 text-gray-600">
                                                        {language === "vi" ? "Không có hóa đơn quá hạn" : "No overdue invoices"}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Message Content */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        {language === "vi" ? "Nội dung tin nhắn" : "Message Content"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>{language === "vi" ? "Chọn mẫu có sẵn:" : "Select Template:"}</Label>
                                        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={language === "vi" ? "Chọn mẫu tin nhắn..." : "Select a template..."} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {templates.filter(t => t.type === notificationType).map(template => (
                                                    <SelectItem key={template.id} value={template.id}>
                                                        {template.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="text-center text-gray-500">
                                        {language === "vi" ? "hoặc" : "or"}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>{language === "vi" ? "Tin nhắn tùy chỉnh:" : "Custom Message:"}</Label>
                                        <Textarea
                                            value={customMessage}
                                            onChange={(e) => setCustomMessage(e.target.value)}
                                            placeholder={language === "vi" ? "Nhập nội dung tin nhắn..." : "Enter your message..."}
                                            rows={6}
                                        />
                                    </div>

                                    {selectedTemplate && (
                                        <div className="p-3 bg-gray-50 rounded border">
                                            <p className="text-sm font-medium mb-2">
                                                {language === "vi" ? "Xem trước:" : "Preview:"}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {templates.find(t => t.id === selectedTemplate)?.content}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Send Button */}
                        <div className="flex justify-end">
                            <Button 
                                onClick={handleSendNotifications}
                                disabled={isSending || recipients.filter(r => r.selected).length === 0}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {isSending ? (
                                    <>
                                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                                        {language === "vi" ? "Đang gửi..." : "Sending..."}
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        {language === "vi" ? "Gửi thông báo" : "Send Notifications"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="templates" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{language === "vi" ? "Mẫu tin nhắn" : "Message Templates"}</h3>
                            <Button onClick={() => setIsCreatingTemplate(true)}>
                                {language === "vi" ? "Tạo mẫu mới" : "Create New Template"}
                            </Button>
                        </div>

                        {isCreatingTemplate && (
                            <Card className="bg-blue-50 border-blue-200">
                                <CardHeader>
                                    <CardTitle>{language === "vi" ? "Tạo mẫu tin nhắn mới" : "Create New Template"}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>{language === "vi" ? "Tên mẫu:" : "Template Name:"}</Label>
                                            <Input
                                                value={newTemplate.name || ""}
                                                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{language === "vi" ? "Loại:" : "Type:"}</Label>
                                            <Select 
                                                value={newTemplate.type || "email"} 
                                                onValueChange={(value) => setNewTemplate(prev => ({ ...prev, type: value as any }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="email">Email</SelectItem>
                                                    <SelectItem value="sms">SMS</SelectItem>
                                                    <SelectItem value="in-app">In-App</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    {newTemplate.type !== 'sms' && (
                                        <div className="space-y-2">
                                            <Label>{language === "vi" ? "Tiêu đề:" : "Subject:"}</Label>
                                            <Input
                                                value={newTemplate.subject || ""}
                                                onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="space-y-2">
                                        <Label>{language === "vi" ? "Nội dung:" : "Content:"}</Label>
                                        <Textarea
                                            value={newTemplate.content || ""}
                                            onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                                            rows={4}
                                        />
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button onClick={handleCreateTemplate}>
                                            {language === "vi" ? "Lưu mẫu" : "Save Template"}
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsCreatingTemplate(false)}>
                                            {language === "vi" ? "Hủy" : "Cancel"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-3">
                            {templates.map((template) => (
                                <Card key={template.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {getNotificationIcon(template.type)}
                                                    <h4 className="font-semibold">{template.name}</h4>
                                                    <Badge variant="secondary">{template.type}</Badge>
                                                </div>
                                                {template.subject && (
                                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                                        {language === "vi" ? "Tiêu đề:" : "Subject:"} {template.subject}
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-600">{template.content.substring(0, 150)}...</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        <h3 className="text-lg font-semibold">{language === "vi" ? "Lịch sử gửi thông báo" : "Notification History"}</h3>
                        
                        <div className="space-y-3">
                            {notificationHistory.length === 0 ? (
                                <Card className="bg-gray-50">
                                    <CardContent className="p-8 text-center text-gray-600">
                                        <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p>{language === "vi" ? "Chưa có lịch sử gửi thông báo" : "No notification history yet"}</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                notificationHistory.map((item) => (
                                    <Card key={item.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {getNotificationIcon(item.type)}
                                                    <div>
                                                        <p className="font-medium">{item.template}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {item.timestamp.toLocaleString()} • {item.recipients} {language === "vi" ? "người nhận" : "recipients"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className={
                                                    item.status === 'sent' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }>
                                                    {item.status === 'sent' ? (language === "vi" ? "Đã gửi" : "Sent") :
                                                     item.status === 'failed' ? (language === "vi" ? "Thất bại" : "Failed") :
                                                     (language === "vi" ? "Đang gửi" : "Pending")}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end pt-4 border-t">
                    <Button onClick={() => setIsOpen(false)}>
                        {language === "vi" ? "Đóng" : "Close"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}