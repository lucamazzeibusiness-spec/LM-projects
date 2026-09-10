export type Gewerk = 'Elektrik' | 'Mechanik' | 'Mechatronik'
export type Prioritaet = 'Hoch' | 'Mittel' | 'Niedrig'
export type LernaufgabeStatus = 'Offen' | 'In Arbeit' | 'Zur Kontrolle' | 'Erledigt'

export interface AzubiProfil {
  name: string
  ausbildungsberuf: string
  lehrjahr: number
  lehrjahreGesamt: number
  abteilung: string
  standort: string
  ausbilder: string
}

export const azubiProfil: AzubiProfil = {
  name: 'Max',
  ausbildungsberuf: 'Elektroniker für Betriebstechnik',
  lehrjahr: 2,
  lehrjahreGesamt: 3,
  abteilung: 'Werk Rummelsburg – Fahrzeuginstandhaltung',
  standort: 'Werk Rummelsburg',
  ausbilder: 'Herr Kowalski',
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
    titel: 'Bremsprobe & Drehgestell-Inspektion begleiten',
    anlage: 'Triebzug ICE 4',
    baureihe: 'BR 412',
    ort: 'Werk Rummelsburg, Gleis 7',
    gewerk: 'Mechanik',
    prioritaet: 'Hoch',
    status: 'In Arbeit',
    faelligkeit: 'Heute, 14:00',
    lernziel: 'Aufbau eines Drehgestells verstehen und die Prüfschritte einer Bremsprobe nach Vorschrift durchführen können.',
    beschreibung:
      'Du begleitest die planmäßige Inspektion der Drehgestelle sowie die Bremsprobe. Dein Ausbilder zeigt dir zunächst Schritt 1–2, danach übernimmst du unter Aufsicht.',
    ausbilderHinweis: 'Vorher unbedingt Kapitel „Drehgestelltechnik" im Lernheft wiederholen.',
    checklist: [
      { id: 'c1', label: 'Sichtprüfung Drehgestellrahmen auf Risse' },
      { id: 'c2', label: 'Radsatzlager auf Spiel/Temperatur prüfen' },
      { id: 'c3', label: 'Bremsbeläge Stärke messen' },
      { id: 'c4', label: 'Bremsprobe (Vollbremsung) unter Aufsicht durchführen' },
      { id: 'c5', label: 'Federspeicher auf Dichtheit prüfen' },
      { id: 'c6', label: 'Ergebnis mit Ausbilder besprechen' },
    ],
  },
  {
    id: 'L-242',
    titel: 'Störung Türsteuerung selbstständig eingrenzen',
    anlage: 'Doppelstockwagen',
    baureihe: 'DBpza',
    ort: 'Abstellgruppe Süd, Gleis 12',
    gewerk: 'Elektrik',
    prioritaet: 'Hoch',
    status: 'Offen',
    faelligkeit: 'Heute, 11:30',
    lernziel: 'Systematische Fehlersuche nach Schaltplan üben – vom Symptom zur Ursache.',
    beschreibung:
      'Fehlercode E-4471 liegt vor (Türsteuergerät meldet Timeout). Versuch die Ursache selbst einzugrenzen, bevor du im Wissensbereich nachschlägst. Bei Unsicherheit: Ausbilder rufen, nicht raten.',
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
    titel: 'Wartung Weichenheizung – Grundlagen Steuerungstechnik',
    anlage: 'Weiche 34a',
    ort: 'Bahnhof Süd, Gleis 4/5',
    gewerk: 'Mechatronik',
    prioritaet: 'Mittel',
    status: 'Offen',
    faelligkeit: 'Morgen, 08:00',
    lernziel: 'Zusammenspiel von Sensorik (Temperaturfühler) und Aktorik (Heizstäbe) an einem realen Beispiel nachvollziehen.',
    beschreibung:
      'Saisonale Funktionsprüfung der Weichenheizung vor Wintereinsatz. Gute Gelegenheit, Steuerungslogik in der Praxis zu sehen statt nur im Simulator.',
    checklist: [
      { id: 'c1', label: 'Heizstäbe auf Durchgang prüfen' },
      { id: 'c2', label: 'Temperaturfühler kalibrieren' },
      { id: 'c3', label: 'Steuerschrank auf Feuchtigkeit prüfen' },
      { id: 'c4', label: 'Automatikbetrieb testen' },
    ],
  },
  {
    id: 'L-235',
    titel: 'Klimaanlage – Kältekreislauf erklärt bekommen',
    anlage: 'Regionaltriebwagen',
    baureihe: 'BR 442',
    ort: 'Werk Rummelsburg, Halle 2',
    gewerk: 'Mechatronik',
    prioritaet: 'Mittel',
    status: 'Erledigt',
    faelligkeit: 'Gestern, 16:00',
    lernziel: 'Grundprinzip des Kältekreislaufs (Verdichten, Kondensieren, Entspannen, Verdampfen) an der Anlage erkennen.',
    beschreibung: 'Klimakompressor schaltete nach ca. 5 Minuten ab. Gemeinsam mit Ausbilder Ursache gesucht und gefunden.',
    ausbilderHinweis: 'Gut mitgedacht – Druckwächter-Logik beim nächsten Mal selbst vorschlagen.',
    checklist: [
      { id: 'c1', label: 'Kältemittelstand prüfen' },
      { id: 'c2', label: 'Druckwächter testen' },
      { id: 'c3', label: 'Kondensator reinigen' },
      { id: 'c4', label: 'Probelauf 30 Minuten begleiten' },
    ],
  },
  {
    id: 'L-228',
    titel: 'Hauptschalter tauschen – erste eigenständige Aufgabe',
    anlage: 'E-Lok',
    baureihe: 'BR 185',
    ort: 'Werk Rummelsburg, Gleis 3',
    gewerk: 'Elektrik',
    prioritaet: 'Niedrig',
    status: 'Erledigt',
    faelligkeit: 'Gestern, 09:00',
    lernziel: 'Sicherheitsregeln beim Arbeiten an Hochspannungsanlagen (Freischalten, Erden) korrekt anwenden.',
    beschreibung: 'Planmäßiger Austausch des Hauptschalters – erste Aufgabe, die du komplett allein durchgeführt hast.',
    ausbilderHinweis: 'Sauber gearbeitet, Freischaltreihenfolge korrekt eingehalten.',
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
  bestand: number
  mindestbestand: number
  lagerort: string
  einheit: string
  funktion: string
}

export const ersatzteile: Ersatzteil[] = [
  { id: 'ET-1', name: 'Bremsbelag ICE 4 (Satz)', nummer: '412-BR-3391', kategorie: 'Mechanik', bestand: 14, mindestbestand: 8, lagerort: 'Halle 2, Regal C3', einheit: 'Satz', funktion: 'Erzeugt durch Reibung an der Bremsscheibe die Bremskraft.' },
  { id: 'ET-2', name: 'Türsteuergerät DBpza', nummer: 'DB-TS-2207', kategorie: 'Elektrik', bestand: 3, mindestbestand: 4, lagerort: 'Halle 1, Regal A1', einheit: 'Stück', funktion: 'Steuert Öffnen/Schließen und wertet Sicherheitssensoren der Tür aus.' },
  { id: 'ET-3', name: 'Lichtschranke Türantrieb', nummer: 'LS-4471-C', kategorie: 'Elektrik', bestand: 22, mindestbestand: 10, lagerort: 'Halle 1, Regal A2', einheit: 'Stück', funktion: 'Erkennt Hindernisse im Türspalt, verhindert Einklemmen.' },
  { id: 'ET-4', name: 'Kältemittel R134a (Flasche)', nummer: 'KM-R134-10', kategorie: 'Mechatronik', bestand: 6, mindestbestand: 5, lagerort: 'Halle 3, Gefahrstofflager', einheit: 'Flasche', funktion: 'Arbeitsmedium des Kältekreislaufs der Klimaanlage.' },
  { id: 'ET-5', name: 'Hauptschalter BR 185', nummer: 'HS-185-09', kategorie: 'Elektrik', bestand: 1, mindestbestand: 2, lagerort: 'Halle 1, Regal B4', einheit: 'Stück', funktion: 'Trennt das Fahrzeug im Fehlerfall komplett von der Fahrleitung.' },
  { id: 'ET-6', name: 'Radsatzlager komplett', nummer: 'RSL-412-11', kategorie: 'Mechanik', bestand: 5, mindestbestand: 4, lagerort: 'Halle 2, Regal D1', einheit: 'Stück', funktion: 'Lagert die Achse drehbar im Drehgestellrahmen.' },
  { id: 'ET-7', name: 'Temperaturfühler Weiche', nummer: 'TF-W-0912', kategorie: 'Mechatronik', bestand: 9, mindestbestand: 6, lagerort: 'Halle 3, Regal E2', einheit: 'Stück', funktion: 'Meldet der Steuerung die Außentemperatur zum Zuschalten der Heizung.' },
]

export type AusbildungsblockTyp = 'Betrieb' | 'Berufsschule' | 'DB Training'

export interface Ausbildungsblock {
  tag: string
  datum: string
  typ: AusbildungsblockTyp
  thema: string
  ort: string
}

export const ausbildungsplan: Ausbildungsblock[] = [
  { tag: 'Montag', datum: '08.09.', typ: 'Betrieb', thema: 'Fahrzeuginstandhaltung – Elektrik', ort: 'Werk Rummelsburg' },
  { tag: 'Dienstag', datum: '09.09.', typ: 'Betrieb', thema: 'Fahrzeuginstandhaltung – Elektrik', ort: 'Werk Rummelsburg' },
  { tag: 'Mittwoch', datum: '10.09.', typ: 'Berufsschule', thema: 'LF6: Anlagen und Geräte analysieren und prüfen', ort: 'OSZ Gustav-Meyer' },
  { tag: 'Donnerstag', datum: '11.09.', typ: 'Berufsschule', thema: 'LF6: Anlagen und Geräte analysieren und prüfen', ort: 'OSZ Gustav-Meyer' },
  { tag: 'Freitag', datum: '12.09.', typ: 'Betrieb', thema: 'Fahrzeuginstandhaltung – Elektrik', ort: 'Werk Rummelsburg' },
  { tag: 'Samstag', datum: '13.09.', typ: 'Betrieb', thema: 'Frei', ort: '-' },
  { tag: 'Sonntag', datum: '14.09.', typ: 'Betrieb', thema: 'Frei', ort: '-' },
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

export interface Lernkarte {
  id: string
  gewerk: Gewerk | 'Allgemein'
  schwierigkeit: FehlerfallSchwierigkeit
  frage: string
  antwort: string
}

export const lernkarten: Lernkarte[] = [
  {
    id: 'LK-1',
    gewerk: 'Elektrik',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie lautet das Ohmsche Gesetz und wonach löst du bei gegebener Spannung und Widerstand auf?',
    antwort: 'U = R · I. Nach dem Strom aufgelöst: I = U / R.',
  },
  {
    id: 'LK-2',
    gewerk: 'Elektrik',
    schwierigkeit: 'Grundlagen',
    frage: 'Was ist der Unterschied zwischen Reihen- und Parallelschaltung beim Gesamtwiderstand?',
    antwort:
      'Reihenschaltung: Widerstände addieren sich (R_ges = R1 + R2 + ...). Parallelschaltung: der Kehrwert des Gesamtwiderstands ist die Summe der Kehrwerte (1/R_ges = 1/R1 + 1/R2 + ...), R_ges wird kleiner als der kleinste Einzelwiderstand.',
  },
  {
    id: 'LK-3',
    gewerk: 'Elektrik',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Welche 5 Sicherheitsregeln gelten beim Freischalten elektrischer Anlagen?',
    antwort:
      '1. Freischalten, 2. Gegen Wiedereinschalten sichern, 3. Spannungsfreiheit feststellen, 4. Erden und Kurzschließen, 5. Benachbarte, unter Spannung stehende Teile abdecken oder abschranken.',
  },
  {
    id: 'LK-4',
    gewerk: 'Mechanik',
    schwierigkeit: 'Grundlagen',
    frage: 'Was versteht man unter „Passung" bei zwei zusammengefügten Bauteilen?',
    antwort:
      'Die Passung beschreibt das Verhältnis von Bohrung und Welle zueinander (Spiel-, Übergangs- oder Presspassung) und legt fest, wie fest oder locker zwei Teile ineinander sitzen.',
  },
  {
    id: 'LK-5',
    gewerk: 'Mechanik',
    schwierigkeit: 'Grundlagen',
    frage: 'Wofür steht die Abkürzung „NDT" in der Fahrzeuginstandhaltung und wozu dient sie?',
    antwort:
      'NDT = Non-Destructive Testing (zerstörungsfreie Prüfung), z. B. Ultraschall- oder Magnetpulverprüfung, um Risse in Bauteilen wie Radsätzen zu finden, ohne sie zu zerstören.',
  },
  {
    id: 'LK-6',
    gewerk: 'Mechanik',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Warum wird ein Drehmomentschlüssel beim Verschrauben sicherheitsrelevanter Bauteile vorgeschrieben?',
    antwort:
      'Er stellt sicher, dass die Schraubverbindung exakt mit dem vom Hersteller vorgegebenen Anzugsmoment angezogen wird – zu locker kann sich lösen, zu fest kann das Gewinde oder Bauteil beschädigen.',
  },
  {
    id: 'LK-7',
    gewerk: 'Mechatronik',
    schwierigkeit: 'Grundlagen',
    frage: 'Was ist der Unterschied zwischen einem Sensor und einem Aktor?',
    antwort:
      'Ein Sensor erfasst eine physikalische Größe (z. B. Temperatur, Position) und wandelt sie in ein elektrisches Signal um. Ein Aktor wandelt ein elektrisches Signal in eine Bewegung oder Aktion um (z. B. Motor, Ventil).',
  },
  {
    id: 'LK-8',
    gewerk: 'Mechatronik',
    schwierigkeit: 'Grundlagen',
    frage: 'Was bedeutet SPS und welche Aufgabe hat sie in einer Steuerung?',
    antwort:
      'SPS = Speicherprogrammierbare Steuerung. Sie liest Eingangssignale (Sensoren), verarbeitet sie nach einem hinterlegten Programm und steuert darüber Ausgänge (Aktoren) an.',
  },
  {
    id: 'LK-9',
    gewerk: 'Mechatronik',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Wie unterscheiden sich eine UND- und eine ODER-Verknüpfung in der Steuerungstechnik?',
    antwort:
      'UND: Ausgang wird nur aktiv, wenn ALLE Eingänge erfüllt sind. ODER: Ausgang wird aktiv, wenn MINDESTENS EIN Eingang erfüllt ist.',
  },
  {
    id: 'LK-10',
    gewerk: 'Allgemein',
    schwierigkeit: 'Grundlagen',
    frage: 'Was gehört laut Jugendarbeitsschutzgesetz zu den wichtigsten Regeln für Azubis unter 18?',
    antwort:
      'U. a. maximal 8 Std./Tag bzw. 40 Std./Woche, keine Arbeit vor 6 Uhr oder nach 20 Uhr, mindestens 30 Minuten Pause ab 4,5 Std. Arbeitszeit, keine gefährlichen Arbeiten ohne Aufsicht.',
  },
  {
    id: 'LK-11',
    gewerk: 'Allgemein',
    schwierigkeit: 'Grundlagen',
    frage: 'Wofür wird das Berichtsheft (Ausbildungsnachweis) benötigt und wie oft sollte es geführt werden?',
    antwort:
      'Es dokumentiert die betrieblichen und schulischen Ausbildungsinhalte, ist Voraussetzung für die Zulassung zur Abschlussprüfung und sollte regelmäßig (i. d. R. wöchentlich) geführt und vom Ausbilder abgezeichnet werden.',
  },
]
