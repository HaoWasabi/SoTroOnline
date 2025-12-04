"use client"

import { useEffect, useState, useRef } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguageStore } from "@/zustand/language-tranlator"

type ServiceValues = {
    dvRac: boolean
    dvWifi: boolean
    dvCap: boolean
    dvKhac: boolean
}

interface ServiceTableProps {
    onChange?: (services: Record<string, boolean>) => void
    initialValues?: Partial<ServiceValues>
}

const SERVICE_DEFINITIONS: { key: keyof ServiceValues; id: string; labelVi: string; labelEn: string; unit?: string }[] = [
    { key: "dvRac", id: "S1", labelVi: "Rác", labelEn: "Trash"},
    { key: "dvWifi", id: "S2", labelVi: "Wifi", labelEn: "Wifi"},
    { key: "dvCap", id: "S3", labelVi: "Cáp", labelEn: "Cable"},
    { key: "dvKhac", id: "S4", labelVi: "Khác", labelEn: "Other"},
]

export default function ServiceTable({ onChange, initialValues }: ServiceTableProps) {
    const { language } = useLanguageStore()

    const [services, setServices] = useState<ServiceValues>({ dvRac: false, dvWifi: false, dvCap: false, dvKhac: false })

        // Prevent calling onChange while we're synchronizing initialValues to local state,
        // which would create an update loop when the parent also uses the same state object.
        const isSyncingRef = useRef(false)

        useEffect(() => {
            if (initialValues) {
                isSyncingRef.current = true
                setServices((prev) => ({ ...prev, ...initialValues }))
                // queue clearing the syncing flag after the next tick so the
                // subsequent services update does not trigger the onChange callback.
                setTimeout(() => {
                    isSyncingRef.current = false
                }, 0)
            }
        }, [initialValues])

        useEffect(() => {
            if (!isSyncingRef.current) {
                onChange?.(services)
            }
        }, [services, onChange])

    const toggle = (key: keyof ServiceValues) => {
        setServices((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="flex items-center gap-6">
            {SERVICE_DEFINITIONS.map((s) => (
                <label key={s.id} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={!!services[s.key]}
                        onChange={() => toggle(s.key)}
                        className="w-4 h-4 accent-green-600"
                    />
                    <span className="text-sm">{language === "vi" ? s.labelVi : s.labelEn}</span>
                </label>
            ))}
        </div>
    )
}