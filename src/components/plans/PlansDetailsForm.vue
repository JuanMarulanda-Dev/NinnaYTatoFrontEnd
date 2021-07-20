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
        <!-- Info about module -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="primary" dark v-bind="attrs" v-on="on">
              mdi-alert-circle-outline
            </v-icon>
          </template>
          <span>
            * Si la vigencia x dias es igual a 0 el detalle registrado no tendra
            una vigencia establecida.
          </span>
        </v-tooltip>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
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
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                v-model="editedItem.validity"
                label="Vigencia x días*"
                type="number"
                min="0"
                required
                :error-messages="validityErrors"
                @input="$v.editedItem.validity.$touch()"
                @blur="$v.editedItem.validity.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
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
            <v-col cols="12" sm="6" md="6">
              <v-select
                v-model="editedItem.plan_id"
                :items="active_plans"
                item-text="name"
                item-value="id"
                label="Unidad del plan*"
                append-icon="mdi-format-list-bulleted-type"
                :error-messages="plan_idErrors"
                @input="$v.editedItem.plan_id.$touch()"
                @blur="$v.editedItem.plan_id.$touch()"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <vuetify-money
                v-model="valorBruto"
                label="Valor Bruto*"
                :readonly="true"
              />
            </v-col>
            <v-col cols="12">
              <vuetify-money
                v-model="valorNeto"
                label="Valor neto"
                :readonly="true"
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
import { validationMixin } from "vuelidate";
import { required, maxLength, numeric } from "vuelidate/lib/validators";
import { mapState, mapMutations, mapActions } from "vuex";
import VuetifyMoney from "@/components/vuetifyMoney.vue";

export default {
  name: "plans-details-form",
  data() {
    return {};
  },
  props: {
    editedIndex: {
      type: Number,
      required: true,
      default: -1,
    },
  },
  mixins: [validationMixin],
  validations: {
    editedItem: {
      quantity: { required, maxLength: maxLength(11), numeric },
      validity: { required, maxLength: maxLength(11), numeric },
      discount: { required, maxLength: maxLength(11), numeric },
      plan_id: { required },
    },
  },
  computed: {
    valorBruto() {
      let plan = this.plans.find((item) => item.id == this.editedItem.plan_id);
      let valor_plan = plan === undefined ? 0 : plan.equivalence * plan.price;
      return this.editedItem.quantity * valor_plan;
    },
    valorNeto() {
      let valor_bruto = this.valorBruto;
      let valor_neto =
        valor_bruto - (valor_bruto * this.editedItem.discount) / 100;
      return valor_neto;
    },
    active_plans() {
      return this.plans.filter((item) => item.state == true);
    },
    ...mapState("plans", ["plans"]),
    ...mapState("plans_details", [
      "editedItem",
      "defaultItem",
      "dialogPlansDetails",
    ]),
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva detalle de plan"
        : "Editar detalle de plan";
    },
    quantityErrors() {
      const errors = [];
      if (!this.$v.editedItem.quantity.$dirty) return errors;
      !this.$v.editedItem.quantity.required &&
        errors.push("La cantidad es requerida");
      !this.$v.editedItem.quantity.numeric &&
        errors.push("La cantidad debe ser un numero");
      !this.$v.editedItem.quantity.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    validityErrors() {
      const errors = [];
      if (!this.$v.editedItem.validity.$dirty) return errors;
      !this.$v.editedItem.validity.required &&
        errors.push("La vigencia es requerida");
      !this.$v.editedItem.validity.numeric &&
        errors.push("La vigencia debe ser un numero");
      !this.$v.editedItem.validity.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    discountErrors() {
      const errors = [];
      if (!this.$v.editedItem.discount.$dirty) return errors;
      !this.$v.editedItem.discount.required &&
        errors.push("El descuento es requerido");
      !this.$v.editedItem.discount.numeric &&
        errors.push("El descuento debe ser un numero");
      !this.$v.editedItem.discount.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    plan_idErrors() {
      const errors = [];
      if (!this.$v.editedItem.plan_id.$dirty) return errors;
      !this.$v.editedItem.plan_id.required &&
        errors.push("La unidad de plan es requerida");
      return errors;
    },
  },
  created() {},
  methods: {
    ...mapMutations("plans_details", [
      "SET_DIALOG_PLANS_DETAILS",
      "SET_EDIT_ITEM",
    ]),
    ...mapActions("plans_details", ["storePlanDetail", "updatePlanDetail"]),

    close() {
      this.SET_DIALOG_PLANS_DETAILS(false);
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
        this.$emit("resetIndex");
      });
    },

    save() {
      // activate validations form
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) {
          // Do update
          this.updatePlanDetail().then((result) => {
            if (result) {
              this.close();
            }
          });
        } else {
          // Do store
          this.storePlanDetail().then((result) => {
            if (result) {
              this.close();
            }
          });
        }
      }
    },
  },
  components: {
    VuetifyMoney,
  },
};
</script>
