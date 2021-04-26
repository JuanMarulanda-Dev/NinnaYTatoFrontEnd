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
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="email"
                    label="E-mail"
                    required
                    class="mb-6"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    name="input-10-1"
                    label="Contraseña"
                    hint="At least 8 characters"
                    counter
                    @click:append="showPassword = !showPassword"
                    class="mb-8"
                  ></v-text-field>

                  <v-btn block color="secondary" class="mb-6">
                    <v-icon left>mdi-paw</v-icon> EditIngresar
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
