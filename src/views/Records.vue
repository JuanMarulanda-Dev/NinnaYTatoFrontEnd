<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="records"
    sort-by="name"
    class="elevation-3"
    :search="search"
    :loading="loading"
    :loading-text="loadingText"
  >
    <!-- Header content datatable -->
    <template v-slot:top>
      <v-toolbar flat color="white" class="rounded-xl">
        <!-- Title Module -->
        <v-toolbar-title>
          <v-icon large>mdi-history</v-icon> Historial
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <!-- Filter date -->
        <v-dialog
          ref="fecha"
          v-model="dialog"
          :return-value.sync="date"
          persistent
          width="290px"
          :retain-focus="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="mt-8"
              v-model="date"
              label="Fecha"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker :max="maxDate" v-model="date" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dialog = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.fecha.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          class="mr-3"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    permissions: {},
    dialog: false,
    search: "",
    date: "",
    headers: [
      {
        text: "Numero",
        align: "center",
        value: "id",
      },
      { text: "Usuario", value: "user" },
      { text: "Modulo", value: "module" },
      { text: "Acción", value: "action" },
      { text: "Observaciones", value: "observation" },
      { text: "Fecha", value: "created_at" },
    ],
  }),
  computed: {
    ...mapState(["loadingText"]),
    ...mapState("records", ["records", "loading"]),
    maxDate() {
      return this.getNowDate();
    },
  },

  created() {
    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;
    this.date = this.getNowDate();
  },

  watch: {
    date() {
      if (this.permissions.read) {
        this.initialize();
      }
    },
  },

  methods: {
    ...mapActions("records", ["getRecordsByDate"]),
    initialize() {
      this.getRecordsByDate(this.date);
    },
  },
};
</script>
