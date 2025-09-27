"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ProfileInformationForm({profile}: {profile: Profile}) {

    const {language} = useLanguageStore()

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    {language === 'vi' ? "Thông tin cá nhân" : "Personal Information"}
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder={profile.name}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            placeholder={profile.email}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="firstName">Address</Label>
                    <Input
                        id="address"
                        type="text"
                        placeholder={profile.address}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="phone"
                            className="pl-10"
                            placeholder={profile.phone}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                        <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea
                            id="address"
                            className="pl-10"
                            placeholder={profile.address}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}