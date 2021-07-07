<template>
  <v-dialog v-model="dialogDiscount" persistent max-width="700px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-alpha-d-circle-outline</v-icon>
          Descuentos <small>(Plan - 4 Horas)</small>
        </span>
        <v-spacer></v-spacer>
        <!-- A este icono se le va agregar un tooltip para que informe 
        como se debe utilizar correctamente este modulo -->
        <v-icon>mdi-alert-circle-outline</v-icon>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="5">
              <v-text-field
                label="Cantidad*"
                type="number"
                min="0"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="5">
              <v-text-field
                label="Descuento x Defecto*"
                required
              ></v-text-field>
            </v-col>
            <v-col
              class="d-flex justify-center align-center"
              cols="12"
              sm="6"
              md="2"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    x-small
                    dark
                    color="secondary"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon> mdi-check-bold </v-icon>
                  </v-btn>
                </template>
                <span>Guardar descuento</span>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-data-table
                height="200"
                :headers="headers"
                :items="discounts"
                fixed-header
                hide-default-footer
                class="elevation-1"
              >
                <!-- Discount -->
                <template v-slot:[`item.discount`]="{ item }">
                  {{ item.discount }} %
                </template>

                <!-- Actions -->
                <template v-slot:[`item.actions`]="{ item }">
                  <!-- Editar -->
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        fab
                        x-small
                        dark
                        color="secondary mr-1"
                        v-bind="attrs"
                        v-on="on"
                        @click="editItem(item)"
                      >
                        <v-icon> {{ editIcon }} </v-icon>
                      </v-btn>
                    </template>
                    <span>Editar</span>
                  </v-tooltip>

                  <!-- Detalles sucursal -->
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        fab
                        x-small
                        dark
                        color="error"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon> {{ deleteIcon }} </v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close()"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="save()"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "discounts-form",
  data() {
    return {
      headers: [
        {
          text: "Cantidad",
          align: "center",
          value: "quantity",
        },
        { text: "Descuento %", align: "center", value: "discount" },
        { text: "Acciones", align: "center", value: "actions" },
      ],
      discounts: [
        {
          quantity: 4,
          discount: 50,
        },
        {
          quantity: 4,
          discount: 50,
        },
      ],
    };
  },
  computed: {
    ...mapState(["editIcon", "deleteIcon"]),
    ...mapState("discounts", ["dialogDiscount", "discounts"]),
  },
  created() {},
  methods: {
    ...mapMutations("discounts", ["SET_DIALOG_DISCOUNT"]),

    close() {
      this.SET_DIALOG_DISCOUNT(false);
      // this.$nextTick(() => {
      //   this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
      // });
    },

    save() {
      // activate validations form
      // this.$v.$touch();
      // // Correct validations
      // if (!this.$v.$invalid) {
      //   if (this.editedIndex > -1) {
      //     // Do update
      //     this.updateProduct();
      //   } else {
      //     // Do store
      //     this.storeProduct();
      //   }
      //   // Close modal
      this.close();
      // }
    },
  },
};
</script>
