<template>
  <v-menu
    offset-y
    left
    bottom
    max-width="30rem"
    transition="scroll-y-transition"
    max-height="300px"
    v-model="menuDialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
        v-show="show"
        @click="$forceUpdate()"
      >
        <v-badge :content="quantityUnviwedNotifications" color="green" overlap>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <!-- Lista de notificaciones -->
    <v-list>
      <v-subheader>Notificaciones</v-subheader>
      <v-list-item
        v-for="(notification, i) in notifications"
        :key="i"
        @click="
          () => {
            // Make a redirect
          }
        "
      >
        <v-list-item-avatar>
          <v-icon>{{ notification.icon }}</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ notification.title }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ notification.description }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-list-item-action-text>
            {{ calculateDifferenceTimeNotification(notification.created_at) }}
          </v-list-item-action-text>
          <label v-show="!notification.viewed">
            <v-icon x-large color="secondary"> mdi-circle-small </v-icon>
            <small>Nueva</small>
          </label>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import moment from "moment";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      menuDialog: false,
    };
  },
  props: {
    // Use "value" to enable using v-model
    show: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState(["user"]),
    ...mapState("notifications", ["notifications"]),
    quantityUnviwedNotifications() {
      return this.notifications
        .filter((item) => !item.viewed)
        .length.toString();
    },
  },
  watch: {
    menuDialog(newValue) {
      if (!newValue) {
        this.updateViewedNotifications(this.user.id);
      }
    },
  },
  methods: {
    ...mapActions("notifications", ["updateViewedNotifications"]),
    calculateDifferenceTimeNotification(created_at) {
      let start = moment(created_at, "DD/MM/YYYY HH:mm:ss").format();
      let end = moment().format();
      let diffSeconds = moment(end).diff(moment(start), "seconds");

      if (diffSeconds > 0 && diffSeconds < 60) {
        // return seconds
        return `${diffSeconds} sg`;
      }

      if (diffSeconds > 60 && diffSeconds < 3600) {
        // return minutes
        return `${Math.trunc(diffSeconds / 60)} min`;
      }

      if (diffSeconds > 3600 && diffSeconds < 86400) {
        // return hours
        return `${Math.trunc(diffSeconds / 3600)} h`;
      }

      if (diffSeconds > 86400) {
        // return days
        return `${Math.trunc(diffSeconds / (3600 * 24))} dia/s`;
      }
    },
  },
};
</script>
