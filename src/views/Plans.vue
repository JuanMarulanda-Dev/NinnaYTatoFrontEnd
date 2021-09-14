<template>
  <div>
    <!-- Plans details -->
    <v-data-table
      fixed-header
      :headers="headers"
      :items="plans_details"
      sort-by="name"
      class="elevation-3"
      :search="search"
      :loading="loading"
      :loading-text="loadingText"
    >
      <!-- Header content datatable -->
      <template v-slot:top>
        <v-toolbar flat color="white" class="rounded-xl">
          <!-- Title Module -->
          <v-toolbar-title>
            <v-icon large>mdi-note-outline</v-icon> Planes y Servicios
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- Search Field -->
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>

          <!-- Modal New/edit Plans details-->
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
                @click="SET_DIALOG_PLANS(true)"
                class="mr-1 ml-3"
                v-show="permissions.create"
              >
                <v-icon>mdi-alpha-p-circle-outline</v-icon>
              </v-btn>
            </template>
            <span>Unidad de planes</span>
          </v-tooltip>

          <!-- Modal New/edit Plans-->
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
                @click="SET_DIALOG_PLANS_DETAILS(true)"
                class="mr-1"
                v-show="permissions.create"
              >
                <v-icon>mdi-alpha-d-circle-outline</v-icon>
              </v-btn>
            </template>
            <span>Detalle de Planes</span>
          </v-tooltip>
        </v-toolbar>
      </template>

      <!-- Full value -->
      <template v-slot:[`item.full_value`]="{ item }">
        <v-icon small>{{ moneyIcon }}</v-icon>
        {{ currencyFormat(item.full_value) }}
      </template>

      <!-- State -->
      <template v-slot:[`item.state`]="{ item }">
        <v-switch
          :input-value="item.state"
          v-model="item.state"
          @change="changeStatePlanDetail(item)"
          v-show="permissions.delete"
        ></v-switch>
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <!-- Descuentos -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="orange accent-2 mr-1"
              v-bind="attrs"
              v-on="on"
              @click="showDiscountModule(item.id, item.name)"
              v-show="permissions.update"
            >
              <v-icon> mdi-sale </v-icon>
            </v-btn>
          </template>
          <span>Descuentos</span>
        </v-tooltip>
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
              v-show="permissions.update"
            >
              <v-icon> {{ editIcon }} </v-icon>
            </v-btn>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <!-- Modal New/edit Plans form-->
    <plans-form></plans-form>

    <!-- Modal New/edit Plans details form-->
    <plans-details-form
      @resetIndex="editedIndex = -1"
      :editedIndex="editedIndex"
    ></plans-details-form>

    <!-- Modal Discounts form -->
    <discounts-form :discount_name="discount_name"></discounts-form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { required, maxLength } from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";
import PlansForm from "@/components/plans/PlansForm.vue";
import PlansDetailsForm from "@/components/plans/PlansDetailsForm.vue";
import DiscountsForm from "@/components/plans/DiscountsForm.vue";

export default {
  data: () => ({
    search: "",
    headers: [
      { text: "Nombre", value: "name" },
      { text: "Cantidad", value: "quantity", align: "center" },
      { text: "Descuento (%)", value: "discount", align: "center" },
      { text: "Valor bruto", value: "full_value", align: "center" },
      { text: "Vigencia (Días)", value: "validity", align: "center" },
      { text: "Estado", value: "state" },
      { text: "Creado", value: "created_at" },
      { text: "Eliminado", value: "deleted_at" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    discount_name: "",
  }),
  mixins: [validationMixin, moneyFormatMixin],
  validations: {
    editedItem: {
      name: { required, maxLength: maxLength(255) },
      supplier_id: { required },
    },
  },
  computed: {
    ...mapState("plans", ["dialogPlans", "permissions"]),
    ...mapState(["editIcon", "loadingText"]),
    ...mapState("plans_details", [
      "plans_details",
      "loading",
      "editedItem",
      "defaultItem",
      "dialogPlansDetails",
    ]),

    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push("El nombre es requerido");
      !this.$v.editedItem.name.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    supplierErrors() {
      const errors = [];
      if (!this.$v.editedItem.supplier_id.$dirty) return errors;
      !this.$v.editedItem.supplier_id.required &&
        errors.push("El proveedor es requerido");
      return errors;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      this.$v.$reset();
    },
  },

  created() {
    // Obtener los permisos
    this.SET_PERMISSIONS(this.$route.meta.permissions);

    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
    }
  },

  methods: {
    ...mapActions("plans", ["getAllPlans"]),
    ...mapActions("discounts", ["getAllDiscountByPlanDetail"]),
    ...mapActions("plans_details", [
      "getAllPlansDetails",
      "changeStatusPlanDetail",
    ]),
    ...mapMutations("plans_details", [
      "SET_DIALOG_PLANS_DETAILS",
      "SET_EDIT_ITEM",
    ]),
    ...mapMutations("discounts", [
      "SET_DIALOG_DISCOUNT",
      "SET_ID_PLAN_DETAILS",
    ]),
    ...mapMutations("plans", ["SET_DIALOG_PLANS", "SET_PERMISSIONS"]),
    initialize() {
      // Traer solo los planes activos
      this.getAllPlans(1);
      //
      if (this.plans_details.length === 0) {
        this.getAllPlansDetails();
      }
    },

    changeStatePlanDetail(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de este producto?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusPlanDetail(item.id).then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackStatePlanDetail(item);
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackStatePlanDetail(item);
        }
      });
    },

    rollbackStatePlanDetail(item) {
      let plansDetailsIndex = this.plans_details.indexOf(item);
      this.plans_details[plansDetailsIndex].state =
        !this.plans_details[plansDetailsIndex].state;
    },

    editItem(item) {
      this.editedIndex = this.plans_details.indexOf(item);
      this.SET_EDIT_ITEM(Object.assign({}, item));
      this.SET_DIALOG_PLANS_DETAILS(true);
    },

    showDiscountModule(id, name) {
      this.SET_ID_PLAN_DETAILS(id);
      this.discount_name = name;
      this.getAllDiscountByPlanDetail(id).then((result) => {
        if (result) {
          // Show Dialog discounts
          this.SET_DIALOG_DISCOUNT(true);
        }
      });
    },
  },
  components: {
    PlansForm,
    PlansDetailsForm,
    DiscountsForm,
  },
};
</script>
