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
            prepend-inner-icon="mdi-instagram"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-select
            :items="meet"
            item-text="name"
            item-value="id"
            label="¿Como nos conoció?"
            dense
            prepend-icon="mdi-account-supervisor-circle"
          ></v-select>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ImageInput from "@/components/imageUploader.vue";

export default {
  name: "customer-additional-information",
  data() {
    return {
      userImage: null,
      meet: [{ id: 1, name: "Redes sociales" }],
    };
  },
  components: {
    ImageInput,
  },
};
</script>
