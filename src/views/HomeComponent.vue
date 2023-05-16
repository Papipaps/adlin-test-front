<template>
  <TheNavigation />
  <main class="wrapper">
    <div class="room-list">
      <form class="search-filters" @submit.prevent="filter">
        <div class="equipment-opts">
          <CustomLabelVue text="Doit avoir" >
            <input v-model="searchFilters.hasAllEquipments" type="checkbox"/>
          </CustomLabelVue>
          <MultiSelect
            label="Equipement"
            v-model="searchFilters.equipments"
            :options="equipmentOptions"
            placeholder="Équipement"
            :maxSelectedLabels="1"
            class="w-full md:w-20rem"
          />
        </div>
        <div class="calendar">
          <Datepicker v-model="searchFilters.scheduledAt" />
        </div>
        <div class="opts">
          <Dropdown
            v-model="searchFilters.choosenTime"
            :options="timeOptions"
            optionLabel="name"
            placeholder="Durée"
            class="time-opts w-full md:w-14rem"
          />
          <Slider
            class="capacity-opts"
            v-model="searchFilters.capacity"
            :step="5"
          /><span>{{ searchFilters.capacity }}</span>
        </div>
        <button>filtrer</button>
      </form>

      <div class="room-cards">
        <div
          v-for="(room, index) in rooms"
          :key="room.id"
          class="room-card"
          @click="selectRoom(room, index)"
        >
          <img
            :src="getImageUrl(String(index + 1))"
            alt="Room Image"
            class="room-image"
          />
          <div class="room-info">
            <h3 class="room-name">
              {{ room.name }}{{ " - " }}<span>0/{{ room.capacity }}</span
              >>
            </h3>
            <p class="room-description">{{ room.description }}</p>
            <ul class="equipment-list">
              <li v-for="equipment in room.equipements" :key="equipment.name">
                {{ equipment.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="room-details-wrapper">
      <RoomDetails
        @book="filter"
        v-if="selectedRoom"
        :room="{
          ...selectedRoom,
          img: getImageUrl(String(selectedRoomImgIndex + 1)),
        }"
      />
      <div v-else><p>Veuillez selectionner une salle</p></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import RoomDetails from "./RoomDetails.vue";
import type { Room } from "@/interfaces/room.interface";
import TheNavigation from "@/components/TheNavigation.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Dropdown from "primevue/dropdown";
import Slider from "primevue/slider";
import MultiSelect from "primevue/multiselect";
import CustomLabelVue from "@/components/atom/Label/CustomLabel.vue";
import {getImageUrl} from '@/utils/utils'

interface SearchFilters {
  equipments: string[];
  capacity: number;
  scheduledAt: Date;
  choosenTime: number;
  hasAllEquipments: boolean;
}

const searchFilters = ref<SearchFilters>({
  scheduledAt: new Date(),
  choosenTime: 0.5,
  equipments: [],
  capacity: 0,
  hasAllEquipments:false,
});

const equipmentOptions: string[] = [
  "TV",
  "Retro Projecteur"
]; 
const timeOptions = ref<{ value: number; name: string }[]>([
  { value: 0.5, name: "30 minutes" },
  { value: 1, name: "1 heure" },
  { value: 2, name: "2 heures" },
  { value: 3, name: "3 heures" },
]);
const rooms = ref<Room[]>([]);
const scheduledUntil = ref<Date>(new Date());
const selectedRoom = ref<Room | null>(null);
const selectedRoomImgIndex = ref<number>(0);

const selectRoom = (room: Room, index: number) => {
  selectedRoom.value = room;
  selectedRoomImgIndex.value = index;
};



watch(["choosenTime", "scheduledAt"], () => {
  scheduledUntil.value = new Date(
    searchFilters.value.scheduledAt.getTime() +
      searchFilters.value.choosenTime * 3_600_000
  );
});

onMounted(async () => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `http://localhost:3000/rooms/list?scheduledAt=${searchFilters.value.scheduledAt?.toISOString()}&scheduledUntil=${scheduledUntil.value.toISOString()}`,
    true
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        rooms.value = responseData;
      }
    }
  };
  xhr.send();
});

function filter() {
  const { equipments, capacity, scheduledAt, choosenTime, hasAllEquipments } =
    searchFilters.value;
  const params = new URLSearchParams();

  if (equipments && equipments.length > 0) {
    params.append("equipments", equipments.join(","));
  }

  if (capacity) {
    params.append("capacity", String(capacity));
  }
  
  if (hasAllEquipments) { 
    params.append("hasAll", String(hasAllEquipments));
  }

  if (scheduledAt && choosenTime) {
    params.append("scheduledAt", scheduledAt.toISOString());
    params.append(
      "scheduledUntil",
      new Date(scheduledAt.getTime() + choosenTime * 3_600_000)?.toISOString()
    );
  } 

  const url = `http://localhost:3000/rooms/list?${params.toString()}`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        rooms.value = responseData;
        selectedRoom.value = null;
      }
    }
  };
  xhr.send();
}
</script>

<style scoped>
@media (width <= 1200px) {
  .wrapper {
    flex-direction: column;
    height: fit-content;
    align-items: center;
  }
  .room-list {
    max-width: none;
    max-height: 70%;
    box-shadow: none;
  }
}
.wrapper {
  display: flex;
  height: 100vh;
  background: var(--background-color);
}
.room-list {
  padding: 30px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  max-width: 850px;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
}
.search-filters > div {
  padding: 20px;
}
.search-filters { 
  background: white;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  /* gap: 10px; */
  border-radius: 15px;
  box-shadow: var(--box-shadow);
}

.search-filters button {
  cursor: pointer;
  height: 100%;
  flex: 1;
  color: white;
  font-weight: 700;
  border: 0;
  background: var(--accent-color);
  padding: 0 10px;
  border-radius: 0px 15px 15px 0px;
  text-transform: uppercase;
}
.calendar {
  flex: 1;
  min-width: 250px;
}

.opts {
  width: 100%;
  flex: 1;
}
.equipment-opts {
  max-width: 350px;
  flex: 1;
}
.capacity-opts {
  width: 100%;
  margin: 10px 0;
}
.room-cards {
  padding: 0 50px;
  overflow-y: scroll;
}

.room-card:is(:hover, :focus) {
  filter: brightness(0.9);
}
.room-card {
  background: white;
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 150px;
  margin: 10px 0;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
}

.room-image {
  height: 100%;
  width: 50%;
  object-fit: cover;
}

.room-info {
  padding: 10px;
  flex: 1;
}

.room-name {
  font-size: 18px;
  font-weight: bold;
}

.room-description {
  font-size: 14px;
  margin-bottom: 10px;
}

.equipment-list {
  padding-left: 10px;
}

.equipment-list li {
  margin-right: 5px;
  font-size: 12px;
}

.room-details-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
