<template>
  <div>
    <v-dialog v-model="dialogMovementDetail" persistent fluid>
      <!-- Modal Form -->
      <v-card>
        <v-card-title>
          <span class="headline"> Detalles del movimiento </span>
        </v-card-title>

        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  fixed-header
                  :headers="customeHeaders"
                  :items="customeItem"
                  sort-by="name"
                  class="elevation-3"
                  hide-default-footer
                >
                  <!-- total -->
                  <template v-slot:[`item.total`]="{ item }">
                    <v-icon small>{{ moneyIcon }}</v-icon>
                    {{ currencyFormat(item.total) }}
                  </template>

                  <!-- payment -->
                  <template v-slot:[`item.payment`]="{ item }">
                    <v-icon
                      small
                      :class="{
                        'success--text':
                          item.payment === item.total && item.total > 0,
                      }"
                      >{{ moneyIcon }}</v-icon
                    >
                    <span
                      :class="{
                        'success--text':
                          item.payment === item.total && item.total > 0,
                      }"
                    >
                      {{ currencyFormat(item.payment) }}
                    </span>
                  </template>

                  <!-- pending -->
                  <template v-slot:[`item.pending`]="{ item }">
                    <v-icon
                      small
                      :class="{ 'error--text': item.pending !== 0 }"
                      >{{ moneyIcon }}</v-icon
                    >
                    <span :class="{ 'error--text': item.pending !== 0 }">
                      {{ currencyFormat(item.pending) }}
                    </span>
                  </template>

                  <!-- State -->
                  <template v-slot:[`item.state`]="{ item }">
                    <v-switch
                      :input-value="item.state"
                      v-model="item.state"
                      v-show="user.is_admin"
                      @change="changeStateSale(item)"
                    ></v-switch>
                  </template>

                  <!-- Actions -->
                  <template v-slot:[`item.actions`]="{ item }">
                    <!-- Sale Actions -->
                    <sale-actions
                      :item="item"
                      :permissions="{}"
                      v-if="movement_type == 1"
                    >
                    </sale-actions>

                    <!-- Turn Actions -->
                    <turn-actions
                      :item="item"
                      :permissions="{}"
                      v-if="movement_type == 3"
                    ></turn-actions>

                    <!-- Purchases Actions -->
                    <purchase-actions
                      :item="item"
                      :permissions="{}"
                      v-if="movement_type == 5"
                    ></purchase-actions>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" text @click="close()">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Sale -->
    <!-- Show dialog payments -->
    <sale-payments></sale-payments>
    <!-- Show dialog details -->
    <sale-details></sale-details>

    <!-- Turns -->
    <!-- Edit form -->
    <turn-form></turn-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import SaleActions from "@/components/sales/SaleActions.vue";
import TurnActions from "@/components/turns/TurnActions.vue";
import PurchaseActions from "@/components/purchases/PurchaseActions.vue";
import TurnForm from "@/components/turns/TurnForm.vue";
import SalePayments from "@/components/sales/SalePayments.vue";
import SaleDetails from "@/components/sales/SaleDetails.vue";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";

export default {
  data() {
    return {};
  },
  mixins: [moneyFormatMixin],
  computed: {
    ...mapState("movements", ["dialogMovementDetail", "movement_type"]),

    ...mapState(["user"]),

    ...mapState("sales", ["headersSales", "sales"]),
    ...mapState("turns", ["headersTurns", "turns"]),
    ...mapState("purchases", ["headersPurchases", "purchases"]),

    customeHeaders() {
      let headers = {};
      switch (this.movement_type) {
        case 1: // Sale
          headers = this.headersSales;
          break;
        case 3: // Turn
          headers = this.headersTurns;
          break;
        case 5: // Purchases
          headers = this.headersPurchases;
          break;
      }
      return headers;
    },

    customeItem() {
      let item = [];
      switch (this.movement_type) {
        case 1: // Sale
          item = this.sales;
          break;
        case 3: // Turn
          item = this.turns;
          break;
        case 5: // Purchases
          item = this.purchases;
          break;
      }
      return item;
    },
  },
  methods: {
    ...mapMutations("movements", ["SET_DIALOG_MOVEMENT"]),
    ...mapActions("movements", ["getAllMovementsBewteenDates"]),
    close() {
      this.SET_DIALOG_MOVEMENT(false);
      this.getAllMovementsBewteenDates();
    },
  },
  components: {
    SaleActions,
    TurnActions,
    PurchaseActions,
    TurnForm,
    SalePayments,
    SaleDetails,
  },
};
</script>
