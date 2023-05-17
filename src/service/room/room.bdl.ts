import type { Room } from "@/interfaces/room.interface";

interface RoomData {
  roomId?: string;
  userId?: string;
  scheduledAt?: string;
  scheduledUntil?: string;
  equipments?: string[];
  capacity?: number;
  hasAllEquipments?: boolean;
}

async function list(data: RoomData): Promise<Room[]> {
  const params = new URLSearchParams();
  const {
    equipments,
    userId,
    capacity,
    scheduledAt,
    scheduledUntil,
    hasAllEquipments,
  } = data;
  if (equipments && equipments.length > 0) {
    params.append("equipments", equipments.join(","));
  }

  if (userId) {
    params.append("userId", userId);
  }
  if (capacity) {
    params.append("capacity", String(capacity));
  }

  if (hasAllEquipments) {
    params.append("hasAll", String(hasAllEquipments));
  }

  if (scheduledAt && scheduledUntil) {
    params.append("scheduledAt", scheduledAt);
    params.append("scheduledUntil", scheduledUntil);
  }
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `http://localhost:3000/rooms/list?${params.toString()}`,
      true
    );
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const responseData = JSON.parse(xhr.responseText);
          resolve(responseData);
        } else {
          const errorData = JSON.parse(xhr.responseText);
          reject(errorData);
        }
      }
    };
    xhr.send();
  });
}
export const RoomService = {
  list,
};
