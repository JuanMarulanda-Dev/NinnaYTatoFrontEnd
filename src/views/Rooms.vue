<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="rooms"
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
          <v-icon large>mdi-home-modern</v-icon> Habitaciones
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
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.capacity"
                      label="Capacidad*"
                      type="number"
                      min="1"
                      required
                      counter="255"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-center">
                    <v-color-picker
                      v-model="editedItem.color"
                      dot-size="25"
                      hide-mode-switch
                      swatches-max-height="200"
                      mode="hexa"
                    ></v-color-picker>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save()">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <!-- color -->
    <template v-slot:[`item.color`]="{ item }">
      <v-chip dark :color="item.color">{{ item.color }}</v-chip>
    </template>

    <!-- State -->
    <template v-slot:[`item.state`]="{ item }">
      <v-switch
        :input-value="item.state"
        v-model="item.state"
        @change="changeStateRoom(item)"
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
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { required, maxLength } from "vuelidate/lib/validators";
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
      { text: "Color", value: "color" },
      { text: "Capacidad", value: "capacity" },
      { text: "Estado", value: "state" },
      { text: "Creado", value: "created_at" },
      { text: "Eliminado", value: "deleted_at" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
  }),
  mixins: [validationMixin, moneyFormatMixin],
  validations: {
    editedItem: {
      name: { required, maxLength: maxLength(255) },
    },
  },
  computed: {
    ...mapState(["editIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("rooms", ["rooms", "loading", "editedItem", "defaultItem"]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Habitación" : "Editar Habitación";
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
    ...mapActions("rooms", [
      "getAllRooms",
      "storeRoom",
      "updateRoom",
      "changeStatusRoom",
    ]),
    ...mapMutations("rooms", ["SET_EDIT_ITEM"]),
    initialize() {
      this.getAllRooms();
    },

    changeStateRoom(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de este producto?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusRoom(item.id).then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackStateRoom(item);
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackStateRoom(item);
        }
      });
    },

    rollbackStateRoom(item) {
      let roomIndex = this.rooms.indexOf(item);
      this.rooms[roomIndex].state = !this.rooms[roomIndex].state;
    },

    editItem(item) {
      this.editedIndex = this.rooms.indexOf(item);
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
          this.updateRoom().then((result) => {
            if (result) {
              this.close();
            }
          });
        } else {
          // Do store
          this.storeRoom().then((result) => {
            if (result) {
              this.close();
            }
          });
        }
      }
    },
  },
};
</script>
