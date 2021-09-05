<template>
  <div>
    <v-data-table
      fixed-header
      :headers="headers"
      :items="lodgings"
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
            <v-icon large>mdi-home-heart</v-icon> Ingresos y salidas
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
          <!-- Modal New entry-->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-3"
                fab
                small
                dark
                color="secondary"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-book-search</v-icon>
              </v-btn>
            </template>
            <span>Consultar Ingresos</span>
          </v-tooltip>

          <!-- Plus Entry -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                dark
                color="info mr-1"
                v-bind="attrs"
                v-on="on"
                @click="dialogEntry = true"
              >
                <v-icon>mdi-plus-thick</v-icon>
              </v-btn>
            </template>
            <span>Agregar ingreso</span>
          </v-tooltip>
        </v-toolbar>
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <!-- Details -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="info mr-1"
              v-bind="attrs"
              v-on="on"
              @click="showPetDetails(item.customer_id, item.pet_id)"
            >
              <v-icon> mdi-paw</v-icon>
            </v-btn>
          </template>
          <span>Detalles Mascotas</span>
        </v-tooltip>

        <!-- Timelines -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="warning mr-1"
              v-bind="attrs"
              v-on="on"
              @click="showFollowUpForm(item.name, item.id)"
            >
              <v-icon>mdi-timeline</v-icon>
            </v-btn>
          </template>
          <span>Seguimiento</span>
        </v-tooltip>

        <!-- Edit in-->
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
          <span>Editar ingreso</span>
        </v-tooltip>

        <!-- Out -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="accent mr-1"
              v-bind="attrs"
              v-on="on"
              @click="showOutputForm(item.name, item.id)"
            >
              <v-icon> mdi-home-import-outline </v-icon>
            </v-btn>
          </template>
          <span>Salir</span>
        </v-tooltip>

        <!-- Delete In -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="error mr-1"
              v-bind="attrs"
              v-on="on"
              @click="deleteItem(item.id, item.name)"
            >
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </template>
          <span>Eliminar</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <entry-form v-model="dialogEntry"></entry-form>

    <output-form
      v-model="dialogOutput"
      :pet_name="pet_name"
      :pet_id="pet_id"
    ></output-form>

    <follow-up-form
      v-model="dialogFollowUp"
      :pet_name="pet_name"
      :pet_id="pet_id"
    ></follow-up-form>

    <entry-pet-details
      v-model="dialogPetDetails"
      :pet="entry_pet_details"
    ></entry-pet-details>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";
import EntryForm from "@/components/lodging/EntryForm.vue";
import OutputForm from "@/components/lodging/OutputForm.vue";
import FollowUpForm from "@/components/lodging/FollowUpForm.vue";
import EntryPetDetails from "@/components/lodging/EntryPetDetails.vue";

export default {
  data: () => ({
    permissions: {},
    dialogPetDetails: false,
    dialogEntry: false,
    dialogOutput: false,
    dialogFollowUp: false,
    pet_name: "",
    pet_id: "",
    search: "",
    headers: [
      {
        text: "Nombre mascota",
        align: "start",
        value: "name",
      },
      { text: "Desayuno", align: "center", value: "breakfast" },
      { text: "Almuerzo", align: "center", value: "lunch" },
      { text: "Cena", align: "center", value: "dinner" },
      { text: "Ingreso", align: "center", value: "arrival_date" },
      { text: "Salida", align: "center", value: "departure_date" },
      { text: "Acciones", align: "center", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    entry_pet_details: {},
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      name: { required, maxLength: maxLength(255) },
    },
  },
  components: {
    EntryForm,
    OutputForm,
    FollowUpForm,
    EntryPetDetails,
  },
  computed: {
    ...mapState(["editIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("lodging", [
      "lodgings",
      "loading",
      "editedItem",
      "defaultItem",
    ]),
    ...mapState("customers", ["personal_infomation"]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Producto" : "Editar Producto";
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required &&
        errors.push("El nombre es requerido");
      !this.$v.editedItem.name.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      this.$v.$reset();
    },
    mainBranchOffice() {
      if (this.permissions.read) {
        this.initialize();
      }
    },
  },

  created() {
    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;

    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
    }
  },

  methods: {
    ...mapActions("lodging", [
      "getAllLodging",
      "getAllAccessories",
      "getAllCustomersPets",
      "getMonitoryByPetLodging",
      "storeProduct",
      "updateProduct",
      "deleteEntry",
      "changeStatusProduct",
    ]),
    ...mapMutations("lodging", ["SET_EDIT_ITEM"]),
    initialize() {
      this.getAllLodging();
      this.getAllAccessories();
      this.getAllCustomersPets();
    },

    showPetDetails(customer_id, pet_id) {
      // Consultar el detalle de la mascota
      this.personal_infomation.id = customer_id;
      this.$router.push({
        path: `/clientes/detalles/${customer_id}/mascota/${pet_id}`,
      });
    },

    showOutputForm(pet_name, pet_id) {
      this.pet_name = pet_name;
      this.pet_id = pet_id;
      this.dialogOutput = true;
    },

    showFollowUpForm(pet_name, lodging_id) {
      this.pet_name = pet_name;
      this.getMonitoryByPetLodging(lodging_id).then((result) => {
        if (result) {
          // search follow up by the last lodging by pet
          this.dialogFollowUp = true;
        }
      });
    },

    deleteItem(id, name) {
      this.$confirm(`¿Seguro quieres eliminar este ingreso de ${name}?`, {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          this.deleteEntry(id);
        }
      });
    },
  },
};
</script>
