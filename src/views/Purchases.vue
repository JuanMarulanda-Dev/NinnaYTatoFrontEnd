<template>
  <div>
    <v-data-table
      fixed-header
      :headers="headersPurchases"
      :items="purchases"
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
            <v-icon large>mdi-clipboard-text</v-icon> Compras
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
                  <v-icon large>mdi-clipboard-text</v-icon>
                  Registrar Compra
                </span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="editedItem.product_id"
                        label="Producto*"
                        item-text="name"
                        item-value="id"
                        :items="products"
                        :error-messages="productErrors"
                        @input="$v.editedItem.product_id.$touch()"
                        @blur="$v.editedItem.product_id.$touch()"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-autocomplete
                        v-model="editedItem.supplier_id"
                        label="Proveedor*"
                        item-text="name"
                        item-value="id"
                        :items="suppliers"
                        :error-messages="supplierErrors"
                        @input="$v.editedItem.supplier_id.$touch()"
                        @blur="$v.editedItem.supplier_id.$touch()"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <vuetify-money
                        v-model="editedItem.price"
                        label="Valor Unidad*"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="editedItem.cash_register_id"
                        :items="cash_registers"
                        item-text="name"
                        item-value="id"
                        label="Caja*"
                        append-icon="mdi-cash-register"
                        :error-messages="cashRegisterErrors"
                        @input="$v.editedItem.cash_register_id.$touch()"
                        @blur="$v.editedItem.cash_register_id.$touch()"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.quantity"
                        label="Cantidad*"
                        required
                        min="0"
                        type="number"
                        :error-messages="quantityErrors"
                        @input="$v.editedItem.quantity.$touch()"
                        @blur="$v.editedItem.quantity.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-dialog
                        ref="fecha"
                        v-model="modalDatePicker"
                        :return-value.sync="date"
                        persistent
                        width="290px"
                        :retain-focus="false"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            label="Fecha de compra*"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :error-messages="dateErrors"
                            @input="$v.date.$touch()"
                            @blur="$v.date.$touch()"
                          ></v-text-field>
                        </template>
                        <v-date-picker :max="maxDate" v-model="date" scrollable>
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="modalDatePicker = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.fecha.save(date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-dialog
                        ref="time"
                        v-model="modalTimePicker"
                        :return-value.sync="time"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="time"
                            label="hora"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :error-messages="timeErrors"
                            @input="$v.time.$touch()"
                            @blur="$v.time.$touch()"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="modalTimePicker"
                          v-model="time"
                          full-width
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="modalTimePicker = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.time.save(time)"
                          >
                            OK
                          </v-btn>
                        </v-time-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        name="input-7-1"
                        label="Notas"
                        v-model="editedItem.note"
                        :error-messages="noteErrors"
                        @input="$v.editedItem.note.$touch()"
                        @blur="$v.editedItem.note.$touch()"
                        counter="500"
                      ></v-textarea>
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

      <!-- price -->
      <template v-slot:[`item.price`]="{ item }">
        <v-icon small>{{ moneyIcon }}</v-icon>
        {{ currencyFormat(item.price) }}
      </template>

      <!-- State -->
      <template v-slot:[`item.state`]="{ item }">
        <v-switch
          :input-value="item.state"
          v-model="item.state"
          @change="changeState(item)"
          v-show="permissions.delete"
        ></v-switch>
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
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
                  `${item.product_name} - ${item.quantity} - ${item.created_at}`,
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

    <!-- Notes dialog -->
    <note-form-dialog
      v-model="dialogNoteForm"
      :id="id_purchase"
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
import { required, maxLength } from "vuelidate/lib/validators";
import { mapState, mapActions, mapMutations } from "vuex";
import VuetifyMoney from "@/components/vuetifyMoney.vue";
import NoteFormDialog from "@/components/NoteFormDialog.vue";

export default {
  data: () => ({
    permissions: {},
    dialog: false,
    modalDatePicker: false,
    modalTimePicker: false,
    date: "",
    time: "",

    id_purchase: "",
    title: "",
    note: "",
    note_type: 5,
    dialogNoteForm: false,
  }),
  mixins: [validationMixin, moneyFormatMixin],
  validations: {
    editedItem: {
      product_id: { required },
      quantity: { required },
      cash_register_id: { required },
      supplier_id: { required },
      note: { maxLength: maxLength(500) },
    },
    date: { required },
    time: { required },
  },
  computed: {
    ...mapState(["loadingText", "mainBranchOffice"]),
    ...mapState("purchases", [
      "purchases",
      "loading",
      "editedItem",
      "defaultItem",
      "headersPurchases",
    ]),
    ...mapState("suppliers", ["suppliers"]),
    ...mapState("products", ["products"]),
    ...mapState("cash_registers", ["cash_registers"]),
    maxDate() {
      return this.getNowDate();
    },
    quantityErrors() {
      const errors = [];
      if (!this.$v.editedItem.quantity.$dirty) return errors;
      !this.$v.editedItem.quantity.required &&
        errors.push("La cantidad es requerida");
      return errors;
    },
    productErrors() {
      const errors = [];
      if (!this.$v.editedItem.product_id.$dirty) return errors;
      !this.$v.editedItem.product_id.required &&
        errors.push("El producto es requerido");
      return errors;
    },
    cashRegisterErrors() {
      const errors = [];
      if (!this.$v.editedItem.cash_register_id.$dirty) return errors;
      !this.$v.editedItem.cash_register_id.required &&
        errors.push("La caja es requerida");
      return errors;
    },
    supplierErrors() {
      const errors = [];
      if (!this.$v.editedItem.supplier_id.$dirty) return errors;
      !this.$v.editedItem.supplier_id.required &&
        errors.push("El proveedor es requerido");
      return errors;
    },
    dateErrors() {
      const errors = [];
      if (!this.$v.date.$dirty) return errors;
      !this.$v.date.required && errors.push("La fecha es requerida");
      return errors;
    },
    timeErrors() {
      const errors = [];
      if (!this.$v.time.$dirty) return errors;
      !this.$v.time.required && errors.push("La hora es requerida.");
      return errors;
    },
    noteErrors() {
      const errors = [];
      if (!this.$v.editedItem.note.$dirty) return errors;
      !this.$v.editedItem.note.maxLength &&
        errors.push("La longitud no es permitida");
      return errors;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      this.$v.$reset();
      if (val) {
        this.date = this.getNowDate();
        this.time = this.getNowTime();
      }
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
    ...mapActions("purchases", [
      "getAllPurchases",
      "storePurchases",
      "changeStatusPurchases",
    ]),
    ...mapActions("suppliers", ["getAllSuppliers"]),
    ...mapActions("products", ["getAllProducts"]),
    ...mapActions("cash_registers", ["getAllCashRegisters"]),
    ...mapMutations("purchases", ["SET_EDIT_ITEM"]),
    initialize() {
      this.getAllCashRegisters(1);
      this.getAllProducts(1);
      this.getAllSuppliers();
      this.getAllPurchases();
    },

    changeState(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de esta compra?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusPurchases(item).then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackStatePurchases(item);
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackStatePurchases(item);
        }
      });
    },

    rollbackStatePurchases(item) {
      let purchasesIndex = this.purchases.indexOf(item);
      this.purchases[purchasesIndex].state =
        !this.purchases[purchasesIndex].state;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
      });
    },

    save() {
      // activate validations form
      this.$v.$touch();
      // Correct validations
      if (!this.$v.$invalid) {
        // add datatime
        this.editedItem.datetime = `${this.date} ${this.time}`;
        // save purchases
        this.storePurchases().then((result) => {
          if (result) {
            this.close();
          }
        });
      }
    },
    updateRowNote(note) {
      let row = this.purchases.find(
        (element) => element.id === this.id_purchase
      );
      row.note = note;
    },

    showNoteFormDialog(id, title, note) {
      this.id_purchase = id;
      this.title = "Compra: " + title;
      this.note = note ?? "";
      this.dialogNoteForm = true;
    },
  },
  components: {
    VuetifyMoney,
    NoteFormDialog,
  },
};
</script>
