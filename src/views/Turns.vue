<template>
  <div>
    <v-data-table
      fixed-header
      :headers="headersTurns"
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
          <v-btn
            fab
            small
            color="secondary"
            elevation="3"
            dark
            v-show="permissions.create"
            @click="SET_FORM_DIALOG(true)"
          >
            <v-icon>mdi-plus-thick</v-icon>
          </v-btn>
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
        <turn-actions :item="item" :permissions="permissions"></turn-actions>
      </template>
    </v-data-table>

    <!-- Notes dialog -->
    <note-form-dialog></note-form-dialog>
    <turn-form></turn-form>
  </div>
</template>

<script>
import { moneyFormatMixin } from "@/mixins/moneyFormatMixin.js";
import { mapState, mapActions, mapMutations } from "vuex";
import NoteFormDialog from "@/components/NoteFormDialog.vue";
import TurnActions from "@/components/turns/TurnActions.vue";
import TurnForm from "@/components/turns/TurnForm.vue";
import moment from "moment";

export default {
  data: () => ({
    permissions: {},
    dialogStart: false,
    dialogEnd: false,
  }),
  mixins: [moneyFormatMixin],

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
      this.getAllCollaborators();
      this.getAllCashRegisters(1);
    }

    //Status movements module
    this.SET_MODULE_STATUS(false);
  },

  computed: {
    ...mapState(["loadingText", "mainBranchOffice"]),
    ...mapState("turns", [
      "turns",
      "loading",
      "start",
      "end",
      "headersTurns",
      "turn_types",
    ]),

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
    formDialog(val) {
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
      "getAllTurnTypes",
      "getAllCollaborators",
    ]),

    ...mapActions("cash_registers", ["getAllCashRegisters"]),
    ...mapMutations("movements", ["SET_MODULE_STATUS"]),
    ...mapMutations("turns", [
      "SET_START_DATE",
      "SET_END_DATE",
      "SET_FORM_DIALOG",
    ]),
    initialize() {
      this.getAllTurns();
    },
  },

  components: {
    NoteFormDialog,
    TurnActions,
    TurnForm,
  },
};
</script>
