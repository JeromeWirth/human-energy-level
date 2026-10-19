import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Datenschutz · Energy Level",
};

// German on purpose: it's written for German law, and the Impressum it links
// to (jeromewirth.de) is German too. Describes what the app really does —
// keep it in step when sharing, storage or analytics change.
export default function DatenschutzPage() {
  return (
    <main
      lang="de"
      className="min-h-screen mx-auto w-full max-w-md px-4 pb-12 pt-[max(2.5rem,calc(env(safe-area-inset-top)+1rem))] flex flex-col gap-6"
    >
      <Link href="/" className="text-sm text-foreground/50">
        ← Zurück zur App
      </Link>

      <h1 className="text-xl font-semibold">Datenschutzerklärung</h1>

      <Section title="Das Wichtigste in Kürze">
        <p>
          Energy Level hat <strong>keine Benutzerkonten, keine Datenbank und
          keine Cookies</strong>. Ihre Einträge bleiben auf Ihrem Gerät. Sie
          verlassen es nur, wenn Sie selbst einen Link teilen oder einen
          Sicherungscode weitergeben. Die Besucherstatistik läuft auf meinem
          eigenen Server in Deutschland.
        </p>
      </Section>

      <Section title="Verantwortlicher">
        <p>
          Verantwortlich ist Jérôme Wirth. Anschrift und Kontaktdaten finden
          Sie im{" "}
          <a href="https://jeromewirth.de/impressum" className="underline">
            Impressum
          </a>
          .
        </p>
      </Section>

      <Section title="Hosting">
        <p>
          Die Anwendung wird bei der Vercel Inc. (USA) gehostet. Beim Aufruf
          verarbeitet Vercel technisch bedingt Ihre IP-Adresse, Datum und
          Uhrzeit, die aufgerufene Adresse und die Browser-Kennung, um die
          Seite auszuliefern und den Betrieb abzusichern. Dabei können Daten
          in die USA übermittelt werden. Wie lange Vercel diese Daten
          speichert, richtet sich nach der{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            className="underline"
          >
            Datenschutzerklärung von Vercel
          </a>
          . Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes
          Interesse ist ein stabiler, missbrauchsfreier Betrieb.
        </p>
      </Section>

      <Section title="Ihre Einträge (localStorage)">
        <p>
          Ihr Name, Ihr Energiestand, Ihre Einträge mit Notizen und Ihre
          Einstellungen werden im localStorage Ihres Browsers gespeichert.
          Diese Daten verlassen Ihr Gerät nicht von selbst und sind für mich
          nicht einsehbar. Die Speicherung ist für die App unbedingt
          erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Löschen können Sie die
          Daten jederzeit über die „Website-Daten löschen“-Funktion Ihres
          Browsers.
        </p>
      </Section>

      <Section title="Sicherungscode">
        <p>
          Unter „Export data“ erzeugt die App auf Ihrem Gerät einen Code mit
          all Ihren Daten. Er wird nicht an einen Server geschickt. Wer den
          Code hat, kann Ihre Daten lesen und in die App laden. Geben Sie ihn
          deshalb nur an Ihre eigenen Geräte weiter.
        </p>
      </Section>

      <Section title="Teilen als Bild">
        <p>
          Das Bild Ihres Tages wird auf Ihrem Gerät erzeugt. Wohin es geht,
          entscheiden Sie beim Teilen.
        </p>
      </Section>

      <Section title="Teilen als Link">
        <p>
          Ein geteilter Link enthält die Daten des Tages selbst: Name,
          Energiestand, Datum und die Einträge von heute, mit Notizen, außer
          Sie haben „Hide notes when sharing“ eingeschaltet. Die Daten sind im
          Link nicht verschlüsselt. Wer den Link hat, kann sie lesen.
        </p>
        <p>
          Wird der Link geöffnet, erzeugt der Server bei Vercel daraus die
          Seite und ein Vorschaubild und speichert beides in seinem
          Zwischenspeicher. Messenger, in denen Sie den Link teilen, rufen
          dieses Vorschaubild meist automatisch ab. Teilen Sie Links deshalb
          nur mit Menschen, die den Inhalt sehen sollen. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. b DSGVO, da Sie die Teilen-Funktion nutzen.
        </p>
      </Section>

      <Section title="Besucherstatistik mit Umami">
        <p>
          Um zu erfahren, wie oft die App genutzt wird, verwende ich das
          Statistikprogramm Umami. Ich betreibe Umami selbst auf meinem Server
          bei der Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen,
          Deutschland. Die Daten verlassen diesen Server nicht und werden
          nicht weitergegeben. Umami setzt keine Cookies.
        </p>
        <p>
          Erfasst werden die aufgerufene Seite, die Seite, von der Sie
          gekommen sind, Browser, Betriebssystem, Gerätetyp, Bildschirmgröße
          und Spracheinstellung sowie Land, Region und Ort, die aus Ihrer
          IP-Adresse abgeleitet werden. Ihre IP-Adresse speichert Umami nicht.
          Um zusammengehörige Seitenaufrufe zu erkennen, bildet Umami aus
          IP-Adresse, Browserkennung und einem geheimen Schlüssel eine
          Kennung, aus der sich die IP-Adresse nicht ermitteln lässt. Diese
          Kennung wechselt jeden Monat. Ihre Einträge erfasst Umami nicht.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes
          Interesse ist es, die App anhand der Nutzungszahlen zu verbessern.
        </p>
      </Section>

      <Section title="Ihre Rechte">
        <p>
          Sie haben nach der DSGVO das Recht auf Auskunft (Art. 15),
          Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der
          Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und
          Widerspruch (Art. 21) sowie das Recht, sich bei einer
          Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77). Für Anfragen
          genügt eine E-Mail an die im Impressum genannte Adresse.
        </p>
      </Section>

      <p className="text-xs text-foreground/45">Stand: Oktober 2026</p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/75">
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      {children}
    </section>
  );
}
