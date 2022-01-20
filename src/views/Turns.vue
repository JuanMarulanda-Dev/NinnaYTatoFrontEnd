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
          <!-- Filter date start -->
          <v-dialog
            ref="start"
            v-model="dialogStart"
            :return-value.sync="startDate"
            persistent
            width="290px"
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mt-8"
                v-model="startDate"
                label="Fecha"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              @change="getAllTurns()"
              v-model="startDate"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogStart = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.start.save(startDate)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
          <!-- Filter date end -->
          <v-dialog
            ref="end"
            v-model="dialogEnd"
            :return-value.sync="endDate"
            persistent
            width="290px"
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mt-8"
                v-model="endDate"
                label="Fecha"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker @change="getAllTurns()" v-model="endDate" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogEnd = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.end.save(endDate)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
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
                  {{ formTitle }}
                </span>
              </v-card-title>

              <v-card-text>
                <!-- Form turns -->
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-dialog
                        ref="date"
                        v-model="dialogDate"
                        :return-value.sync="editedItem.date"
                        persistent
                        width="290px"
                        :retain-focus="false"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.date"
                            label="Fecha"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="editedItem.date" scrollable>
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="dialogDate = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.date.save(editedItem.date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>

                    <v-col cols="6">
                      <v-select
                        v-model="editedItem.user_id"
                        :items="collaborators"
                        class="text-center"
                        item-text="name"
                        item-value="id"
                        label="Colaborador*"
                        :error-messages="collaboratorErrors"
                        @input="$v.editedItem.user_id.$touch()"
                        @blur="$v.editedItem.user_id.$touch()"
                      ></v-select>
                    </v-col>

                    <v-col cols="6">
                      <v-select
                        v-model="editedItem.turn_type_id"
                        :items="turn_types"
                        class="text-center"
                        item-text="name"
                        item-value="id"
                        label="Tipo de*"
                        :error-messages="turnTypeErrors"
                        @input="$v.editedItem.turn_type_id.$touch()"
                        @blur="$v.editedItem.turn_type_id.$touch()"
                      ></v-select>
                    </v-col>

                    <v-col cols="6">
                      <v-select
                        v-model="editedItem.cash_register_id"
                        :items="cash_registers"
                        class="text-center"
                        item-text="name"
                        item-value="id"
                        label="Origen*"
                        :error-messages="cashRegisterErrors"
                        @input="$v.editedItem.cash_register_id.$touch()"
                        @blur="$v.editedItem.cash_register_id.$touch()"
                      ></v-select>
                    </v-col>

                    <v-col cols="6">
                      <vuetify-money
                        v-model="getValueByTurnType"
                        label="Valor turno*"
                      />
                    </v-col>

                    <v-col cols="6">
                      <vuetify-money
                        v-model="editedItem.payment"
                        label="Abono*"
                      />
                    </v-col>

                    <v-col cols="12">
                      <vuetify-money
                        v-model="getRemainderByCollaborator"
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

      <!-- total -->
      <template v-slot:[`item.total`]="{ item }">
        <v-icon small>{{ moneyIcon }}</v-icon>
        {{ currencyFormat(item.total) }}
      </template>

      <!-- total -->
      <template v-slot:[`item.payment`]="{ item }">
        <v-icon small>{{ moneyIcon }}</v-icon>
        {{ currencyFormat(item.payment) }}
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <!-- Eliminar -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              dark
              color="error mr-1"
              v-bind="attrs"
              v-on="on"
              @click="deleteItem(item.id)"
              v-show="permissions.delete"
            >
              <v-icon> {{ deleteIcon }} </v-icon>
            </v-btn>
          </template>
          <span>Eliminar</span>
        </v-tooltip>

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
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { required, minValue } from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";
import VuetifyMoney from "@/components/vuetifyMoney.vue";
import moment from "moment";

export default {
  data: () => ({
    permissions: {},
    dialog: false,
    id_turn: 0,
    payment_proof: 0, // esto no se va a utilizar más
    note: 0,
    dialogNoteForm: false,

    dialogStart: false,
    dialogEnd: false,
    dialogDate: false,

    headers: [
      {
        text: "Fecha",
        align: "start",
        value: "date",
      },
      { text: "Colaborador", value: "name" },
      { text: "Turno", value: "turn_type" },
      { text: "Valor", value: "total" },
      { text: "Abono", value: "payment" },
      { text: "Nota", value: "note" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
  }),
  mixins: [validationMixin, moneyFormatMixin],
  validations: {
    editedItem: {
      user_id: { required },
      date: { required },
      turn_type_id: { required },
      cash_register_id: { required },
      payment: { required, minValue: minValue(0) },
    },
  },

  created() {
    this.SET_START_DATE(moment().startOf("month").format("YYYY-MM-DD"));
    this.SET_END_DATE(moment().endOf("month").format("YYYY-MM-DD"));
    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;

    if (this.turn_types.length == 0) {
      this.getAllTurnTypes();
    }

    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
      this.getAllCashRegisters(1);
    }
  },

  computed: {
    ...mapState(["deleteIcon", "editIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("turns", [
      "turns",
      "turn_types",
      "collaborators",
      "loading",
      "editedItem",
      "defaultItem",
      "start",
      "end",
    ]),
    ...mapState("cash_registers", ["cash_registers"]),

    formTitle() {
      return this.editedIndex === -1 ? "Nueva Turno" : "Editar Turno";
    },

    getValueByTurnType() {
      let total = 0;
      if (this.editedItem.turn_type_id != "") {
        total = this.turn_types.find(
          (item) => item.id === this.editedItem.turn_type_id
        ).value;
      }
      return total;
    },

    getRemainderByCollaborator() {
      let saldo = 0;
      if (this.editedItem.user_id != "") {
        saldo = this.collaborators.find(
          (item) => item.id === this.editedItem.user_id
        ).remainder;
      }
      return saldo;
    },

    collaboratorErrors() {
      const errors = [];
      if (!this.$v.editedItem.user_id.$dirty) return errors;
      !this.$v.editedItem.user_id.required &&
        errors.push("El colaborador es requerido");
      return errors;
    },

    dateErrors() {
      const errors = [];
      if (!this.$v.editedItem.date.$dirty) return errors;
      !this.$v.editedItem.date.required && errors.push("La fecha es requerida");
      return errors;
    },

    turnTypeErrors() {
      const errors = [];
      if (!this.$v.editedItem.turn_type_id.$dirty) return errors;
      !this.$v.editedItem.turn_type_id.required &&
        errors.push("El tipo es requerido");
      return errors;
    },

    cashRegisterErrors() {
      const errors = [];
      if (!this.$v.editedItem.cash_register_id.$dirty) return errors;
      !this.$v.editedItem.cash_register_id.required &&
        errors.push("La caja es requerida");
      return errors;
    },

    totalErrors() {
      const errors = [];
      if (!this.$v.editedItem.total.$dirty) return errors;
      !this.$v.editedItem.total.required &&
        errors.push("El total es requerido");
      return errors;
    },

    paymentErrors() {
      const errors = [];
      if (!this.$v.editedItem.payment.$dirty) return errors;
      !this.$v.editedItem.payment.required &&
        errors.push("El abono es requerido");
      !this.$v.editedItem.payment.minValue &&
        errors.push("El abono no puede ser 0");
      return errors;
    },

    startDate: {
      get: function () {
        return this.start;
      },
      set: function (newValue) {
        this.SET_START_DATE(newValue);
      },
    },
    endDate: {
      get: function () {
        return this.end;
      },
      set: function (newValue) {
        this.SET_END_DATE(newValue);
      },
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
        this.getAllCollaborators();
        this.getAllCashRegisters(1);
      }
    },
  },
  methods: {
    ...mapActions("turns", [
      "getAllTurns",
      "storeTurn",
      "updateTurn",
      "deleteTurn",
      "getAllTurnTypes",
      "getAllCollaborators",
    ]),

    ...mapActions("cash_registers", ["getAllCashRegisters"]),
    ...mapMutations("turns", [
      "SET_EDIT_ITEM",
      "SET_START_DATE",
      "SET_END_DATE",
    ]),
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

    editItem(item) {
      this.editedIndex = this.turns.indexOf(item);
      this.SET_EDIT_ITEM(Object.assign({}, item));
      this.dialog = true;
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

    deleteItem(id) {
      this.$confirm(`¿Seguro quieres eliminar este turno?`, {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          this.deleteTurn(id).then((result) => {
            if (result) {
              this.getAllTurns();
            }
          });
        }
      });
    },

    updateRowNote(note) {
      let row = this.movements.find((element) => element.id === this.id_turn);
      row.note = note;
    },
  },

  components: {
    VuetifyMoney,
  },
};
</script>
