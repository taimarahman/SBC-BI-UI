// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Enums
import { EnvName } from '@enums/environment.enum';

// Packages
import packageInfo from '../../package.json';

const scheme = 'http://';
const host   = '192.168.78.148';
const port   = ':8090';
const path   = '/SBC-BI';

const baseUrl = scheme + host + port + path;
// const baseUrl = scheme + host + port;

export const environment = {
  production      : false,
  version         : packageInfo.version,
  appName         : 'Project Angular',
  envName         : EnvName.LOCAL,
  defaultLanguage : 'en',
  apiBaseUrl      : baseUrl,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
