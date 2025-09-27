"use client"

import { Building2 } from "lucide-react";
import SignUpForm from "./signup-form";

export default function SignUpPageLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col items-center">
            <div className="text-center mb-4">
                <div className="flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">SoTroOnline</h1>
            </div>
            <SignUpForm />
        </div>
    )
}