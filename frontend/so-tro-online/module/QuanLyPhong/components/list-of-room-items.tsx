import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLanguageStore } from "@/zustand/language-tranlator"
import { Room } from "../types/room-types"

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
        label_english_name: "Wardrobe",
        value: "wardrobe",
    },
    {
        label_vietnam_name: "Giường",
        label_english_name: "Bed",
        value: "bed",
    }
]

interface ListOfRoomItemsProps {
    room?: Room;
    disabled?: boolean;
}

export default function ListOfRoomItems({ room, disabled = false }: ListOfRoomItemsProps) {

    const {language} = useLanguageStore()

    // Get selected items from the room's furniture list
    const getSelectedItems = () => {
        if (!room || !room.furnitures) return [];
        
        // Convert the furnitures array to the corresponding values
        return room.furnitures.map(furniture => {
            const matchedItem = roomItems.find(item => 
                item.label_vietnam_name.toLowerCase().includes(furniture.toLowerCase()) ||
                item.label_english_name.toLowerCase().includes(furniture.toLowerCase())
            );
            return matchedItem?.value || furniture.toLowerCase().replace(/\s+/g, '_');
        });
    };

    const selectedItems = getSelectedItems();

    return (
        <div className="space-y-4">
            <div className={`grid grid-cols-3 gap-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {roomItems.map((item) => (
                    <div key={item.value}>
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id={item.value}
                                name="room_items"
                                value={item.value}
                                defaultChecked={!disabled && selectedItems.includes(item.value)}
                                disabled={disabled}
                            />
                            <Label 
                                htmlFor={item.value}
                                className={disabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
                            >
                                {language === "vi" ? item.label_vietnam_name : item.label_english_name}
                            </Label>
                        </div>
                    </div>
                ))}
            </div>
            {disabled && (
                <p className="text-sm text-gray-500 italic text-center">
                    {language === "vi" 
                        ? "Phòng trống không có nội thất" 
                        : "Empty rooms don't have furniture"
                    }
                </p>
            )}
        </div>
    )
}
    