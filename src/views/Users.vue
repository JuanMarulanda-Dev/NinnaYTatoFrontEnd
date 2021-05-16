<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="users"
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
          <v-icon large>mdi-account-multiple</v-icon> Users
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
                <v-icon large>mdi-account-multiple</v-icon>
                {{ formTitle }}
              </span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="editedItem.first_name"
                      label="Nombres*"
                      required
                      prepend-inner-icon="mdi-format-letter-matches"
                      counter="255"
                      :error-messages="first_nameErrors"
                      @input="$v.editedItem.first_name.$touch()"
                      @blur="$v.editedItem.first_name.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.last_name"
                      label="Apellidos*"
                      prepend-inner-icon="mdi-format-letter-matches"
                      counter="255"
                      :error-messages="last_nameErrors"
                      @input="$v.editedItem.last_name.$touch()"
                      @blur="$v.editedItem.last_name.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.email"
                      label="Email*"
                      prepend-inner-icon="mdi-at"
                      counter="255"
                      :error-messages="emailErrors"
                      @input="$v.editedItem.email.$touch()"
                      @blur="$v.editedItem.email.$touch()"
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
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      :items="roles"
                      item-text="name"
                      item-value="id"
                      label="Rol"
                      v-model="editedItem.role_id"
                      dense
                      append-icon="mdi-account-supervisor-circle"
                      :error-messages="rolErrors"
                      @input="$v.editedItem.role_id.$touch()"
                      @blur="$v.editedItem.role_id.$touch()"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      :items="branchOffices"
                      item-text="name"
                      item-value="id"
                      label="Sucursal"
                      v-model="editedItem.branch_office_id"
                      dense
                      append-icon="mdi-office-building-marker"
                      :error-messages="branch_officeErrors"
                      @input="$v.editedItem.branch_office_id.$touch()"
                      @blur="$v.editedItem.branch_office_id.$touch()"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      type="password"
                      v-model="editedItem.password"
                      label="Contraseña*"
                      prepend-inner-icon="mdi-lock"
                      counter="25"
                      :error-messages="passwordErrors"
                      @input="$v.editedItem.password.$touch()"
                      @blur="$v.editedItem.password.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      type="password"
                      v-model="editedItem.password_confirmation"
                      label="Confirmar contraseña*"
                      prepend-inner-icon="mdi-lock"
                      counter="25"
                      :error-messages="password_confirmationErrors"
                      @input="$v.editedItem.password_confirmation.$touch()"
                      @blur="$v.editedItem.password_confirmation.$touch()"
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
    </template>
  </v-data-table>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  numeric,
  email,
  sameAs,
  minLength,
} from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data: () => ({
    permissions: {},
    dialog: false,
    headers: [
      {
        text: "Nombre",
        align: "start",
        value: "first_name",
      },
      { text: "Rol", value: "role" },
      { text: "Sucursal", value: "branch_office" },
      { text: "Estado", value: "state" },
      { text: "Creado", value: "created_at" },
      { text: "Eliminado", value: "deleted_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      first_name: { required, maxLength: maxLength(255) },
      last_name: { required, maxLength: maxLength(255) },
      phone: { required, numeric, maxLength: maxLength(255) },
      email: { required, maxLength: maxLength(255), email },
      role_id: { required },
      branch_office_id: { required },
      password: {
        required,
        maxLength: maxLength(25),
        minLength: minLength(8),
      },
      password_confirmation: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(25),
        sameAsPassword: sameAs("password"),
      },
    },
  },
  computed: {
    ...mapState(["editIcon", "deleteIcon", "detailsIcon", "loadingText"]),
    ...mapState("users", [
      "users",
      "loading",
      "editedItem",
      "defaultItem",
      "branchOffices",
      "roles",
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Usuario" : "Editar Usuario";
    },
    first_nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.first_name.$dirty) return errors;
      !this.$v.editedItem.first_name.required &&
        errors.push("El nombre es requerido.");
      !this.$v.editedItem.first_name.maxLength &&
        errors.push("Longitud no permitida.");
      return errors;
    },
    last_nameErrors() {
      const errors = [];
      if (!this.$v.editedItem.last_name.$dirty) return errors;
      !this.$v.editedItem.last_name.required &&
        errors.push("El nombre es requerido.");
      !this.$v.editedItem.last_name.maxLength &&
        errors.push("Longitud no permitida.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.editedItem.email.$dirty) return errors;
      !this.$v.editedItem.email.required &&
        errors.push("El email es requerido.");
      !this.$v.editedItem.email.maxLength &&
        errors.push("Longitud no permitida.");
      !this.$v.editedItem.email.email && errors.push("No es un email valido.");
      return errors;
    },

    phoneErrors() {
      const errors = [];
      if (!this.$v.editedItem.phone.$dirty) return errors;
      !this.$v.editedItem.phone.required &&
        errors.push("El telefono es requerido.");
      !this.$v.editedItem.phone.maxLength &&
        errors.push("Longitud no permitida.");
      !this.$v.editedItem.phone.numeric &&
        errors.push("Solo se permiten numeros.");
      return errors;
    },

    rolErrors() {
      const errors = [];
      if (!this.$v.editedItem.role_id.$dirty) return errors;
      !this.$v.editedItem.role_id.required &&
        errors.push("El rol es requerido.");
      return errors;
    },

    branch_officeErrors() {
      const errors = [];
      if (!this.$v.editedItem.role_id.$dirty) return errors;
      !this.$v.editedItem.role_id.required &&
        errors.push("La sucursal es requerido.");
      return errors;
    },

    passwordErrors() {
      const errors = [];
      if (this.editedItem.id == 0 || this.editedItem.password) {
        if (!this.$v.editedItem.password.$dirty) return errors;
        !this.$v.editedItem.password.required &&
          errors.push("La contraseña es requerida.");
        !this.$v.editedItem.password.minLength &&
          errors.push("Minimo 8 caracteres.");
        !this.$v.editedItem.password.maxLength &&
          errors.push("Maximo 25 caracteres.");
      }
      return errors;
    },

    password_confirmationErrors() {
      const errors = [];
      if (this.editedItem.id == 0 || this.editedItem.password_confirmation) {
        if (!this.$v.editedItem.password_confirmation.$dirty) return errors;
        !this.$v.editedItem.password_confirmation.required &&
          errors.push("La confirmacion es requerida.");
        !this.$v.editedItem.password_confirmation.minLength &&
          errors.push("Minimo 8 caracteres.");
        !this.$v.editedItem.password_confirmation.sameAsPassword &&
          errors.push("Las contraseñas no coinciden.");
        !this.$v.editedItem.password_confirmation.maxLength &&
          errors.push("Maximo 25 caracteres.");
      }
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
    ...mapActions("users", [
      "getAllUsers",
      "getAllRoles",
      "getBranchOfficesAvailable",
      "storeUser",
      "updateBranchOffice",
      "changeStatusBranchOffices",
    ]),
    ...mapMutations("users", ["SET_EDIT_ITEM"]),
    initialize() {
      this.getAllRoles();
      this.getBranchOfficesAvailable();
      this.getAllUsers();
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
      let branchOfficeIndex = this.users.indexOf(item);
      this.users[branchOfficeIndex].state = !this.users[branchOfficeIndex]
        .state;
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.SET_EDIT_ITEM(Object.assign({}, item));
      // this.editedItem = ;
      this.dialog = true;
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
          this.storeUser().then((result) => {
            if (result) {
              // Close modal
              this.close();
            }
          });
        }
      }
    },
  },
};
</script>
