<template>
  <div>
    <v-data-table
      fixed-header
      :headers="headers"
      :items="turns"
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
            <v-icon large>mdi-alpha-t-circle-outline</v-icon> Turnos
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- Modal New/edit-->
          <v-dialog v-model="dialog" persistent max-width="600px">
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
                  <v-icon large>mdi-alpha-t-circle-outline</v-icon>
                  Nuevo turno
                </span>
              </v-card-title>

              <v-card-text>
                <!-- Form turns -->
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-select
                        v-model="editedItem.collaborator_id"
                        :items="collaborators"
                        class="text-center"
                        item-text="name"
                        item-value="id"
                        label="Colaborador*"
                        :error-messages="collaboratorErrors"
                        @input="$v.editedItem.collaborator_id.$touch()"
                        @blur="$v.editedItem.collaborator_id.$touch()"
                      ></v-select>
                    </v-col>

                    <v-col cols="6">
                      <v-select
                        v-model="editedItem.type_id"
                        :items="types"
                        class="text-center"
                        item-text="name"
                        item-value="id"
                        label="Tipo de*"
                        :error-messages="typeErrors"
                        @input="$v.editedItem.type_id.$touch()"
                        @blur="$v.editedItem.type_id.$touch()"
                      ></v-select>
                    </v-col>

                    <v-col cols="6">
                      <vuetify-money
                        v-model="editedItem.value"
                        label="Valor turno*"
                      />
                    </v-col>

                    <v-col cols="6">
                      <vuetify-money
                        v-model="editedItem.payment"
                        label="Abono*"
                      />
                    </v-col>

                    <v-col cols="6">
                      <vuetify-money
                        v-model="editedItem.total"
                        label="Saldo*"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save()"
                  >Guardar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <!-- price -->
      <template v-slot:[`item.total`]="{ item }">
        <!-- Definir colores rojo para egresos - verde para ingresos -->
        <v-icon small>{{ moneyIcon }}</v-icon>
        {{ currencyFormat(item.total) }}
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <!-- Eliminar (Only egresos) -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="secondary mr-1"
              v-bind="attrs"
              v-on="on"
              @click="deleteItem(item)"
              v-show="permissions.delete"
            >
              <v-icon> {{ deleteIcon }} </v-icon>
            </v-btn>
          </template>
          <span>Eliminar</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <turn-form></turn-form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { required, maxLength, minValue } from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";
import VuetifyMoney from "@/components/vuetifyMoney.vue";

export default {
  data: () => ({
    permissions: {},
    dialog: false,
    id_movement: 0,
    payment_proof: 0,
    note: 0,
    dialogNoteForm: false,
    headers: [
      {
        text: "Fecha",
        align: "start",
        value: "created_at",
      },
      { text: "Colaborador", value: "name" },
      { text: "Turno", value: "turn_type" },
      { text: "Valor", value: "total" },
      { text: "Abono", value: "payment" },
      { text: "Saldo", value: "total" },
      { text: "Nota", value: "note" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
  }),
  mixins: [validationMixin, moneyFormatMixin],
  validations: {
    editedItem: {
      mediator: { required, maxLength: maxLength(255) },
      group: { required },
      cash_register_id: { required },
      total: { required, minValue: minValue(1) },
    },
  },
  computed: {
    ...mapState(["deleteIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("turns", ["turns", "loading", "editedItem", "defaultItem"]),
    mediatorErrors() {
      const errors = [];
      if (!this.$v.editedItem.mediator.$dirty) return errors;
      !this.$v.editedItem.mediator.required &&
        errors.push("El mediador es requerido");
      !this.$v.editedItem.mediator.maxLength &&
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
    ...mapActions("turns", [
      "getAllTurns",
      "storeTurn",
      "updateTurn",
      "deleteTurn",
    ]),
    ...mapMutations("turns", ["SET_EDIT_ITEM"]),
    initialize() {
      this.getAllTurns();
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
          this.updateTurn().then((result) => {
            if (result) {
              this.close();
            }
          });
        } else {
          // Do store
          this.storeTurn().then((result) => {
            if (result) {
              this.close();
            }
          });
        }
      }
    },

    updateRowNote(note) {
      let row = this.movements.find(
        (element) => element.id === this.id_movement
      );
      row.note = note;
    },
  },

  components: {
    VuetifyMoney,
  },
};
</script>
