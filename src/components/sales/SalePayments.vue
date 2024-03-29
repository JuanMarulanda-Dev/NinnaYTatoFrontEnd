<template>
  <v-dialog v-model="dialogPayments" persistent max-width="700px">
    <!-- Modal Form -->
    <v-card>
      <v-card-title>
        <span class="headline">
          <v-icon large>mdi-cash-multiple</v-icon>
          Pagos - <small>venta N° {{ payment_proof }}</small>
        </span>
        <v-spacer></v-spacer>
        <!-- Info about module -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="primary" dark v-bind="attrs" v-on="on">
              mdi-alert-circle-outline
            </v-icon>
          </template>
          <span>
            * Acá se podran registrar todos los pagos de la venta seleccionada
          </span>
        </v-tooltip>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <vuetify-money
                label="Saldo a pagar"
                v-model="editedItem.total"
              ></vuetify-money>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="editedItem.cash_register_id"
                :items="cash_registers"
                class="text-center"
                prepend-inner-icon="mdi-cash-register"
                item-text="name"
                item-value="id"
                label="¿A donde va?"
                :error-messages="cashRegisterErrors"
                @input="$v.editedItem.cash_register_id.$touch()"
                @blur="$v.editedItem.cash_register_id.$touch()"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-data-table
                height="200"
                :headers="headers"
                :items="payments"
                fixed-header
                hide-default-footer
                class="elevation-1"
              >
                <!-- total -->
                <template v-slot:[`item.total`]="{ item }">
                  <v-icon>{{ moneyIcon }}</v-icon>
                  {{ currencyFormat(item.total) }}
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
                      >
                        <v-icon> {{ deleteIcon }} </v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

          <v-col cols="12">
            <v-textarea
              name="input-7-1"
              label="Notas"
              v-model="editedItem.note"
              :error-messages="noteErrors"
              @input="$v.editedItem.note.$touch()"
              @blur="$v.editedItem.note.$touch()"
              counter="400"
            ></v-textarea>
          </v-col>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close()"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="save()"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import VuetifyMoney from "@/components/vuetifyMoney.vue";
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  name: "sale-payments",
  data() {
    return {
      editedItem: {
        total: 0,
        cash_register_id: "",
        note: "",
      },
      defaultItem: {
        total: 0,
        cash_register_id: "",
        note: "",
      },
      headers: [
        { text: "Monto", value: "total", align: "center" },
        { text: "Caja", value: "cash_register", align: "center" },
        { text: "Fecha", value: "created_at", align: "center" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      editedIndex: -1,
    };
  },
  mixins: [moneyFormatMixin, validationMixin],
  validations: {
    editedItem: {
      cash_register_id: { required },
      note: { maxLength: maxLength(500) },
    },
  },
  created() {
    if (!this.user.is_customer) {
      this.getAllCashRegisters(1);
    }
  },
  computed: {
    ...mapState(["editIcon", "deleteIcon", "user"]),
    ...mapState("sales", [
      "dialogPayments",
      "payments",
      "payment_proof",
      "note",
    ]),
    ...mapState("cash_registers", ["cash_registers"]),
    cashRegisterErrors() {
      const errors = [];
      if (!this.$v.editedItem.cash_register_id.$dirty) return errors;
      !this.$v.editedItem.cash_register_id.required &&
        errors.push("La caja es requerida");
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
    note(value) {
      this.editedItem.note = value;
    },
  },
  methods: {
    ...mapMutations("sales", ["SET_DIALOG_SALE_PAYMENTS", "SET_NOTE"]),
    ...mapActions("sales", ["storeSalePayment", "deletePayment"]),
    ...mapActions("cash_registers", ["getAllCashRegisters"]),
    close() {
      this.SET_DIALOG_SALE_PAYMENTS(false);
      this.SET_NOTE("");
      this.editedItem = Object.assign({}, this.defaultItem);
    },

    save() {
      this.$confirm("¿Estas seguro que quieres registrar este pago?", {
        title: "Advertencia",
      }).then((result) => {
        if (result) {
          // Store
          if (this.editedItem.total > 0) {
            this.storeSalePayment({ ...this.editedItem }).then((result) => {
              if (result) {
                this.total = 0;
                this.close();
              }
            });
          }
        }
      });
    },

    deleteItem(id) {
      this.$confirm(`¿Seguro quieres eliminar este turno?`, {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          this.deletePayment(id);
        }
      });
    },
  },
  components: {
    VuetifyMoney,
  },
};
</script>
