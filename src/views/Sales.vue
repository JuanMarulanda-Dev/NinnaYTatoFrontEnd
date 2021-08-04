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
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
              <span>Buscar Ventas</span>
            </v-tooltip>
          </v-toolbar>
        </v-row>
        <v-row>
          <!-- Customer -->
          <v-col cols="4">
            <v-autocomplete
              class="pb-3"
              prepend-icon="mdi-paw"
              label="Cliente"
              item-text="name"
              item-value="id"
            ></v-autocomplete>
            <!-- Options to comprobante de pago -->
            <v-row>
              <v-col>
                <v-card outlined>
                  <v-card-text>
                    <h4 class="text-center">Comprobante de pago</h4>
                  </v-card-text>
                  <v-container class="py-0">
                    <v-row>
                      <v-col>
                        <v-checkbox
                          on-icon="mdi-printer"
                          label="Imprimir"
                        ></v-checkbox>
                      </v-col>
                      <v-col>
                        <v-checkbox
                          on-icon="mdi-email-newsletter"
                          label="Enviar"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <!-- Pagos -->
          <v-col cols="8">
            <v-card outlined>
              <v-card-text class="pb-0">
                <h4 class="text-center">Informacion de pago</h4>
              </v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-select
                      prepend-inner-icon="mdi-cash-register"
                      item-text="name"
                      item-value="id"
                      label="Caja*"
                    ></v-select>
                  </v-col>
                  <v-col cols="6" class="vue-money-x-large">
                    <vuetify-money v-model="total" label="Total" readonly />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <vuetify-money
                      v-model="input"
                      label="Dinero ingresado*"
                      dense
                    />
                  </v-col>
                  <v-col cols="6">
                    <vuetify-money
                      v-model="changes"
                      label="Devuelta"
                      readonly
                      dense
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <!-- actions -->
          <v-col cols="4" class="py-0">
            <v-autocomplete
              prepend-icon="mdi-puzzle"
              label="Productos"
              item-text="name"
              item-value="id"
              dense
            ></v-autocomplete>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-autocomplete
              prepend-icon="mdi-note-outline"
              label="Servicios"
              item-text="name"
              item-value="id"
              dense
            ></v-autocomplete>
          </v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-btn class="mr-2" small color="error">Limpiar</v-btn>
            <v-btn small color="secondary">Guardar</v-btn>
          </v-col>
          <!-- Cart sale -->
          <v-col cols="12">
            <v-simple-table fixed-header height="200px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-center">Valor</th>
                    <th class="text-center">Descuento(%)</th>
                    <th class="text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in cart" :key="index">
                    <th>{{ item.name }}</th>
                    <th class="text-center">
                      <plus-minus-field
                        :min="1"
                        :max="10"
                        v-model="item.quantity"
                      ></plus-minus-field>
                    </th>
                    <th class="text-center">{{ item.price }}</th>
                    <th class="text-center">{{ item.discount }}</th>
                    <th class="text-center">
                      <v-btn medium icon color="primary">
                        <v-icon>mdi-close-circle-outline</v-icon>
                      </v-btn>
                    </th>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import VuetifyMoney from "@/components/vuetifyMoney.vue";
import PlusMinusField from "@/components/plusMinusField.vue";

export default {
  data: () => ({
    total: 50000,
    input: 0,
    changes: 0,
    cart: [
      {
        name: "Juguete",
        quantity: 3,
        price: "$50.000",
        discount: 50,
      },
    ],
  }),
  components: {
    VuetifyMoney,
    PlusMinusField,
  },
};
</script>

<style>
.vue-money-x-large .v-text-field__slot input {
  font-size: x-large !important;
}
</style>
