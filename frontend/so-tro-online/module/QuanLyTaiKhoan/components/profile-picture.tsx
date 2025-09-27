"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { vi } from "date-fns/locale";
import { User } from "lucide-react";

export default function ProfilePictureComponent({profile}: {profile: Profile}) {

    const {language} = useLanguageStore();

    return (
        <Card>
            <CardHeader>
              <CardTitle className="text-lg">{language === 'vi' ? "Anh nền" : "Profile Picture"}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <div className="relative mx-auto">
                    <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                    <User className="h-16 w-16 text-blue-600" />
                    </div>
                    {/* {isEditing && (
                    <Button 
                        size="sm" 
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                    >
                        <Camera className="h-4 w-4" />
                    </Button>
                    )} */}
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{profile.name}</h3>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
            </CardContent>
        </Card>
    )
}