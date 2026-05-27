"use client";

import { useEffect, useMemo, useState } from "react";

type FloorOption = {
  id: string;
  floor_name: string;
};

type RoomOption = {
  id: string;
  floor_id: string | null;
  room_name: string;
};

type FloorRoomSelectProps = {
  floors: FloorOption[];
  rooms: RoomOption[];
  defaultFloorId?: string | null;
  defaultRoomId?: string | null;
};

export function FloorRoomSelect({ floors, rooms, defaultFloorId, defaultRoomId }: FloorRoomSelectProps) {
  const [floorId, setFloorId] = useState(defaultFloorId ?? "");
  const [roomId, setRoomId] = useState(defaultRoomId ?? "");
  const [wholeBuilding, setWholeBuilding] = useState(!defaultFloorId && !defaultRoomId);
  const filteredRooms = useMemo(() => (floorId ? rooms.filter((room) => room.floor_id === floorId) : rooms), [floorId, rooms]);

  useEffect(() => {
    if (wholeBuilding) {
      setFloorId("");
      setRoomId("");
      return;
    }

    if (!roomId) return;
    if (!filteredRooms.some((room) => room.id === roomId)) setRoomId("");
  }, [filteredRooms, roomId, wholeBuilding]);

  return (
    <>
      <label className="flex min-h-11 items-center gap-2 self-end rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-ink md:col-span-3">
        <input
          type="checkbox"
          name="whole_building"
          value="on"
          checked={wholeBuilding}
          onChange={(event) => setWholeBuilding(event.currentTarget.checked)}
          className="h-4 w-4 accent-ink"
        />
        Gesamtes Gebäude
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Etage optional
        <select name="floor_id" value={floorId} disabled={wholeBuilding} onChange={(event) => setFloorId(event.currentTarget.value)} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal disabled:bg-slate-100 disabled:text-slate-400">
          <option value="">Ohne Etage</option>
          {floors.map((floor) => (
            <option key={floor.id} value={floor.id}>
              {floor.floor_name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Raum optional
        <select name="room_id" value={roomId} disabled={wholeBuilding} onChange={(event) => setRoomId(event.currentTarget.value)} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal disabled:bg-slate-100 disabled:text-slate-400">
          <option value="">Ohne Raum</option>
          {filteredRooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.room_name}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
