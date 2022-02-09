<template>
  <v-dialog v-model="formDialog" persistent max-width="600px">
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
                  <v-btn text color="primary" @click="dialogDate = false">
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
              <vuetify-money v-model="editedItem.payment" label="Abono*" />
            </v-col>

            <v-col cols="12">
              <vuetify-money
                v-model="getRemainderByCollaborator"
                label="Saldo*"
              />
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
        <v-btn color="error darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save()">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minValue, maxLength } from "vuelidate/lib/validators";
import VuetifyMoney from "@/components/vuetifyMoney.vue";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      dialogDate: false,
    };
  },
  mixins: [validationMixin],
  validations: {
    editedItem: {
      user_id: { required },
      date: { required },
      turn_type_id: { required },
      cash_register_id: { required },
      payment: { required, minValue: minValue(0) },
      note: { maxLength: maxLength(500) },
    },
  },

  created() {
    if (this.turn_types.length == 0) {
      this.getAllTurnTypes();
    }
    if (this.collaborators.length == 0) {
      this.getAllCollaborators();
    }
  },

  computed: {
    ...mapState("turns", [
      "turn_types",
      "collaborators",
      "editedItem",
      "defaultItem",
      "editedIndex",
      "formDialog",
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

    noteErrors() {
      const errors = [];
      if (!this.$v.editedItem.note.$dirty) return errors;
      !this.$v.editedItem.note.maxLength &&
        errors.push("La longitud no es permitida");
      return errors;
    },
  },
  methods: {
    ...mapMutations("turns", [
      "SET_EDIT_ITEM",
      "SET_FORM_DIALOG",
      "SET_EDITED_INDEX",
    ]),
    ...mapActions("turns", [
      "updateTurn",
      "storeTurn",
      "getAllTurnTypes",
      "getAllCollaborators",
    ]),
    close() {
      this.SET_FORM_DIALOG(false);
      this.$nextTick(() => {
        this.SET_EDIT_ITEM(Object.assign({}, this.defaultItem));
        this.SET_EDITED_INDEX(-1);
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
  },
  components: {
    VuetifyMoney,
  },
};
</script>