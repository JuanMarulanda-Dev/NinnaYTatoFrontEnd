<template>
  <v-app id="login">
    <v-container>
      <v-row
        id="content-login"
        justify="center"
        align="center"
        style="height: 100vh"
      >
        <v-col sm="8" md="6" lg="5">
          <v-card class="pa-5 rounded-xl primary elevation-6">
            <v-card class="elevation-4 rounded-xl">
              <v-card-text>
                <div class="layout column align-center">
                  <v-img
                    src="../assets/logo.png"
                    alt="Logo"
                    width="250"
                    transition="true"
                  >
                  </v-img>
                  <h1 class="flex my-4 primary--text">¡{{ bienvenida }}!</h1>
                </div>
                <v-form ref="form" @submit.prevent="login({ email, password })">
                  <v-text-field
                    v-model="email"
                    :error-messages="emailErrors"
                    label="E-mail"
                    required
                    class="mb-6"
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    :error-messages="passwordErrors"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    name="input-10-1"
                    label="Contraseña"
                    counter
                    required
                    @click:append="showPassword = !showPassword"
                    class="mb-8"
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                  ></v-text-field>

                  <v-btn
                    :loading="loadingLogin"
                    :disabled="loadingLogin"
                    type="submit"
                    block
                    color="secondary"
                    class="mb-6"
                  >
                    <v-icon left>mdi-paw</v-icon> Ingresar
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { mapActions, mapState } from "vuex";
import { required, email } from "vuelidate/lib/validators";
export default {
  name: "Login",
  data() {
    return {
      bienvenida: process.env.VUE_APP_WELCOME,
      email: null,
      password: null,
      showPassword: false,
    };
  },
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required },
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required && errors.push("El e-mail es requerido");
      !this.$v.email.email && errors.push("El e-mail no es valido");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("La contraseña es requerida");
      return errors;
    },
    ...mapState(["loadingLogin"]),
  },
  methods: {
    ...mapActions(["login"]),
  },
};
</script>

<style scoped>
#login {
  position: relative;
  z-index: 10;
}

/* MEdia para celulares */
@media (max-width: 600px) {
  #content-login {
    height: 80vh !important;
  }
}

/* Fondo de pantalla */
div[data-app="true"] {
  background: url("../assets/cover1.jpg") no-repeat center center fixed !important;
  background-size: cover;
}

/* Opacidad */
div[data-app="true"]::after {
  content: "";
  background: #2a4c9bb4;
  position: absolute;
  z-index: -1;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
</style>
