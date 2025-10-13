
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
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Plus } from "lucide-react"

export function TenantFormAsDialog() {

    const {language} = useLanguageStore()

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'vi' ? 'Thêm khách thuê' : 'Add Tenant'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:min-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>
                            {language === 'vi' ? 'Thêm khách thuê mới' : 'Add New Tenant'}
                        </DialogTitle>
                        <DialogDescription>
                            {language === 'vi' ? 'Điền thông tin khách thuê của bạn vào biểu mẫu bên dưới.' : 'Fill out the form below with your tenant information.'}
                        </DialogDescription>
                    </DialogHeader>
                <div className="grid gap-4">
                    <form>
                    <CardContent className="space-y-4">
                        <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                            <Label htmlFor="name">
                                {language === 'vi' ? 'Tên' : 'Name'}
                            </Label>
                            <Input
                                //ref={userNameRef}
                                id="name"
                                placeholder="John"
                                required
                            />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    //ref={emailRef}
                                    id="email"
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    required
                                />
                        </div>
                        </div>

                        <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="cccd">Cccd</Label>
                                <Input
                                    //ref={cccdRef}
                                    id="cccd"
                                    type="text"
                                    placeholder={ language === 'vi' ? 'Nhập số căn cước công dân ở đây!' : 'Enter cccd code here!'}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    { language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                                </Label>
                                <Input
                                    //ref={phoneRef}
                                    id="phone"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-0 sm:grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="address">
                                    { language === 'vi' ? 'Địa chỉ' : 'Address'}
                                </Label>
                                <Input
                                    //ref={addressRef}
                                    id="address"
                                    type="text"
                                    placeholder={ language === 'vi' ? '123 An Duong Vuong' : '123 No Street'}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">
                                    { language === 'vi' ? 'Ngày sinh' : 'Date of birth'}
                                </Label>
                                <Input
                                    //ref={dateOfBirthRef}
                                    id="dateOfBirth"
                                    type="date"
                                    required
                                />
                            </div>
                        </div>
                
                    </CardContent>
                    
                </form>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
