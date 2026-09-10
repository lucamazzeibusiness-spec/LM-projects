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
]
