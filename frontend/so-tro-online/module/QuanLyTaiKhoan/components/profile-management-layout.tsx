"use client"

import { Button } from "@/components/ui/button"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Edit, Key, Shield} from "lucide-react";
import ProfilePictureComponent from "./profile-picture";
import ProfileInformationForm from "./profile-information-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const profiles: Profile[] = [
  {
    cccd_code: "012345678901",
    email: "nguyenvana@example.com",
    name: "Nguyen Van A",
    phone: "0912345678",
    address: "12 Nguyen Trai, Ha Noi",
    dateOfBirth: "2000-05-15",
    status: "Active",
  },
  {
    cccd_code: "987654321098",
    email: "tranthib@example.com",
    name: "Tran Thi B",
    phone: "0987654321",
    address: "45 Le Loi, Da Nang",
    dateOfBirth: "1998-11-22",
    status: "Locked",
  },
  {
    cccd_code: "456789123456",
    email: "phamvanc@example.com",
    name: "Pham Van C",
    phone: "0905123456",
    address: "89 Tran Hung Dao, Ho Chi Minh City",
    dateOfBirth: "1995-02-10",
    status: "Active",
  },
  {
    cccd_code: "321654987321",
    email: "lethid@example.com",
    name: "Le Thi D",
    phone: "0933456789",
    address: "23 Nguyen Hue, Hue",
    dateOfBirth: "2002-07-09",
    status: "Active",
  },
  {
    cccd_code: "654321789654",
    email: "hoangvene@example.com",
    name: "Hoang Van E",
    phone: "0961234567",
    address: "77 Pham Van Dong, Hai Phong",
    dateOfBirth: "1999-12-30",
    status: "Locked",
  },
];


export default function ProfileManagementLayout() {

    const {language} = useLanguageStore();

    return (
      <main className="pt-8 px-4 lg:pl-70 flex flex-col gap-5">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {language === 'vi' ? 'Quản lý phòng' : 'Room Management'}
                </h1>
                <p className="text-gray-600">
                    {language === 'vi' ? 'Quản lý thông tin phòng' : 'Manage all your rooms and their availability'}
                </p>
            </div>
            <Button 
                variant="outline"
            >
                <Edit className="h-4 w-4 mr-2" />
                {language === 'vi' ? 'Chỉnh sửa' : 'Edit profile'}
            </Button>
        </div>
        <ProfilePictureComponent profile={profiles[0]}/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileInformationForm profile={profiles[0]} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
}