<template>
  <div>
    <v-data-table
      fixed-header
      :headers="headers"
      :items="products"
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
              @click="editItem(item)"
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
              @click="editItem(item)"
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
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";
import EntryForm from "@/components/lodging/EntryForm.vue";
import OutputForm from "@/components/lodging/OutputForm.vue";
import FollowUpForm from "@/components/lodging/FollowUpForm.vue";

export default {
  data: () => ({
    permissions: {},
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
      { text: "Desayuno", align: "center", value: "price" },
      { text: "Almuerzo", align: "center", value: "stock" },
      { text: "Cena", align: "center", value: "state" },
      { text: "Ingreso", align: "center", value: "created_at" },
      { text: "Salida", align: "center", value: "deleted_at" },
      { text: "Acciones", align: "center", value: "actions", sortable: false },
    ],
    editedIndex: -1,
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
  },
  computed: {
    ...mapState(["editIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("lodging", [
      "products",
      "loading",
      "editedItem",
      "defaultItem",
    ]),
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
      "getAllProducts",
      "storeProduct",
      "updateProduct",
      "changeStatusProduct",
    ]),
    ...mapMutations("lodging", ["SET_EDIT_ITEM"]),
    initialize() {
      this.getAllProducts();
    },

    showOutputForm(pet_name, pet_id) {
      this.pet_name = pet_name;
      this.pet_id = pet_id;
      this.dialogOutput = true;
    },

    showFollowUpForm(pet_name, pet_id) {
      this.pet_name = pet_name;
      this.pet_id = pet_id;
      // search follow up by the last lodging by pet
      this.dialogFollowUp = true;
    },
  },
};
</script>
