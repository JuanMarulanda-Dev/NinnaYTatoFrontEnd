<template>
  <div>
    <!-- Information sale -->
    <v-card elevation="2" class="pa-2">
      <v-container>
        <v-row>
          <!-- Header -->
          <v-toolbar flat color="white" class="rounded-xl">
            <!-- Title Module -->
            <v-toolbar-title>
              <v-icon large>mdi-cart</v-icon> Tienda
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  small
                  color="secondary"
                  elevation="3"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="SET_DIALOG_SALES_HITORY(true)"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
              <span>Buscar Ventas</span>
            </v-tooltip>
          </v-toolbar>
        </v-row>
        <!-- Form to sales -->
        <sale-form></sale-form>
      </v-container>
    </v-card>

    <!-- Sales -->
    <sales-data-table></sales-data-table>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import SalesDataTable from "@/components/sales/SalesDataTable.vue";
import SaleForm from "@/components/sales/SaleForm.vue";

export default {
  methods: {
    ...mapMutations("sales", ["SET_DIALOG_SALES_HITORY", "SET_SALE_DEFAULT"]),
  },
  created() {
    this.SET_SALE_DEFAULT();
  },
  components: {
    SalesDataTable,
    SaleForm,
  },
};
</script>
