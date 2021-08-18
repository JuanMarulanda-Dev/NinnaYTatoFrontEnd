<template>
  <v-dialog v-model="dialogSaleDitails" persistent max-width="700px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-alpha-d-circle-outline</v-icon>
          Detalles - <small>venta N° {{ payment_proof }}</small>
        </span>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-col cols="12">
            <v-simple-table fixed-header height="200px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-center">Valor</th>
                    <th class="text-center">Descuento(%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in saleDetails" :key="index">
                    <td>{{ item.name }}</td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td class="text-center">
                      <v-icon>{{ moneyIcon }}</v-icon>
                      {{ currencyFormat(item.total) }}
                    </td>
                    <td class="text-center">{{ item.discount }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close()"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";

export default {
  name: "sale-details",
  data() {
    return {
      editedIndex: -1,
      headers: [
        {
          text: "Cantidad",
          align: "center",
          value: "quantity",
        },
        { text: "Descuento %", align: "center", value: "discount" },
        { text: "Acciones", align: "center", value: "actions" },
      ],
    };
  },
  mixins: [moneyFormatMixin],
  props: {
    payment_proof: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState("sales", ["dialogSaleDitails", "saleDetails"]),
  },

  methods: {
    ...mapMutations("sales", ["SET_DIALOG_SALE_DETAILS"]),

    close() {
      // Close dialog
      this.SET_DIALOG_SALE_DETAILS(false);
    },
  },
};
</script>
