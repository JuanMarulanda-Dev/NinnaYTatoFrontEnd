<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="plans_customers_report"
    sort-by="name"
    class="elevation-3"
    :search="search"
    item-key="created_at"
  >
    <!-- Header content datatable -->
    <template v-slot:top>
      <v-toolbar flat color="white" class="rounded-xl">
        <!-- Title Module -->
        <v-toolbar-title>
          <v-icon large>mdi-notebook-multiple</v-icon> Planes de clientes
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          class="mr-2"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
    </template>

    <!-- total -->
    <template v-slot:[`item.total`]="{ item }">
      {{ currencyFormat(item.total) }}
    </template>
  </v-data-table>
</template>

<script>
import { mapState } from "vuex";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Fecha",
          align: "start",
          value: "created_at",
        },
        { text: "Mediador", value: "mediator", align: "left" },
        { text: "Tipo", value: "type_movement" },
        { text: "Grupo", value: "group", align: "center" },
        { text: "Origin / Destino", value: "cash_register", align: "center" },
        { text: "Total", value: "total", align: "center" },
        { text: "Nota", value: "note" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
    };
  },
  mixins: [moneyFormatMixin],
  computed: {
    ...mapState("statistics", ["plans_customers_report"]),
  },
};
</script>
