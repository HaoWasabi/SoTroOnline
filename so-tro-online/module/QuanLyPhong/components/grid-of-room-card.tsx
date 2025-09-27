import RoomCardComponent from "./room-card";

const rooms: Room[] = [
    {
        room_id: "#abc",
        name: "Room A101",
        typeOfRoom: "Single",
        address: "123 Nguyen Trai, Hanoi",
        width: 3,
        height: 4,
        furnitures: ["Bed", "Desk", "Wardrobe"],
        baseRent: 2500000,
        roomStatus: "Available"
    },
    {
        room_id: "#cdf",
        name: "Room B202",
        typeOfRoom: "Double",
        address: "45 Le Loi, Ho Chi Minh City",
        width: 4,
        height: 5,
        furnitures: ["2 Beds", "Table", "Chair", "Air Conditioner"],
        baseRent: 4000000,
        roomStatus: "Occupied"
    },
    {
        room_id: "#fgh",
        name: "Room C303",
        typeOfRoom: "Studio",
        address: "78 Tran Phu, Da Nang",
        width: 5,
        height: 6,
        furnitures: ["Bed", "Kitchenette", "Sofa", "Fridge"],
        baseRent: 5500000,
        roomStatus: "Available"
    },
    {
        room_id: "#trf",
        name: "Room D404",
        typeOfRoom: "Single",
        address: "12 Vo Thi Sau, Hue",
        width: 3,
        height: 3,
        furnitures: ["Bed", "Fan", "Desk"],
        baseRent: 1800000,
        roomStatus: "In Maintenance"
    },
    {
        room_id: "#afg",
        name: "Room E505",
        typeOfRoom: "Suite",
        address: "99 Nguyen Hue, HCMC",
        width: 6,
        height: 7,
        furnitures: ["King Bed", "TV", "Sofa", "Wardrobe", "Air Conditioner"],
        baseRent: 8500000,
        roomStatus: "Available"
    }
];


export default function GridOfRoomCard() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
                <RoomCardComponent 
                    key={room.name}
                    room={room}
                />
            ))}
        </div>
    )

}