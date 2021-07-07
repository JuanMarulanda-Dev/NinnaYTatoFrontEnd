<template>
  <v-dialog v-model="dialogPlansDetails" persistent max-width="500px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-alpha-d-circle-outline</v-icon>
          {{ formTitle }}
        </span>
        <v-spacer></v-spacer>
        <!-- A este icono se le va agregar un tooltip para que informe 
        como se debe utilizar correctamente este modulo -->
        <v-icon>mdi-alert-circle-outline</v-icon>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Cantidad*"
                type="number"
                min="0"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Vigencia x días*"
                type="number"
                min="0"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Descuento x Defecto*"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
                item-text="name"
                item-value="id"
                label="Tipo de plan*"
                append-icon="mdi-format-list-bulleted-type"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <vuetify-money
                v-model="valor"
                label="Valor*"
                :readonly="true"
                :options="currencyOptions"
              />
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
import VuetifyMoney from "@/components/vuetifyMoney.vue";

export default {
  name: "plans-details-form",
  data() {
    return {
      valor: 200000,
    };
  },
  props: {
    editedIndex: {
      type: Number,
      required: true,
      default: -1,
    },
  },
  computed: {
    ...mapState(["currencyOptions"]),
    ...mapState("plans_details", ["dialogPlansDetails"]),
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva detalle de plan"
        : "Editar detalle de plan";
    },
  },
  created() {},
  methods: {
    ...mapMutations("plans_details", [
      "SET_DIALOG_PLANS_DETAILS",
      "SET_EDIT_ITEM",
    ]),
    changeStateProduct(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de este producto?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusProduct(item.id).then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackStateProduct(item);
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackStateProduct(item);
        }
      });
    },

    rollbackStateProduct(item) {
      let productsIndex = this.products.indexOf(item);
      this.products[productsIndex].state = !this.products[productsIndex].state;
    },

    close() {
      this.SET_DIALOG_PLANS_DETAILS(false);
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
        this.$emit("resetIndex");
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
  components: {
    VuetifyMoney,
  },
};
</script>
