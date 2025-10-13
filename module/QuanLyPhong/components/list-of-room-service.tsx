import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLanguageStore } from "@/zustand/language-tranlator"

const roomServices = [
    {
        label_vietnam_name: "Wifi",
        label_english_name: "Wifi",
        value: "wifi",
    },
    {
        label_vietnam_name: "Giữ xe / Bãi xe",
        label_english_name: "Parking",
        value: "parking",
    },
    {
        label_vietnam_name: "Bảo vệ / An ninh",
        label_english_name: "Security",
        value: "security",
    },
    {
        label_vietnam_name: "Thu gom rác",
        label_english_name: "Trash Collection",
        value: "trash_collection",
    },
    {
        label_vietnam_name: "Giặt sấy / Máy giặt chung",
        label_english_name: "Laundry / Shared Washing Machine",
        value: "laundry",
    },
]
export default function ListOfRoomServices() {

    const {language} = useLanguageStore()

    return (
        <div className="grid grid-cols-3 gap-4">
            {roomServices.map((item) => (
                <div key={item.value}>
                    <div className="flex items-center space-x-2">
                        <Checkbox id={item.value} />
                        <Label htmlFor={item.value}>{language === "vi" ? item.label_vietnam_name : item.label_english_name}</Label>
                    </div>
                </div>
            ))}
        </div>

    )
}
    