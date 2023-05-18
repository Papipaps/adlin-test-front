<template>
  <TheNavigation />
  <CustomButton
    class="cancel-btn"
    @click="cancelReservation"
    :styles="{ background: 'red' }"
    text="Annuler les réservations"
    :disabled="selectedBookings.length === 0"
  />
  <main class="wrapper">
    <div class="reservation-header">
      <h1>Mes Réservations</h1>
      <Dropdown
        @change="page = 0"
        v-model="state"
        :options="[
          { name: 'TOUS', value: '' },
          { name: 'En cours', value: 'ONGOING' },
          { name: 'Annulée', value: 'CLOSED' },
        ]"
        option-value="value"
        option-label="name"
        placeholder="État"
        class="time-opts w-full md:w-14rem"
      />
      <Paginator
        v-model:first="page"
        :rows="1"
        :totalRecords="totalPage"
      ></Paginator>
    </div>
    <div class="reservation-list">
      <div
        v-if="bookings && bookings.length > 0"
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
            <i class="pi pi-trash" @click="cancelReservation(booking)"></i>
          </div>
          <div v-else>
            <p class="bold error">
              Annulé le {{ getDateAsString(booking.updatedAt) }}
            </p>
          </div>
        </div>
      </div>
      <p v-else>Aucune salle trouvée</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Booking } from "@/interfaces/booking.interface";
import { type User } from "@/service/auth/auth.bdl";
import { ref, inject, type Ref, watchEffect, onMounted } from "vue";
import { getImageUrl, getDateAsString } from "@/utils/utils";
import TheNavigation from "@/components/molecule/TheNavigation.vue";
import CustomButton from "@/components/atom/Button/CustomButton.vue";
import Dropdown from "primevue/dropdown";
import { BookingService } from "@/service/booking/booking.bdl";
import Paginator from "primevue/paginator";
const user = inject("user") as Ref<User>;
const selectedBookings = ref<Booking[]>([]);

const state = ref<string>("ONGOING");
const bookings = ref<Booking[]>();

const page = ref<number>(0);
const totalPage = ref<number>(1);

const fetchReservations = () => {
  BookingService.list({
    userId: user.value.id,
    state: state.value,
    page: page.value,
  })
    .then((res) => {
      bookings.value = res.bookings;
      totalPage.value = Math.ceil(res.count / 6);
    })
    .catch(() => (bookings.value = []));
};
const cancelReservation = (booking: Booking) => {
  const ids = booking.id
    ? [booking.id]
    : selectedBookings.value.map((b) => b.id);
  if (ids.length > 0) {
    BookingService.cancel({ ids: ids, userId: user.value.id }).then(() =>
      fetchReservations()
    );
  }
};

onMounted(() => {
  
});

watchEffect(() => ((selectedBookings.value = []), fetchReservations()));

function isClosed(booking: Booking) {
  return booking.state === "CLOSED";
}
</script>

<style scoped>
.wrapper {
  background: white;
  min-height: 100vh;
}

.cancel-btn {
  position: fixed;
  z-index: 10;
  top: 10%;
  left: 20%;
  transform: translateX(-50%);
  padding: 20px;
}

.reservation-header {
  padding-top: 50px;
  text-align: center;
  width: 50%;
  margin: 0 auto;
  min-width: 450px;
  max-width: 900px;
}
.reservation-list {
  /* Styles pour la liste des réservations */
  text-align: center;
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
