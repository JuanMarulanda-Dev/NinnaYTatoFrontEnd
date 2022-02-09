<!-- Actions -->
<template>
  <div>
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
              item.note
            )
          "
        >
          <v-icon>mdi-note-text</v-icon>
        </v-btn>
      </template>
      <span>Nota</span>
    </v-tooltip>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      note_type: 5,
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
  methods: {
    ...mapMutations("notes", ["SET_EDIT_ITEM_NOTE", "SET_DIALOG_NOTE_FORM"]),

    showNoteFormDialog(id, title, note) {
      this.SET_EDIT_ITEM_NOTE({
        id,
        title: "Compra:" + title,
        note,
        type: this.note_type,
      });
      this.SET_DIALOG_NOTE_FORM(true);
    },
  },
};
</script>
