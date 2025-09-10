import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { environment } from './environments/environment';

console.log('✅ App iniciada en modo:', environment.production ? 'Producción' : 'Desarrollo');
console.log('🌐 API Base URL:', environment.apiBase);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
