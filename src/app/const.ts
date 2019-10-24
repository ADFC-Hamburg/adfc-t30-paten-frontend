// --------------------- STATUS --------------------------------------------
export const FARBCODE = [
  '#0554fa', // 0 blau
  '#f7ab05', // 1 orange
  '#44f917', // 2 gruen
  '#ef140d', // 3 rot
  '#000000', // 4 schwarz
  '#e7ff08', // 5 gelb
];
export const LEGENDE_TEXT = [
  'Bitte prüfen, d. h. ggf. vor Ort relevante Straßenabschnitte im Umfeld der ' +
  'Einrichtung überprüfen und deren Tempo-30-Status eingeben.', // 0

  'Forderung gestellt. Für alle relevanten Straßenabschnitte im Umfeld der ' +
  'Einrichtung ohne Tempo 30 wurde bereits eine Mail versandt.', // 1

  'OK. An allen relevanten Straßenabschnitten im Umfeld der Einrichtung gilt Tempo 30.', // 2

  'Mail versenden. Hier wurde noch nicht für alle relevanten Straßenabschnitte ' +
  'im Umfeld der Einrichtung ohne Tempo 30 eine Mail versandt.', // 3

  'Abgelehnt. Für mindestens einen relevanten Straßenabschnitt im ' +
  'Umfeld der Einrichtung hat die Behörde Tempo 30 abgelehnt.', // 4

  'Umsetzung beobachten. An mindestens einem relevanten Straßenabschnitt im ' +
  'Umfeld der Einrichtung wurde Tempo 30 bereits angeordnet, aber noch nicht eingeführt.', // 5
];
export const STATUS = [
  'unklar',
  'hier wird Tempo 30 gefordert',
  'hier ist Tempo 30',
  'hier fehlt Tempo 30',
  'die Behörde hat Tempo 30 abgelehnt',
  'Tempo 30 wurde angeordnet, die Schilder stehen aber noch nicht',
];

export const STATUS_TEXT = [
  'Bitte checken.',
  'Tempo 30 gefordert.',
  'OK.',
  'Handlungsbedarf.',
  'Abgelehnt!',
  'Umsetzung Beobachten.',
];

export const STATUS_LONG_TEXT = [
  'Bitte prüfen und Angaben machen.', /*0*/
  'Tempo 30 fehlt, Forderung gestellt.', /*1*/
  'OK.', /*2*/
  'Tempo 30 fehlt, Forderung wurde noch nicht gestellt', /*3*/
  'Tempo 30 abgelehnt.', /*4*/
  'Tempo 30 angeordnet, Schilder fehlen noch.', /* 5*/
];

// --------------------- Anderes: --------------------------------------------

export const BUSVERKEHR = [
  'Unklar',
  'Kein Busverkehr',
  'weniger als 6 mal/h',
  '6 mal/h oder mehr'
];

export const SPURIGKEIT_STR = [
  'Je eine KFZ-Spur je Fahrtrichtung',
  'Mehr als eine KFZ-Spur je Fahrtrichtung'
];

export const EINRICHTUNGSART = [
  'Unklar',
  'Kindertagesstätte / Kindergarten',
  'Schule',
  'Alten-, Pflege- und Tagespflegeheim',
  'Krankenhaus',
];

export const HAMBURG_LAT = 53.551086;
export const HAMBURG_LON = 9.993682;
export const START_ZOOM = 12;
