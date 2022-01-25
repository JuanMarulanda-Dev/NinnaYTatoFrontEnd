<template>
  <div>
    <v-row>
      <!-- Cash registers -->
      <v-col md="6">
        <v-data-table
          fixed-header
          sort-by="name"
          class="elevation-3"
          :headers="headersCashRegisters"
          :items="cash_registers"
          hide-actions
          select-all
          height="200px"
          :hide-default-footer="true"
          :disable-pagination="true"
          item-key="id"
        >
          <template v-slot:[`item.amount`]="{ item }">
            <v-icon small>{{ moneyIcon }}</v-icon>
            <span>
              {{ currencyFormat(item.amount) }}
            </span>
          </template>
        </v-data-table>
      </v-col>
      <!-- Incomes Plans -->
      <v-col md="6">
        <v-data-table
          fixed-header
          sort-by="name"
          class="elevation-3"
          :headers="headersPlans"
          :items="income_plans"
          hide-actions
          select-all
          height="200px"
          :hide-default-footer="true"
          :disable-pagination="true"
          item-key="id"
        >
          <template v-slot:[`item.total`]="{ item }">
            <v-icon small>{{ moneyIcon }}</v-icon>
            <span>
              {{ currencyFormat(item.total) }}
            </span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          fixed-header
          :headers="headers"
          :items="movements"
          sort-by="name"
          class="elevation-3"
          :loading="loading"
          :loading-text="loadingText"
          item-key="created_at"
        >
          <!-- Header content datatable -->
          <template v-slot:top>
            <v-toolbar flat color="white" class="rounded-xl">
              <!-- Title Module -->
              <v-toolbar-title>
                <v-icon large>mdi-notebook-multiple</v-icon> Movimientos
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
                  @change="researchMovemets()"
                  v-model="startDate"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dialogStart = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.start.save(startDate)"
                  >
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
                <v-date-picker
                  @change="researchMovemets()"
                  v-model="endDate"
                  scrollable
                >
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
                      <v-icon large>mdi-notebook-multiple</v-icon>
                      Nuevo movimiento (Egreso)
                    </span>
                  </v-card-title>

                  <v-card-text>
                    <!-- Form movements -->
                    <v-container>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            v-model="editedItem.mediator"
                            label="Mediador*"
                            required
                            counter="255"
                            :error-messages="mediatorErrors"
                            @input="$v.editedItem.mediator.$touch()"
                            @blur="$v.editedItem.mediator.$touch()"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="6">
                          <v-select
                            v-model="editedItem.egress_type_id"
                            :items="egress_types"
                            class="text-center"
                            item-text="name"
                            item-value="id"
                            label="Grupo*"
                            :error-messages="egressTypeErrors"
                            @input="$v.editedItem.egress_type_id.$touch()"
                            @blur="$v.editedItem.egress_type_id.$touch()"
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
                            v-model="editedItem.total"
                            label="Valor*"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error darken-1" text @click="close"
                      >Cancel</v-btn
                    >
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
            <!-- Definir colores rojo para egresos - verde para ingresos -->
            <span :class="classObject(item.type_movement)">
              {{ item.type_movement === "Egreso" ? "-" : "+" }}
            </span>
            <v-icon small :class="classObject(item.type_movement)">{{
              moneyIcon
            }}</v-icon>
            <span :class="classObject(item.type_movement)">
              {{ currencyFormat(item.total) }}
            </span>
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
                  color="error mr-1"
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteItem(item.id)"
                  v-show="permissions.delete && item.edit"
                >
                  <v-icon> {{ deleteIcon }} </v-icon>
                </v-btn>
              </template>
              <span>Eliminar</span>
            </v-tooltip>

            <!-- Edit -->
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
                  v-show="item.edit"
                >
                  <v-icon> {{ editIcon }} </v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>

            <!-- Notes -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  x-small
                  dark
                  color="info"
                  v-bind="attrs"
                  v-on="on"
                  @click="
                    showNoteFormDialog(
                      item.id,
                      item.created_at,
                      item.note,
                      item.note_type
                    )
                  "
                >
                  <v-icon>mdi-note-text</v-icon>
                </v-btn>
              </template>
              <span>Nota</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Notes dialog -->
    <note-form-dialog
      v-model="dialogNoteForm"
      :id="id_movement"
      :type="note_type"
      :note="note"
      :title="title"
      @saved="updateRowNote($event)"
    ></note-form-dialog>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { required, maxLength, minValue } from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";
import VuetifyMoney from "@/components/vuetifyMoney.vue";
import NoteFormDialog from "@/components/NoteFormDialog.vue";
import moment from "moment";

export default {
  data: () => ({
    permissions: {},
    dialog: false,
    // Notes
    id_movement: "",
    title: "",
    note_type: 0,
    note: "",
    dialogNoteForm: false,

    dialogStart: false,
    dialogEnd: false,

    headers: [
      {
        text: "Fecha",
        align: "start",
        value: "created_at",
      },
      { text: "Mediador", value: "mediator" },
      { text: "Tipo", value: "type_movement" },
      { text: "Grupo", value: "group" },
      { text: "Origin / Destino", value: "cash_register" },
      { text: "Total", value: "total" },
      { text: "Nota", value: "note" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    headersCashRegisters: [
      { text: "Caja", value: "name" },
      { text: "Total", value: "amount" },
    ],
    headersPlans: [
      { text: "Plan", value: "name" },
      { text: "Total", value: "total" },
    ],

    editedIndex: -1,
  }),
  mixins: [validationMixin, moneyFormatMixin],
  validations: {
    editedItem: {
      mediator: { required, maxLength: maxLength(255) },
      egress_type_id: { required },
      cash_register_id: { required },
      total: { required, minValue: minValue(1) },
    },
  },
  created() {
    this.SET_START_DATE(moment().startOf("month").format("YYYY-MM-DD"));
    this.SET_END_DATE(moment().endOf("month").format("YYYY-MM-DD"));
    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;

    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
      this.getAllEgressTypes();
      this.getAllIncomePlans();
      this.getAllCashRegisters(1);
    }
  },
  computed: {
    ...mapState(["deleteIcon", "editIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("movements", [
      "movements",
      "start",
      "end",
      "loading",
      "income_plans",
    ]),
    ...mapState("cash_registers", ["cash_registers"]),
    ...mapState("egresses", ["egress_types", "editedItem", "defaultItem"]),
    mediatorErrors() {
      const errors = [];
      if (!this.$v.editedItem.mediator.$dirty) return errors;
      !this.$v.editedItem.mediator.required &&
        errors.push("El mediador es requerido");
      !this.$v.editedItem.mediator.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    egressTypeErrors() {
      const errors = [];
      if (!this.$v.editedItem.egress_type_id.$dirty) return errors;
      !this.$v.editedItem.egress_type_id.required &&
        errors.push("El grupo es requerido");
      return errors;
    },
    cashRegisterErrors() {
      const errors = [];
      if (!this.$v.editedItem.cash_register_id.$dirty) return errors;
      !this.$v.editedItem.cash_register_id.required &&
        errors.push("El origen es requerido");
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
        this.getAllCashRegisters(1);
      }
    },
  },

  methods: {
    ...mapActions("movements", [
      "getAllMovementsBewteenDates",
      "getAllIncomePlans",
    ]),
    ...mapActions("cash_registers", ["getAllCashRegisters"]),
    ...mapActions("egresses", [
      "getAllEgressTypes",
      "storeEgress",
      "updateEgress",
      "deleteEgress",
    ]),
    ...mapMutations("egresses", ["SET_EDIT_ITEM"]),
    ...mapMutations("movements", ["SET_START_DATE", "SET_END_DATE"]),
    initialize() {
      this.getAllMovementsBewteenDates();
      this.getAllIncomePlans();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
        this.editedIndex = -1;
      });
    },

    editItem(item) {
      this.editedIndex = this.movements.indexOf(item);
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
          this.updateEgress().then((result) => {
            if (result) {
              this.close();
              this.getAllCashRegisters(1);
            }
          });
        } else {
          // Do store
          this.storeEgress().then((result) => {
            if (result) {
              this.close();
              this.getAllCashRegisters(1);
            }
          });
        }
      }
    },

    deleteItem(id) {
      this.$confirm(`¿Seguro quieres eliminar este egreso?`, {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          this.deleteEgress(id).then((result) => {
            if (result) {
              this.initialize();
              this.getAllCashRegisters(1);
            }
          });
        }
      });
    },

    showNoteFormDialog(id, title, note, note_type) {
      this.id_movement = id;
      this.title = "Fecha movimiento: " + title;
      this.note = note ?? "";
      this.note_type = note_type;
      this.dialogNoteForm = true;
    },

    updateRowNote(note) {
      let row = this.movements.find(
        (element) =>
          element.id === this.id_movement &&
          element.note_type === this.note_type
      );
      row.note = note;
    },

    researchMovemets() {
      this.initialize();
    },

    classObject: function (type_movement) {
      return {
        "success--text": type_movement === "Ingreso",
        "error--text": type_movement === "Egreso",
      };
    },
  },

  components: {
    VuetifyMoney,
    NoteFormDialog,
  },
};
</script>
