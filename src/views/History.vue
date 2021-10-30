<template>
  <div v-for="item in seriesCollection" :key="item.name" class="chart">
    <apexchart :options="item.options" :series="item.series" height="300" type="line"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import serial from '@/services/serial';

export default defineComponent({
  setup() {
    const seriesCollection = ref({});
    onMounted(() => {
      seriesCollection.value = serial.commandNames.map((commandName) => ({
        name: commandName,
        options: {
          chart: {
            id: commandName,
            group: 'measurements',
          },
          title: {
            text: `${commandName} [${serial.lastMeasurement.value.values[commandName].unit}]`,
          },
          xaxis: {
            type: 'datetime',
            labels: {
              datetimeUTC: false,
            },
          },
        },
        series: [{
          name: commandName,
          data: serial.measurements.value.map((m) => [m.date.getTime(), m.values[commandName].scalar]),
        }],
      }));
    });
    return {
      seriesCollection,
    };
  },
});
</script>

<style scoped>
.chart {
  width: 100%;
}
</style>
