<template>
  <v-dialog
    v-model="dialogAdditionalCharge"
    persistent
    scrollable
    max-width="700px"
  >
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-cart</v-icon>
          Cargos adicionales
        </span>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-container>
          <!-- Form to sales -->
          <sale-form
            :readonlyCustomer="true"
            lg="12"
            :showAdditionalForm="true"
            @closeDialog="dialogAdditionalCharge = false"
          ></sale-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close()"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from "vuex";
import SaleForm from "@/components/sales/SaleForm.vue";

export default {
  name: "additional-charge-form",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    ...mapMutations("sales", ["SET_SALE_DEFAULT"]),
    close() {
      // Close modal
      this.dialogAdditionalCharge = false;
    },
  },
  computed: {
    dialogAdditionalCharge: {
      get: function () {
        return this.value;
      },
      set: function (newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  watch: {
    dialogAdditionalCharge(newValue) {
      if (!newValue) {
        this.SET_SALE_DEFAULT();
      }
    },
  },
  components: {
    SaleForm,
  },
};
</script>
