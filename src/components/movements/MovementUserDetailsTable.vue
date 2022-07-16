<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="movements_details"
    sort-by="name"
    class="elevation-3"
    :search="search"
    :loading="loading"
    :loading-text="loadingText"
    item-key="created_at"
  >
    <!-- Header content datatable -->
    <template v-slot:top>
      <v-toolbar flat color="white" class="rounded-xl">
        <!-- Title Module -->
        <v-toolbar-title>
          <v-icon large>mdi-notebook-multiple</v-icon> Detalles de los
          movimientos
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
      <!-- Definir colores rojo para egresos - verde para ingresos -->
      <span :class="classObject(item.type_movement)">
        {{ item.type_movement === "Egreso" ? "-" : "+" }}
      </span>
      <v-icon small :class="classObject(item.type_movement)">{{
        moneyIcon
      }}</v-icon>
      <span :class="classObject(item.type_movement)">
        {{ currencyFormat(item.total) }}
      </span>
    </template>

    <!-- footer -->
    <template v-slot:[`body.append`]="{ items }">
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td class="text-center font-weight-bold">Total</td>
        <td class="text-center font-weight-bold">
          <v-icon small>
            {{ moneyIcon }}
          </v-icon>
          {{ currencyFormat(totalsMovements(items)) }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { mapState } from "vuex";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";

export default {
  data() {
    return {
      search: null,
      headers: [
        {
          text: "Fecha",
          align: "start",
          value: "created_at",
        },
        { text: "Tercero", value: "mediator", align: "left" },
        { text: "Movimiento", value: "type_movement" },
        { text: "Grupo", value: "group", align: "center" },
        { text: "Origin / Destino", value: "cash_register", align: "center" },
        { text: "Total", value: "total", align: "center" },
      ],
    };
  },
  mixins: [moneyFormatMixin],
  methods: {
    classObject: function (type_movement) {
      return {
        "success--text": type_movement === "Ingreso",
        "error--text": type_movement === "Egreso",
      };
    },
    totalsMovements(items) {
      const totals = items.reduce(
        (acc, d) => {
          if (d.type_movement === "Ingreso") {
            // Ingreso
            acc.total += parseFloat(d.total);
          } else {
            // Egreso
            acc.total -= parseFloat(d.total);
          }
          return acc;
        },
        {
          total: 0,
        }
      );
      return totals.total;
    },
  },
  computed: {
    ...mapState(["loadingText"]),
    ...mapState("movements", ["movements_details", "loading"]),
  },
};
</script>
