<!-- Actions -->
<template>
  <div>
    <!-- Details -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          x-small
          dark
          color="info mr-1"
          v-bind="attrs"
          v-on="on"
          @click="searchDetails(item.id, item.number_payment_proof)"
        >
          <v-icon>{{ detailsIcon }}</v-icon>
        </v-btn>
      </template>
      <span>Detalle de venta</span>
    </v-tooltip>

    <!-- Payments -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          x-small
          dark
          color="success mr-1"
          v-bind="attrs"
          v-on="on"
          @click="searchPayments(item.id, item.number_payment_proof, item.note)"
          v-show="!user.is_customer && (item.pending > 0 || user.is_admin)"
        >
          <v-icon>mdi-cash-multiple</v-icon>
        </v-btn>
      </template>
      <span>Pagos</span>
    </v-tooltip>

    <!-- Print Paymentproof -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          x-small
          dark
          color="primary mr-1"
          v-bind="attrs"
          v-on="on"
          @click="
            downloadPaymentProof({
              saleId: item.id,
              name: item.number_payment_proof,
            })
          "
          v-show="!user.is_customer"
        >
          <v-icon>mdi-printer</v-icon>
        </v-btn>
      </template>
      <span>Imprimir Comprobante</span>
    </v-tooltip>

    <!-- Note -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          x-small
          dark
          color="secondary"
          v-bind="attrs"
          v-on="on"
          @click="
            showNoteFormDialog(item.id, item.number_payment_proof, item.note)
          "
          v-show="!user.is_customer"
        >
          <v-icon>mdi-note-text</v-icon>
        </v-btn>
      </template>
      <span>Nota</span>
    </v-tooltip>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      note_type: 1,
    };
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    permissions: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(["user", "detailsIcon"]),
    ...mapState("sales", ["payment_proof"]),
    ...mapState("notes", ["dialogNoteForm"]),
  },
  methods: {
    ...mapMutations("notes", ["SET_EDIT_ITEM_NOTE", "SET_DIALOG_NOTE_FORM"]),
    ...mapMutations("sales", ["SET_PAYMENT_PROOF", "SET_NOTE"]),
    ...mapActions("sales", [
      "getSaleDetails",
      "getSalePayments",
      "downloadPaymentProof",
    ]),

    searchDetails(saleId, payment_proof) {
      this.SET_PAYMENT_PROOF(payment_proof);
      this.getSaleDetails(saleId);
    },

    showNoteFormDialog(id, title, note) {
      this.SET_EDIT_ITEM_NOTE({
        id,
        title: "Venta N° " + title,
        note,
        type: this.note_type,
      });
      this.SET_DIALOG_NOTE_FORM(true);
    },

    searchPayments(saleId, payment_proof, note) {
      this.SET_PAYMENT_PROOF(payment_proof);
      this.SET_NOTE(note);
      this.getSalePayments(saleId);
    },
  },
};
</script>
