<template>
  <g-gantt-chart chart-start="2020-03-01" chart-end="2020-03-3">
    <g-gantt-row
      label="My row"
      :bars="myBars"
      bar-start="myBarStart"
      bar-end="myBarEnd"
    />
    <g-gantt-row
      label="My row"
      :bars="myBars"
      bar-start="myBarStart"
      bar-end="myBarEnd"
    />
  </g-gantt-chart>
</template>

<script>
import { GGanttChart, GGanttRow } from "vue-ganttastic";

export default {
  data() {
    return {
      myChartStart: "2020-03-01",
      myChartEnd: "2020-03-02",
      myBars: [
        {
          myBarStart: "2020-03-01",
          myBarEnd: "2020-03-01",
        },
        {
          myBarStart: "2020-03-01",
          myBarEnd: "2020-03-01",
        },
      ],
    };
  },
  components: {
    GGanttChart,
    GGanttRow,
  },
};
</script>
