<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="sucursales"
    sort-by="name"
    class="elevation-3"
    :loading="loading"
    :loading-text="loadingText"
  >
    <!-- Header content datatable -->
    <template v-slot:top>
      <v-toolbar flat color="white" class="rounded-xl">
        <!-- Title Module -->
        <v-toolbar-title>
          <v-icon large>mdi-home-group</v-icon> Sucursales
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <!-- Modal New/edit-->
        <v-dialog v-model="dialog" persistent max-width="500px">
          <!-- Button active modal -->
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="secondary"
              elevation="3"
              dark
              v-bind="attrs"
              v-on="on"
              v-show="permissions.create"
            >
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
          </template>
          <!-- Modal Form -->
          <v-card>
            <v-card-title>
              <span class="headline">
                <v-icon large>mdi-home-group</v-icon>
                {{ formTitle }}
              </span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Nombre*"
                      required
                      prepend-inner-icon="mdi-format-letter-matches"
                      counter="255"
                      :error-messages="nameErrors"
                      @input="$v.editedItem.name.$touch()"
                      @blur="$v.editedItem.name.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.address"
                      label="Dirrección*"
                      prepend-inner-icon="mdi-map-marker"
                      counter="255"
                      :error-messages="addressErrors"
                      @input="$v.editedItem.address.$touch()"
                      @blur="$v.editedItem.address.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.phone"
                      label="Telefono*"
                      prepend-inner-icon="mdi-phone"
                      counter="255"
                      :error-messages="phoneErrors"
                      @input="$v.editedItem.phone.$touch()"
                      @blur="$v.editedItem.phone.$touch()"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <!-- State -->
    <template v-slot:[`item.state`]="{ item }">
      <v-switch
        :input-value="item.state"
        v-model="item.state"
        @change="changeStateSucursal(item)"
        v-show="permissions.delete"
      ></v-switch>
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
            v-show="permissions.update"
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
            color="info"
            v-bind="attrs"
            v-on="on"
            @click="goToShowDetailSucursal(item)"
          >
            <v-icon> {{ detailsIcon }} </v-icon>
          </v-btn>
        </template>
        <span>Detalles</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, numeric } from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data: () => ({
    permissions: {},
    dialog: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "name",
      },
      { text: "Dirección", value: "address" },
      { text: "Telefono", value: "phone" },
      { text: "Estado", value: "state" },
      { text: "Creado", value: "created_at" },
      { text: "Eliminado", value: "deleted_at" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      name: { required, maxLength: maxLength(255) },
      address: { required, maxLength: maxLength(255) },
      phone: { required, numeric, maxLength: maxLength(255) },
    },
  },
  computed: {
    ...mapState(["editIcon", "deleteIcon", "detailsIcon", "loadingText"]),
    ...mapState("sucursales", [
      "sucursales",
      "loading",
      "editedItem",
      "defaultItem",
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Sucursal" : "Editar Sucursal";
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
    addressErrors() {
      const errors = [];
      if (!this.$v.editedItem.address.$dirty) return errors;
      !this.$v.editedItem.address.required &&
        errors.push("La dirección es requerido");
      !this.$v.editedItem.address.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.editedItem.phone.$dirty) return errors;
      !this.$v.editedItem.phone.required &&
        errors.push("El telefono es requerido");
      !this.$v.editedItem.phone.maxLength &&
        errors.push("Longitud no permitida");
      !this.$v.editedItem.phone.numeric &&
        errors.push("Solo se permiten numeros");
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
    this.permissions = this.$route.meta.permissions;
    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
    }
  },

  methods: {
    ...mapActions("sucursales", [
      "getAllBranchOffices",
      "storeBranchOffice",
      "updateBranchOffice",
      "changeStatusBranchOffices",
    ]),
    ...mapMutations("sucursales", ["SET_EDIT_ITEM"]),
    initialize() {
      if (this.sucursales.length == 0) {
        this.getAllBranchOffices();
      }
    },

    changeStateSucursal(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de esta sucursal?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusBranchOffices(item.id).then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackStateBranchOffice(item);
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackStateBranchOffice(item);
        }
      });
    },

    rollbackStateBranchOffice(item) {
      let branchOfficeIndex = this.sucursales.indexOf(item);
      this.sucursales[branchOfficeIndex].state =
        !this.sucursales[branchOfficeIndex].state;
    },

    editItem(item) {
      this.editedIndex = this.sucursales.indexOf(item);
      this.SET_EDIT_ITEM(Object.assign({}, item));
      // this.editedItem = ;
      this.dialog = true;
    },

    goToShowDetailSucursal(item) {
      // Esto de desarrollara más adelante
      // Ir a monstrar los detalles de esta sucursal (Caja, stocks, trabajadores, clientes registrados en esa sucursal, mascotas en esa sucursal, sus habitaciones, etc)
      this.editedIndex = this.sucursales.indexOf(item);
      // let itemObject = Object.assign({}, item); // Convertir a un objeto json
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
        this.editedIndex = -1;
      });
    },

    save() {
      // activate validations form
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) {
          // Do update
          this.updateBranchOffice();
        } else {
          // Do store
          this.storeBranchOffice();
        }
        // Close modal
        this.close();
      }
    },
  },
};
</script>
