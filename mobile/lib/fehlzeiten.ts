import type { BerichtsheftEintrag } from '../data/mock'

// Obergrenze, unter der die Krankheitstage bleiben sollen (Vorgabe des Azubis).
export const KRANKHEITSTAGE_GRENZE = 25
// Ab hier wird gewarnt, bevor die Grenze erreicht ist.
export const KRANKHEITSTAGE_WARNUNG = 20

// Ein Tag gilt als Krankheitstag, wenn eine Zeile des Eintrags mit einem dieser Wörter beginnt –
// so zählen der „Krank"-Schnellknopf und selbst geschriebene Einträge gleichermaßen, aber nicht
// z. B. „Krankenwagen …" (ganzes Wort, danach kein weiterer Buchstabe).
const KRANK_MUSTER = /^(krank|krankheit|krankgeschrieben|krankmeldung|arbeitsunfähig|arbeitsunfähigkeit)(?![a-zäöüß])/

export function istKrankheitstag(eintrag: BerichtsheftEintrag): boolean {
  return eintrag.taetigkeiten
    .split('\n')
    .map((zeile) => zeile.replace(/^-+\s*/, '').trim().toLowerCase())
    .some((zeile) => KRANK_MUSTER.test(zeile))
}

export function krankheitstage(eintraege: BerichtsheftEintrag[]): number {
  return new Set(eintraege.filter(istKrankheitstag).map((e) => e.datumISO)).size
}
