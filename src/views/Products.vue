<template>
  <v-data-table
    fixed-header
    :headers="headers"
    :items="products"
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
          <v-icon large>mdi-puzzle</v-icon> Productos
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
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
                <v-icon large>mdi-puzzle</v-icon>
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
                  <v-col cols="12" sm="6" md="6">
                    <vuetify-money
                      v-model="editedItem.price"
                      label="Valor Unidad*"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      :items="suppliers"
                      item-text="name"
                      item-value="id"
                      label="Proveedor"
                      v-model="editedItem.supplier_id"
                      append-icon="mdi-account-tie"
                      :error-messages="supplierErrors"
                      @input="$v.editedItem.supplier_id.$touch()"
                      @blur="$v.editedItem.supplier_id.$touch()"
                    ></v-select>
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

    <!-- price -->
    <template v-slot:[`item.price`]="{ item }">
      <v-icon small>{{ moneyIcon }}</v-icon>
      {{ currencyFormat(item.price) }}
    </template>

    <!-- State -->
    <template v-slot:[`item.state`]="{ item }">
      <v-switch
        :input-value="item.state"
        v-model="item.state"
        @change="changeStateProduct(item)"
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
import VuetifyMoney from "@/components/vuetifyMoney.vue";

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
      { text: "Valor Unidad", value: "price" },
      { text: "Cantidad", value: "stock" },
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
      supplier_id: { required },
    },
  },
  components: {
    VuetifyMoney,
  },
  computed: {
    ...mapState(["editIcon", "loadingText"]),
    ...mapState("products", [
      "products",
      "loading",
      "editedItem",
      "defaultItem",
    ]),
    ...mapState("suppliers", ["suppliers"]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Producto" : "Editar Producto";
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
    supplierErrors() {
      const errors = [];
      if (!this.$v.editedItem.supplier_id.$dirty) return errors;
      !this.$v.editedItem.supplier_id.required &&
        errors.push("El proveedor es requerido");
      return errors;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
      this.$v.$reset();
    },
  },

  created() {
    // Obtener los permisos
    this.permissions = this.$route.meta.permissions;

    this.getAllSuppliers();

    // Acciones que debe realizar el componente una vez creado
    if (this.permissions.read) {
      this.initialize();
    }
  },

  methods: {
    ...mapActions("products", [
      "getAllProducts",
      "storeProduct",
      "updateProduct",
      "changeStatusProduct",
    ]),
    ...mapActions("suppliers", ["getAllSuppliers"]),
    ...mapMutations("products", ["SET_EDIT_ITEM"]),
    initialize() {
      this.getAllProducts();
    },

    changeStateProduct(item) {
      // Confirmation to change de status
      this.$confirm("¿Quieres cambiar el estado de este producto?", {
        title: "Advertencia",
      }).then((res) => {
        if (res) {
          // Make to change status to backend
          this.changeStatusProduct(item.id).then((result) => {
            if (!result) {
              // Rollback the state from branch office
              this.rollbackStateProduct(item);
            }
          });
        } else {
          // Rollback the state from branch office
          this.rollbackStateProduct(item);
        }
      });
    },

    rollbackStateProduct(item) {
      let productsIndex = this.products.indexOf(item);
      this.products[productsIndex].state = !this.products[productsIndex].state;
    },

    editItem(item) {
      this.editedIndex = this.products.indexOf(item);
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
          this.updateProduct();
        } else {
          // Do store
          this.storeProduct();
        }
        // Close modal
        this.close();
      }
    },
  },
};
</script>
