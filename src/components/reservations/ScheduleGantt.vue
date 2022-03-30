<template>
  <v-dialog
    v-model="dialog_schedule_gantt"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <!-- Modal Form -->
    <v-card tile color="background">
      <v-toolbar flat dark color="secondary" max-height="10vh">
        <v-toolbar-title
          ><span class="headline">
            <v-icon large>mdi-book</v-icon>
            Calendario de reservas
          </span></v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn icon dark @click="SET_DIALOG_SCHEDULE_GANTT(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <!-- Gantt -->
          <gantt-elastic
            :tasks="tasks"
            :options="options"
            :dynamic-style="dynamicStyle"
          >
            <gantt-header :options="options" slot="header"></gantt-header>
          </gantt-elastic>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import GanttElastic from "gantt-elastic";
import GanttHeader from "gantt-elastic-header";
import moment from "moment";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      options: {
        // maxRows: 100,
        maxHeight: 1000,
        title: {
          label: "Agenda",
          html: false,
        },
        times: {
          timeScale: 60 * 1000,
          timeZoom: 21, //*
          timePerPixel: 0,
          firstTime: null,
          lastTime: null,
          firstTaskTime: 0,
          lastTaskTime: 0,
          totalViewDurationMs: 0,
          totalViewDurationPx: 0,
          stepDuration: "day",
          steps: [],
        },
        row: {
          height: 24,
        },
        scope: {
          after: 18,
        },
        calendar: {
          hour: {
            display: false,
          },
        },
        chart: {
          progress: {
            bar: false,
          },
          expander: {
            display: true,
          },
        },
        taskList: {
          expander: {
            straight: true,
          },
          columns: [
            {
              id: 1,
              label: "ID",
              value: "human_id",
              width: 40,
            },
            {
              id: 2,
              label: "Habitaciones",
              value: "room_name",
              width: 130,
              expander: true,
              html: true,
            },
          ],
        },
        /*locale:{
          name: 'pl', // name String
          weekdays: 'Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota_Niedziela'.split('_'), // weekdays Array
          weekdaysShort: 'Pon_Wto_Śro_Czw_Pią_Sob_Nie'.split('_'), // OPTIONAL, short weekdays Array, use first three letters if not provided
          weekdaysMin: 'Pn_Wt_Śr_Cz_Pt_So_Ni'.split('_'), // OPTIONAL, min weekdays Array, use first two letters if not provided
          months: 'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień'.split('_'), // months Array
          monthsShort: 'Sty_Lut_Mar_Kwi_Maj_Cze_Lip_Sie_Wrz_Paź_Lis_Gru'.split('_'), // OPTIONAL, short months Array, use first three letters if not provided
          ordinal: n => `${n}`, // ordinal Function (number) => return number + output
          relativeTime: { // relative time format strings, keep %s %d as the same
            future: 'za %s', // e.g. in 2 hours, %s been replaced with 2hours
            past: '%s temu',
            s: 'kilka sekund',
            m: 'minutę',
            mm: '%d minut',
            h: 'godzinę',
            hh: '%d godzin', // e.g. 2 hours, %d been replaced with 2
            d: 'dzień',
            dd: '%d dni',
            M: 'miesiąc',
            MM: '%d miesięcy',
            y: 'rok',
            yy: '%d lat'
          }
        }*/
      },
      dynamicStyle: {},
    };
  },
  computed: {
    ...mapState("reservations", ["reservations", "dialog_schedule_gantt"]),
    tasks() {
      return this.buildDataTasks(this.sortReservations());
    },
  },
  methods: {
    ...mapMutations("reservations", ["SET_DIALOG_SCHEDULE_GANTT"]),
    toTimeStamp(date) {
      return moment(date).valueOf(); // timestamp
    },

    diffDays(start, end) {
      return moment(end).diff(start, "days") + 1;
    },

    toMilliseconds(days) {
      return days * 24 * 60 * 60 * 1000;
    },

    sortReservations() {
      return this.reservations.sort((a, b) => {
        // Ordenar por fechas tambien (start), de menor a mayor
        if (a.room_name > b.room_name) {
          return 1;
        }
        if (a.room_name < b.room_name) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    },

    buildDataTasks(task) {
      let lastIDRoom = "";
      let lastIDReservation = "";
      let lastID = 1;
      let databuilder = task.map((element) => {
        let newTask = {
          id: element.id,
          human_id: lastID,
          label: element.name,
          start: this.toTimeStamp(element.start),
          duration: this.toMilliseconds(
            this.diffDays(element.start, element.end)
          ),
          type: "task",
          progress: 0,
          style: {
            base: {
              fill: element.room_color,
              stroke: element.room_color,
            },
          },
        };

        lastID++;

        newTask.room_name =
          lastIDRoom != element.room_id ? element.room_name : "";

        if (lastIDRoom != element.room_id) {
          lastIDRoom = element.room_id;
          lastIDReservation = element.id;
        } else {
          newTask.parentId = lastIDReservation;
        }

        return newTask;
      });
      return databuilder;
    },
  },
  components: {
    GanttElastic,
    GanttHeader,
  },
};
</script>
