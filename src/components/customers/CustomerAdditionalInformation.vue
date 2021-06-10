<template>
  <v-row class="mt-5">
    <v-col xs="12" sm="12" md="4" cols="12">
      <v-row justify="center">
        <image-input v-model="userImage">
          <div slot="activator">
            <v-avatar
              size="200px"
              v-ripple
              v-if="!userImage"
              class="grey lighten-3 mb-3"
            >
              <span>Click para añadir</span>
            </v-avatar>
            <v-avatar size="200px" v-ripple v-else class="mb-3">
              <img :src="userImage.imageURL" alt="avatar" />
            </v-avatar>
          </div>
        </image-input>
      </v-row>
    </v-col>
    <v-col xs="12" sm="12" md="8" cols="12">
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Red social"
            required
            v-model="additional_information.social_network"
            prepend-inner-icon="mdi-instagram"
            :error-messages="social_networkErrors"
            @input="$v.additional_information.social_network.$touch()"
            @blur="$v.additional_information.social_network.$touch()"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="additional_information.how_contact_id"
            :items="how_contact"
            item-text="name"
            item-value="id"
            label="¿Como nos conoció?*"
            dense
            prepend-icon="mdi-account-supervisor-circle"
            :error-messages="how_contact_idErrors"
            @input="$v.additional_information.how_contact_id.$touch()"
            @blur="$v.additional_information.how_contact_id.$touch()"
          ></v-select>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ImageInput from "@/components/imageUploader.vue";
import { mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  name: "customer-additional-information",
  data() {
    return {
      userImage: null,
    };
  },
  props: {
    // Use "value" to enable using v-model
    value: Boolean,
  },
  mixins: [validationMixin],
  validations: {
    additional_information: {
      social_network: { maxLength: maxLength(255) },
      how_contact_id: { required },
    },
  },
  computed: {
    ...mapState("customers", ["additional_information", "how_contact"]),
    social_networkErrors() {
      const errors = [];
      if (!this.$v.additional_information.social_network.$dirty) return errors;
      !this.$v.additional_information.social_network.maxLength &&
        errors.push("Longitud no permitida");
      return errors;
    },
    how_contact_idErrors() {
      const errors = [];
      if (!this.$v.additional_information.how_contact_id.$dirty) return errors;
      !this.$v.additional_information.how_contact_id.required &&
        errors.push("El como nos conocio es requerido");
      return errors;
    },
  },
  watch: {
    userImage: function () {
      this.additional_information.customer_avatar = this.userImage.formData;
    },
    additional_information: {
      handler: function () {
        // // Correct validations
        this.$emit("input", !this.$v.$invalid);
      },
      deep: true,
    },
  },
  components: {
    ImageInput,
  },
};
</script>
