<template>
  <div>
    <!-- Datatable planes-->
    <v-data-table
      fixed-header
      :headers="headers"
      :items="value"
      sort-by="name"
      class="elevation-3"
      :loading="loading"
      :loading-text="loadingText"
    >
      <!-- Header content datatable -->
      <template v-slot:top>
        <slot name="header"></slot>
      </template>

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
            'success--text': item.payment === item.total && item.total > 0,
          }"
          >{{ moneyIcon }}</v-icon
        >
        <span
          :class="{
            'success--text': item.payment === item.total && item.total > 0,
          }"
        >
          {{ currencyFormat(item.payment) }}
        </span>
      </template>

      <!-- pending -->
      <template v-slot:[`item.pending`]="{ item }">
        <v-icon small :class="{ 'error--text': item.pending !== 0 }">{{
          moneyIcon
        }}</v-icon>
        <span :class="{ 'error--text': item.pending !== 0 }">
          {{ currencyFormat(item.pending) }}
        </span>
      </template>

      <!-- State -->
      <template v-slot:[`item.state`]="{ item }">
        <v-switch
          :input-value="item.state"
          v-model="item.state"
          v-show="permissions.delete || !user.is_customer"
          @change="changeStateSale(item)"
        ></v-switch>
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <sale-actions :item="item" :permissions="permissions"></sale-actions>
      </template>

      <template v-slot:[`body.append`]="{ items }">
        <tr>
          <td class="font-weight-bold"></td>
          <td class="text-center font-weight-bold">Totals</td>
          <td class="text-left font-weight-bold">
            <v-icon small>
              {{ moneyIcon }}
            </v-icon>
            {{ currencyFormat(totals(items).total) }}
          </td>
          <td class="text-left font-weight-bold">
            <v-icon small>
              {{ moneyIcon }}
            </v-icon>
            {{ currencyFormat(totals(items).payment) }}
          </td>
          <td class="text-left font-weight-bold">
            <v-icon small>
              {{ moneyIcon }}
            </v-icon>
            {{ currencyFormat(totals(items).pending) }}
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Show dialog payments -->
    <sale-payments></sale-payments>
    <!-- Show dialog details -->
    <sale-details></sale-details>
    <!-- Show dialog note -->
    <note-form-dialog></note-form-dialog>
  </div>
</template>

<script>
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { mapState, mapMutations, mapActions } from "vuex";
import SalePayments from "@/components/sales/SalePayments.vue";
import SaleDetails from "@/components/sales/SaleDetails.vue";
import NoteFormDialog from "@/components/NoteFormDialog.vue";
import SaleActions from "@/components/sales/SaleActions.vue";

export default {
  name: "sales-data-tables",
  data: () => ({}),
  mixins: [moneyFormatMixin],
  props: {
    value: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
  },
  created() {
    //Status movements module
    this.SET_MODULE_STATUS(false);
  },
  computed: {
    ...mapState(["user"]),
    ...mapState(["loadingText", "mainBranchOffice", "detailsIcon", "user"]),
    ...mapState("sales", ["loading", "permissions"]),

    maxDate() {
      return this.getNowDate();
    },
  },

  methods: {
    ...mapMutations("sales", ["SET_DIALOG_SALES_HITORY"]),
    ...mapActions("sales", ["changeStatusSale"]),
    ...mapMutations("movements", ["SET_MODULE_STATUS"]),

    changeStateSale(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de esta venta?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusSale(item.id).then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackStateSale(item);
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackStateSale(item);
        }
      });
    },

    rollbackStateSale(item) {
      // Sales
      let saleIndex = this.value.indexOf(item);
      this.$emit("rollback", saleIndex);
    },

    totals(items) {
      const totals = items.reduce(
        (acc, d) => {
          if (d.state) {
            acc.payment += parseFloat(d.payment);
            acc.pending += parseFloat(d.pending);
            acc.total += parseFloat(d.total);
          }

          return acc;
        },
        {
          payment: 0,
          pending: 0,
          total: 0,
        }
      );
      return totals;
    },
  },
  components: {
    SalePayments,
    SaleDetails,
    NoteFormDialog,
    SaleActions,
  },
};
</script>
