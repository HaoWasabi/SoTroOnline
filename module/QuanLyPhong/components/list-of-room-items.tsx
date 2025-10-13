import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLanguageStore } from "@/zustand/language-tranlator"

const roomItems = [
    {
        label_vietnam_name: "Bàn, ghế",
        label_english_name: "Table, Chair",
        value: "table_chair",
    },
    {
        label_vietnam_name: "Tủ lạnh",
        label_english_name: "Refrigerator",
        value: "refrigerator",
    },
    {
        label_vietnam_name: "Máy điều hòa",
        label_english_name: "Air Conditioner",
        value: "air_conditioner",
    },
    {
        label_vietnam_name: "Tủ áo quần",
        label_english_name: "Fan",
        value: "fan",
    },
    {
        label_vietnam_name: "Giường",
        label_english_name: "Bed",
        value: "bed",
    }
]
export default function ListOfRoomItems() {

    const {language} = useLanguageStore()

    return (
        <div className="grid grid-cols-3 gap-4">
            {roomItems.map((item) => (
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
    