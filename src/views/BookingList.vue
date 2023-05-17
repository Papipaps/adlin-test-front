<template>
  <TheNavigation />
  <CustomButton
    class="cancel-btn"
    @click="deleteReservation"
    :styles="{ background: 'red' }"
    text="Annuler les réservations"
    :disabled="selectedBookings.length === 0"
  />
  <main class="wrapper">
    <div class="reservation-header">
      <h1>Mes Réservations</h1>
      <Dropdown
        v-model="state"
        :options="[
          { name: 'TOUS', value: '' },
          { name: 'En cours', value: 'ONGOING' },
          { name: 'Annulée', value: 'CLOSED'  },
        ]"
        option-value="value"
        option-label="name"
        placeholder="État"
        class="time-opts w-full md:w-14rem"
      />
    </div>
    <div class="reservation-list">
      <div
        v-for="booking in bookings"
        :key="booking.id"
        class="reservation-item"
        :class="{ booked: isClosed(booking) }"
      >
        <div class="item-image">
          <img :src="getImageUrl('7')" alt="Reservation Image" />
        </div>
        <div class="item-details">
          <p>{{ booking.room.name }}</p>
          <p>{{ booking.room.capacity }} places</p>
          <p>
            Réservée du
            <span class="bold">{{ getDateAsString(booking.scheduledAt) }}</span>
          </p>
          <p>
            au
            <span class="bold">{{ getDateAsString(booking.scheduledAt) }}</span>
          </p>
        </div>
        <div class="item-actions">
          <div v-if="!isClosed(booking)">
            <input
              type="checkbox"
              v-model="selectedBookings"
              :value="booking"
            />
            <i class="pi pi-trash" @click="deleteReservation(booking)"></i>
          </div>
          <div v-else>
            <p class="bold error">
              Annulé le {{ getDateAsString(booking.updatedAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Booking } from "@/interfaces/booking.interface";
import type { User } from "@/service/auth/auth.service";
import { ref, inject, type Ref, watchEffect } from "vue";
import { getImageUrl, getDateAsString } from "@/utils/utils";
import TheNavigation from "@/components/TheNavigation.vue";
import CustomButton from "@/components/atom/Button/FormButton/CustomButton.vue";
import Dropdown from "primevue/dropdown";
const xhr = new XMLHttpRequest();
const user = inject("user") as Ref<User>;
const selectedBookings = ref<Booking[]>([]);

const state = ref<string>("ONGOING");
const bookings = ref<Booking[]>();

const fetchReservations = () => {
  xhr.open(
    "GET",
    `http://localhost:3000/booking/list?userId=${user.value?.id}&state=${state.value}`,
    true
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        console.log(responseData);
        bookings.value = responseData;
        bookings.value?.map(
          (booking) => (
            (booking.scheduledAt = new Date(booking.scheduledAt)),
            (booking.scheduledUntil = new Date(booking.scheduledUntil)),
            (booking.updatedAt = new Date(booking.updatedAt))
          )
        );
      }
    }
  };
  xhr.send();
};
const deleteReservation = (booking: Booking) => {
  const ids = booking.id
    ? [booking.id]
    : selectedBookings.value.map((b) => b.id);

  if (ids.length > 0) {
    xhr.open(
      "DELETE",
      `http://localhost:3000/booking/cancel?userId=${user.value?.id}&ids=${ids}`,
      true
    );
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.send(JSON.stringify({ ids: ids, userId: user.value.id }));

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          fetchReservations();
          console.log(JSON.parse(xhr.responseText));
        }
      }
    };
  }
};

watchEffect(() => ((selectedBookings.value = []), fetchReservations()));

function isClosed(booking: Booking) {
  return booking.state === "CLOSED";
}
</script>

<style scoped>
.wrapper {
  background: white;
  height: 100vh;
}

.cancel-btn {
  position: fixed;
  z-index: 10;
  top: 10%;
  left: 20%;
  transform: translateX(-50%);
  padding: 20px;
}

.reservation-header{
  padding-top: 50px;
  text-align: center;
  width: 50%;
  margin: 0 auto;
  min-width: 450px;
  max-width: 900px;
}
.reservation-list {
  /* Styles pour la liste des réservations */
  padding: 20px;
  list-style: none;
}

.reservation-item > div {
  /* border: red 1px solid; */
  height: 100%;
}

.reservation-item {
  margin: 0 auto;
  height: 125px;
  max-width: 700px;
  min-width: 400px;
  /* border: blue 4px solid; */
  display: flex;
  align-items: center;
  box-shadow: var(--box-shadow-darker);
  border-bottom: 1px solid #e0e0e0;
  border-radius: var(--border-radius-m);
  overflow: hidden;
  margin-bottom: 20px;
  background-color: white;
}

.item-image {
  width: 100%;
  flex: 2;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.booked {
  filter: brightness(0.9);
  cursor: not-allowed;
}
.item-details {
  padding: 16px;
  flex: 2;
  display: flex;
  flex-direction: column;
}

.item-actions input,
.item-actions i {
  scale: 1.5;
  margin: 0 10px;
}
.item-actions {
  padding: 16px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.item-actions input[type="checkbox"] {
  margin-right: 8px;
}

.item-actions i {
  cursor: pointer;
  color: #d32f2f;
}

.item-actions i:hover {
  color: #991515;
}
</style>
