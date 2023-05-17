import type { Booking } from "@/interfaces/booking.interface";

interface BookingData {
  roomId?: string;
  userId?: string;
  scheduledAt?: string;
  scheduledUntil?: string;
  equipments?: string[];
  capacity?: number;
  hasAllEquipments?: boolean;
}

async function list(data: {
  userId: string;
  state: string;
  page: number;
}): Promise<{ bookings: Booking[]; count: number }> {
  const params = new URLSearchParams();
  const { userId, state, page } = data;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams();

    params.append("userId", userId);

    if (state) {
      params.append("state", state);
    }
   
    params.append("page", String(page+1));
    params.append("size", String(6));
    xhr.open("GET", `http://localhost:3000/booking/list?${params}`, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const responseData = JSON.parse(xhr.responseText);
          resolve(responseData);
        } else {
          // const errorData = JSON.parse(xhr.responseText);
          // reject(errorData);
          reject();
        }
      }
    };
    xhr.send();
  });
}
async function cancel(data: { ids: string[]; userId: string }): Promise<void> {
  const xhr = new XMLHttpRequest();
  const { ids, userId } = data;
  return new Promise<void>((resolve, reject) => {
    xhr.open("PATCH", `http://localhost:3000/booking/cancel`, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.send(JSON.stringify({ ids: ids, userId: userId }));

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve();
        } else {
          const errorData = JSON.parse(xhr.responseText);
          reject(errorData);
        }
      }
    };
  });
}

async function book(data: BookingData): Promise<void> {
  const xhr = new XMLHttpRequest();
  return new Promise<void>((resolve, reject) => {
    xhr.open("POST", "http://localhost:3000/booking/book", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve();
        } else {
          const errorData = JSON.parse(xhr.responseText);
          reject(errorData);
        }
      }
    };
    xhr.send(JSON.stringify(data));
  });
}

export const BookingService = {
  book,
  cancel,
  list,
};
