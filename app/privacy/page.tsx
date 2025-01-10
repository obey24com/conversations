import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: 'Datenschutzerklärung',
  description: 'Informationen zum Datenschutz und zur Verarbeitung Ihrer personenbezogenen Daten bei ULOCAT.',
};

export default function PrivacyPage() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
        </Link>
      </div>

      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-8">Datenschutzerklärung</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Verantwortlicher für die Datenverarbeitung</h2>
          <p>
            Orhan Yilmaz<br />
            Fischenzstraße 6d<br />
            78462 Konstanz<br />
            Deutschland<br />
            +49 176 62915092<br />
            info@obey24.de
          </p>
        </div>

        <p className="text-gray-600 mb-8">
          Wir freuen uns über Ihr Interesse an unserem Online-Angebot. Der Schutz Ihrer Privatsphäre ist für uns sehr wichtig. Nachstehend informieren wir Sie ausführlich über den Umgang mit Ihren Daten.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Zugriffsdaten und Hosting</h2>
          <p>
            Sie können unsere Webseiten (z. B. ulocat.com) besuchen, ohne Angaben zu Ihrer Person zu machen.
            Bei jedem Aufruf einer Webseite speichert der Webserver lediglich automatisch ein sogenanntes Server-Logfile, das z. B. den Namen der angeforderten Datei, Ihre IP-Adresse, Datum und Uhrzeit des Abrufs, übertragene Datenmenge und den anfragenden Provider (Zugriffsdaten) enthält und den Abruf dokumentiert.
          </p>
          <p>
            Diese Zugriffsdaten werden ausschließlich zum Zwecke der Sicherstellung eines störungsfreien Betriebs der Seite sowie zur Verbesserung unseres Angebots ausgewertet. Dies dient gemäß Art. 6 Abs. 1 S. 1 lit. f DSGVO der Wahrung unserer im Rahmen einer Interessensabwägung überwiegenden berechtigten Interessen an einer korrekten Darstellung unseres Angebots. Alle Zugriffsdaten werden spätestens sieben Tage nach Ende Ihres Seitenbesuchs gelöscht.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Hostingdienstleistungen durch einen Drittanbieter</h3>
          <p>
            Im Rahmen einer Verarbeitung in unserem Auftrag erbringt ein Drittanbieter für uns die Dienste zum Hosting und zur Darstellung der Webseite. Alle Daten, die im Rahmen der Nutzung dieser Webseite oder in dafür vorgesehenen Formularen wie nachfolgend beschrieben erhoben werden, werden auf dessen Servern verarbeitet. Eine Verarbeitung auf anderen Servern findet nur in dem hier erläuterten Rahmen statt.
          </p>
          <p>
            Dieser Dienstleister sitzt innerhalb eines Landes der Europäischen Union oder des Europäischen Wirtschaftsraums.
          </p>
        </section>

        {/* Continue with all other sections... */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Datenerhebung und -verwendung zur Vertragsabwicklung</h2>
          <p>
            Wir erheben personenbezogene Daten, wenn Sie uns diese im Rahmen Ihrer Bestellung oder bei einer Kontaktaufnahme mit uns (z. B. per Kontaktformular oder E-Mail) freiwillig mitteilen. Pflichtfelder werden als solche gekennzeichnet, da wir in diesen Fällen die Daten zwingend zur Vertragsabwicklung bzw. zur Bearbeitung Ihrer Kontaktaufnahme benötigen und Sie ohne deren Angabe die Bestellung bzw. die Kontaktaufnahme nicht versenden können.
          </p>
        </section>

        {/* Add all remaining sections... */}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Kontaktmöglichkeiten und Ihre Rechte</h2>
          <p>Als betroffene Person haben Sie folgende Rechte:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Art. 15 DSGVO: Recht auf Auskunft</li>
            <li>Art. 16 DSGVO: Recht auf Berichtigung</li>
            <li>Art. 17 DSGVO: Recht auf Löschung</li>
            <li>Art. 18 DSGVO: Recht auf Einschränkung der Verarbeitung</li>
            <li>Art. 20 DSGVO: Recht auf Datenübertragbarkeit</li>
            <li>Art. 77 DSGVO: Recht auf Beschwerde bei einer Aufsichtsbehörde</li>
          </ul>

          <p className="mb-4">Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten wenden Sie sich bitte an:</p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <p>
              Orhan Yilmaz<br />
              Fischenzstraße 6d<br />
              78462 Konstanz<br />
              Deutschland<br />
              Telefon: +49 176 62915092<br />
              E-Mail: info@obey24.de
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. ULOCAT – Nutzung von Drittanbieterdiensten</h2>
          <p>
            Unsere App und Website nutzen verschiedene Drittanbieterdienste wie Google Analytics, OpenAI API, und ElevenLabs API. Detaillierte Informationen zur Datenverarbeitung durch diese Dienste finden Sie in den jeweiligen Abschnitten dieser Datenschutzerklärung.
          </p>
        </section>

        <div className="mt-12 flex justify-center">
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Startseite
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
