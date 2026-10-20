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
  ausbilderEmail: string
  // ISO-Datum (YYYY-MM-DD). Bestimmt die fortlaufende Nummerierung (Nr.) des Ausbildungsnachweises:
  // Nr. 001 ist die Woche, in der die Ausbildung begonnen hat, danach zählt jede Woche eins weiter.
  ausbildungsbeginn: string
  // Optional, weil ältere gespeicherte Profile diese Felder noch nicht haben. Datum als ISO (YYYY-MM-DD).
  pruefungTitel?: string
  pruefungDatum?: string
  // Baureihen-IDs aus data/fahrzeuge.ts, an denen der Azubi arbeitet – filtert Fehlerdiagnose
  // und Bauteil-Lexikon. Optional wie die Prüfungsfelder.
  baureihen?: string[]
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
  ausbilderEmail: '',
  ausbildungsbeginn: '',
}

// Kürzel für Dateiname/Betreff des Ausbildungsnachweises (Format: BERUF_JAHR_NR_Ausbildungsnachweis_Vorname_Nachname).
export const berufAbkuerzung: Record<AusbildungsberufName, string> = {
  'Elektroniker für Betriebstechnik': 'EBET',
  Industriemechaniker: 'IM',
  Mechatroniker: 'Metro',
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
  | 'Fahrzeugtechnik'

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
  // --- Fahrzeugtechnik und Bahnpraxis ---
  {
    id: 'LK-F1',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Welchen Regeldruck hat die Hauptluftleitung (HL) der indirekten Druckluftbremse, und was passiert, wenn der Druck sinkt?',
    antwort: '5 bar. Sinkt der Druck in der HL, bremsen die Fahrzeuge; steigt er wieder auf 5 bar, lösen sie.',
  },
  {
    id: 'LK-F2',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Warum ist die Druckluftbremse im Zug „indirekt" gebaut und warum ist das sicher?',
    antwort: 'Gebremst wird durch Absenken des Leitungsdrucks. Reißt der Zug auseinander oder platzt ein Schlauch, entweicht die Luft und alle Fahrzeuge bremsen automatisch.',
  },
  {
    id: 'LK-F3',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wozu dient der Hauptluftbehälter (HB)?',
    antwort: 'Er speichert die vom Kompressor erzeugte Druckluft (deutlich über 5 bar) als Vorrat für Bremse, Stromabnehmer, Sanden, Türen und Luftfedern.',
  },
  {
    id: 'LK-F4',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie funktioniert eine Federspeicherbremse?',
    antwort: 'Eine Feder legt die Bremse an, Druckluft löst sie. Fällt der Druck weg, bleibt das Fahrzeug gebremst – deshalb dient sie als Feststellbremse.',
  },
  {
    id: 'LK-F5',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was ist die elektrische Bremse (E-Bremse) einer E-Lok?',
    antwort: 'Die Fahrmotoren arbeiten beim Bremsen als Generatoren. Die Energie wird ins Netz zurückgespeist (Netzbremse) oder in Widerständen in Wärme umgewandelt – ohne Verschleiß an Belägen.',
  },
  {
    id: 'LK-F6',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Warum ist eine Flachstelle am Rad gefährlich?',
    antwort: 'Sie verursacht bei jeder Umdrehung Schläge, die Radsatzlager, Drehgestell und Gleis schädigen und zu Rissen führen können.',
  },
  {
    id: 'LK-F7',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Welche Maße werden bei einer Radsatzmessung typischerweise geprüft?',
    antwort: 'Spurkranzhöhe, Spurkranzdicke, qR-Maß (Flankensteilheit) und Laufkreisdurchmesser – jeweils gegen die Grenzmaße.',
  },
  {
    id: 'LK-F8',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was ist der Unterschied zwischen Primär- und Sekundärfederung?',
    antwort: 'Die Primärfederung sitzt zwischen Radsatz und Drehgestellrahmen, die Sekundärfederung (oft Luftfedern) zwischen Drehgestell und Wagenkasten.',
  },
  {
    id: 'LK-F9',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wozu dient die Spurkranzschmierung?',
    antwort: 'Sie bringt in Bögen Schmierstoff an die Spurkranzflanke und verringert so Verschleiß an Rad und Schiene sowie das Quietschen.',
  },
  {
    id: 'LK-F10',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wozu dient die Sandstreueinrichtung?',
    antwort: 'Sie streut beim Anfahren und Bremsen trockenen Sand zwischen Rad und Schiene und verbessert so die Haftung, z. B. bei Nässe oder Laub.',
  },
  {
    id: 'LK-F11',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was bedeutet PZB und wie reagiert sie auf einen 1000-Hz-Gleismagneten?',
    antwort: 'Punktförmige Zugbeeinflussung. Bei 1000 Hz muss der Tf innerhalb von 4 Sekunden die Wachsamkeitstaste betätigen, sonst folgt eine Zwangsbremsung.',
  },
  {
    id: 'LK-F12',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was macht die Sicherheitsfahrschaltung (Sifa)?',
    antwort: 'Sie prüft, ob der Tf handlungsfähig ist: Er muss regelmäßig Taster oder Pedal loslassen und wieder betätigen. Reagiert er nicht auf Leuchtmelder und Summer, wird zwangsgebremst.',
  },
  {
    id: 'LK-F13',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Welche Aufgabe hat der Traktionsstromrichter in einer modernen E-Lok?',
    antwort: 'Er formt die Spannung vom Transformator über einen Gleichspannungs-Zwischenkreis in Drehstrom mit veränderlicher Spannung und Frequenz um, damit die Asynchron-Fahrmotoren stufenlos geregelt werden können.',
  },
  {
    id: 'LK-F14',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Warum musst du vor Arbeiten am Stromrichter eine Wartezeit einhalten?',
    antwort: 'Die Kondensatoren im Zwischenkreis speichern auch nach dem Abschalten noch gefährlich hohe Spannung. Erst nach der Entladezeit und gemessener Spannungsfreiheit darf gearbeitet werden.',
  },
  {
    id: 'LK-F15',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was macht der Hauptschalter einer E-Lok?',
    antwort: 'Er schaltet die Hochspannung von der Oberleitung zum Transformator ein und trennt das Fahrzeug bei Überstrom oder Erdschluss sofort ab.',
  },
  {
    id: 'LK-F16',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was ist die Zugsammelschiene (ZS)?',
    antwort: 'Die Energieleitung durch einen lokbespannten Zug, über die die Lok die Wagen mit Strom für Licht, Heizung und Klima versorgt (aus der Oberleitung 1000 V).',
  },
  {
    id: 'LK-F17',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was sagt die erste Ziffer einer Baureihennummer bei der DB aus?',
    antwort: 'Die Fahrzeugart: 1 = Elektrolok, 2 = Diesellok, 3 = Kleinlok, 4 = Elektrotriebwagen, 6 = Dieseltriebwagen, 7 = Nebenfahrzeug.',
  },
  {
    id: 'LK-F18',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was ist eine Scharfenbergkupplung?',
    antwort: 'Eine automatische Mittelpufferkupplung, die Fahrzeuge in einem Schritt mechanisch und oft auch pneumatisch und elektrisch verbindet – typisch bei Triebzügen.',
  },
  {
    id: 'LK-F19',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was ist der Unterschied zwischen Magnetschienenbremse und Wirbelstrombremse?',
    antwort: 'Die Magnetschienenbremse liegt beim Bremsen auf der Schiene auf und bremst durch Reibung. Die Wirbelstrombremse bremst berührungslos über Wirbelströme in der Schiene, ohne Verschleiß.',
  },
  {
    id: 'LK-F20',
    themenbereich: 'Fahrzeugtechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was bedeutet laufleistungsabhängige und zeitabhängige Instandhaltung bei Schienenfahrzeugen?',
    antwort: 'Prüfungen werden nach gefahrenen Kilometern oder nach Zeitfristen fällig – je nachdem, was zuerst erreicht wird. So werden Verschleiß und Alterung gleichermaßen erfasst.',
  },
  {
    id: 'LK-S11',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was bedeutet „Bahnerden" und wann ist es nötig?',
    antwort: 'Die abgeschaltete Oberleitung wird von befugtem Personal mit Erdungsvorrichtungen mit der Schiene verbunden. Erst dann darf z. B. auf dem Fahrzeugdach gearbeitet werden.',
  },
  {
    id: 'LK-S12',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie sicherst du ein abgestelltes Fahrzeug gegen Wegrollen?',
    antwort: 'Mit der Feststellbremse und zusätzlich mit Hemmschuhen bzw. Radvorlegern nach Vorschrift – besonders vor Arbeiten an der Bremse.',
  },
  {
    id: 'LK-E11',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was ist der Unterschied zwischen Kurzschluss und Erdschluss?',
    antwort: 'Beim Kurzschluss berühren sich zwei aktive Leiter unterschiedlichen Potenzials direkt. Beim Erdschluss bekommt ein aktiver Leiter Verbindung zur Erde bzw. zum Fahrzeugkasten.',
  },
  {
    id: 'LK-E12',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Wozu dient eine Isolationsmessung und womit wird sie durchgeführt?',
    antwort: 'Sie prüft, ob der Isolationswiderstand zwischen aktiven Leitern und Erde groß genug ist. Gemessen wird mit einem Isolationsmessgerät mit erhöhter Gleichspannung an der freigeschalteten Anlage.',
  },
  // --- Weitere AP1/AP2-Themen ---
  {
    id: 'LK-M11',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Ein Gerät nimmt an 230 V einen Strom von 4 A auf. Wie groß ist die Leistung?',
    antwort: 'P = U · I = 230 V · 4 A = 920 W.',
  },
  {
    id: 'LK-M12',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie viel sind 15 % von 240 €?',
    antwort: '240 € · 0,15 = 36 €. (Oder: 1 % = 2,40 €, mal 15 = 36 €.)',
  },
  {
    id: 'LK-M13',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie rechnest du 2,5 kW in Watt und 1500 W in Kilowatt um?',
    antwort: '1 kW = 1000 W. Also 2,5 kW = 2500 W und 1500 W = 1,5 kW.',
  },
  {
    id: 'LK-M14',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Ein Bohrer mit 10 mm Durchmesser soll mit 25 m/min Schnittgeschwindigkeit arbeiten. Welche Drehzahl stellst du ungefähr ein?',
    antwort: 'n = v / (π · d) = 25 m/min / (π · 0,01 m) ≈ 796 1/min, also rund 800 1/min.',
  },
  {
    id: 'LK-M15',
    themenbereich: 'Mathematik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: '4 Monteure brauchen für einen Auftrag 6 Stunden. Wie lange brauchen 3 Monteure?',
    antwort: 'Umgekehrter Dreisatz: 4 · 6 h = 24 Arbeitsstunden, geteilt durch 3 Monteure = 8 Stunden.',
  },
  {
    id: 'LK-E13',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Welche Spannungen gibt es im 400/230-V-Drehstromnetz?',
    antwort: 'Zwischen zwei Außenleitern 400 V, zwischen einem Außenleiter und dem Neutralleiter 230 V. Der Faktor dazwischen ist √3.',
  },
  {
    id: 'LK-E14',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Wie berechnest du die Wirkleistung eines Drehstromverbrauchers?',
    antwort: 'P = √3 · U · I · cos φ, mit U als Spannung zwischen den Außenleitern (z. B. 400 V).',
  },
  {
    id: 'LK-E15',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was bedeutet die Schutzart IP54?',
    antwort: 'Erste Ziffer 5: staubgeschützt und Schutz gegen Berühren. Zweite Ziffer 4: Schutz gegen Spritzwasser aus allen Richtungen.',
  },
  {
    id: 'LK-E16',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was ist der Unterschied zwischen Leitungsschutzschalter und Fehlerstromschutzschalter (RCD)?',
    antwort: 'Der Leitungsschutzschalter schützt Leitungen vor Überlast und Kurzschluss. Der RCD schützt Menschen, indem er bei Fehlerströmen gegen Erde abschaltet.',
  },
  {
    id: 'LK-E17',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was ist Schutzkleinspannung (SELV)?',
    antwort: 'Eine Spannung bis 50 V Wechsel- bzw. 120 V Gleichspannung, sicher vom Netz getrennt und ohne Verbindung zur Erde – Berühren ist dabei ungefährlich.',
  },
  {
    id: 'LK-E18',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Wie änderst du die Drehrichtung eines Drehstrommotors?',
    antwort: 'Indem du zwei der drei Außenleiter miteinander tauschst – natürlich nur im spannungsfreien Zustand.',
  },
  {
    id: 'LK-E19',
    themenbereich: 'Elektrotechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Wozu dient der Stern-Dreieck-Anlauf bei Drehstrommotoren?',
    antwort: 'Der Motor läuft zuerst in Sternschaltung an und wird dann auf Dreieck umgeschaltet. So sinkt der hohe Anlaufstrom auf etwa ein Drittel.',
  },
  {
    id: 'LK-S13',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was bedeuten die Farben von Sicherheitszeichen?',
    antwort: 'Rot: Verbot oder Brandschutz. Blau: Gebot. Gelb: Warnung. Grün: Rettung und Erste Hilfe.',
  },
  {
    id: 'LK-S14',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was gilt grundsätzlich für Arbeiten im Gleisbereich?',
    antwort: 'Nur nach Unterweisung, mit Auftrag und festgelegter Sicherung, mit Warnkleidung. Niemals ein Gleis ohne Sicherungsmaßnahme betreten – Züge kommen leise und schnell.',
  },
  {
    id: 'LK-S15',
    themenbereich: 'Sicherheit',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was tust du zuerst bei einem Stromunfall?',
    antwort: 'Eigenschutz: Stromkreis unterbrechen (Not-Aus, Sicherung), erst dann die Person berühren. Notruf 112, Erste Hilfe. Bei Hochspannung Abstand halten und auf Fachpersonal warten.',
  },
  {
    id: 'LK-T12',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was bedeutet die Angabe M10 bei einer Schraube?',
    antwort: 'Metrisches ISO-Gewinde mit 10 mm Nenndurchmesser.',
  },
  {
    id: 'LK-T13',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was sagt die Festigkeitsklasse 8.8 auf einem Schraubenkopf aus?',
    antwort: 'Zugfestigkeit 8 · 100 = 800 N/mm². Die Streckgrenze liegt bei 80 % davon, also 640 N/mm².',
  },
  {
    id: 'LK-T14',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Warum und womit werden Schraubenverbindungen gesichert?',
    antwort: 'Damit sie sich durch Schwingungen nicht lösen – z. B. mit selbstsichernden Muttern, Schraubensicherungskleber, Sicherungsblechen oder Splinten.',
  },
  {
    id: 'LK-T15',
    themenbereich: 'Metalltechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Mit welchem Messmittel misst du einen Außendurchmesser auf 0,01 mm genau?',
    antwort: 'Mit der Bügelmessschraube (Mikrometer).',
  },
  {
    id: 'LK-C7',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP1',
    schwierigkeit: 'Grundlagen',
    frage: 'Was ist der Unterschied zwischen Öffner und Schließer?',
    antwort: 'Ein Öffner ist im Ruhezustand geschlossen und öffnet bei Betätigung, ein Schließer umgekehrt. Not-Aus-Taster arbeiten mit Öffnern, damit auch ein Drahtbruch abschaltet.',
  },
  {
    id: 'LK-C8',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Wofür wird ein Frequenzumrichter eingesetzt?',
    antwort: 'Um die Drehzahl von Drehstrommotoren stufenlos zu verändern, indem Frequenz und Spannung angepasst werden – z. B. für sanftes Anfahren.',
  },
  {
    id: 'LK-C9',
    themenbereich: 'Steuerungstechnik',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Was bedeutet die Bezeichnung 5/2-Wegeventil?',
    antwort: 'Das Ventil hat 5 Anschlüsse und 2 Schaltstellungen – typisch zum Ansteuern eines doppeltwirkenden Zylinders.',
  },
  {
    id: 'LK-W7',
    themenbereich: 'Wirtschaft & Soziales',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Welche fünf Zweige hat die gesetzliche Sozialversicherung?',
    antwort: 'Kranken-, Pflege-, Renten-, Arbeitslosen- und Unfallversicherung. Die Unfallversicherung zahlt der Arbeitgeber allein.',
  },
  {
    id: 'LK-W8',
    themenbereich: 'Wirtschaft & Soziales',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Ab wie vielen Beschäftigten kann ein Betriebsrat gewählt werden?',
    antwort: 'In Betrieben mit mindestens fünf ständigen, wahlberechtigten Arbeitnehmern.',
  },
  {
    id: 'LK-W9',
    themenbereich: 'Wirtschaft & Soziales',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Wer darf die Jugend- und Auszubildendenvertretung (JAV) wählen?',
    antwort: 'Beschäftigte unter 18 Jahren und Auszubildende unter 25 Jahren.',
  },
  {
    id: 'LK-W10',
    themenbereich: 'Wirtschaft & Soziales',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Fortgeschritten',
    frage: 'Wie viel Urlaub steht Jugendlichen nach dem Jugendarbeitsschutzgesetz mindestens zu?',
    antwort: 'Unter 16 Jahren 30 Werktage, unter 17 Jahren 27 Werktage, unter 18 Jahren 25 Werktage – maßgeblich ist das Alter zu Beginn des Kalenderjahres.',
  },
  {
    id: 'LK-W11',
    themenbereich: 'Wirtschaft & Soziales',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Welche Pflichten hast du als Auszubildende:r laut Berufsbildungsgesetz?',
    antwort: 'Lernen, Weisungen befolgen, die Berufsschule besuchen, den Ausbildungsnachweis führen, Betriebsgeheimnisse wahren und sorgfältig mit Arbeitsmitteln umgehen.',
  },
  {
    id: 'LK-A2',
    themenbereich: 'Ausbildung',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Was passiert, wenn du die Abschlussprüfung nicht bestehst?',
    antwort: 'Auf deinen Wunsch verlängert sich die Ausbildung bis zur nächsten Wiederholungsprüfung, höchstens um ein Jahr. Die Prüfung kann zweimal wiederholt werden.',
  },
  {
    id: 'LK-A3',
    themenbereich: 'Ausbildung',
    pruefungsteil: 'AP2',
    schwierigkeit: 'Grundlagen',
    frage: 'Wann endet das Ausbildungsverhältnis?',
    antwort: 'Mit Ablauf der Ausbildungszeit. Bestehst du die Abschlussprüfung vorher, endet es schon mit der Bekanntgabe des Ergebnisses.',
  },
]

export type DBFaktKategorie = 'Geschichte' | 'Unternehmen' | 'Fahrzeuge & Technik' | 'Netz & Strecken' | 'Rekorde & Zahlen'

export interface DBFakt {
  id: string
  kategorie: DBFaktKategorie
  frage: string
  antwort: string
}

export const dbFakten: DBFakt[] = [
  // --- Geschichte ---
  {
    id: 'DBF-1',
    kategorie: 'Geschichte',
    frage: 'Wann wurde die Deutsche Bahn AG gegründet?',
    antwort:
      'Am 1. Januar 1994, im Zuge der Bahnreform. Sie entstand aus der Fusion der Deutschen Bundesbahn (Westdeutschland) und der Deutschen Reichsbahn (DDR).',
  },
  {
    id: 'DBF-2',
    kategorie: 'Geschichte',
    frage: 'Wo und wann fuhr die erste deutsche Eisenbahn?',
    antwort: '1835 zwischen Nürnberg und Fürth, mit der Dampflok „Adler" – die Strecke war rund 6 km lang.',
  },
  {
    id: 'DBF-3',
    kategorie: 'Geschichte',
    frage: 'Seit wann gibt es den ICE (InterCityExpress)?',
    antwort: 'Der erste ICE ging 1991 in Betrieb, zunächst auf der Strecke Hamburg–München.',
  },
  {
    id: 'DBF-4',
    kategorie: 'Geschichte',
    frage: 'Was war die „Bahnreform" von 1994?',
    antwort:
      'Die Umwandlung der beiden deutschen Staatsbahnen in ein wirtschaftlich eigenständiges Unternehmen (DB AG), um die Bahn wettbewerbsfähiger zu machen.',
  },
  {
    id: 'DBF-5',
    kategorie: 'Geschichte',
    frage: 'Wie hieß die Vorgängergesellschaft im Westen vor 1994?',
    antwort: 'Deutsche Bundesbahn. Im Osten hieß das Pendant Deutsche Reichsbahn.',
  },
  // --- Unternehmen ---
  {
    id: 'DBF-6',
    kategorie: 'Unternehmen',
    frage: 'Wem gehört die Deutsche Bahn AG?',
    antwort: 'Zu 100 % dem Bund, also der Bundesrepublik Deutschland.',
  },
  {
    id: 'DBF-7',
    kategorie: 'Unternehmen',
    frage: 'Wo hat die Deutsche Bahn ihren Hauptsitz?',
    antwort: 'In Berlin.',
  },
  {
    id: 'DBF-8',
    kategorie: 'Unternehmen',
    frage: 'Nenne drei bekannte Tochtergesellschaften des DB-Konzerns.',
    antwort: 'Zum Beispiel DB Fernverkehr, DB Regio, DB Cargo, DB InfraGO oder DB Sicherheit.',
  },
  {
    id: 'DBF-9',
    kategorie: 'Unternehmen',
    frage: 'Was macht DB Cargo?',
    antwort: 'DB Cargo ist für den Güterverkehr auf der Schiene zuständig – Transport von Waren statt Personen.',
  },
  {
    id: 'DBF-10',
    kategorie: 'Unternehmen',
    frage: 'Wer betreibt das Schienennetz und die Bahnhöfe in Deutschland?',
    antwort:
      'DB InfraGO AG (hervorgegangen aus DB Netz und DB Station&Service) – sie ist für Gleise, Stellwerke und Bahnhöfe zuständig.',
  },
  {
    id: 'DBF-11',
    kategorie: 'Unternehmen',
    frage: 'Welches Klimaziel hat sich der DB-Konzern gesetzt?',
    antwort: 'Bis 2040 will der Konzern klimaneutral werden – das ist ein erklärtes Unternehmensziel.',
  },
  // --- Fahrzeuge & Technik ---
  {
    id: 'DBF-12',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Welche Spurweite hat das deutsche Regelnetz?',
    antwort: '1435 mm – das ist die „Normalspur", die in weiten Teilen Europas verwendet wird.',
  },
  {
    id: 'DBF-13',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Mit welcher Spannung und Frequenz fährt die Bahn unter Fahrdraht?',
    antwort: '15 kV Wechselspannung bei 16,7 Hz – anders als das öffentliche Stromnetz mit 50 Hz.',
  },
  {
    id: 'DBF-14',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Wie schnell fährt ein ICE 3 im Regelbetrieb höchstens?',
    antwort: 'Bis zu 300 km/h, z. B. auf der Schnellfahrstrecke Köln–Frankfurt.',
  },
  {
    id: 'DBF-15',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Was bedeutet die Abkürzung „Tf"?',
    antwort: 'Triebfahrzeugführer – die offizielle Berufsbezeichnung für Lokführerinnen und Lokführer.',
  },
  {
    id: 'DBF-16',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Was ist eine Oberleitung?',
    antwort:
      'Der über dem Gleis gespannte Fahrdraht, aus dem elektrische Triebfahrzeuge über den Stromabnehmer (Pantograf) Strom beziehen.',
  },
  {
    id: 'DBF-17',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Was unterscheidet einen Triebwagen von einem lokbespannten Zug?',
    antwort:
      'Beim Triebwagen sind Antrieb und Wagen fest zu einer Einheit verbunden (z. B. ICE 3, viele S-Bahnen). Bei lokbespannten Zügen zieht eine separate Lok die Wagen.',
  },
  // --- Netz & Strecken ---
  {
    id: 'DBF-18',
    kategorie: 'Netz & Strecken',
    frage: 'Wie lang ist das deutsche Schienennetz ungefähr?',
    antwort: 'Rund 33.000 Streckenkilometer – eines der dichtesten Netze Europas.',
  },
  {
    id: 'DBF-19',
    kategorie: 'Netz & Strecken',
    frage: 'Was ist ein Stellwerk?',
    antwort:
      'Die Betriebsstelle, von der aus Weichen und Signale gestellt und Zugfahrten gesichert werden – heute meist elektronisch (ESTW).',
  },
  {
    id: 'DBF-20',
    kategorie: 'Netz & Strecken',
    frage: 'Wofür steht „ETCS"?',
    antwort:
      'European Train Control System – ein europaweit einheitliches Zugsicherungssystem, das nationale Systeme wie PZB/LZB langfristig ablösen soll.',
  },
  {
    id: 'DBF-21',
    kategorie: 'Netz & Strecken',
    frage: 'Was bedeutet „PZB"?',
    antwort:
      'Punktförmige Zugbeeinflussung – ein Sicherungssystem, das u. a. prüft, ob ein Zug rechtzeitig vor einem Halt zeigenden Signal bremst.',
  },
  // --- Rekorde & Zahlen ---
  {
    id: 'DBF-22',
    kategorie: 'Rekorde & Zahlen',
    frage: 'Welchen Geschwindigkeitsrekord stellte ein deutscher Versuchszug auf?',
    antwort:
      '1988 erreichte der InterCityExperimental (ICE-V) auf der Schnellfahrstrecke bei Fulda 406,9 km/h – bis heute ein deutscher Schienengeschwindigkeitsrekord.',
  },
  {
    id: 'DBF-23',
    kategorie: 'Rekorde & Zahlen',
    frage: 'Ist die Deutsche Bahn einer der größten Arbeitgeber Deutschlands?',
    antwort: 'Ja – der DB-Konzern beschäftigt weltweit deutlich über 200.000 Mitarbeitende, die meisten davon in Deutschland.',
  },
  {
    id: 'DBF-24',
    kategorie: 'Rekorde & Zahlen',
    frage: 'Was zeigt das DB-Logo?',
    antwort: 'Die roten Buchstaben „DB" in einem roten Rahmen auf weißem Grund – eines der bekanntesten Markenzeichen Deutschlands.',
  },
  {
    id: 'DBF-25',
    kategorie: 'Geschichte',
    frage: 'Wo fuhr die erste elektrische Lokomotive der Welt?',
    antwort: '1879 auf der Berliner Gewerbeausstellung – gebaut von Siemens & Halske.',
  },
  {
    id: 'DBF-26',
    kategorie: 'Geschichte',
    frage: 'Was war der „Fliegende Hamburger"?',
    antwort: 'Ein Schnelltriebwagen, der ab 1933 zwischen Berlin und Hamburg fuhr und damals eine der schnellsten Zugverbindungen der Welt war.',
  },
  {
    id: 'DBF-27',
    kategorie: 'Geschichte',
    frage: 'Welche Schnellfahrstrecken gingen 1991 mit dem Start des ICE in Betrieb?',
    antwort: 'Hannover–Würzburg und Mannheim–Stuttgart – die ersten Neubaustrecken für den Hochgeschwindigkeitsverkehr in Deutschland.',
  },
  {
    id: 'DBF-28',
    kategorie: 'Geschichte',
    frage: 'Seit wann gibt es die BahnCard?',
    antwort: 'Seit 1992.',
  },
  {
    id: 'DBF-29',
    kategorie: 'Unternehmen',
    frage: 'Seit wann gibt es das Deutschlandticket?',
    antwort: 'Seit dem 1. Mai 2023 – ein Monatsabo für den gesamten Nahverkehr in Deutschland.',
  },
  {
    id: 'DBF-30',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Welche Baureihe ist die größte ICE-Flotte der DB?',
    antwort: 'Der ICE 4 (Baureihe 412), gebaut von Siemens mit Bombardier.',
  },
  {
    id: 'DBF-31',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Was ist ein „Vectron"?',
    antwort: 'Eine Lokomotiv-Plattform von Siemens. Bei DB Cargo fährt sie als Baureihe 193 – als Mehrsystemlok auch grenzüberschreitend.',
  },
  {
    id: 'DBF-32',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Was bedeutet die erste Ziffer einer DB-Baureihennummer?',
    antwort: 'Die Fahrzeugart: 1 Elektrolok, 2 Diesellok, 3 Kleinlok, 4 Elektrotriebwagen, 6 Dieseltriebwagen, 7 Nebenfahrzeug. Die BR 101 ist also eine E-Lok, die BR 218 eine Diesellok.',
  },
  {
    id: 'DBF-33',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Warum fahren die S-Bahnen in Berlin und Hamburg ohne Oberleitung?',
    antwort: 'Sie beziehen ihren Strom aus einer seitlichen Stromschiene: Berlin mit 750 Volt, Hamburg mit 1200 Volt Gleichspannung.',
  },
  {
    id: 'DBF-34',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Wofür steht „LZB" und wann ist sie nötig?',
    antwort: 'Linienzugbeeinflussung – eine kontinuierliche Zugbeeinflussung. In Deutschland ist für Geschwindigkeiten über 160 km/h LZB oder ETCS vorgeschrieben.',
  },
  {
    id: 'DBF-35',
    kategorie: 'Fahrzeuge & Technik',
    frage: 'Was ist eine UIC-Fahrzeugnummer?',
    antwort: 'Die zwölfstellige europäische Fahrzeugnummer an jedem Fahrzeug. Die letzte Ziffer ist eine Prüfziffer gegen Tippfehler.',
  },
  {
    id: 'DBF-36',
    kategorie: 'Netz & Strecken',
    frage: 'Welcher ist der längste Eisenbahntunnel Deutschlands?',
    antwort: 'Der Landrückentunnel auf der Schnellfahrstrecke Hannover–Würzburg mit rund 10,8 km.',
  },
  {
    id: 'DBF-37',
    kategorie: 'Netz & Strecken',
    frage: 'Wie schnell darf in Deutschland höchstens gefahren werden?',
    antwort: '300 km/h – z. B. auf den Schnellfahrstrecken Köln–Rhein/Main und Nürnberg–Ingolstadt.',
  },
  {
    id: 'DBF-38',
    kategorie: 'Netz & Strecken',
    frage: 'Wann wurde der Berliner Hauptbahnhof eröffnet?',
    antwort: '2006, kurz vor der Fußball-Weltmeisterschaft in Deutschland.',
  },
  {
    id: 'DBF-39',
    kategorie: 'Rekorde & Zahlen',
    frage: 'Welcher ist der meistfrequentierte Bahnhof Deutschlands?',
    antwort: 'Hamburg Hauptbahnhof – mit mehreren hunderttausend Reisenden und Besuchern am Tag.',
  },
  {
    id: 'DBF-40',
    kategorie: 'Rekorde & Zahlen',
    frage: 'Welcher Bahnhof gilt nach Grundfläche als größter Kopfbahnhof Europas?',
    antwort: 'Der Leipziger Hauptbahnhof.',
  },
]
