import { bootstrapApplication } from '@angular/platform-browser';
import { provideCharts } from 'ng2-charts';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { Chart as ChartJS, Legend, ArcElement, PieController } from 'chart.js';

// Register controllers, elements, and scales
ChartJS.register(
  Legend,
  ArcElement,       // needed for pie/doughnut
  PieController,    // ✅ explicitly register pie controller
);

bootstrapApplication(App, {
  ...appConfig,
  providers: [
   provideCharts(),
    ...(appConfig.providers ?? [])
  ]
}).catch((err) => console.error(err));
