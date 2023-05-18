<template>
  <div>
    <div v-if="!room" class="loading">Chargement...</div>
    <div v-else>
      <div class="wrapper">
        <img class="image" :src="room.img" />
        <div class="room-details">
          <div class="info-header">
            <h2 class="title">{{ room.name }} • {{ room.capacity }} places</h2>
            <button
              :class="{ disable: errors.length > 0 }"
              @click="handleClick"
            >
              Réserver
            </button>
          </div>
          <p class="description">{{ room.description }}</p>
          <section>
            <div class="calendar">
              <span v-show="errors.length > 0"
                ><p class="error bold" v-for="error in errors">
                  {{ error.message }}
                </p></span
              >
              <Datepicker v-model="searchFilters.scheduledAt" />
            </div>

            <div class="room-info">
              <p>
                Date sélectionnée :
                {{ getDateAsString(searchFilters.scheduledAt) }}
              </p>
              <p>{{ displayDuration() }}</p>
              <br />
              <Dropdown
                v-model="searchFilters.choosenTime"
                :options="timeOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Durée"
                class="time-opts w-full md:w-14rem"
              />
              <br />
              <p>Equipements de la salle</p>
              <ul class="equipment-list">
                <li v-for="equipment in room.equipements" :key="equipment.name">
                  {{ equipment.name }}
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef, watch } from "vue";
import type { Room } from "@/interfaces/room.interface";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { getDateAsString } from "@/utils/utils";
import type { IError } from "@/interfaces/error.interface";
import { BookingService } from "@/service/booking/booking.bdl";
import type { SearchFilters } from "./HomeComponent.vue";
import Dropdown from "primevue/dropdown";

interface Props {
  room: Room;
  searchFilters: SearchFilters;
  timeOptions: { value: number; name: string }[];
}

const props = defineProps<Props>();
const emit = defineEmits(["book"]);

const room = toRef(props, "room");
const searchFilters = toRef(props, "searchFilters");
const timeOptions = toRef(props, "timeOptions");
const errors = ref<IError[]>([]);

const HOUR_IN_MILLI: number = 3_600_000;

watch([searchFilters.value.scheduledAt], () => {
  if (searchFilters.value.scheduledAt.getTime() < new Date().getTime()) {
    errors.value = [
      {
        message: "La date ne peut pas etre antérieur à celle d'aujourd'hui",
      },
    ];
  } else {
    errors.value = [];
  }
});

function displayDuration() {
  const de: Date = searchFilters.value.scheduledAt;
  const a: Date = new Date(
    de.getTime() + searchFilters.value.choosenTime * HOUR_IN_MILLI
  );
  return `De ${de.getHours()}h${de.getMinutes()} à ${a.getHours()}h${a.getMinutes()}m`;
}
function handleClick() {
  const storedUser = localStorage.getItem("mock-credentials");
  const until = new Date(
    searchFilters.value.scheduledAt.getTime() +
      searchFilters.value.choosenTime * HOUR_IN_MILLI
  );

  if (storedUser && errors.value.length === 0) {
    const user = JSON.parse(storedUser);
    const data = {
      roomId: room.value.id,
      userId: user.id,
      scheduledAt: searchFilters.value.scheduledAt.toISOString(),
      scheduledUntil: until.toISOString(),
    };
    BookingService.book(data)
      .then(() => emit("book"))
      .catch((err) => {
        errors.value.push(err);
      });
  }
}
</script>

<style scoped>
.wrapper {
  height: 500px;
  box-shadow: var(--box-shadow);
  border-radius: 15px;
  background-color: white;
}
.room-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px 20px 20px 20px;
}

.loading {
  font-size: 20px;
  margin-bottom: 20px;
}

.image {
  height: 150px;
  width: 100%;
  object-fit: cover;
  padding: 0;
  border-radius: 15px 15px 0 0;
}
.info-header {
  display: flex;
  gap: 30px;
  align-items: center;
  width: 100%;
  padding: 10px;
  height: 80px;
}
.title {
  flex: 2;
  font-size: 24px;
  font-weight: bold;
}

.info-header button {
  flex: 1;
}

.description {
  font-style: italic;
  color: rgb(51, 51, 51);
  font-size: 16px;
}

section {
  display: flex;
  margin-top: 20px;
}

.calendar {
  flex: 1;
}

.room-info {
  flex: 1;
  margin-left: 20px;
}

.equipment-list {
  list-style-type: none;
  padding: 0;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: var(--border-radius-s);
}
</style>
