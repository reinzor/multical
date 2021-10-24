import { createApp } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import ElementPlus from 'element-plus';

import 'element-plus/dist/index.css';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';

createApp(App).use(router).use(VueApexCharts).use(ElementPlus).mount('#app');
