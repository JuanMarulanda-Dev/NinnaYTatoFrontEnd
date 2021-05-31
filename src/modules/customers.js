import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    customers: [
      {
        id: 1,
        image: "https://cdn.vuetifyjs.com/images/john.jpg",
        dni: "1216727816",
        name: "Camilo muñoz",
        phone: "3004991084",
        email: "judama3012@gmail.com",
        state: true,
      },
      {
        id: 2,
        image: "",
        dni: "1216727816",
        name: "Juan David Marulanda",
        phone: "3004991084",
        email: "judama3012@gmail.com",
        state: false,
      },
      {
        id: 3,
        image: "https://cdn.vuetifyjs.com/images/john.jpg",
        dni: "1216727816",
        name: "Juan David Marulanda",
        phone: "3004991084",
        email: "judama3012@gmail.com",
        state: false,
      },
      {
        id: 4,
        image: "https://cdn.vuetifyjs.com/images/john.jpg",
        dni: "1216727816",
        name: "Juan David Marulanda",
        phone: "3004991084",
        email: "judama3012@gmail.com",
        state: false,
      },
    ],
    editedItem: {
      id: 0,
      image: "https://cdn.vuetifyjs.com/images/john.jpg",
      name: "",
      phone: "",
      email: "",
      state: false,
    },
    defaultItem: {
      id: 0,
      image: "",
      name: "",
      phone: "",
      email: "",
      state: true,
    },
  },
  mutations: {},
  actions: {},
  getters: {},
};
