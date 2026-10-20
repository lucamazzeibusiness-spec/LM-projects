import type { FehlerfallSchwierigkeit, Gewerk } from './mock'

// Fahrzeuge, Fehlerdiagnose und Bauteil-Lexikon.
//
// Die Baureihen sind echte Fahrzeuge der Deutschen Bahn mit öffentlich bekannten Eckdaten
// (gerundet). Fehlerfälle und Bauteile sind Lernbeispiele, die typische Störungen und Prüfungen
// an diesen Fahrzeugtypen erklären – bewusst OHNE erfundene Fehlercodes, Materialnummern oder
// Lagerorte: die echten stehen nur in den internen Unterlagen des jeweiligen Werks und sind
// immer maßgeblich.

export type Fahrzeugart =
  | 'E-Lok'
  | 'Diesellok'
  | 'Hochgeschwindigkeitszug'
  | 'Elektrotriebzug'
  | 'S-Bahn'
  | 'Dieseltriebzug'
  | 'Reisezugwagen'

export interface Baureihe {
  id: string
  name: string
  spitzname?: string
  art: Fahrzeugart
  einsatz: string
  hersteller: string
  baujahre: string
  vmax: number
  leistung?: string
  hinweis?: string
  // Titel des deutschen Wikipedia-Artikels – daraus lädt die App das Titelfoto (Wikimedia Commons).
  wikipedia?: string
}

export const fahrzeugarten: Fahrzeugart[] = [
  'E-Lok',
  'Diesellok',
  'Hochgeschwindigkeitszug',
  'Elektrotriebzug',
  'S-Bahn',
  'Dieseltriebzug',
  'Reisezugwagen',
]

export const baureihen: Baureihe[] = [
  // --- E-Loks ---
  { id: '101', wikipedia: 'DB-Baureihe 101', name: 'BR 101', art: 'E-Lok', einsatz: 'Fernverkehr (IC)', hersteller: 'Adtranz', baujahre: '1996–1999', vmax: 220, leistung: '6,4 MW', hinweis: 'Wird schrittweise durch neuere Fahrzeuge ersetzt.' },
  { id: '111', wikipedia: 'DB-Baureihe 111', name: 'BR 111', art: 'E-Lok', einsatz: 'Regionalverkehr', hersteller: 'Krauss-Maffei, Krupp, Henschel (Elektrik: AEG, BBC, Siemens)', baujahre: '1974–1984', vmax: 160, leistung: '3,7 MW' },
  { id: '143', wikipedia: 'DR-Baureihe 243', name: 'BR 143', art: 'E-Lok', einsatz: 'Regionalverkehr (ehemals DR-Baureihe 243)', hersteller: 'LEW Hennigsdorf', baujahre: '1984–1991', vmax: 120, leistung: '3,7 MW', hinweis: 'Bei DB Regio inzwischen weitgehend ausgemustert.' },
  { id: '146', wikipedia: 'DB-Baureihe 146', name: 'BR 146', spitzname: 'TRAXX P160 AC', art: 'E-Lok', einsatz: 'Regionalverkehr und Intercity', hersteller: 'Bombardier', baujahre: '2001–2015', vmax: 160, leistung: '5,6 MW' },
  { id: '147', wikipedia: 'DB-Baureihe 147', name: 'BR 147', spitzname: 'TRAXX AC3', art: 'E-Lok', einsatz: 'Intercity 2 (Doppelstock) und Regionalverkehr', hersteller: 'Bombardier (heute Alstom)', baujahre: 'ab 2015', vmax: 160, leistung: '5,6 MW' },
  { id: '152', wikipedia: 'DB-Baureihe 152', name: 'BR 152', spitzname: 'EuroSprinter', art: 'E-Lok', einsatz: 'Güterverkehr (DB Cargo)', hersteller: 'Siemens', baujahre: '1996–2001', vmax: 140, leistung: '6,4 MW' },
  { id: '185', wikipedia: 'DB-Baureihe 185', name: 'BR 185', spitzname: 'TRAXX F140 AC', art: 'E-Lok', einsatz: 'Güterverkehr (DB Cargo), Zweisystem', hersteller: 'Bombardier', baujahre: '2000–2010', vmax: 140, leistung: '5,6 MW' },
  { id: '187', wikipedia: 'DB-Baureihe 187', name: 'BR 187', spitzname: 'TRAXX AC3 LM', art: 'E-Lok', einsatz: 'Güterverkehr (DB Cargo), mit Last-Mile-Dieselmotor für nicht elektrifizierte Anschlüsse', hersteller: 'Bombardier (heute Alstom)', baujahre: 'ab 2016', vmax: 140, leistung: '5,6 MW' },
  { id: '189', wikipedia: 'DB-Baureihe 189', name: 'BR 189', spitzname: 'EuroSprinter ES64F4', art: 'E-Lok', einsatz: 'Grenzüberschreitender Güterverkehr, Mehrsystem', hersteller: 'Siemens', baujahre: '2002–2004', vmax: 140, leistung: '6,4 MW' },
  { id: '193', wikipedia: 'Siemens Vectron', name: 'BR 193', spitzname: 'Vectron', art: 'E-Lok', einsatz: 'Güterverkehr (DB Cargo), Mehrsystem', hersteller: 'Siemens', baujahre: 'ab 2010er-Jahre', vmax: 160, leistung: '6,4 MW' },
  // --- Dieselloks ---
  { id: '218', wikipedia: 'DB-Baureihe 218', name: 'BR 218', art: 'Diesellok', einsatz: 'Regionalverkehr, Rangier- und Hilfsdienst (z. B. Abschleppen liegengebliebener Züge)', hersteller: 'Krupp, Henschel, Krauss-Maffei, MaK', baujahre: '1968–1979', vmax: 140, leistung: 'ca. 1,8–2 MW', hinweis: 'Diesel-hydraulisch.' },
  { id: '232', wikipedia: 'DR-Baureihe 132', name: 'BR 232/233', spitzname: 'Ludmilla', art: 'Diesellok', einsatz: 'Güterverkehr (DB Cargo)', hersteller: 'Lokomotivfabrik Luhansk (damals Woroschilowgrad)', baujahre: '1973–1982', vmax: 120, leistung: 'ca. 2,2 MW', hinweis: 'Diesel-elektrisch, ursprünglich für die Deutsche Reichsbahn gebaut.' },
  { id: '245', wikipedia: 'DB-Baureihe 245', name: 'BR 245', spitzname: 'TRAXX P160 DE ME', art: 'Diesellok', einsatz: 'Regionalverkehr auf nicht elektrifizierten Strecken', hersteller: 'Bombardier (heute Alstom)', baujahre: 'ab 2013', vmax: 160, leistung: 'ca. 2,2 MW', hinweis: 'Diesel-elektrisch mit vier kleineren Motoren statt einem großen.' },
  { id: '261', wikipedia: 'Voith Gravita', name: 'BR 261', spitzname: 'Gravita', art: 'Diesellok', einsatz: 'Rangier- und Übergabedienst (DB Cargo)', hersteller: 'Voith', baujahre: '2010–2013', vmax: 100, leistung: 'ca. 1 MW', hinweis: 'Diesel-hydraulisch.' },
  { id: '294', wikipedia: 'DB-Baureihe V 90', name: 'BR 294/295', art: 'Diesellok', einsatz: 'Rangierdienst', hersteller: 'MaK, Henschel, Deutz u. a. (Bauart V 90)', baujahre: '1964–1974', vmax: 80, hinweis: 'Diesel-hydraulisch, viele mit Funkfernsteuerung umgebaut.' },
  // --- ICE ---
  { id: '401', wikipedia: 'ICE 1', name: 'BR 401', spitzname: 'ICE 1', art: 'Hochgeschwindigkeitszug', einsatz: 'Fernverkehr', hersteller: 'Konsortium u. a. Siemens, AEG, Krupp, Thyssen-Henschel', baujahre: '1989–1993', vmax: 280, hinweis: 'Zwei Triebköpfe mit Mittelwagen dazwischen.' },
  { id: '402', wikipedia: 'ICE 2', name: 'BR 402', spitzname: 'ICE 2', art: 'Hochgeschwindigkeitszug', einsatz: 'Fernverkehr', hersteller: 'Siemens, Adtranz u. a.', baujahre: '1995–1997', vmax: 280, hinweis: 'Ein Triebkopf und ein Steuerwagen, zwei Halbzüge kuppelbar.' },
  { id: '403', wikipedia: 'ICE 3', name: 'BR 403/406', spitzname: 'ICE 3 / ICE 3M', art: 'Hochgeschwindigkeitszug', einsatz: 'Fernverkehr, BR 406 als Mehrsystemzug auch ins Ausland', hersteller: 'Siemens, Adtranz', baujahre: '1999–2001', vmax: 300, hinweis: 'Verteilter Antrieb unter dem ganzen Zug, Wirbelstrombremse.' },
  { id: '407', wikipedia: 'DB-Baureihe 407', name: 'BR 407', spitzname: 'ICE 3 (Velaro D)', art: 'Hochgeschwindigkeitszug', einsatz: 'Fernverkehr, Mehrsystem (u. a. Frankreich)', hersteller: 'Siemens', baujahre: 'ab 2011', vmax: 320 },
  { id: '408', wikipedia: 'DB-Baureihe 408', name: 'BR 408', spitzname: 'ICE 3neo', art: 'Hochgeschwindigkeitszug', einsatz: 'Fernverkehr', hersteller: 'Siemens', baujahre: 'ab 2022', vmax: 320 },
  { id: '411', wikipedia: 'ICE T', name: 'BR 411/415', spitzname: 'ICE T', art: 'Hochgeschwindigkeitszug', einsatz: 'Fernverkehr auf kurvenreichen Strecken', hersteller: 'Siemens, Adtranz, Fiat u. a.', baujahre: '1999–2005', vmax: 230, hinweis: 'Mit Neigetechnik ausgelegt.' },
  { id: '412', wikipedia: 'ICE 4', name: 'BR 412', spitzname: 'ICE 4', art: 'Hochgeschwindigkeitszug', einsatz: 'Fernverkehr – die größte ICE-Flotte', hersteller: 'Siemens mit Bombardier', baujahre: 'ab 2017', vmax: 250, hinweis: 'Je nach Variante bis 265 km/h zugelassen.' },
  // --- Elektrotriebzüge Regionalverkehr ---
  { id: '425', wikipedia: 'DB-Baureihe 425', name: 'BR 425/426', art: 'Elektrotriebzug', einsatz: 'Regionalverkehr', hersteller: 'Bombardier, Siemens u. a.', baujahre: '1999–2008', vmax: 160 },
  { id: '440', wikipedia: 'Alstom Coradia Continental', name: 'BR 440', spitzname: 'Coradia Continental', art: 'Elektrotriebzug', einsatz: 'Regionalverkehr', hersteller: 'Alstom', baujahre: 'ab 2008', vmax: 160 },
  { id: '442', wikipedia: 'Bombardier Talent 2', name: 'BR 442', spitzname: 'Talent 2', art: 'Elektrotriebzug', einsatz: 'Regionalverkehr', hersteller: 'Bombardier', baujahre: 'ab 2008', vmax: 160 },
  { id: '445', wikipedia: 'Bombardier Twindexx Vario', name: 'BR 445', spitzname: 'Twindexx Vario', art: 'Elektrotriebzug', einsatz: 'Regionalverkehr (Doppelstock-Triebzug)', hersteller: 'Bombardier', baujahre: 'ab 2010er-Jahre', vmax: 160 },
  { id: '463', wikipedia: 'Siemens Mireo', name: 'BR 463', spitzname: 'Mireo', art: 'Elektrotriebzug', einsatz: 'Regionalverkehr', hersteller: 'Siemens', baujahre: 'ab 2019', vmax: 160 },
  // --- S-Bahn ---
  { id: '423', wikipedia: 'DB-Baureihe 423', name: 'BR 423', art: 'S-Bahn', einsatz: 'S-Bahn u. a. München, Stuttgart, Frankfurt, Köln', hersteller: 'Adtranz, Alstom, Bombardier', baujahre: '1998–2008', vmax: 140 },
  { id: '430', wikipedia: 'DB-Baureihe 430', name: 'BR 430', art: 'S-Bahn', einsatz: 'S-Bahn u. a. Stuttgart, Frankfurt, Rhein-Ruhr', hersteller: 'Bombardier, Alstom', baujahre: 'ab 2012', vmax: 140 },
  { id: '481', wikipedia: 'DB-Baureihe 481', name: 'BR 480/481', art: 'S-Bahn', einsatz: 'S-Bahn Berlin', hersteller: 'AEG, Adtranz, Bombardier', baujahre: '1986–2004', vmax: 100, hinweis: 'Stromschiene 750 V Gleichspannung statt Oberleitung.' },
  { id: '483', wikipedia: 'DB-Baureihe 483', name: 'BR 483/484', art: 'S-Bahn', einsatz: 'S-Bahn Berlin', hersteller: 'Stadler, Siemens', baujahre: 'ab 2020', vmax: 100, hinweis: 'Stromschiene 750 V Gleichspannung.' },
  { id: '490', wikipedia: 'DB-Baureihe 490', name: 'BR 490', art: 'S-Bahn', einsatz: 'S-Bahn Hamburg', hersteller: 'Bombardier (heute Alstom)', baujahre: 'ab 2016', vmax: 100, hinweis: 'Stromschiene 1200 V Gleichspannung, teils zusätzlich für Oberleitung 15 kV.' },
  // --- Dieseltriebzüge ---
  { id: '628', wikipedia: 'DB-Baureihe 628', name: 'BR 628', art: 'Dieseltriebzug', einsatz: 'Regionalverkehr', hersteller: 'Duewag, LHB u. a.', baujahre: '1974–1996', vmax: 120 },
  { id: '642', wikipedia: 'Siemens Desiro Classic', name: 'BR 642', spitzname: 'Desiro Classic', art: 'Dieseltriebzug', einsatz: 'Regionalverkehr', hersteller: 'Siemens', baujahre: '1999–2008', vmax: 120 },
  { id: '648', wikipedia: 'Alstom Coradia LINT', name: 'BR 648', spitzname: 'Coradia LINT 41', art: 'Dieseltriebzug', einsatz: 'Regionalverkehr', hersteller: 'Alstom (vorher LHB)', baujahre: 'ab 2000', vmax: 120 },
  // --- Wagen ---
  { id: 'dosto', name: 'Doppelstockwagen', art: 'Reisezugwagen', einsatz: 'Regionalverkehr (lokbespannt, mit Steuerwagen)', hersteller: 'Waggonbau Görlitz, später Bombardier', baujahre: 'ab den 1990er-Jahren', vmax: 160 },
]

export const baureiheNach = new Map(baureihen.map((b) => [b.id, b]))

// Gruppen für Fehlerfälle/Bauteile, die viele Baureihen betreffen.
const E_LOKS = ['101', '111', '143', '146', '147', '152', '185', '187', '189', '193']
const ICE = ['401', '402', '403', '407', '408', '411', '412']
const E_TRIEBZUEGE = ['425', '440', '442', '445', '463', '423', '430']
const DIESEL = ['218', '232', '245', '261', '294', '628', '642', '648']
const OBERLEITUNG = [...E_LOKS, ...ICE, ...E_TRIEBZUEGE]
const LOKBESPANNT_PERSONEN = ['101', '111', '143', '146', '147', '245', '218']
// Fahrzeuge mit Drehstrom-Antriebstechnik (Stromrichter + Asynchron-Fahrmotoren).
const DREHSTROM = ['101', '146', '147', '152', '185', '187', '189', '193', '401', '402', '403', '407', '408', '411', '412', '425', '440', '442', '445', '463', '423', '430', '481', '483', '490']

export type Haeufigkeit = 'Häufig' | 'Gelegentlich' | 'Selten'

export interface Fehlerfall {
  id: string
  titel: string
  gewerk: Gewerk
  // Leer = betrifft praktisch alle Fahrzeuge.
  baureihen: string[]
  schwierigkeit: FehlerfallSchwierigkeit
  symptome: string[]
  ursache: string
  loesung: string[]
  merksatz: string
  haeufigkeit: Haeufigkeit
}

export const fehlerfaelle: Fehlerfall[] = [
  {
    id: 'F-01',
    titel: 'Stromabnehmer hebt nicht',
    gewerk: 'Mechatronik',
    baureihen: OBERLEITUNG,
    schwierigkeit: 'Grundlagen',
    symptome: ['Stromabnehmer bleibt nach dem Aufrüsten unten', 'Keine Anzeige der Fahrdrahtspannung', 'Meldung zu Steuerluft im Führerstand'],
    ursache:
      'Der Stromabnehmer wird pneumatisch gehoben. Nach längerer Abstellung fehlt oft Steuerluft – oder die Schleifleiste ist beschädigt und die automatische Senkeinrichtung hält ihn absichtlich unten.',
    loesung: [
      'Steuerluftdruck im Führerstand ablesen, bei zu wenig Druck den Hilfsluftpresser laufen lassen',
      'Absperrhähne in der Stromabnehmer-Luftleitung auf richtige Stellung prüfen',
      'Nur nach Freigabe und Bahnerdung aufs Dach: Schleifleiste auf Brüche, Riefen und Mindeststärke prüfen',
      'Beschädigte Schleifleiste nach Vorgabe tauschen, danach Hebe- und Senkzeit testen',
    ],
    merksatz: 'Aufs Dach nur, wenn die Oberleitung ausgeschaltet und bahngeerdet ist – nie auf eigene Faust.',
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-02',
    titel: 'Hauptschalter fällt beim Einschalten',
    gewerk: 'Elektrik',
    baureihen: [...E_LOKS, ...ICE, ...E_TRIEBZUEGE],
    schwierigkeit: 'Fortgeschritten',
    symptome: ['Hauptschalter schaltet ein und sofort wieder aus', 'Fahrzeug lässt sich nicht aufrüsten', 'Schutzmeldung im Diagnosesystem'],
    ursache:
      'Eine Schutzeinrichtung hat ausgelöst: typisch sind Überstrom oder Erdschluss im Hochspannungsteil (Dachleitung, Transformator), ein Transformatorschutz oder Unterspannung der Steuerung.',
    loesung: [
      'Diagnosespeicher auslesen – welche Schutzfunktion hat ausgelöst?',
      'Dachausrüstung (nach Bahnerdung) auf Verschmutzung, Risse an Isolatoren und Fremdkörper prüfen',
      'Isolationsmessung der Hochspannungsleitung nach Prüfvorschrift',
      'Transformator: Ölstand und Schutzmeldungen prüfen',
      'Ursache beseitigen, erst dann erneut einschalten – nicht mehrfach „probieren"',
    ],
    merksatz: 'Ein Schutz löst nicht ohne Grund aus: erst Ursache finden, dann wieder einschalten.',
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-03',
    titel: 'Zwangsbremsung durch die PZB',
    gewerk: 'Elektrik',
    baureihen: [],
    schwierigkeit: 'Grundlagen',
    symptome: ['Zug bremst ungewollt bis zum Stillstand', 'PZB-Leuchtmelder und Störmeldung im Führerstand'],
    ursache:
      'Entweder ein Bedienfehler (z. B. 1000-Hz-Beeinflussung nicht rechtzeitig quittiert, Geschwindigkeit zu hoch) – oder ein Fehler am Fahrzeuggerät oder Fahrzeugmagneten, der falsche Beeinflussungen erkennt.',
    loesung: [
      'Fahrtdatenspeicher auswerten: war es Bedienung oder Technik?',
      'Fahrzeugmagnet auf Beschädigung, Verschmutzung und richtige Einbauhöhe prüfen',
      'PZB-Fahrzeuggerät mit dem Prüfgerät nach Vorschrift testen',
      'Nach Instandsetzung: Prüfung dokumentieren, erst dann Freigabe',
    ],
    merksatz: 'Die PZB ist sicherheitsrelevant – Arbeiten daran nur mit Berechtigung und vollständiger Prüfdokumentation.',
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-04',
    titel: 'Zwangsbremsungen durch die Sifa',
    gewerk: 'Elektrik',
    baureihen: [],
    schwierigkeit: 'Grundlagen',
    symptome: ['Sifa-Zwangsbremsung, obwohl der Tf den Taster betätigt', 'Leuchtmelder und Summer kommen unregelmäßig'],
    ursache:
      'Die Sicherheitsfahrschaltung erwartet regelmäßiges Loslassen und Betätigen des Tasters oder Pedals. Ein defekter oder verschmutzter Kontakt meldet „nicht betätigt", obwohl gedrückt wird.',
    loesung: [
      'Fußpedal und Handtaster auf Leichtgängigkeit und Verschmutzung prüfen',
      'Schaltkontakte durchmessen, auch während Bewegung (Wackelkontakt)',
      'Steckverbinder und Leitung zum Sifa-Gerät prüfen',
      'Funktionsprüfung: Zeitablauf Leuchtmelder → Summer → Zwangsbremsung kontrollieren',
    ],
    merksatz: 'Wackelkontakte findest du nur, wenn du beim Messen bewegst.',
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-05',
    titel: 'Räder schleudern beim Anfahren',
    gewerk: 'Mechatronik',
    baureihen: ['152', '185', '187', '189', '193', '232', '146', '147'],
    schwierigkeit: 'Grundlagen',
    symptome: ['Schleuderschutz greift ständig ein', 'Zugkraft bricht bei Nässe oder Laub stark ein'],
    ursache: 'Die Sandstreueinrichtung arbeitet nicht: Sandkasten leer, Sand feucht und verklumpt, Düse verstopft oder falsch ausgerichtet.',
    loesung: [
      'Füllstand der Sandkästen prüfen, nur trockenen Bremssand nachfüllen',
      'Sandfallrohre und Düsen auf Verstopfung prüfen und reinigen',
      'Ausrichtung der Düsen auf den Spalt zwischen Rad und Schiene kontrollieren',
      'Sand-Trocknung bzw. Heizung (falls vorhanden) und Magnetventile testen',
    ],
    merksatz: 'Sand gehört genau zwischen Rad und Schiene – daneben bringt er nichts.',
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-06',
    titel: 'Federspeicherbremse löst nicht',
    gewerk: 'Mechanik',
    baureihen: [],
    schwierigkeit: 'Grundlagen',
    symptome: ['Fahrzeug lässt sich nicht bewegen', 'Anzeige „Federspeicher angelegt" bleibt'],
    ursache:
      'Die Federspeicherbremse wird durch Federkraft angelegt und nur durch Druckluft gelöst. Fehlt der Druck (Leckage, Absperrhahn zu) oder klemmt der Zylinder, bleibt sie fest.',
    loesung: [
      'Luftdruck in der Federspeicherleitung prüfen',
      'Absperrhähne und Magnetventil der Federspeichersteuerung prüfen',
      'Leckagen abhören bzw. mit Lecksuchspray suchen',
      'Nur nach Vorschrift und mit gesichertem Fahrzeug die mechanische Notlösung benutzen – danach wieder in Grundstellung bringen',
    ],
    merksatz: 'Vor dem Notlösen das Fahrzeug immer gegen Wegrollen sichern (Hemmschuhe/Radvorleger).',
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-07',
    titel: 'Druckverlust in der Hauptluftleitung',
    gewerk: 'Mechanik',
    baureihen: [],
    schwierigkeit: 'Grundlagen',
    symptome: ['Hauptluftleitung hält die 5 bar nicht', 'Bremsen legen sich schleichend an', 'Kompressor läuft auffällig oft'],
    ursache: 'Undichtigkeit an Kupplungsköpfen, Absperrhähnen, Schlauchverbindungen oder Steuerventilen.',
    loesung: [
      'Bei aufgefüllter Anlage entlang der Leitung abhören',
      'Verbindungen mit Lecksuchspray prüfen (Blasenbildung)',
      'Dichtringe der Kupplungsköpfe und Bremsschläuche kontrollieren',
      'Dichtheitsprüfung nach Vorschrift: Druckabfall in der vorgegebenen Zeit messen',
    ],
    merksatz: 'Druckluft verrät sich durch Zischen – erst hören, dann sprühen.',
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-08',
    titel: 'Klimaanlage schaltet nach kurzer Zeit ab',
    gewerk: 'Mechatronik',
    baureihen: [...ICE, '425', '440', '442', '445', '463', '430', '642', '648'],
    schwierigkeit: 'Fortgeschritten',
    symptome: ['Kompressor schaltet nach wenigen Minuten ab', 'Fahrgastraum wird warm', 'Hochdruck-Störmeldung'],
    ursache:
      'Meist verschmutzter Verflüssiger (zu wenig Wärmeabfuhr → Hochdruck) oder Kältemittelmangel durch Undichtigkeit; seltener ein defekter Druckwächter.',
    loesung: [
      'Verflüssiger und Luftfilter auf Verschmutzung prüfen und reinigen',
      'Lüfter des Verflüssigers auf Funktion prüfen',
      'Drücke nur mit Sachkundenachweis für Kältemittel messen',
      'Druckwächter prüfen, danach Probelauf mit Temperaturprotokoll',
    ],
    merksatz: 'Kältemittel nur mit Sachkunde – und niemals einfach in die Luft ablassen.',
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-09',
    titel: 'Außentür schließt nicht',
    gewerk: 'Mechatronik',
    baureihen: ['412', '407', '408', '425', '440', '442', '445', '463', '423', '430', '481', '483', '490', '642', '648', 'dosto'],
    schwierigkeit: 'Grundlagen',
    symptome: ['Tür bleibt offen oder reversiert', 'Türstörung verhindert Abfahrt'],
    ursache:
      'Die Einklemmschutz-Sensorik meldet ein Hindernis: verschmutzte Lichtschranke, beschädigte Sensorkante, oder die Notentriegelung wurde nicht zurückgestellt.',
    loesung: [
      'Notentriegelung innen und außen auf Grundstellung prüfen',
      'Sensorkanten und Lichtschranke reinigen und auf Beschädigung prüfen',
      'Führungen und Laufwagen auf Fremdkörper prüfen',
      'Diagnosespeicher der Türsteuerung auslesen, danach mehrere Testzyklen fahren',
    ],
    merksatz: 'Bei Sensorfehlern zuerst „sauber, fest, dicht" – dann erst Bauteile tauschen.',
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-10',
    titel: 'Heißläufer-Meldung am Radsatzlager',
    gewerk: 'Mechanik',
    baureihen: [...ICE, ...E_LOKS, 'dosto'],
    schwierigkeit: 'Fortgeschritten',
    symptome: ['Temperaturüberwachung meldet Übertemperatur', 'Lagergehäuse deutlich wärmer als die anderen'],
    ursache: 'Lagerschaden, Schmierstoffmangel oder eine fest gehende Bremse, die zusätzlich Wärme erzeugt – seltener ein defekter Sensor.',
    loesung: [
      'Bremse am betroffenen Radsatz auf Festsitzen prüfen',
      'Temperatur mit unabhängigem Messgerät gegenprüfen (Sensor oder echtes Problem?)',
      'Lager nach Vorschrift auf Geräusche, Spiel und Schmierstoffaustritt prüfen',
      'Bei bestätigtem Lagerschaden: Radsatz nicht mehr bewegen ohne Freigabe',
    ],
    merksatz: 'Eine echte Heißläufer-Meldung ist ein Sicherheitsrisiko – nie „wegquittieren".',
    haeufigkeit: 'Selten',
  },
  {
    id: 'F-11',
    titel: 'Flachstelle am Rad',
    gewerk: 'Mechanik',
    baureihen: [],
    schwierigkeit: 'Grundlagen',
    symptome: ['Rhythmisches Schlagen während der Fahrt', 'Sichtbar abgeflachte Stelle auf der Lauffläche'],
    ursache: 'Das Rad ist beim Bremsen blockiert und über die Schiene gerutscht – oft durch einen defekten Gleitschutz oder eine fest gehende Bremse.',
    loesung: [
      'Länge und Tiefe der Flachstelle messen und mit den Grenzmaßen vergleichen',
      'Gleitschutz (Drehzahlgeber, Ventile) und Bremse des Radsatzes prüfen',
      'Je nach Maß: Radsatz auf der Unterflurdrehmaschine reprofilieren oder tauschen',
      'Ursache beheben, sonst entsteht die nächste Flachstelle',
    ],
    merksatz: 'Flachstellen beschädigen Lager und Gleis – messen, nicht schätzen.',
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-12',
    titel: 'Spurkranzschmierung ohne Funktion',
    gewerk: 'Mechatronik',
    baureihen: [...E_LOKS, '218', '232', '245'],
    schwierigkeit: 'Grundlagen',
    symptome: ['Quietschen in engen Bögen', 'Erhöhter Spurkranzverschleiß bei der Radsatzmessung'],
    ursache: 'Schmiermittelbehälter leer, Düse verstopft oder falsch ausgerichtet, oder die Ansteuerung (Weg-/Zeittakt) arbeitet nicht.',
    loesung: [
      'Füllstand prüfen und mit freigegebenem Schmierstoff auffüllen',
      'Düse reinigen und auf die Spurkranzflanke ausrichten – nicht auf die Lauffläche',
      'Ansteuerung und Magnetventil prüfen',
      'Probelauf: Sprühbild kontrollieren',
    ],
    merksatz: 'Schmierstoff auf der Lauffläche verringert die Haftung – immer nur an die Flanke.',
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-13',
    titel: 'Fahrzeug lässt sich nicht aufrüsten (Batterie leer)',
    gewerk: 'Elektrik',
    baureihen: [],
    schwierigkeit: 'Grundlagen',
    symptome: ['Nach dem Batteriehauptschalter bleibt alles dunkel', 'Steuerung startet und fällt wieder ab'],
    ursache: 'Die Fahrzeugbatterie wurde während der Abstellung tiefentladen, z. B. weil Verbraucher eingeschaltet blieben oder das Ladegerät defekt ist.',
    loesung: [
      'Batteriespannung messen und mit Sollwert vergleichen',
      'Fremdeinspeisung bzw. externes Ladegerät nach Vorschrift anschließen',
      'Nach dem Aufrüsten: Ladegerät und Ladestrom prüfen',
      'Klären, welcher Verbraucher während der Abstellung lief',
    ],
    merksatz: 'Eine leere Batterie ist ein Symptom – such die Ursache, sonst ist sie morgen wieder leer.',
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-14',
    titel: 'Keine Energieversorgung in den Wagen (Zugsammelschiene)',
    gewerk: 'Elektrik',
    baureihen: LOKBESPANNT_PERSONEN,
    schwierigkeit: 'Fortgeschritten',
    symptome: ['Licht, Heizung und Klima in den Wagen fallen aus', 'Lok meldet Störung der Zugsammelschiene'],
    ursache:
      'Die Lok versorgt die Wagen über die Zugsammelschiene (bei Strom aus der Oberleitung 1000 V). Typisch sind ein Erdschluss in einem Wagen oder beschädigte UIC-Kabel bzw. Steckdosen.',
    loesung: [
      'Zugsammelschiene vor jeder Arbeit spannungsfrei schalten und sichern',
      'Wagen einzeln abtrennen, um den fehlerhaften Wagen einzugrenzen',
      'Kabel, Stecker und Steckdosen auf Brandspuren, Feuchtigkeit und Beschädigung prüfen',
      'Isolationsmessung des betroffenen Wagens',
    ],
    merksatz: 'Fehler in einer Kette grenzt du ein, indem du sie Stück für Stück teilst.',
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-15',
    titel: 'Kühlwassertemperatur zu hoch (Diesellok)',
    gewerk: 'Mechanik',
    baureihen: DIESEL,
    schwierigkeit: 'Grundlagen',
    symptome: ['Leistung wird automatisch reduziert', 'Temperaturwarnung im Führerstand'],
    ursache: 'Verschmutzter Kühler, zu wenig Kühlmittel, defektes Thermostat oder ein Lüfter, der nicht hochdreht.',
    loesung: [
      'Kühlmittelstand nur bei abgekühltem Motor prüfen',
      'Kühlerblock auf Verschmutzung (Laub, Staub, Öl) prüfen und reinigen',
      'Lüfterantrieb und Lüftersteuerung prüfen',
      'Thermostat und Temperaturfühler testen, danach Probelauf unter Last',
    ],
    merksatz: 'Kühlsystem nie heiß öffnen – Verbrühungsgefahr durch Dampf und heißes Kühlmittel.',
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-16',
    titel: 'Dieselmotor startet schlecht oder verliert Leistung',
    gewerk: 'Mechanik',
    baureihen: DIESEL,
    schwierigkeit: 'Grundlagen',
    symptome: ['Langes Orgeln beim Start', 'Motor nimmt kein Gas an, schwarzer Rauch'],
    ursache: 'Zugesetzter Kraftstoff- oder Luftfilter, Wasser im Kraftstoff oder Luft im Kraftstoffsystem nach Filterwechsel.',
    loesung: [
      'Kraftstofffilter und Wasserabscheider prüfen, Wasser ablassen',
      'Luftfilter-Anzeige bzw. Luftfilter prüfen',
      'Nach Filterwechsel das Kraftstoffsystem nach Vorschrift entlüften',
      'Fehlerspeicher der Motorsteuerung auslesen',
    ],
    merksatz: 'Bei Diesel zuerst an Luft, Kraftstoff und Filter denken – die einfachen Dinge zuerst.',
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-17',
    titel: 'Stromrichter schaltet ab: Erdschluss im Fahrmotorkreis',
    gewerk: 'Elektrik',
    baureihen: DREHSTROM,
    schwierigkeit: 'Fortgeschritten',
    symptome: ['Traktionsstromrichter meldet Erdschluss und schaltet ab', 'Fahrzeug fährt mit reduzierter Leistung'],
    ursache: 'Isolationsfehler an einem Fahrmotor oder seiner Zuleitung, häufig durch Feuchtigkeit, Verschmutzung oder beschädigte Kabel.',
    loesung: [
      'Vor jeder Arbeit: Anlage freischalten und Zwischenkreis vollständig entladen lassen (Wartezeit beachten), Spannungsfreiheit messen',
      'Diagnosespeicher: welcher Motor bzw. welcher Kreis?',
      'Isolationsmessung von Fahrmotor und Zuleitung nach Prüfvorschrift',
      'Klemmkasten und Kabel auf Feuchtigkeit, Abrieb und Scheuerstellen prüfen',
    ],
    merksatz: 'Kondensatoren im Zwischenkreis halten gefährliche Spannung auch nach dem Abschalten.',
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-18',
    titel: 'Magnetschienenbremse wirkt nicht',
    gewerk: 'Elektrik',
    baureihen: ['401', '402', '425', '440', '442', '463', '423', '430', '642', '648'],
    schwierigkeit: 'Grundlagen',
    symptome: ['Bei Schnellbremsung senkt sich ein Bremsmagnet nicht ab', 'Störmeldung Mg-Bremse'],
    ursache: 'Unterbrechung im Magnetstromkreis (Kabel, Sicherung, Spule) oder mechanisch verklemmte Aufhängung.',
    loesung: [
      'Spulenwiderstand messen und mit Sollwert vergleichen',
      'Zuleitung, Steckverbinder und Absicherung prüfen',
      'Aufhängung, Federn und Abstand zur Schiene in Ruhelage messen',
      'Funktionsprüfung im Stand nach Vorschrift',
    ],
    merksatz: 'Die Mg-Bremse wirkt unabhängig vom Rad-Schiene-Kontakt – wichtig bei schlechter Haftung.',
    haeufigkeit: 'Selten',
  },
  {
    id: 'F-19',
    titel: 'Stromabnehmer an der Stromschiene verschlissen (S-Bahn)',
    gewerk: 'Mechanik',
    baureihen: ['481', '483', '490'],
    schwierigkeit: 'Grundlagen',
    symptome: ['Funkenbildung an der Stromschiene', 'Spannungsunterbrechungen während der Fahrt'],
    ursache: 'Der seitliche Stromabnehmer bzw. Schleifschuh ist verschlissen, verbogen oder der Anpressdruck stimmt nicht.',
    loesung: [
      'Nur bei ausgeschalteter und gesicherter Stromschiene arbeiten',
      'Verschleiß des Schleifschuhs mit dem Grenzmaß vergleichen',
      'Anpressfeder und Gelenke prüfen',
      'Schleifschuh tauschen und Lage zur Stromschiene kontrollieren',
    ],
    merksatz: 'Die Stromschiene liegt tief und ist schnell übersehen – sie steht unter Spannung, bis sie nachweislich abgeschaltet ist.',
    haeufigkeit: 'Gelegentlich',
  },
  {
    id: 'F-20',
    titel: 'Vakuum-WC ohne Funktion',
    gewerk: 'Mechatronik',
    baureihen: [...ICE, '445', '463', '440', '442', 'dosto'],
    schwierigkeit: 'Grundlagen',
    symptome: ['WC spült nicht, Störanzeige an der Kabine', 'Fäkalientank meldet „voll"'],
    ursache: 'Fäkalientank voll, Unterdruck wird nicht aufgebaut, Spülwasser fehlt oder ist eingefroren, oder ein Ventil hängt.',
    loesung: [
      'Füllstand Fäkalientank und Spülwasser prüfen',
      'Unterdruckerzeugung und Ventile testen',
      'Bei Frost: Begleitheizung prüfen',
      'Hygiene: Handschuhe, Hautschutz, danach Hände desinfizieren',
    ],
    merksatz: 'Auch „unbeliebte" Systeme brauchen saubere Fehlersuche – und Hygiene schützt dich selbst.',
    haeufigkeit: 'Häufig',
  },
  {
    id: 'F-21',
    titel: 'Bremse legt an einem Wagen nicht an',
    gewerk: 'Mechanik',
    baureihen: ['dosto', ...LOKBESPANNT_PERSONEN],
    schwierigkeit: 'Grundlagen',
    symptome: ['Bei der Bremsprobe bewegt sich an einem Wagen nichts', 'Bremszylinder bleibt drucklos'],
    ursache: 'Bremse des Wagens ausgeschaltet (Absperrhahn/Umstellvorrichtung), Steuerventil defekt oder Bremsgestänge falsch eingestellt.',
    loesung: [
      'Umstellvorrichtungen und Absperrhahn des Steuerventils prüfen',
      'Druck im Bremszylinder beim Bremsen messen',
      'Steuerventil nach Vorschrift prüfen bzw. tauschen',
      'Bremsgestänge und Gestängesteller kontrollieren, Bremsprobe wiederholen',
    ],
    merksatz: 'Eine Bremsprobe gilt erst als bestanden, wenn an jedem Fahrzeug Anlegen und Lösen geprüft wurde.',
    haeufigkeit: 'Gelegentlich',
  },
]

export interface Bauteil {
  id: string
  name: string
  kategorie: Gewerk
  // Leer = an praktisch allen Fahrzeugen.
  baureihen: string[]
  funktion: string
  pruefung: string[]
  sicherheit?: string
}

export const bauteile: Bauteil[] = [
  { id: 'B-01', name: 'Stromabnehmer (Pantograf)', kategorie: 'Mechatronik', baureihen: OBERLEITUNG, funktion: 'Stellt über die Schleifleiste den Kontakt zur Oberleitung her und wird pneumatisch angehoben.', pruefung: ['Schleifleiste auf Verschleiß, Brüche und Riefen', 'Anpresskraft und Hebe-/Senkzeit', 'Gelenke und Federn'], sicherheit: 'Arbeiten am Dach nur bei ausgeschalteter und bahngeerdeter Oberleitung.' },
  { id: 'B-02', name: 'Hauptschalter', kategorie: 'Elektrik', baureihen: [...E_LOKS, ...ICE, ...E_TRIEBZUEGE], funktion: 'Schaltet die Hochspannung zum Transformator ein und trennt das Fahrzeug bei Überstrom oder Erdschluss sofort ab.', pruefung: ['Schaltspiele und Schaltzeiten', 'Isolatoren auf Verschmutzung und Risse', 'Auslösung der Schutzfunktionen'] },
  { id: 'B-03', name: 'Haupttransformator', kategorie: 'Elektrik', baureihen: [...E_LOKS, ...ICE, ...E_TRIEBZUEGE], funktion: 'Setzt die Fahrdrahtspannung (15 kV) auf die Spannungen für Stromrichter und Hilfsbetriebe herunter.', pruefung: ['Ölstand und Öltemperatur', 'Dichtheit', 'Kühlanlage und Ölpumpe'] },
  { id: 'B-04', name: 'Traktionsstromrichter', kategorie: 'Elektrik', baureihen: DREHSTROM, funktion: 'Formt die Spannung vom Transformator über einen Gleichspannungs-Zwischenkreis in Drehstrom mit veränderlicher Frequenz für die Fahrmotoren um.', pruefung: ['Diagnosespeicher', 'Kühlkreislauf des Stromrichters', 'Steckverbinder und Leitungen'], sicherheit: 'Zwischenkreis-Kondensatoren können nach dem Abschalten noch gefährliche Spannung führen – Wartezeit und Spannungsfreiheit beachten.' },
  { id: 'B-05', name: 'Fahrmotor (Drehstrom-Asynchronmotor)', kategorie: 'Elektrik', baureihen: DREHSTROM, funktion: 'Wandelt elektrische Energie in Drehbewegung für die Radsätze um; beim elektrischen Bremsen arbeitet er als Generator.', pruefung: ['Isolationswiderstand', 'Lagergeräusche und Temperatur', 'Kühlluftwege'] },
  { id: 'B-06', name: 'Hilfsbetriebeumrichter', kategorie: 'Elektrik', baureihen: [...E_LOKS, ...ICE, ...E_TRIEBZUEGE], funktion: 'Versorgt Lüfter, Kompressor, Pumpen und Bordnetz mit den passenden Spannungen.', pruefung: ['Ausgangsspannungen', 'Lüfter und Kühlung', 'Diagnosespeicher'] },
  { id: 'B-07', name: 'Fahrzeugbatterie', kategorie: 'Elektrik', baureihen: [], funktion: 'Versorgt Steuerung und Sicherheitseinrichtungen, solange keine Fahrleitungsspannung anliegt, und ermöglicht das Aufrüsten.', pruefung: ['Spannung und Ladezustand', 'Elektrolytstand (bei NiCd/Blei)', 'Polklemmen auf Korrosion'], sicherheit: 'Kurzschluss vermeiden: kein Werkzeug auf die Pole legen. Beim Laden auf Belüftung achten.' },
  { id: 'B-08', name: 'Hauptluftpresser (Kompressor)', kategorie: 'Mechanik', baureihen: [], funktion: 'Erzeugt die Druckluft für Bremse, Stromabnehmer, Sanden, Türen und Luftfedern.', pruefung: ['Förderzeit bis Enddruck', 'Ölstand', 'Dichtheit und Abschaltdruck'] },
  { id: 'B-09', name: 'Lufttrockner', kategorie: 'Mechanik', baureihen: [], funktion: 'Entzieht der Druckluft Feuchtigkeit, damit Ventile nicht korrodieren oder im Winter einfrieren.', pruefung: ['Regeneration/Umschaltung', 'Kondensat am Hauptluftbehälter', 'Trockenmittel nach Frist'] },
  { id: 'B-10', name: 'Steuerventil der Druckluftbremse', kategorie: 'Mechanik', baureihen: [], funktion: 'Steuert abhängig vom Druck in der Hauptluftleitung den Druck im Bremszylinder – sinkt die Leitung, wird gebremst.', pruefung: ['Anlegen und Lösen bei der Bremsprobe', 'Ansprech- und Lösezeiten', 'Dichtheit'] },
  { id: 'B-11', name: 'Bremszylinder', kategorie: 'Mechanik', baureihen: [], funktion: 'Wandelt Luftdruck in Kraft auf Bremsbeläge oder Bremsklötze um.', pruefung: ['Hub', 'Dichtheit', 'Rückstellfeder'] },
  { id: 'B-12', name: 'Bremsscheibe und Bremsbelag', kategorie: 'Mechanik', baureihen: [], funktion: 'Erzeugen durch Reibung die Bremskraft; die Scheibe sitzt auf der Radsatzwelle oder am Rad.', pruefung: ['Belagstärke gegen Grenzmaß', 'Scheibe auf Risse und Riefen', 'Gleichmäßiges Tragbild'] },
  { id: 'B-13', name: 'Federspeicherbremse', kategorie: 'Mechanik', baureihen: [], funktion: 'Feststellbremse: Federkraft legt sie an, Druckluft löst sie. Fällt der Druck weg, bleibt das Fahrzeug gebremst.', pruefung: ['Lösen und Anlegen', 'Mechanische Notlöseeinrichtung', 'Anzeige im Führerstand'], sicherheit: 'Vor dem Notlösen Fahrzeug gegen Wegrollen sichern.' },
  { id: 'B-14', name: 'Magnetschienenbremse', kategorie: 'Elektrik', baureihen: ['401', '402', '425', '440', '442', '463', '423', '430', '642', '648'], funktion: 'Elektromagnet, der sich bei Schnellbremsung auf die Schiene absenkt und dort zusätzlich bremst – unabhängig von der Rad-Schiene-Haftung.', pruefung: ['Abstand zur Schiene in Ruhelage', 'Spulenwiderstand', 'Verschleiß der Polschuhe'] },
  { id: 'B-15', name: 'Wirbelstrombremse', kategorie: 'Elektrik', baureihen: ['403', '407', '408'], funktion: 'Berührungslose Bremse: Magnetfelder erzeugen Wirbelströme in der Schiene, die den Zug verzögern – ohne Verschleiß.', pruefung: ['Abstand zur Schiene', 'Ansteuerung und Diagnosespeicher'] },
  { id: 'B-16', name: 'Radsatz', kategorie: 'Mechanik', baureihen: [], funktion: 'Zwei Räder fest auf einer Welle; führt das Fahrzeug im Gleis und trägt seine Last.', pruefung: ['Radsatzmessung: Spurkranzhöhe, Spurkranzdicke, qR-Maß, Laufkreisdurchmesser', 'Flachstellen und Ausbröckelungen', 'Ultraschallprüfung der Welle nach Frist'] },
  { id: 'B-17', name: 'Radsatzlager', kategorie: 'Mechanik', baureihen: [], funktion: 'Lagert den Radsatz drehbar im Drehgestell und überträgt die Last.', pruefung: ['Temperatur', 'Geräusche und Spiel', 'Dichtungen und Schmierstoffaustritt'] },
  { id: 'B-18', name: 'Drehgestell', kategorie: 'Mechanik', baureihen: [], funktion: 'Trägt Radsätze, Federung, Bremse und oft die Antriebe; dreht sich in Kurven gegenüber dem Wagenkasten.', pruefung: ['Rahmen auf Risse (Sichtprüfung, ggf. Rissprüfung)', 'Befestigungen und Anschläge', 'Verschleißteile'] },
  { id: 'B-19', name: 'Primär- und Sekundärfederung', kategorie: 'Mechanik', baureihen: [], funktion: 'Primärfedern sitzen zwischen Radsatz und Drehgestell, Sekundärfedern (oft Luftfedern) zwischen Drehgestell und Wagenkasten – für Laufruhe und Komfort.', pruefung: ['Federn auf Brüche', 'Luftfedern auf Risse und Dichtheit', 'Höhenventile und Niveau'] },
  { id: 'B-20', name: 'Schwingungsdämpfer', kategorie: 'Mechanik', baureihen: [], funktion: 'Dämpfen Bewegungen in Fahrt (z. B. Schlinger- und Vertikaldämpfer) für ruhigen und sicheren Lauf.', pruefung: ['Ölverlust', 'Befestigung', 'Dämpfungskennlinie nach Frist'] },
  { id: 'B-21', name: 'Spurkranzschmierung', kategorie: 'Mechatronik', baureihen: [...E_LOKS, '218', '232', '245'], funktion: 'Bringt in Bögen Schmierstoff an die Spurkranzflanke und senkt so Verschleiß und Quietschen.', pruefung: ['Füllstand', 'Sprühbild und Düsenausrichtung', 'Ansteuerung'] },
  { id: 'B-22', name: 'Sandstreueinrichtung', kategorie: 'Mechatronik', baureihen: [], funktion: 'Streut beim Anfahren oder Bremsen trockenen Sand zwischen Rad und Schiene und verbessert so die Haftung.', pruefung: ['Füllstand und Feuchtigkeit des Sandes', 'Düsenausrichtung', 'Magnetventile'] },
  { id: 'B-23', name: 'Zug- und Stoßeinrichtung (Puffer, Schraubenkupplung)', kategorie: 'Mechanik', baureihen: [...E_LOKS, '218', '232', '245', '261', '294', 'dosto', '401', '402'], funktion: 'Überträgt Zug- und Druckkräfte zwischen Lok und Wagen bei Fahrzeugen mit Schraubenkupplung.', pruefung: ['Pufferteller und Hub', 'Kupplungsbügel und Spindel', 'Zughaken und Federn'] },
  { id: 'B-24', name: 'Scharfenbergkupplung', kategorie: 'Mechanik', baureihen: ['403', '407', '408', '411', '412', '425', '440', '442', '445', '463', '423', '430', '642', '648', '628'], funktion: 'Automatische Mittelpufferkupplung, die Fahrzeuge mechanisch und oft auch Luft- und Elektrikverbindungen in einem Schritt kuppelt.', pruefung: ['Kuppelvorgang', 'Elektrische Kontakte', 'Verschleiß am Kuppelkopf'] },
  { id: 'B-25', name: 'PZB-Fahrzeugmagnet', kategorie: 'Elektrik', baureihen: [], funktion: 'Empfängt an den Gleismagneten die Beeinflussung (1000, 500 und 2000 Hz) für die Punktförmige Zugbeeinflussung.', pruefung: ['Einbauhöhe', 'Beschädigung und Verschmutzung', 'Funktionsprüfung mit Prüfgerät'], sicherheit: 'Sicherheitsrelevantes Bauteil – Prüfungen nur mit Berechtigung und Dokumentation.' },
  { id: 'B-26', name: 'Sicherheitsfahrschaltung (Sifa)', kategorie: 'Elektrik', baureihen: [], funktion: 'Überwacht die Handlungsfähigkeit des Triebfahrzeugführers; reagiert er nicht, wird zwangsgebremst.', pruefung: ['Taster und Fußpedal', 'Zeitablauf Leuchtmelder → Summer → Zwangsbremsung'] },
  { id: 'B-27', name: 'Türantrieb und Einklemmschutz', kategorie: 'Mechatronik', baureihen: ['412', '407', '408', '425', '440', '442', '445', '463', '423', '430', '481', '483', '490', '642', '648', 'dosto'], funktion: 'Öffnet und schließt die Außentüren; Sensorkanten oder Lichtschranken verhindern das Einklemmen von Fahrgästen.', pruefung: ['Schließkraft und Reversieren', 'Sensorik', 'Notentriegelung'] },
  { id: 'B-28', name: 'Klimaanlage (Kältekreis)', kategorie: 'Mechatronik', baureihen: [...ICE, '425', '440', '442', '445', '463', '430', '642', '648'], funktion: 'Kühlt den Fahrgastraum über einen Kältekreis aus Verdichter, Verflüssiger, Expansionsventil und Verdampfer.', pruefung: ['Filter und Verflüssiger reinigen', 'Drücke (nur mit Sachkunde)', 'Probelauf'], sicherheit: 'Arbeiten am Kältekreis nur mit Sachkundenachweis; Kältemittel nie ablassen.' },
  { id: 'B-29', name: 'Zugsammelschiene (ZS) und UIC-Kabel', kategorie: 'Elektrik', baureihen: LOKBESPANNT_PERSONEN.concat('dosto'), funktion: 'Versorgt bei lokbespannten Zügen die Wagen mit Energie für Licht, Heizung und Klima.', pruefung: ['Stecker und Steckdosen', 'Kabel auf Beschädigung', 'Isolationsmessung'], sicherheit: 'Führt hohe Spannung – nur spannungsfrei und gesichert arbeiten.' },
  { id: 'B-30', name: 'Kühlanlage Dieselmotor', kategorie: 'Mechanik', baureihen: DIESEL, funktion: 'Führt die Wärme von Motor, Getriebe und Ladeluft über Kühler und Lüfter ab.', pruefung: ['Kühlmittelstand und Frostschutz', 'Kühler auf Verschmutzung', 'Lüfterantrieb'], sicherheit: 'Nie im heißen Zustand öffnen.' },
]

// Kurzbeschreibung der betroffenen Baureihen für die Anzeige („BR 185, BR 193 + 3 weitere").
export function baureihenText(ids: string[], max = 4): string {
  if (ids.length === 0) return 'Alle Fahrzeuge'
  const namen = ids.map((id) => baureiheNach.get(id)?.name ?? id)
  return namen.length > max ? `${namen.slice(0, max).join(', ')} + ${namen.length - max} weitere` : namen.join(', ')
}

// filter = null heißt „alle Baureihen". Einträge ohne Baureihen-Zuordnung gelten für alle Fahrzeuge.
export function passtZuBaureihen(eintragIds: string[], filter: string[] | null): boolean {
  if (!filter) return true
  return eintragIds.length === 0 || eintragIds.some((id) => filter.includes(id))
}
