<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="cash_registers"
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
          <v-icon large>mdi-cash-register</v-icon> Cajas
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <!-- exchanges cash_registers-->
        <cash-register-change-form></cash-register-change-form>

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
                <v-icon large>mdi-cash-register</v-icon>
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

    <!-- amount -->
    <template v-slot:[`item.amount`]="{ item }">
      <v-icon small>{{ moneyIcon }}</v-icon>
      {{ currencyFormat(item.amount) }}
    </template>

    <!-- State -->
    <template v-slot:[`item.state`]="{ item }">
      <v-switch
        :input-value="item.state"
        v-model="item.state"
        @change="changeStateCashRegister(item)"
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
import CashRegisterChangeForm from "@/components/cash_registers/CashRegisterChangeForm.vue";

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
      { text: "Monto", value: "amount" },
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
  components: {
    CashRegisterChangeForm,
  },
  computed: {
    ...mapState(["editIcon", "loadingText", "mainBranchOffice"]),
    ...mapState("cash_registers", [
      "cash_registers",
      "loading",
      "editedItem",
      "defaultItem",
    ]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Caja" : "Editar Caja";
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
    ...mapActions("cash_registers", [
      "getAllCashRegisters",
      "storeCahsRegister",
      "updateCahsRegister",
      "changeStatusCahsRegister",
    ]),
    ...mapMutations("cash_registers", ["SET_EDIT_ITEM"]),
    initialize() {
      this.getAllCashRegisters();
    },

    changeStateCashRegister(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de esta caja?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusCahsRegister(item.id).then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackStateCahsRegister(item);
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackStateCahsRegister(item);
        }
      });
    },

    rollbackStateCahsRegister(item) {
      let cashRegisterIndex = this.cash_registers.indexOf(item);
      this.cash_registers[cashRegisterIndex].state = !this.cash_registers[
        cashRegisterIndex
      ].state;
    },

    editItem(item) {
      this.editedIndex = this.cash_registers.indexOf(item);
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
          this.updateCahsRegister().then((result) => {
            if (result) {
              this.close();
            }
          });
        } else {
          // Do store
          this.storeCahsRegister().then((result) => {
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
