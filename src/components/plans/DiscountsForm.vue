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
                v-model="editedItem.quantity"
                label="Cantidad*"
                type="number"
                min="0"
                required
                :error-messages="quantityErrors"
                @input="$v.editedItem.quantity.$touch()"
                @blur="$v.editedItem.quantity.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="5">
              <v-text-field
                v-model="editedItem.discount"
                label="Descuento x Defecto*"
                type="number"
                min="0"
                required
                :error-messages="discountErrors"
                @input="$v.editedItem.discount.$touch()"
                @blur="$v.editedItem.discount.$touch()"
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
                    @click="addDiscont()"
                  >
                    <v-icon> mdi-check-bold </v-icon>
                  </v-btn>
                </template>
                <span>Agregar descuento</span>
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
                  <!-- update -->
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

                  <!-- delete -->
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        fab
                        x-small
                        dark
                        color="error"
                        v-bind="attrs"
                        v-on="on"
                        @click="deleteItem()"
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
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapState, mapMutations } from "vuex";
// Validation rule
function onlyQuantity(value) {
  let globalIndex = this.editedIndex;
  return !this.discounts.find(
    (item, index) => item.quantity == value && globalIndex != index
  );
}

export default {
  name: "discounts-form",
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
  mixins: [validationMixin],
  validations: {
    editedItem: {
      quantity: { required, onlyQuantity },
      discount: { required },
    },
  },
  computed: {
    ...mapState(["editIcon", "deleteIcon"]),
    ...mapState("discounts", [
      "dialogDiscount",
      "discounts",
      "editedItem",
      "defaultItem",
    ]),
    quantityErrors() {
      const errors = [];
      if (!this.$v.editedItem.quantity.$dirty) return errors;
      !this.$v.editedItem.quantity.required &&
        errors.push("La cantidad es requerido");
      !this.$v.editedItem.quantity.onlyQuantity &&
        errors.push("Esta cantidad ya existe");
      return errors;
    },
    discountErrors() {
      const errors = [];
      if (!this.$v.editedItem.discount.$dirty) return errors;
      !this.$v.editedItem.discount.required &&
        errors.push("El descuento es requerido");
      return errors;
    },
  },

  created() {},
  methods: {
    ...mapMutations("discounts", [
      "SET_DIALOG_DISCOUNT",
      "SET_EDIT_ITEM",
      "PUSH_NEW_DESCOUNT",
      "DELETE_DESCOUNT",
    ]),

    addDiscont() {
      // Active vuelidate rules to fields
      this.$v.$touch();
      // All validation are valid?
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) {
          // Updated quantity descount
          Object.assign(this.discounts[this.editedIndex], this.editedItem);
          // Reset index
          this.editedIndex = -1;
        } else {
          // Add new quantity descount
          this.PUSH_NEW_DESCOUNT(this.editedItem);
        }
        // Reset edititem by default
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
        // Reset vuelidate rules
        this.$v.$reset();
      }
    },

    editItem(item) {
      this.editedIndex = this.discounts.indexOf(item);
      this.SET_EDIT_ITEM(Object.assign({}, item));
    },

    deleteItem(item) {
      this.editedIndex = this.discounts.indexOf(item);
      this.SET_EDIT_ITEM(Object.assign({}, item));
      // Confirmation to change de status
      this.$confirm("¿Seguro quieres eliminar este descuento?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Delete descount
          this.DELETE_DESCOUNT(this.editedIndex);
        }
      });
    },

    close() {
      // Close dialog
      this.SET_DIALOG_DISCOUNT(false);
      // Reset vuelidate rules
      this.$v.$reset();
      // Reset edititem by default
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
      });
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
