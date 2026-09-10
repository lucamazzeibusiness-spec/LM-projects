export type Gewerk = 'Elektrik' | 'Mechanik' | 'Mechatronik'
export type Prioritaet = 'Hoch' | 'Mittel' | 'Niedrig'
export type AuftragStatus = 'Offen' | 'In Arbeit' | 'Erledigt'

export interface ChecklistItem {
  id: string
  label: string
}

export interface Auftrag {
  id: string
  titel: string
  anlage: string
  baureihe?: string
  ort: string
  gewerk: Gewerk
  prioritaet: Prioritaet
  status: AuftragStatus
  faelligkeit: string
  beschreibung: string
  checklist: ChecklistItem[]
}

export const auftraege: Auftrag[] = [
  {
    id: 'A-24817',
    titel: 'Bremsprobe & Drehgestell-Inspektion',
    anlage: 'Triebzug ICE 4',
    baureihe: 'BR 412',
    ort: 'Werk Rummelsburg, Gleis 7',
    gewerk: 'Mechanik',
    prioritaet: 'Hoch',
    status: 'In Arbeit',
    faelligkeit: 'Heute, 14:00',
    beschreibung:
      'Planmäßige Inspektion der Drehgestelle sowie Bremsprobe nach Fahrplan-km-Intervall. Vorbefund: leichtes Spiel an Radsatzlager 3.',
    checklist: [
      { id: 'c1', label: 'Sichtprüfung Drehgestellrahmen auf Risse' },
      { id: 'c2', label: 'Radsatzlager auf Spiel/Temperatur prüfen' },
      { id: 'c3', label: 'Bremsbeläge Stärke messen' },
      { id: 'c4', label: 'Bremsprobe (Vollbremsung) durchführen' },
      { id: 'c5', label: 'Federspeicher auf Dichtheit prüfen' },
      { id: 'c6', label: 'Prüfprotokoll digital signieren' },
    ],
  },
  {
    id: 'A-24822',
    titel: 'Störung Türsteuerung Wagen 3',
    anlage: 'Doppelstockwagen',
    baureihe: 'DBpza',
    ort: 'Abstellgruppe Süd, Gleis 12',
    gewerk: 'Elektrik',
    prioritaet: 'Hoch',
    status: 'Offen',
    faelligkeit: 'Heute, 11:30',
    beschreibung:
      'Fehlercode E-4471 (Türsteuergerät meldet Timeout). Tür 3 links schließt nicht vollständig, Fahrgastmeldung liegt vor.',
    checklist: [
      { id: 'c1', label: 'Fehlerspeicher Türsteuergerät auslesen' },
      { id: 'c2', label: 'Verkabelung Türantrieb auf Beschädigung prüfen' },
      { id: 'c3', label: 'Lichtschranke reinigen/justieren' },
      { id: 'c4', label: 'Funktionstest Tür (10 Zyklen)' },
      { id: 'c5', label: 'Fehlerspeicher zurücksetzen' },
    ],
  },
  {
    id: 'A-24805',
    titel: 'Wartung Weichenheizung',
    anlage: 'Weiche 34a',
    ort: 'Bahnhof Süd, Gleis 4/5',
    gewerk: 'Mechatronik',
    prioritaet: 'Mittel',
    status: 'Offen',
    faelligkeit: 'Morgen, 08:00',
    beschreibung:
      'Saisonale Funktionsprüfung der Weichenheizung vor Wintereinsatz inkl. Steuerungslogik und Temperaturfühler.',
    checklist: [
      { id: 'c1', label: 'Heizstäbe auf Durchgang prüfen' },
      { id: 'c2', label: 'Temperaturfühler kalibrieren' },
      { id: 'c3', label: 'Steuerschrank auf Feuchtigkeit prüfen' },
      { id: 'c4', label: 'Automatikbetrieb testen' },
    ],
  },
  {
    id: 'A-24799',
    titel: 'Klimaanlage Fahrgastraum fällt aus',
    anlage: 'Regionaltriebwagen',
    baureihe: 'BR 442',
    ort: 'Werk Rummelsburg, Halle 2',
    gewerk: 'Mechatronik',
    prioritaet: 'Mittel',
    status: 'Erledigt',
    faelligkeit: 'Gestern, 16:00',
    beschreibung:
      'Klimakompressor schaltet nach ca. 5 Minuten ab. Verdacht: Druckwächter oder Kältemittelstand.',
    checklist: [
      { id: 'c1', label: 'Kältemittelstand prüfen' },
      { id: 'c2', label: 'Druckwächter testen' },
      { id: 'c3', label: 'Kondensator reinigen' },
      { id: 'c4', label: 'Probelauf 30 Minuten' },
    ],
  },
  {
    id: 'A-24788',
    titel: 'Hauptschalter tauschen',
    anlage: 'E-Lok',
    baureihe: 'BR 185',
    ort: 'Werk Rummelsburg, Gleis 3',
    gewerk: 'Elektrik',
    prioritaet: 'Niedrig',
    status: 'Erledigt',
    faelligkeit: 'Gestern, 09:00',
    beschreibung: 'Planmäßiger Austausch des Hauptschalters gemäß Instandhaltungsplan.',
    checklist: [
      { id: 'c1', label: 'Fahrzeug spannungsfrei schalten, erden' },
      { id: 'c2', label: 'Hauptschalter ausbauen' },
      { id: 'c3', label: 'Neuen Hauptschalter einbauen' },
      { id: 'c4', label: 'Isolationsmessung durchführen' },
      { id: 'c5', label: 'Funktionsprobe unter Last' },
    ],
  },
]

export interface Fehlerfall {
  id: string
  code: string
  titel: string
  gewerk: Gewerk
  baureihe: string
  symptome: string[]
  ursache: string
  loesung: string[]
  haeufigkeit: 'Häufig' | 'Gelegentlich' | 'Selten'
}

export const fehlerfaelle: Fehlerfall[] = [
  {
    id: 'F-001',
    code: 'E-4471',
    titel: 'Türsteuergerät Timeout',
    gewerk: 'Elektrik',
    baureihe: 'DBpza / Doppelstockwagen',
    symptome: ['Tür schließt nicht vollständig', 'Steuergerät zeigt Timeout-Fehler'],
    ursache: 'Meist verschmutzte oder dejustierte Lichtschranke, seltener Wackelkontakt am Türantrieb.',
    loesung: [
      'Lichtschranke mit trockenem Tuch reinigen',
      'Justierung nach Werksvorgabe prüfen (±2mm)',
      'Steckverbinder am Türantrieb auf Sitz prüfen',
      'Fehlerspeicher zurücksetzen und 10 Testzyklen fahren',
    ],
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-002',
    code: 'M-2210',
    titel: 'Radsatzlager Übertemperatur',
    gewerk: 'Mechanik',
    baureihe: 'BR 412 / ICE 4',
    symptome: ['Heißläuferortung löst aus', 'Erhöhte Temperatur an Radsatzlager'],
    ursache: 'Schmierstoffmangel oder beginnender Lagerschaden.',
    loesung: [
      'Lager auf Laufgeräusche und Spiel prüfen',
      'Schmierstoff nach Vorgabe nachfüllen/erneuern',
      'Bei Spiel > Grenzwert: Radsatz tauschen',
      'Nachkontrolle nach 200 km',
    ],
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-003',
    code: 'K-1187',
    titel: 'Klimakompressor Kurzabschaltung',
    gewerk: 'Mechatronik',
    baureihe: 'BR 442 / Talent 2',
    symptome: ['Kompressor läuft an und schaltet nach Minuten ab', 'Fahrgastraum wird nicht gekühlt'],
    ursache: 'Kältemittelmangel löst Druckwächter (Niederdruck) aus.',
    loesung: [
      'Kältemittelstand am Schauglas prüfen',
      'Anlage auf Leckage prüfen (UV-Zusatz/Lecksuchgerät)',
      'Kältemittel nach Herstellervorgabe auffüllen',
      'Probelauf mind. 30 Minuten überwachen',
    ],
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-004',
    code: 'E-3305',
    titel: 'Hauptschalter löst spontan aus',
    gewerk: 'Elektrik',
    baureihe: 'BR 185 / E-Lok',
    symptome: ['Hauptschalter fällt ohne erkennbaren Grund', 'Keine Fehlermeldung im Display'],
    ursache: 'Meist Isolationsfehler im Dachstromkreis oder Überspannung bei Fahrdrahtübergängen.',
    loesung: [
      'Isolationsmessung Dachstromkreis durchführen',
      'Überspannungsableiter prüfen',
      'Stromabnehmer-Schleifleisten auf Verschleiß prüfen',
      'Bei Normalwert: Software-Log auswerten (Systemtechnik)',
    ],
    haeufigkeit: 'Selten',
  },
  {
    id: 'F-005',
    code: 'W-0912',
    titel: 'Weichenheizung ohne Funktion',
    gewerk: 'Mechatronik',
    baureihe: 'Weichenantrieb allgemein',
    symptome: ['Heizung startet nicht bei Frost', 'Automatikbetrieb reagiert nicht'],
    ursache: 'Defekter Temperaturfühler oder Feuchtigkeit im Steuerschrank.',
    loesung: [
      'Temperaturfühler-Widerstand messen und vergleichen',
      'Steuerschrank auf Kondenswasser prüfen, trocknen',
      'Sicherungen und Schütze prüfen',
      'Manuellen Testlauf auslösen',
    ],
    haeufigkeit: 'Häufig',
  },
]

export interface Ersatzteil {
  id: string
  name: string
  nummer: string
  kategorie: Gewerk | 'Allgemein'
  bestand: number
  mindestbestand: number
  lagerort: string
  einheit: string
}

export const ersatzteile: Ersatzteil[] = [
  { id: 'ET-1', name: 'Bremsbelag ICE 4 (Satz)', nummer: '412-BR-3391', kategorie: 'Mechanik', bestand: 14, mindestbestand: 8, lagerort: 'Halle 2, Regal C3', einheit: 'Satz' },
  { id: 'ET-2', name: 'Türsteuergerät DBpza', nummer: 'DB-TS-2207', kategorie: 'Elektrik', bestand: 3, mindestbestand: 4, lagerort: 'Halle 1, Regal A1', einheit: 'Stück' },
  { id: 'ET-3', name: 'Lichtschranke Türantrieb', nummer: 'LS-4471-C', kategorie: 'Elektrik', bestand: 22, mindestbestand: 10, lagerort: 'Halle 1, Regal A2', einheit: 'Stück' },
  { id: 'ET-4', name: 'Kältemittel R134a (Flasche)', nummer: 'KM-R134-10', kategorie: 'Mechatronik', bestand: 6, mindestbestand: 5, lagerort: 'Halle 3, Gefahrstofflager', einheit: 'Flasche' },
  { id: 'ET-5', name: 'Hauptschalter BR 185', nummer: 'HS-185-09', kategorie: 'Elektrik', bestand: 1, mindestbestand: 2, lagerort: 'Halle 1, Regal B4', einheit: 'Stück' },
  { id: 'ET-6', name: 'Radsatzlager komplett', nummer: 'RSL-412-11', kategorie: 'Mechanik', bestand: 5, mindestbestand: 4, lagerort: 'Halle 2, Regal D1', einheit: 'Stück' },
  { id: 'ET-7', name: 'Temperaturfühler Weiche', nummer: 'TF-W-0912', kategorie: 'Mechatronik', bestand: 9, mindestbestand: 6, lagerort: 'Halle 3, Regal E2', einheit: 'Stück' },
]

export interface Schicht {
  tag: string
  datum: string
  von: string
  bis: string
  funktion: string
  team: string
}

export const schichtplan: Schicht[] = [
  { tag: 'Montag', datum: '08.09.', von: '06:00', bis: '14:00', funktion: 'Frühschicht – Werk Rummelsburg', team: 'Team Elektrik 2' },
  { tag: 'Dienstag', datum: '09.09.', von: '06:00', bis: '14:00', funktion: 'Frühschicht – Werk Rummelsburg', team: 'Team Elektrik 2' },
  { tag: 'Mittwoch', datum: '10.09.', von: '14:00', bis: '22:00', funktion: 'Spätschicht – Bahnhof Süd', team: 'Team Mechatronik 1' },
  { tag: 'Donnerstag', datum: '11.09.', von: '14:00', bis: '22:00', funktion: 'Spätschicht – Bahnhof Süd', team: 'Team Mechatronik 1' },
  { tag: 'Freitag', datum: '12.09.', von: '06:00', bis: '14:00', funktion: 'Frühschicht – Werk Rummelsburg', team: 'Team Elektrik 2' },
  { tag: 'Samstag', datum: '13.09.', von: '-', bis: '-', funktion: 'Frei', team: '-' },
  { tag: 'Sonntag', datum: '14.09.', von: '-', bis: '-', funktion: 'Frei', team: '-' },
]

export interface Sicherheitshinweis {
  id: string
  titel: string
  ort: string
  gueltigBis: string
  stufe: 'Kritisch' | 'Hinweis'
}

export const sicherheitshinweise: Sicherheitshinweis[] = [
  { id: 'S-1', titel: 'Gleissperrung Gleis 7 wegen Oberleitungsarbeiten', ort: 'Werk Rummelsburg', gueltigBis: 'Heute, 18:00', stufe: 'Kritisch' },
  { id: 'S-2', titel: 'Rutschgefahr Halle 2 (Ölaustritt beseitigt, Nachreinigung läuft)', ort: 'Halle 2', gueltigBis: 'Morgen, 10:00', stufe: 'Hinweis' },
]
