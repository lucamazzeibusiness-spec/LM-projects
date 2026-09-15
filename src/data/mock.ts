export type Gewerk = 'Elektrik' | 'Mechanik' | 'Mechatronik'
export type Prioritaet = 'Hoch' | 'Mittel' | 'Niedrig'
export type LernaufgabeStatus = 'Offen' | 'In Arbeit' | 'Erledigt'

export interface AzubiProfil {
  name: string
  unternehmensbereich: string
  ausbildungsberuf: AusbildungsberufName
  lehrjahr: number
  lehrjahreGesamt: number
  abteilung: string
  werk: string
  ausbilder: string
}

// Nur Vorbelegung für das Onboarding-Formular – das tatsächliche Profil trägt jede:r selbst ein.
export const azubiProfilBeispiel: AzubiProfil = {
  name: '',
  unternehmensbereich: 'DB Fahrzeuginstandhaltung',
  ausbildungsberuf: 'Elektroniker für Betriebstechnik',
  lehrjahr: 1,
  lehrjahreGesamt: 3,
  abteilung: '',
  werk: '',
  ausbilder: '',
}

export interface ChecklistItem {
  id: string
  label: string
}

export interface Lernaufgabe {
  id: string
  titel: string
  anlage: string
  baureihe?: string
  ort: string
  gewerk: Gewerk
  prioritaet: Prioritaet
  status: LernaufgabeStatus
  faelligkeit: string
  lernziel: string
  beschreibung: string
  ausbilderHinweis?: string
  checklist: ChecklistItem[]
}

export const lernaufgaben: Lernaufgabe[] = [
  {
    id: 'L-241',
    titel: 'Bremsprüfung am Drehgestell',
    anlage: 'Triebzug ICE 4',
    baureihe: 'BR 412',
    ort: 'Werkhalle 2',
    gewerk: 'Mechanik',
    prioritaet: 'Hoch',
    status: 'In Arbeit',
    faelligkeit: 'Heute, 14:00',
    lernziel: 'Aufbau eines Drehgestells verstehen und die Prüfschritte einer Bremsprobe nach Vorschrift durchführen können.',
    beschreibung: 'Inspektion der Drehgestelle und Bremsprobe nach Prüfvorschrift durchführen.',
    ausbilderHinweis: 'Kapitel „Drehgestelltechnik" im Lernheft vorher wiederholen.',
    checklist: [
      { id: 'c1', label: 'Sichtprüfung Drehgestellrahmen auf Risse' },
      { id: 'c2', label: 'Radsatzlager auf Spiel/Temperatur prüfen' },
      { id: 'c3', label: 'Bremsbeläge Stärke messen' },
      { id: 'c4', label: 'Bremsprobe (Vollbremsung) durchführen' },
      { id: 'c5', label: 'Federspeicher auf Dichtheit prüfen' },
      { id: 'c6', label: 'Prüfergebnis dokumentieren' },
    ],
  },
  {
    id: 'L-242',
    titel: 'Fehlersuche Türsteuerung',
    anlage: 'Doppelstockwagen',
    baureihe: 'DBpza',
    ort: 'Werkstatt Elektrik',
    gewerk: 'Elektrik',
    prioritaet: 'Hoch',
    status: 'Offen',
    faelligkeit: 'Heute, 11:30',
    lernziel: 'Systematische Fehlersuche nach Schaltplan üben – vom Symptom zur Ursache.',
    beschreibung: 'Fehlercode E-4471 liegt vor (Türsteuergerät meldet Timeout). Ursache eingrenzen und beheben.',
    checklist: [
      { id: 'c1', label: 'Fehlerspeicher Türsteuergerät auslesen' },
      { id: 'c2', label: 'Verkabelung Türantrieb auf Beschädigung prüfen' },
      { id: 'c3', label: 'Lichtschranke reinigen/justieren' },
      { id: 'c4', label: 'Funktionstest Tür (10 Zyklen)' },
      { id: 'c5', label: 'Fehlerspeicher zurücksetzen' },
    ],
  },
  {
    id: 'L-243',
    titel: 'Funktionsprüfung Weichenheizung',
    anlage: 'Weichenantrieb',
    ort: 'Außenanlage',
    gewerk: 'Mechatronik',
    prioritaet: 'Mittel',
    status: 'Offen',
    faelligkeit: 'Morgen, 08:00',
    lernziel: 'Zusammenspiel von Sensorik (Temperaturfühler) und Aktorik (Heizstäbe) an einem realen Beispiel nachvollziehen.',
    beschreibung: 'Saisonale Funktionsprüfung der Weichenheizung vor Wintereinsatz.',
    checklist: [
      { id: 'c1', label: 'Heizstäbe auf Durchgang prüfen' },
      { id: 'c2', label: 'Temperaturfühler kalibrieren' },
      { id: 'c3', label: 'Steuerschrank auf Feuchtigkeit prüfen' },
      { id: 'c4', label: 'Automatikbetrieb testen' },
    ],
  },
  {
    id: 'L-235',
    titel: 'Fehlersuche Klimaanlage',
    anlage: 'Regionaltriebwagen',
    baureihe: 'BR 442',
    ort: 'Werkhalle 2',
    gewerk: 'Mechatronik',
    prioritaet: 'Mittel',
    status: 'Erledigt',
    faelligkeit: 'Gestern, 16:00',
    lernziel: 'Grundprinzip des Kältekreislaufs (Verdichten, Kondensieren, Entspannen, Verdampfen) an der Anlage erkennen.',
    beschreibung: 'Klimakompressor schaltete nach ca. 5 Minuten ab. Ursache finden und beheben.',
    checklist: [
      { id: 'c1', label: 'Kältemittelstand prüfen' },
      { id: 'c2', label: 'Druckwächter testen' },
      { id: 'c3', label: 'Kondensator reinigen' },
      { id: 'c4', label: 'Probelauf 30 Minuten durchführen' },
    ],
  },
  {
    id: 'L-228',
    titel: 'Hauptschalter tauschen',
    anlage: 'E-Lok',
    baureihe: 'BR 185',
    ort: 'Werkhalle 1',
    gewerk: 'Elektrik',
    prioritaet: 'Niedrig',
    status: 'Erledigt',
    faelligkeit: 'Gestern, 09:00',
    lernziel: 'Sicherheitsregeln beim Arbeiten an Hochspannungsanlagen (Freischalten, Erden) korrekt anwenden.',
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

export type FehlerfallSchwierigkeit = 'Grundlagen' | 'Fortgeschritten'

export interface Fehlerfall {
  id: string
  code: string
  titel: string
  gewerk: Gewerk
  baureihe: string
  schwierigkeit: FehlerfallSchwierigkeit
  symptome: string[]
  ursache: string
  loesung: string[]
  merksatz: string
  haeufigkeit: 'Häufig' | 'Gelegentlich' | 'Selten'
}

export const fehlerfaelle: Fehlerfall[] = [
  {
    id: 'F-001',
    code: 'E-4471',
    titel: 'Türsteuergerät Timeout',
    gewerk: 'Elektrik',
    baureihe: 'DBpza / Doppelstockwagen',
    schwierigkeit: 'Grundlagen',
    symptome: ['Tür schließt nicht vollständig', 'Steuergerät zeigt Timeout-Fehler'],
    ursache: 'Meist verschmutzte oder dejustierte Lichtschranke, seltener Wackelkontakt am Türantrieb.',
    loesung: [
      'Lichtschranke mit trockenem Tuch reinigen',
      'Justierung nach Werksvorgabe prüfen (±2mm)',
      'Steckverbinder am Türantrieb auf Sitz prüfen',
      'Fehlerspeicher zurücksetzen und 10 Testzyklen fahren',
    ],
    merksatz: 'Bei Sensorfehlern immer zuerst „sauber, fest, dicht" prüfen, bevor du Bauteile tauschst.',
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-002',
    code: 'M-2210',
    titel: 'Radsatzlager Übertemperatur',
    gewerk: 'Mechanik',
    baureihe: 'BR 412 / ICE 4',
    schwierigkeit: 'Fortgeschritten',
    symptome: ['Heißläuferortung löst aus', 'Erhöhte Temperatur an Radsatzlager'],
    ursache: 'Schmierstoffmangel oder beginnender Lagerschaden.',
    loesung: [
      'Lager auf Laufgeräusche und Spiel prüfen',
      'Schmierstoff nach Vorgabe nachfüllen/erneuern',
      'Bei Spiel > Grenzwert: Radsatz tauschen',
      'Nachkontrolle nach 200 km',
    ],
    merksatz: 'Wärme + Geräusch = Reibung. Frag dich immer: wo reibt hier etwas, das nicht reiben soll?',
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-003',
    code: 'K-1187',
    titel: 'Klimakompressor Kurzabschaltung',
    gewerk: 'Mechatronik',
    baureihe: 'BR 442 / Talent 2',
    schwierigkeit: 'Grundlagen',
    symptome: ['Kompressor läuft an und schaltet nach Minuten ab', 'Fahrgastraum wird nicht gekühlt'],
    ursache: 'Kältemittelmangel löst Druckwächter (Niederdruck) aus.',
    loesung: [
      'Kältemittelstand am Schauglas prüfen',
      'Anlage auf Leckage prüfen (UV-Zusatz/Lecksuchgerät)',
      'Kältemittel nach Herstellervorgabe auffüllen',
      'Probelauf mind. 30 Minuten überwachen',
    ],
    merksatz: 'Der Druckwächter schützt den Kompressor – er ist meist der Melder, nicht die Ursache.',
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-004',
    code: 'E-3305',
    titel: 'Hauptschalter löst spontan aus',
    gewerk: 'Elektrik',
    baureihe: 'BR 185 / E-Lok',
    schwierigkeit: 'Fortgeschritten',
    symptome: ['Hauptschalter fällt ohne erkennbaren Grund', 'Keine Fehlermeldung im Display'],
    ursache: 'Meist Isolationsfehler im Dachstromkreis oder Überspannung bei Fahrdrahtübergängen.',
    loesung: [
      'Isolationsmessung Dachstromkreis durchführen',
      'Überspannungsableiter prüfen',
      'Stromabnehmer-Schleifleisten auf Verschleiß prüfen',
      'Bei Normalwert: Software-Log auswerten (Systemtechnik)',
    ],
    merksatz: 'Ohne Fehlermeldung heißt nicht „kein Fehler" – manche Schutzfunktionen lösen stumm aus.',
    haeufigkeit: 'Selten',
  },
  {
    id: 'F-005',
    code: 'W-0912',
    titel: 'Weichenheizung ohne Funktion',
    gewerk: 'Mechatronik',
    baureihe: 'Weichenantrieb allgemein',
    schwierigkeit: 'Grundlagen',
    symptome: ['Heizung startet nicht bei Frost', 'Automatikbetrieb reagiert nicht'],
    ursache: 'Defekter Temperaturfühler oder Feuchtigkeit im Steuerschrank.',
    loesung: [
      'Temperaturfühler-Widerstand messen und vergleichen',
      'Steuerschrank auf Kondenswasser prüfen, trocknen',
      'Sicherungen und Schütze prüfen',
      'Manuellen Testlauf auslösen',
    ],
    merksatz: 'Feuchtigkeit ist einer der häufigsten Gründe für „spinnende" Elektronik im Freien.',
    haeufigkeit: 'Häufig',
  },
]

export interface Ersatzteil {
  id: string
  name: string
  nummer: string
  kategorie: Gewerk | 'Allgemein'
  lagerort: string
  funktion: string
}

export const ersatzteile: Ersatzteil[] = [
  { id: 'ET-1', name: 'Bremsbelag ICE 4 (Satz)', nummer: '412-BR-3391', kategorie: 'Mechanik', lagerort: 'Halle 2, Regal C3', funktion: 'Erzeugt durch Reibung an der Bremsscheibe die Bremskraft.' },
  { id: 'ET-2', name: 'Türsteuergerät DBpza', nummer: 'DB-TS-2207', kategorie: 'Elektrik', lagerort: 'Halle 1, Regal A1', funktion: 'Steuert Öffnen/Schließen und wertet Sicherheitssensoren der Tür aus.' },
  { id: 'ET-3', name: 'Lichtschranke Türantrieb', nummer: 'LS-4471-C', kategorie: 'Elektrik', lagerort: 'Halle 1, Regal A2', funktion: 'Erkennt Hindernisse im Türspalt, verhindert Einklemmen.' },
  { id: 'ET-4', name: 'Kältemittel R134a (Flasche)', nummer: 'KM-R134-10', kategorie: 'Mechatronik', lagerort: 'Halle 3, Gefahrstofflager', funktion: 'Arbeitsmedium des Kältekreislaufs der Klimaanlage.' },
  { id: 'ET-5', name: 'Hauptschalter BR 185', nummer: 'HS-185-09', kategorie: 'Elektrik', lagerort: 'Halle 1, Regal B4', funktion: 'Trennt das Fahrzeug im Fehlerfall komplett von der Fahrleitung.' },
  { id: 'ET-6', name: 'Radsatzlager komplett', nummer: 'RSL-412-11', kategorie: 'Mechanik', lagerort: 'Halle 2, Regal D1', funktion: 'Lagert die Achse drehbar im Drehgestellrahmen.' },
  { id: 'ET-7', name: 'Temperaturfühler Weiche', nummer: 'TF-W-0912', kategorie: 'Mechatronik', lagerort: 'Halle 3, Regal E2', funktion: 'Meldet der Steuerung die Außentemperatur zum Zuschalten der Heizung.' },
]

export type AusbildungsblockTyp = 'Betrieb' | 'Berufsschule' | 'DB Training'

export interface Ausbildungsblock {
  typ: AusbildungsblockTyp
  thema: string
  ort: string
}

// Wochentag-Vorlage (Mo–So), wiederholt sich jede Woche. Ein Tag ohne Eintrag (null) gilt als frei.
// Das ist nur eine Beispielvorlage – jede:r Azubi trägt in der App den eigenen echten Rhythmus ein.
export const ausbildungsplanVorlage: (Ausbildungsblock | null)[] = [
  { typ: 'Betrieb', thema: 'Fahrzeuginstandhaltung – Elektrik', ort: 'Werk Rummelsburg' },
  { typ: 'Betrieb', thema: 'Fahrzeuginstandhaltung – Elektrik', ort: 'Werk Rummelsburg' },
  { typ: 'Berufsschule', thema: 'LF6: Anlagen und Geräte analysieren und prüfen', ort: 'OSZ Gustav-Meyer' },
  { typ: 'Berufsschule', thema: 'LF6: Anlagen und Geräte analysieren und prüfen', ort: 'OSZ Gustav-Meyer' },
  { typ: 'Betrieb', thema: 'Fahrzeuginstandhaltung – Elektrik', ort: 'Werk Rummelsburg' },
  null,
  null,
]

export type BerichtsheftStatus = 'Entwurf' | 'Eingereicht' | 'Freigegeben'
export type BerichtsheftKategorie = 'Betrieblich' | 'Berufsschule' | 'DB Training'

export interface BerichtsheftEintrag {
  id: string
  datumISO: string
  datum: string
  kategorie: BerichtsheftKategorie
  taetigkeiten: string
  stunden: number
  status: BerichtsheftStatus
  ausbilderKommentar?: string
}

export const berichtsheft: BerichtsheftEintrag[] = [
  {
    id: 'B-1',
    datumISO: '2026-09-08',
    datum: 'Montag, 08.09.',
    kategorie: 'Betrieblich',
    taetigkeiten:
      'Bremsprobe an ICE 4 unter Anleitung durchgeführt. Aufbau des Drehgestells kennengelernt, Radsatzlager auf Spiel geprüft.',
    stunden: 8,
    status: 'Freigegeben',
    ausbilderKommentar: 'Gut dokumentiert, weiter so.',
  },
  {
    id: 'B-2',
    datumISO: '2026-09-09',
    datum: 'Dienstag, 09.09.',
    kategorie: 'Betrieblich',
    taetigkeiten:
      'Fehlersuche an Türsteuerung DBpza begonnen. Fehlerspeicher ausgelesen, Lichtschranke gereinigt und justiert.',
    stunden: 7.5,
    status: 'Eingereicht',
  },
  {
    id: 'B-3',
    datumISO: '2026-09-10',
    datum: 'Mittwoch, 10.09.',
    kategorie: 'Berufsschule',
    taetigkeiten: 'Lernfeld 6: Grundlagen speicherprogrammierbarer Steuerungen (SPS), Übungen zu UND/ODER-Verknüpfungen.',
    stunden: 8,
    status: 'Freigegeben',
  },
  {
    id: 'B-4',
    datumISO: '2026-09-11',
    datum: 'Donnerstag, 11.09.',
    kategorie: 'Betrieblich',
    taetigkeiten: '',
    stunden: 0,
    status: 'Entwurf',
  },
]

export interface Pruefung {
  titel: string
  datum: string
  tageVerbleibend: number
}

export const naechstePruefung: Pruefung = {
  titel: 'Abschlussprüfung Teil 1',
  datum: '12. November',
  tageVerbleibend: 63,
}

export type AusbildungsberufName = 'Elektroniker für Betriebstechnik' | 'Industriemechaniker' | 'Mechatroniker'
export type LernfeldStatus = 'Abgeschlossen' | 'Aktuell' | 'Geplant'

export interface Lernfeld {
  nummer: number
  titel: string
  ausbildungsjahr: number
  stunden: number
  status: LernfeldStatus
}

export interface Pruefungsbereich {
  name: string
  gewichtung: string
  dauer?: string
}

export interface Pruefungsteil {
  bezeichnung: string
  zeitpunkt: string
  gewichtungGesamt: string
  bereiche: Pruefungsbereich[]
}

export interface AusbildungsberufCurriculum {
  beruf: AusbildungsberufName
  lernfelder: Lernfeld[]
  teil1: Pruefungsteil
  teil2: Pruefungsteil
  quelle: string
}

// Quelle: KMK-Rahmenlehrpläne und IHK-Prüfungsordnungen (öffentlich zugänglich, Stand 2018er-Neuordnung).
// Kein Abbild eines internen Systems – dient nur als grobe Orientierung, ersetzt nicht den offiziellen Rahmenlehrplan.
export const curricula: AusbildungsberufCurriculum[] = [
  {
    beruf: 'Elektroniker für Betriebstechnik',
    lernfelder: [
      { nummer: 1, titel: 'Elektrotechnische Systeme analysieren und Funktionen prüfen', ausbildungsjahr: 1, stunden: 80, status: 'Abgeschlossen' },
      { nummer: 2, titel: 'Elektrische Installationen planen und ausführen', ausbildungsjahr: 1, stunden: 80, status: 'Abgeschlossen' },
      { nummer: 3, titel: 'Steuerungen analysieren und anpassen', ausbildungsjahr: 1, stunden: 80, status: 'Abgeschlossen' },
      { nummer: 4, titel: 'Informationstechnische Systeme bereitstellen', ausbildungsjahr: 1, stunden: 80, status: 'Abgeschlossen' },
      { nummer: 5, titel: 'Elektroenergieversorgung und Sicherheit von Betriebsmitteln gewährleisten', ausbildungsjahr: 2, stunden: 80, status: 'Abgeschlossen' },
      { nummer: 6, titel: 'Anlagen und Geräte analysieren und prüfen', ausbildungsjahr: 2, stunden: 60, status: 'Aktuell' },
      { nummer: 7, titel: 'Steuerungen für Anlagen programmieren und realisieren', ausbildungsjahr: 3, stunden: 80, status: 'Geplant' },
      { nummer: 8, titel: 'Antriebssysteme auswählen und integrieren', ausbildungsjahr: 3, stunden: 60, status: 'Geplant' },
    ],
    teil1: {
      bezeichnung: 'Abschlussprüfung Teil 1',
      zeitpunkt: 'Vor Ende des 2. Ausbildungsjahres',
      gewichtungGesamt: '40 %',
      bereiche: [{ name: 'Prüfungsbereich Teil 1 (Lernfelder 1–6)', gewichtung: '40 % der Gesamtnote' }],
    },
    teil2: {
      bezeichnung: 'Abschlussprüfung Teil 2',
      zeitpunkt: 'Am Ende der Ausbildung',
      gewichtungGesamt: '60 %',
      bereiche: [
        { name: 'Praktische Arbeitsaufgaben', gewichtung: '70 % (zusammen)' },
        { name: 'Wirtschafts- und Sozialkunde', gewichtung: 'schriftlich' },
      ],
    },
    quelle: 'IHK-Rahmenlehrplan Elektroniker/-in für Betriebstechnik, Prüfungsordnung (gestreckte Abschlussprüfung)',
  },
  {
    beruf: 'Industriemechaniker',
    lernfelder: [
      { nummer: 1, titel: 'Fertigen und Fügen', ausbildungsjahr: 1, stunden: 80, status: 'Abgeschlossen' },
      { nummer: 2, titel: 'Fertigen von Bauelementen mit handgeführten Werkzeugen', ausbildungsjahr: 1, stunden: 80, status: 'Abgeschlossen' },
      { nummer: 3, titel: 'Fertigen von Bauelementen mit Maschinen', ausbildungsjahr: 1, stunden: 80, status: 'Abgeschlossen' },
      { nummer: 4, titel: 'Herstellen von einfachen Baugruppen', ausbildungsjahr: 1, stunden: 60, status: 'Abgeschlossen' },
      { nummer: 5, titel: 'Fertigen von Einzelteilen mit Maschinen', ausbildungsjahr: 2, stunden: 80, status: 'Aktuell' },
      { nummer: 6, titel: 'Installieren und Inbetriebnehmen steuerungstechnischer Maschinen', ausbildungsjahr: 2, stunden: 80, status: 'Geplant' },
      { nummer: 7, titel: 'Montieren von technischen Teilsystemen', ausbildungsjahr: 2, stunden: 60, status: 'Geplant' },
      { nummer: 8, titel: 'Fertigen auf numerisch gesteuerten Werkzeugmaschinen', ausbildungsjahr: 3, stunden: 60, status: 'Geplant' },
      { nummer: 9, titel: 'Instandsetzen von technischen Systemen', ausbildungsjahr: 3, stunden: 40, status: 'Geplant' },
      { nummer: 10, titel: 'Herstellen und Inbetriebnehmen von technischen Systemen', ausbildungsjahr: 3, stunden: 80, status: 'Geplant' },
      { nummer: 11, titel: 'Überwachen der Produkt- und Prozessqualität', ausbildungsjahr: 3, stunden: 60, status: 'Geplant' },
      { nummer: 12, titel: 'Instandhalten von technischen Systemen', ausbildungsjahr: 4, stunden: 60, status: 'Geplant' },
      { nummer: 13, titel: 'Sicherstellen der Betriebsfähigkeit automatisierter Systeme', ausbildungsjahr: 4, stunden: 60, status: 'Geplant' },
      { nummer: 14, titel: 'Planen und Realisieren technischer Systeme', ausbildungsjahr: 4, stunden: 80, status: 'Geplant' },
    ],
    teil1: {
      bezeichnung: 'Abschlussprüfung Teil 1',
      zeitpunkt: 'Nach ca. 1,5 Ausbildungsjahren (Lernfelder 1–6)',
      gewichtungGesamt: '40 %',
      bereiche: [{ name: 'Prüfungsbereich Teil 1', gewichtung: '40 % der Gesamtnote' }],
    },
    teil2: {
      bezeichnung: 'Abschlussprüfung Teil 2',
      zeitpunkt: 'Am Ende der Ausbildung (nach 3,5 Jahren)',
      gewichtungGesamt: '60 %',
      bereiche: [
        { name: 'Arbeitsauftrag', gewichtung: '30 %' },
        { name: 'Auftrags- und Funktionsanalyse', gewichtung: 'schriftlich', dauer: '120 Min.' },
        { name: 'Fertigungstechnik', gewichtung: 'schriftlich', dauer: '120 Min.' },
        { name: 'Wirtschafts- und Sozialkunde', gewichtung: 'schriftlich', dauer: '60 Min.' },
      ],
    },
    quelle: 'KMK-Rahmenlehrplan Industriemechaniker/-in, IHK-Prüfungsordnung (gestreckte Abschlussprüfung)',
  },
  {
    beruf: 'Mechatroniker',
    lernfelder: [
      { nummer: 1, titel: 'Analysieren von Funktionszusammenhängen in mechatronischen Systemen', ausbildungsjahr: 1, stunden: 40, status: 'Abgeschlossen' },
      { nummer: 2, titel: 'Herstellen mechanischer Teilsysteme', ausbildungsjahr: 1, stunden: 80, status: 'Abgeschlossen' },
      { nummer: 3, titel: 'Installieren elektrischer Betriebsmittel unter Beachtung sicherheitstechnischer Aspekte', ausbildungsjahr: 1, stunden: 100, status: 'Abgeschlossen' },
      { nummer: 4, titel: 'Untersuchen der Energie- und Informationsflüsse in elektrischen, hydraulischen und pneumatischen Baugruppen', ausbildungsjahr: 1, stunden: 80, status: 'Abgeschlossen' },
      { nummer: 5, titel: 'Kommunizieren mit Hilfe von Datenverarbeitungssystemen', ausbildungsjahr: 2, stunden: 60, status: 'Aktuell' },
      { nummer: 6, titel: 'Planen und Organisieren von Arbeitsabläufen', ausbildungsjahr: 2, stunden: 60, status: 'Geplant' },
      { nummer: 7, titel: 'Realisieren mechatronischer Teilsysteme', ausbildungsjahr: 2, stunden: 80, status: 'Geplant' },
      { nummer: 8, titel: 'Design und Erstellen mechatronischer Systeme', ausbildungsjahr: 3, stunden: 80, status: 'Geplant' },
      { nummer: 9, titel: 'Untersuchen des Informationsflusses in komplexen mechatronischen Systemen', ausbildungsjahr: 3, stunden: 60, status: 'Geplant' },
      { nummer: 10, titel: 'Planen der Montage und Demontage', ausbildungsjahr: 3, stunden: 60, status: 'Geplant' },
      { nummer: 11, titel: 'Inbetriebnahme, Fehlersuche und Instandsetzung', ausbildungsjahr: 4, stunden: 80, status: 'Geplant' },
      { nummer: 12, titel: 'Vorbeugende Instandhaltung', ausbildungsjahr: 4, stunden: 60, status: 'Geplant' },
    ],
    teil1: {
      bezeichnung: 'Abschlussprüfung Teil 1',
      zeitpunkt: 'Vor Ende des 2. Ausbildungsjahres',
      gewichtungGesamt: '40 %',
      bereiche: [{ name: 'Arbeiten an einem mechatronischen Teilsystem', gewichtung: '40 %', dauer: '8 Std. (Arbeitsaufgabe + Fachgespräch + schriftlich)' }],
    },
    teil2: {
      bezeichnung: 'Abschlussprüfung Teil 2',
      zeitpunkt: 'Am Ende der Ausbildung',
      gewichtungGesamt: '60 %',
      bereiche: [
        { name: 'Arbeitsauftrag', gewichtung: '50 %' },
        { name: 'Arbeitsplanung', gewichtung: '20 %' },
        { name: 'Funktionsanalyse', gewichtung: '20 %' },
        { name: 'Wirtschafts- und Sozialkunde', gewichtung: '10 %' },
      ],
    },
    quelle: 'KMK-Rahmenlehrplan Mechatroniker/-in, IHK-Prüfungsordnung (gestreckte Abschlussprüfung)',
  },
]

export function lehrjahreGesamtFuer(beruf: AusbildungsberufName): number {
  const curriculum = curricula.find((c) => c.beruf === beruf)
  if (!curriculum) return 3
  return Math.max(...curriculum.lernfelder.map((lf) => lf.ausbildungsjahr))
}

export interface Lernkarte {
  id: string
  themenbereich: Themenbereich
  pruefungsteil: Pruefungsphase
  schwierigkeit: FehlerfallSchwierigkeit
  frage: string
  antwort: string
}

export type Themenbereich =
  | 'Mathematik'
  | 'Elektrotechnik'
  | 'Sicherheit'
  | 'Metalltechnik'
  | 'Steuerungstechnik'
  | 'Wirtschaft & Soziales'
  | 'Ausbildung'

export type Pruefungsphase = 'AP1' | 'AP2'

export const lernkarten: Lernkarte[] = [
  // --- Mathematik ---
  {
    id: 'LK-M1',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Ein Kabel von 8 m kostet 24 €. Was kosten 12 m? Wie gehst du beim Dreisatz vor?',
    antwort: 'Erst auf 1 m runterrechnen: 24 € / 8 m = 3 €/m. Dann hoch auf 12 m: 3 €/m · 12 = 36 €.',
  },
  {
    id: 'LK-M2',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Ein Werkstück wiegt nach der Bearbeitung 850 g, das waren 85 % des Rohgewichts. Wie schwer war das Rohteil?',
    antwort: 'Rohgewicht = 850 g / 0,85 = 1000 g.',
  },
  {
    id: 'LK-M3',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie berechnest du die Fläche eines Kreises, z. B. den Querschnitt einer Bohrung?',
    antwort: 'A = π · r² (r = Radius, die Hälfte des Durchmessers).',
  },
  {
    id: 'LK-M4',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie berechnest du das Volumen eines zylindrischen Werkstücks?',
    antwort: 'V = π · r² · h (Grundfläche mal Höhe).',
  },
  {
    id: 'LK-M5',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie rechnest du 0,75 mm in µm um?',
    antwort: '1 mm = 1000 µm, also 0,75 mm = 750 µm.',
  },
  {
    id: 'LK-M6',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Wofür brauchst du den Satz des Pythagoras in der Praxis, z. B. beim Anreißen?',
    antwort: 'a² + b² = c². Damit prüfst oder berechnest du z. B. rechte Winkel oder die Diagonale eines rechteckigen Bauteils.',
  },
  {
    id: 'LK-M7',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Wie berechnest du eine unbekannte Kathete in einem rechtwinkligen Dreieck, wenn du einen Winkel und die Hypotenuse kennst?',
    antwort: 'Mit Sinus/Kosinus: Gegenkathete = Hypotenuse · sin(Winkel), Ankathete = Hypotenuse · cos(Winkel).',
  },
  {
    id: 'LK-M8',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Eine Maschine fertigt 45 Teile in 15 Minuten. Wie viele Teile schafft sie in einer Stunde?',
    antwort: '45 Teile / 15 Min = 3 Teile/Min. In 60 Min: 3 · 60 = 180 Teile.',
  },
  {
    id: 'LK-M9',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Welche Rechenregel gilt bei einer Aufgabe wie 5 + 3 · 4?',
    antwort: 'Punktrechnung vor Strichrechnung: erst 3 · 4 = 12 rechnen, dann 5 + 12 = 17.',
  },
  {
    id: 'LK-M10',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Ein Bauteil ist im Maßstab 1:5 gezeichnet und misst in der Zeichnung 40 mm. Wie lang ist es real?',
    antwort: '40 mm · 5 = 200 mm = 20 cm.',
  },

  // --- Elektrotechnik ---
  {
    id: 'LK-E1',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie lautet das Ohmsche Gesetz und wonach löst du bei gegebener Spannung und Widerstand auf?',
    antwort: 'U = R · I. Nach dem Strom aufgelöst: I = U / R.',
  },
  {
    id: 'LK-E2',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was ist der Unterschied zwischen Reihen- und Parallelschaltung beim Gesamtwiderstand?',
    antwort:
      'Reihenschaltung: Widerstände addieren sich (R_ges = R1 + R2 + ...). Parallelschaltung: der Kehrwert des Gesamtwiderstands ist die Summe der Kehrwerte (1/R_ges = 1/R1 + 1/R2 + ...), R_ges wird kleiner als der kleinste Einzelwiderstand.',
  },
  {
    id: 'LK-E3',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie berechnest du die elektrische Leistung aus Spannung und Strom?',
    antwort: 'P = U · I. Einheit Watt (W).',
  },
  {
    id: 'LK-E4',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wozu dient der Schutzleiter (PE) an elektrischen Geräten?',
    antwort:
      'Er verbindet leitfähige Gehäuseteile mit der Erde. Bei einem Isolationsfehler fließt so ein hoher Strom ab, der die Sicherung schnell auslöst, statt das Gehäuse dauerhaft unter Spannung zu setzen.',
  },
  {
    id: 'LK-E5',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie funktioniert ein Fehlerstromschutzschalter (FI/RCD) und wovor schützt er?',
    antwort:
      'Er vergleicht den Strom im Außen- und Neutralleiter. Fließt ein Teil z. B. über einen Menschen zur Erde ab, entsteht eine Differenz und der FI schaltet in Millisekunden ab – schützt vor lebensgefährlichem Stromschlag.',
  },
  {
    id: 'LK-E6',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was gibt der Effektivwert einer Wechselspannung an, z. B. bei 230 V Netzspannung?',
    antwort:
      'Den Gleichspannungswert, der die gleiche Leistung/Wärmewirkung erzeugen würde. Bei 230 V Effektivwert liegt der Scheitelwert (Spitzenwert) bei ca. 325 V.',
  },
  {
    id: 'LK-E7',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Wie hängt das Übersetzungsverhältnis eines Transformators mit den Windungszahlen zusammen?',
    antwort:
      'U1/U2 = N1/N2. Mehr Windungen auf der Primär- als auf der Sekundärseite bedeutet, die Spannung wird heruntertransformiert (und umgekehrt).',
  },
  {
    id: 'LK-E8',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was besagt die Kirchhoffsche Knotenregel?',
    antwort: 'Die Summe aller Ströme, die in einen Knotenpunkt hineinfließen, ist gleich der Summe aller Ströme, die herausfließen.',
  },
  {
    id: 'LK-E9',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Welche Grundfunktion hat eine Diode in einer Schaltung?',
    antwort:
      'Sie lässt Strom nur in eine Richtung durch (Durchlassrichtung) und sperrt in die andere (Sperrrichtung) – z. B. zum Gleichrichten von Wechselspannung.',
  },
  {
    id: 'LK-E10',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Was macht eine NICHT-Verknüpfung (NOT) in der Steuerungstechnik?',
    antwort: 'Sie kehrt das Eingangssignal um: aus 1 wird 0, aus 0 wird 1 (Invertierung).',
  },

  // --- Sicherheit ---
  {
    id: 'LK-S1',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Welche 5 Sicherheitsregeln gelten beim Freischalten elektrischer Anlagen?',
    antwort:
      '1. Freischalten, 2. Gegen Wiedereinschalten sichern, 3. Spannungsfreiheit feststellen, 4. Erden und Kurzschließen, 5. Benachbarte, unter Spannung stehende Teile abdecken oder abschranken.',
  },
  {
    id: 'LK-S2',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was zählt zur persönlichen Schutzausrüstung (PSA) in der Werkstatt?',
    antwort: 'U. a. Sicherheitsschuhe, Schutzbrille, Gehörschutz, Schutzhandschuhe, je nach Tätigkeit auch Helm.',
  },
  {
    id: 'LK-S3',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Welche Brandklasse betrifft brennende Metalle und darf nicht mit Wasser gelöscht werden?',
    antwort:
      'Brandklasse D (Metallbrände). Wasser würde bei brennenden Metallen wie Magnesium eine heftige Reaktion auslösen – spezielle Metallbrandlöscher verwenden.',
  },
  {
    id: 'LK-S4',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wofür stehen die GHS-Gefahrstoffsymbole (z. B. Flamme, Totenkopf)?',
    antwort:
      'Sie kennzeichnen genormt die Gefahr eines Stoffes (z. B. entzündlich, giftig, ätzend) nach dem weltweit einheitlichen GHS-System (Globally Harmonized System).',
  },
  {
    id: 'LK-S5',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wann wird die stabile Seitenlage bei der Ersten Hilfe angewendet?',
    antwort:
      'Bei bewusstlosen Personen mit normaler Atmung, um die Atemwege freizuhalten und ein Ersticken an Erbrochenem zu verhindern.',
  },
  {
    id: 'LK-S6',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was gehört laut Jugendarbeitsschutzgesetz zu den wichtigsten Regeln für Azubis unter 18?',
    antwort:
      'U. a. maximal 8 Std./Tag bzw. 40 Std./Woche, keine Arbeit vor 6 Uhr oder nach 20 Uhr, mindestens 30 Minuten Pause ab 4,5 Std. Arbeitszeit, keine gefährlichen Arbeiten ohne Aufsicht.',
  },
  {
    id: 'LK-S7',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Ab welchem Lärmpegel besteht grundsätzlich Gehörschutzpflicht?',
    antwort: 'Ab einem Beurteilungspegel von 85 dB(A) muss Gehörschutz getragen werden, ab 80 dB(A) muss er bereitgestellt werden.',
  },
  {
    id: 'LK-S8',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Worauf muss bei Flucht- und Rettungswegen in der Werkstatt geachtet werden?',
    antwort: 'Sie müssen jederzeit frei von Hindernissen, eindeutig gekennzeichnet und ausreichend beleuchtet sein.',
  },
  {
    id: 'LK-S9',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie hebt man schwere Lasten richtig, um den Rücken zu schonen?',
    antwort: 'Aus den Beinen heben, Rücken gerade halten, Last nah am Körper tragen, nicht ruckartig drehen.',
  },
  {
    id: 'LK-S10',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was ist eine Gefährdungsbeurteilung und wer muss sie erstellen?',
    antwort:
      'Eine systematische Ermittlung und Bewertung von Gefahren am Arbeitsplatz mit Festlegung von Schutzmaßnahmen – Pflicht des Arbeitgebers nach Arbeitsschutzgesetz.',
  },

  // --- Metalltechnik ---
  {
    id: 'LK-T1',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was versteht man unter „Passung" bei zwei zusammengefügten Bauteilen?',
    antwort:
      'Die Passung beschreibt das Verhältnis von Bohrung und Welle zueinander (Spiel-, Übergangs- oder Presspassung) und legt fest, wie fest oder locker zwei Teile ineinander sitzen.',
  },
  {
    id: 'LK-T2',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Wofür steht die Abkürzung „NDT" und wozu dient sie?',
    antwort:
      'NDT = Non-Destructive Testing (zerstörungsfreie Prüfung), z. B. Ultraschall- oder Magnetpulverprüfung, um Risse in Bauteilen zu finden, ohne sie zu zerstören.',
  },
  {
    id: 'LK-T3',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Warum wird ein Drehmomentschlüssel beim Verschrauben sicherheitsrelevanter Bauteile vorgeschrieben?',
    antwort:
      'Er stellt sicher, dass die Schraubverbindung exakt mit dem vom Hersteller vorgegebenen Anzugsmoment angezogen wird – zu locker kann sich lösen, zu fest kann das Gewinde oder Bauteil beschädigen.',
  },
  {
    id: 'LK-T4',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was passiert beim Härten von Stahl und warum wird danach oft angelassen?',
    antwort:
      'Beim Härten wird Stahl erhitzt und schnell abgeschreckt, wodurch er hart, aber spröde wird. Anlassen (erneutes, moderates Erwärmen) reduziert die Sprödigkeit und baut innere Spannungen ab.',
  },
  {
    id: 'LK-T5',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was ist der grundlegende Unterschied zwischen Drehen und Fräsen?',
    antwort:
      'Beim Drehen rotiert das Werkstück, das Werkzeug steht meist fest. Beim Fräsen rotiert das Werkzeug, das Werkstück wird meist linear bewegt.',
  },
  {
    id: 'LK-T6',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Aus welchen zwei Skalen setzt sich eine Messung mit dem Messschieber zusammen?',
    antwort:
      'Aus Hauptskala (ganze mm) und Nonius-Skala (Zehntel- oder Zwanzigstel-mm) – der Nonius-Strich, der am genauesten mit der Hauptskala übereinstimmt, gibt die Dezimalstelle an.',
  },
  {
    id: 'LK-T7',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was gibt die Gewindesteigung an?',
    antwort:
      'Den Abstand zwischen zwei benachbarten Gewindegängen in mm – bestimmt, wie weit sich z. B. eine Schraube pro Umdrehung vorwärtsbewegt.',
  },
  {
    id: 'LK-T8',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was ist der Hauptunterschied zwischen MIG/MAG- und WIG-Schweißen?',
    antwort:
      'MIG/MAG nutzt eine abschmelzende Drahtelektrode als Zusatzwerkstoff. WIG (Wolfram-Inertgas) nutzt eine nicht abschmelzende Wolframelektrode mit separatem Zusatzwerkstoff – präziser und sauberer, aber langsamer.',
  },
  {
    id: 'LK-T9',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was wird im Zugversuch an einem Werkstoff ermittelt?',
    antwort: 'U. a. Zugfestigkeit, Streckgrenze und Bruchdehnung – wichtige Kennwerte für die Materialauswahl.',
  },
  {
    id: 'LK-T10',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Welche Verfahren schützen Stahl vor Korrosion?',
    antwort:
      'U. a. Verzinken, Lackieren, Pulverbeschichten – sie bilden eine Schutzschicht gegen Feuchtigkeit und Sauerstoff.',
  },
  {
    id: 'LK-T11',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was gibt die Toleranz bei einer Maßangabe wie Ø20 h7 an?',
    antwort:
      'Den zulässigen Abweichungsbereich vom Nennmaß (hier 20 mm), innerhalb dessen das gefertigte Maß liegen darf – h7 ist eine genormte ISO-Toleranzklasse für Wellen.',
  },

  // --- Steuerungstechnik ---
  {
    id: 'LK-C1',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was ist der Unterschied zwischen einem Sensor und einem Aktor?',
    antwort:
      'Ein Sensor erfasst eine physikalische Größe (z. B. Temperatur, Position) und wandelt sie in ein elektrisches Signal um. Ein Aktor wandelt ein elektrisches Signal in eine Bewegung oder Aktion um (z. B. Motor, Ventil).',
  },
  {
    id: 'LK-C2',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Was bedeutet SPS und welche Aufgabe hat sie in einer Steuerung?',
    antwort:
      'SPS = Speicherprogrammierbare Steuerung. Sie liest Eingangssignale (Sensoren), verarbeitet sie nach einem hinterlegten Programm und steuert darüber Ausgänge (Aktoren) an.',
  },
  {
    id: 'LK-C3',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Wie unterscheiden sich eine UND- und eine ODER-Verknüpfung in der Steuerungstechnik?',
    antwort:
      'UND: Ausgang wird nur aktiv, wenn ALLE Eingänge erfüllt sind. ODER: Ausgang wird aktiv, wenn MINDESTENS EIN Eingang erfüllt ist.',
  },
  {
    id: 'LK-C4',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Was ist das Arbeitsmedium der Pneumatik und was ist ihr Vorteil?',
    antwort:
      'Druckluft. Vorteil: sauber, ungiftig, schnell, kann bei Leckage einfach entweichen ohne Umweltschaden – im Gegensatz zu Hydrauliköl.',
  },
  {
    id: 'LK-C5',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Warum wird Hydraulik statt Pneumatik eingesetzt, wenn hohe Kräfte nötig sind?',
    antwort:
      'Hydrauliköl ist nahezu inkompressibel, dadurch lassen sich mit Hydraulik viel höhere Kräfte präzise und ruckfrei übertragen als mit Druckluft.',
  },
  {
    id: 'LK-C6',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was unterscheidet einen Regelkreis von einer Steuerkette?',
    antwort:
      'Eine Steuerkette wirkt nur in eine Richtung ohne Rückmeldung. Ein Regelkreis misst den Istwert fortlaufend zurück (Rückkopplung) und gleicht ihn automatisch an den Sollwert an.',
  },

  // --- Wirtschaft & Soziales ---
  {
    id: 'LK-W1',
    themenbereich: 'Wirtschaft & Soziales',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Welche Angaben muss ein Ausbildungsvertrag mindestens enthalten?',
    antwort:
      'U. a. Ausbildungsberuf und -ziel, Beginn und Dauer, Ausbildungsvergütung, tägliche Arbeitszeit, Dauer der Probezeit, Urlaubsdauer.',
  },
  {
    id: 'LK-W2',
    themenbereich: 'Wirtschaft & Soziales',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie lang ist die Probezeit in der Ausbildung mindestens und höchstens?',
    antwort: 'Mindestens 1 Monat, höchstens 4 Monate.',
  },
  {
    id: 'LK-W3',
    themenbereich: 'Wirtschaft & Soziales',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Wie unterscheidet sich die Kündigung einer Ausbildung während und nach der Probezeit?',
    antwort:
      'Während der Probezeit kann jederzeit fristlos ohne Angabe von Gründen gekündigt werden. Danach nur noch fristlos aus wichtigem Grund oder mit vier Wochen Frist, wenn man die Ausbildung ganz aufgeben oder den Beruf wechseln will.',
  },
  {
    id: 'LK-W4',
    themenbereich: 'Wirtschaft & Soziales',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Was ist die Aufgabe der Jugend- und Auszubildendenvertretung (JAV)?',
    antwort: 'Sie vertritt die Interessen der Auszubildenden und jungen Beschäftigten gegenüber Betriebsrat und Arbeitgeber.',
  },
  {
    id: 'LK-W5',
    themenbereich: 'Wirtschaft & Soziales',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Was wird vom Bruttolohn abgezogen, um den Nettolohn zu erhalten?',
    antwort: 'Lohnsteuer und Sozialversicherungsbeiträge (Kranken-, Renten-, Arbeitslosen- und Pflegeversicherung).',
  },
  {
    id: 'LK-W6',
    themenbereich: 'Wirtschaft & Soziales',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Was regelt ein Tarifvertrag?',
    antwort:
      'U. a. Löhne/Gehälter, Arbeitszeiten und weitere Arbeitsbedingungen – ausgehandelt zwischen Gewerkschaft und Arbeitgeber(verband).',
  },

  // --- Ausbildung allgemein ---
  {
    id: 'LK-A1',
    themenbereich: 'Ausbildung',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wofür wird das Berichtsheft (Ausbildungsnachweis) benötigt und wie oft sollte es geführt werden?',
    antwort:
      'Es dokumentiert die betrieblichen und schulischen Ausbildungsinhalte, ist Voraussetzung für die Zulassung zur Abschlussprüfung und sollte regelmäßig (i. d. R. wöchentlich) geführt werden.',
  },

  // --- Echte AP2-Prüfungsaufgaben (IHK, Elektroniker für Betriebstechnik) ---
  {
    id: 'LK-R11',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Der Stromlaufplan zeigt die Temperaturüberwachung einer Motorwicklung. Was geschieht, wenn der Schalter -S3 betätigt wird und die Temperatur des Motors niedrig ist?\n1) Im Auslösegerät -B1 wird der Kontakt 11/12 geschlossen.\n2) Das im Auslösegerät -B1 eingebaute Relais zieht an.\n3) Durch den Temperaturfühler im Motor fließt ein Wechselstrom.\n4) Das im Auslösegerät -B1 eingebaute Relais kehrt in die Ruhestellung zurück.\n5) Die Meldeleuchte -P1 beginnt zu leuchten.',
    antwort:
      '4) Das Relais im Auslösegerät kehrt in die Ruhestellung zurück. -S3 ist eine Prüf-/Testtaste, die unabhängig von der tatsächlichen Motortemperatur eine Störung simuliert (z. B. durch Unterbrechen/Kurzschließen des Kaltleiterkreises) – das Gerät reagiert wie im Fehlerfall, obwohl der Motor kalt ist.',
  },
  {
    id: 'LK-R12',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Im dargestellten GRAFCET-Plan werden zwischen zwei waagerechten Doppellinien Abläufe dargestellt. Welche Aussage ist hierzu richtig?\n1) Die Abläufe werden parallel bearbeitet.\n2) Entweder wird der linke oder der rechte Ablauf bearbeitet.\n3) Beide Abläufe werden zweimal wiederholt.\n4) Zuerst wird der linke, dann der rechte Ablauf bearbeitet.\n5) Die bearbeiteten Abläufe müssen die gleiche Anzahl an Schritten haben.',
    antwort:
      '1) Die Abläufe werden parallel bearbeitet. Eine doppelte waagerechte Linie im GRAFCET steht für eine UND-Verzweigung (simultane Sequenzen) – alle Zweige darunter laufen gleichzeitig. Eine einfache Linie stünde für eine ODER-Verzweigung (nur ein Zweig wird gewählt).',
  },
  {
    id: 'LK-R13',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Welche Instandhaltungsstrategie ist im Diagramm dargestellt (der Abnutzungsvorrat sinkt unregelmäßig über die Zeit, die Instandsetzung erfolgt kurz bevor er aufgebraucht ist)?\n1) Vorbeugende Instandhaltung\n2) Zustandsbedingte Instandhaltung\n3) Ausfallbedingte Instandhaltung\n4) Routinemäßige Instandhaltung\n5) Planmäßige Instandhaltung',
    antwort:
      '2) Zustandsbedingte Instandhaltung. Der tatsächliche Verlauf des Abnutzungsvorrats wird laufend überwacht, die Instandsetzung erfolgt anhand des gemessenen Zustands – nicht nach festem Zeitplan (vorbeugend/planmäßig) und nicht erst nach dem tatsächlichen Ausfall (ausfallbedingt).',
  },
  {
    id: 'LK-R14',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Was kann bei der grafischen Simulation eines CNC-Programms nicht erkannt werden?\n1) Das Anfahren zum Werkzeugwechselpunkt\n2) Eine falsche Werkstückkontur\n3) Eine Kollision des Werkzeugs mit dem Werkstück im Eilgang\n4) Eine falsche Werkzeugauswahl (z. B. Einstichmeißel statt Längsdrehmeißel)\n5) Ein ungenügender Spanbruch',
    antwort:
      '5) Ein ungenügender Spanbruch. Die grafische Simulation prüft nur die geometrische Bahn von Werkzeug und Werkstück – Spanbruch ist ein realer Zerspanungsvorgang, der sich geometrisch nicht simulieren lässt.',
  },
  {
    id: 'LK-R15',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Bei digitalen Sensoren zur Weg- bzw. Winkelerfassung unterscheidet man zwischen inkrementaler und absoluter Messung. Welche Aussage ist richtig?\n1) Bei der inkrementalen Wegmessung wird jeder Position auf dem Maßstab ein eindeutiger Zahlenwert zugeordnet.\n2) Bei der inkrementalen Wegmessung werden elektrische Impulse gezählt; die Anzahl der Impulse definiert den zurückgelegten Weg.\n3) Bei der absoluten Wegmessung wird eine Nullmarkierung benötigt.\n4) Bei der absoluten Wegmessung muss zu Beginn der Messung ein Zähler auf 0 gesetzt werden.\n5) Bei der absoluten Wegmessung wird die Anzahl der Impulse eines regelmäßigen Strichrasters ausgewertet.',
    antwort:
      '2) Inkremental = Impulse zählen, ihre Anzahl ergibt den Weg. Absolute Systeme brauchen dagegen keine Nullmarkierung oder Referenzfahrt, da jede Position direkt einen eindeutigen Codewert liefert.',
  },
  {
    id: 'LK-R16',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Was versteht man unter Redundanz bei einer speicherprogrammierbaren Steuerung (SPS)?\n1) Alle Systeme einer SPS sind in Reihe angeordnet.\n2) Alle Systeme einer SPS sind mehrfach ausgelegt.\n3) Alle Systeme der SPS sind nur einmal vorhanden.\n4) Die SPS darf nicht ausgeschaltet werden.\n5) Dies ist ein Programmierbefehl der SPS.',
    antwort:
      '2) Mehrfach ausgelegt. Redundanz bedeutet, dass wichtige Komponenten doppelt oder mehrfach vorhanden sind, damit bei Ausfall einer Komponente ein Ersatzsystem sofort übernehmen kann.',
  },
  {
    id: 'LK-R17',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Am Frequenzumrichter lässt sich eine Vielzahl von Betriebswerten über das Bedienfeld eingeben. Welcher der aufgeführten Werte gehört nicht dazu?\n1) Motorstrom\n2) Motorbemessungsfrequenz\n3) Rampenzeit\n4) Betriebsart des Motors\n5) Mindestausgangsfrequenz',
    antwort:
      '1) Motorstrom. Der Motorstrom ist ein gemessener Istwert, den der Frequenzumrichter während des Betriebs erfasst und anzeigt – kein Parameter, den man als Sollwert eingibt.',
  },
  {
    id: 'LK-R18',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Welche Aussage zur prinzipiellen Arbeitsweise eines Halbleiterrelais ist richtig? (Eingang E1/E2 über eine Gleichrichterbrücke auf eine LED -P1, die optisch den Fototransistor -K1 ansteuert, der den Ausgangstransistor -Q1 schaltet)\n1) Die Ansteuerung erfolgt mit DC, die mit AC betriebene Diode -P1 schaltet den Fototransistor -K1, -Q1 schaltet 0V durch.\n2) Die Ansteuerung erfolgt mit DC, der mit DC betriebene Fototransistor beleuchtet die Diode -P1, der Ausgang schaltet AC.\n3) Die Ansteuerung erfolgt nur mit AC, am Ausgang wird +Ub durchgeschaltet.\n4) Die Ansteuerung kann mit AC oder mit DC erfolgen.\n5) Der Verbraucher am Anschluss A wird zwischen dem Kollektor von -Q1 und 0V angeschlossen.',
    antwort:
      '4) AC oder DC möglich. Die Gleichrichterbrücke am Eingang sorgt dafür, dass die LED -P1 unabhängig von der Polung bzw. Stromart des Ansteuersignals leuchtet – deshalb funktioniert die Ansteuerung mit Wechsel- oder Gleichspannung. Genau das ist der Zweck der Eingangsbrücke bei Halbleiterrelais.',
  },
  {
    id: 'LK-R19',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Wie groß ist der Wirkungsgrad η (in %) des symbolisierten Netzgeräts zur Ansteuerung einer Werkzeugmaschine? (U1 = 230V, I1 = 0,47A; U2 = 24V, I2 = 1,65A)\n1) η = 0,037 %\n2) η = 0,73 %\n3) η = 3,7 %\n4) η = 29,7 %\n5) η = 37 %',
    antwort:
      '5) η ≈ 37 %. η = Pab/Pauf = (U2·I2)/(U1·I1) = (24V·1,65A)/(230V·0,47A) = 39,6W/108,1W ≈ 0,366 = 37 %.',
  },
  {
    id: 'LK-R20',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Ein 20mm dickes Stahlblech soll nach der Werkstückzeichnung auf einer CNC-Bohrmaschine gebohrt werden. Welche Aussage über den Werkstücknullpunkt ist richtig?\n1) Er ist der Referenzpunkt im Arbeitsraum der CNC-Maschine.\n2) Er ist der Ursprungspunkt des Werkstück-Koordinatensystems.\n3) Er ist der Bezugspunkt des Werkzeugträgers.\n4) Er ist der Ursprungspunkt des Maschinen-Koordinatensystems.\n5) Er ist der Werkzeugbezugspunkt.',
    antwort:
      '2) Ursprungspunkt des Werkstück-Koordinatensystems. Nicht zu verwechseln mit dem Maschinennullpunkt (Ursprung des Maschinenkoordinatensystems, Option 4) oder dem Werkzeugbezugspunkt (Option 5).',
  },
  {
    id: 'LK-R22',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Bei der Messung der Schleifenimpedanz in RCD-geschützten Stromkreisen löst die Schutzeinrichtung immer aus, sodass eine Messung des Werts nicht möglich ist. Welche der genannten Ursachen ist richtig?\n1) Es fließt ein Prüfstrom mit erhöhter Frequenz, der im Summenstromwandler erhöhte Induktionsspannungen erzeugt und die RCD somit ungewollt auslöst.\n2) Es fließt ein Prüfwechselstrom von L1 über den PE, der von der RCD als Fehlerstrom erkannt wird.\n3) Es fließt ein Prüfgleichstrom von L1 über den PE, der von der RCD als Fehlerstrom erkannt wird.\n4) Es fließt ein Prüfwechselstrom vom N-Leiter zum PE, der von der RCD als Fehlerstrom erkannt wird.\n5) Es fließt ein Prüfgleichstrom vom N-Leiter zum PE, der von der RCD als Fehlerstrom erkannt wird.',
    antwort:
      '2) Ein Prüfwechselstrom fließt von L1 über PE. Das ist für die Schleifenimpedanzmessung notwendig – die RCD erkennt diesen Strom korrekt als Differenzstrom (Fehlerstrom) und löst deshalb planmäßig aus. Für eine RCD-unempfindliche Messung braucht es spezielle Messverfahren/-geräte.',
  },
  {
    id: 'LK-R23',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Was heißt Teach-in-Programmierung bei einem Industrieroboter?\n1) Die gewünschten Raumpunkte werden über eine Schnittstelle eingegeben.\n2) Die gewünschten Punkte werden mittels CAD-Datentransfer übertragen.\n3) Der Industrieroboter holt sich die Daten selbstständig vom Rechner.\n4) Der Bediener gibt die Daten mittels Datenträger ein.\n5) Die gewünschten Raumpunkte werden angefahren und gespeichert.',
    antwort:
      '5) Punkte anfahren und speichern. Teach-in ist die klassische Online-Programmierung: der Roboter wird von Hand zu den gewünschten Positionen bewegt, die dann gespeichert werden – im Gegensatz zur Offline-Programmierung per CAD-Daten.',
  },
  {
    id: 'LK-R24',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Für welche Spitzensperrspannung muss jede der Dioden V1 bis V6 in der dargestellten Drehstrom-Brückenschaltung (400V zwischen den Wicklungen) mindestens bemessen sein?\n1) Für 400V · √2 ≈ 566V\n2) Für 400V · 2 · √2 ≈ 1132V\n3) Für 400V : √3 ≈ 230V\n4) Für 400V : 2 ≈ 200V\n5) Für 400V : 3 ≈ 133V',
    antwort:
      '1) 400V · √2 ≈ 566V. In einer Drehstrom-Brückenschaltung (6-Puls-Gleichrichter) muss jede Diode den Scheitelwert der verketteten Spannung sperren können: Û = 400V · √2 ≈ 566V.',
  },
  {
    id: 'LK-R25',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Bei der Mittenlage der Nut 20H7 (Toleranz +0,021/0) eines gefertigten Werkstücks soll geprüft werden, ob sie innerhalb der zulässigen Toleranz liegt. Welches Prüfmittel ist hierzu am besten geeignet?\n1) Bügelmessschraube 0 bis 25mm\n2) Stahlmaßstab\n3) Messschieber Form A\n4) Parallelendmaße\n5) Grenzlehre (Grenzrachenlehre)',
    antwort:
      '5) Grenzlehre. Für eine schnelle, zuverlässige Gut-/Schlecht-Prüfung einer engen ISO-Toleranz (hier nur 21µm Toleranzfeld) in der Serienfertigung ist eine Grenzlehre das geeignete Prüfmittel – ein Messschieber oder Stahlmaßstab ist dafür nicht präzise genug.',
  },
  {
    id: 'LK-R26',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Wie groß ist bei dem skizzierten Zahnradtrieb der Achsabstand a (in mm)? (z1 = 30, z2 = 72, Modul m = 4,0mm)\n1) a = 84mm\n2) a = 204mm\n3) a = 216mm\n4) a = 408mm\n5) a = 816mm',
    antwort: '2) a = 204mm. Achsabstand a = m · (z1 + z2) / 2 = 4,0mm · (30 + 72) / 2 = 4,0mm · 51 = 204mm.',
  },
  {
    id: 'LK-R27',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Ein Relais für 24V AC wird versehentlich an 24V DC angeschlossen. Welche Aussage trifft zu?\n1) Das Relais zieht nicht an, da der Effektivwert der Spannung zu gering ist.\n2) Das Relais kann ordnungsgemäß betrieben werden, da 24V AC den Effektivwert beschreibt.\n3) Das Relais wird von einem zu niedrigen Strom durchflossen; es zieht deshalb eventuell nicht an.\n4) Das Relais wird von einem zu hohen Strom durchflossen; es brennt deshalb eventuell durch.\n5) Das Relais wechselt ständig zwischen angezogenem und abgefallenem Zustand hin und her.',
    antwort:
      '4) Zu hoher Strom, das Relais kann durchbrennen. Eine AC-Spule ist auf ihre Wechselstromimpedanz (mit induktivem Blindwiderstand) ausgelegt. Bei Gleichspannung fehlt dieser Blindwiderstand, es wirkt nur der viel kleinere Ohmsche Wicklungswiderstand – bei gleicher Spannung fließt ein deutlich höherer Strom als vorgesehen, die Spule überhitzt.',
  },
  {
    id: 'LK-R28',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage:
      'Wovon ist die Umdrehungsfrequenz beim Bohren hauptsächlich abhängig?\n1) Stabilität der Bohrmaschine, Durchmesser der Bohrspindel, Tiefe der Bohrung\n2) Durchmesser des Bohrers, Werkstoff des Werkstücks, Schneidstoff des Bohrers\n3) Tiefe der Bohrung, Dicke des Werkstücks\n4) Länge des Bohrers, Kühlschmierstoff\n5) Einspannmöglichkeit des Bohrers und des Werkstücks',
    antwort:
      '2) Bohrerdurchmesser, Werkstoff, Schneidstoff. Die Drehzahl ergibt sich aus n = vc / (π · d) – die zulässige Schnittgeschwindigkeit vc hängt von der Werkstoff-Schneidstoff-Paarung ab, d ist der Bohrerdurchmesser.',
  },
]
