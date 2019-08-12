// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  VERSION: require('../../package.json').version,
  // API_BASE_URL: 'https://tools.adfc-hamburg.de/t30-paten/api/version0.1.10/',
  API_BASE_URL: '/t30/api/',
  API_STUB_BASE_URL: 'https://merlin.anders.hamburg/adfc/t30-paten-backend/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
