<template>
  <v-row v-show="showAdditionalForm">
    <!-- Sale Form Additional Charge -->
    <v-col cols="12">
      <v-card outlined>
        <v-card-text class="pb-0">
          <h4 class="text-center">Recargo adicional</h4>
        </v-card-text>
        <v-container>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="form.name"
                :error-messages="nameErrors"
                @input="$v.form.name.$touch()"
                @blur="$v.form.name.$touch()"
                label="Description*"
                dense
              >
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <vuetify-money v-model="form.full_value" label="Valor*" dense />
            </v-col>
            <v-col cols="4">
              <v-btn small color="secondary" @click="addCartItem()"
                >Agregar</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import VuetifyMoney from "@/components/vuetifyMoney.vue";

export default {
  data: () => ({
    form: {
      type: 3, // Cargo adicional
      name: "",
      full_value: 0,
    },
  }),
  mixins: [validationMixin],
  validations: {
    form: {
      name: { required },
      full_value: { required },
    },
  },
  props: {
    showAdditionalForm: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.form.name.$dirty) return errors;
      !this.$v.form.name.required && errors.push("La descripción requerida.");
      return errors;
    },
  },
  methods: {
    addCartItem() {
      this.$v.$touch();
      if (!this.$v.invalid) {
        this.$emit("addCartItem", this.form);
        this.form.name = "";
        this.form.full_value = 0;
      }
    },
  },
  components: {
    VuetifyMoney,
  },
};
</script>
