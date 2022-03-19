<template>
  <div>
    <v-data-table
      fixed-header
      :headers="headers"
      :items="lodgings_history"
      sort-by="name"
      class="elevation-3"
      :search="search"
      :loading="loading"
      :loading-text="loadingText"
    >
      <!-- Header content datatable -->
      <template v-slot:top>
        <slot name="header"></slot>
      </template>

      <!-- Avatar + nombre -->
      <template v-slot:[`item.name`]="{ item }">
        <!-- Image profile -->
        <v-tooltip right v-if="item.pet_avatar">
          <template v-slot:activator="{ on, attrs }">
            <v-avatar v-bind="attrs" v-on="on" class="my-2 mr-1">
              <img :src="item.pet_avatar" :alt="item.name" />
            </v-avatar>
          </template>
          <span>
            <v-avatar size="200">
              <img :src="item.pet_avatar" :alt="item.name" />
            </v-avatar>
          </span>
        </v-tooltip>

        <!-- Icon profile -->
        <v-avatar v-else color="grey lighten-1" class="my-2 mr-1">
          <v-icon dark> mdi-dog-side </v-icon>
        </v-avatar>
        <span>
          {{ item.name }}
        </span>
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <!-- Details -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="info mr-1"
              v-bind="attrs"
              v-on="on"
              @click="
                showPetDetails(item.customer_id, item.arrival_data.pet_id)
              "
              v-show="!user.is_customer"
            >
              <v-icon> mdi-paw</v-icon>
            </v-btn>
          </template>
          <span>Detalles Mascotas</span>
        </v-tooltip>

        <!-- Timelines -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="warning mr-1"
              v-bind="attrs"
              v-on="on"
              @click="
                showMonitoringForm(
                  item.name,
                  item.id,
                  item.pet_avatar,
                  item.arrival_data.day_instructions
                )
              "
            >
              <v-icon>mdi-timeline</v-icon>
            </v-btn>
          </template>
          <span>Seguimiento</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <monitoring-form
      v-model="dialogMonitoring"
      :pet_name="pet_name"
      :pet_avatar="pet_avatar"
      :lodging_id="lodging_id"
      :day_instructions="day_instructions"
      :add_monitoring="add_monitoring"
    >
    </monitoring-form>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import MonitoringForm from "@/components/lodging/MonitoringForm.vue";

export default {
  data() {
    return {
      pet_name: "",
      lodging_id: "",
      pet_avatar: "",
      day_instructions: "",
      add_monitoring: false,
      dialogMonitoring: false,
    };
  },
  props: {
    value: {
      type: Array,
      required: true,
    },

    headers: {
      type: Array,
      required: true,
    },
    search: {
      type: String,
      default: "",
    },
  },

  computed: {
    ...mapState(["user", "loadingText"]),
    ...mapState("lodging", ["loading"]),
    ...mapState("customers", ["personal_infomation"]),
    lodgings_history() {
      return this.value;
    },
  },

  methods: {
    ...mapActions("monitorings", ["getMonitoryByPetLodging"]),
    showMonitoringForm(
      pet_name,
      lodging_id,
      pet_avatar = null,
      day_instructions = null,
      add_monitoring = true
    ) {
      this.pet_name = pet_name;
      this.pet_avatar = pet_avatar;
      this.lodging_id = lodging_id;
      this.day_instructions = day_instructions ?? "";
      this.add_monitoring = add_monitoring;
      this.getMonitoryByPetLodging(lodging_id).then((result) => {
        if (result) {
          // search follow up by the last lodging by pet
          this.dialogMonitoring = true;
        }
      });
    },

    showPetDetails(customer_id, pet_id) {
      // Consultar el detalle de la mascota
      this.personal_infomation.id = customer_id;
      this.$router.push({
        path: `/clientes/detalles/${customer_id}/mascota/${pet_id}`,
      });
    },
  },
  components: {
    MonitoringForm,
  },
};
</script>
