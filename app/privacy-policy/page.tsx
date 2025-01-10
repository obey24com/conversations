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
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
        </Link>
      </div>

      <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Datenschutzerklärung</h1>
        
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Verantwortlicher für die Datenverarbeitung ist:</h2>
          <p className="text-sm sm:text-base">
            Orhan Yilmaz<br />
            Fischenzstraße 6d<br />
            78462 Konstanz<br />
            Deutschland<br />
            +49 176 62915092<br />
            info@obey24.de
          </p>
        </div>

        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Wir freuen uns über Ihr Interesse an unserem Online-Angebot. Der Schutz Ihrer Privatsphäre ist für uns sehr wichtig. Nachstehend informieren wir Sie ausführlich über den Umgang mit Ihren Daten.
        </p>

        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">1. Zugriffsdaten und Hosting</h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Sie können unsere Webseiten (z. B. ulocat.com) besuchen, ohne Angaben zu Ihrer Person zu machen.
                Bei jedem Aufruf einer Webseite speichert der Webserver lediglich automatisch ein sogenanntes Server-Logfile, das z. B. den Namen der angeforderten Datei, Ihre IP-Adresse, Datum und Uhrzeit des Abrufs, übertragene Datenmenge und den anfragenden Provider (Zugriffsdaten) enthält und den Abruf dokumentiert.
              </p>
              <p>
                Diese Zugriffsdaten werden ausschließlich zum Zwecke der Sicherstellung eines störungsfreien Betriebs der Seite sowie zur Verbesserung unseres Angebots ausgewertet. Dies dient gemäß Art. 6 Abs. 1 S. 1 lit. f DSGVO der Wahrung unserer im Rahmen einer Interessensabwägung überwiegenden berechtigten Interessen an einer korrekten Darstellung unseres Angebots. Alle Zugriffsdaten werden spätestens sieben Tage nach Ende Ihres Seitenbesuchs gelöscht.
              </p>
              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">Hostingdienstleistungen durch einen Drittanbieter</h3>
              <p>
                Im Rahmen einer Verarbeitung in unserem Auftrag erbringt ein Drittanbieter für uns die Dienste zum Hosting und zur Darstellung der Webseite. Alle Daten, die im Rahmen der Nutzung dieser Webseite oder in dafür vorgesehenen Formularen wie nachfolgend beschrieben erhoben werden, werden auf dessen Servern verarbeitet. Eine Verarbeitung auf anderen Servern findet nur in dem hier erläuterten Rahmen statt.
              </p>
              <p>
                Dieser Dienstleister sitzt innerhalb eines Landes der Europäischen Union oder des Europäischen Wirtschaftsraums.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">2. Datenerhebung und -verwendung zur Vertragsabwicklung</h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Wir erheben personenbezogene Daten, wenn Sie uns diese im Rahmen Ihrer Bestellung oder bei einer Kontaktaufnahme mit uns (z. B. per Kontaktformular oder E-Mail) freiwillig mitteilen. Pflichtfelder werden als solche gekennzeichnet, da wir in diesen Fällen die Daten zwingend zur Vertragsabwicklung bzw. zur Bearbeitung Ihrer Kontaktaufnahme benötigen und Sie ohne deren Angabe die Bestellung bzw. die Kontaktaufnahme nicht versenden können. Welche Daten erhoben werden, ist aus den jeweiligen Eingabeformularen ersichtlich. Wir verwenden die von Ihnen mitgeteilten Daten gemäß Art. 6 Abs. 1 S. 1 lit. b DSGVO zur Vertragsabwicklung und Bearbeitung Ihrer Anfragen.
              </p>
            </div>
          </section>

          {/* Continue with sections 3-10... */}
          
          {/* Section 11 */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">11. Kontaktmöglichkeiten und Ihre Rechte</h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>Als betroffene Person haben Sie folgende Rechte:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Art. 15 DSGVO: Recht auf Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten</li>
                <li>Art. 16 DSGVO: Recht auf Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten</li>
                <li>Art. 17 DSGVO: Recht auf Löschung Ihrer bei uns gespeicherten personenbezogenen Daten</li>
                <li>Art. 18 DSGVO: Recht auf Einschränkung der Verarbeitung Ihrer personenbezogenen Daten</li>
                <li>Art. 20 DSGVO: Recht auf Datenübertragbarkeit</li>
                <li>Art. 77 DSGVO: Recht, sich bei einer Aufsichtsbehörde zu beschweren</li>
              </ul>
              
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p>
                  Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten wenden Sie sich bitte an:<br /><br />
                  Orhan Yilmaz<br />
                  Fischenzstraße 6d<br />
                  78462 Konstanz<br />
                  Deutschland<br />
                  Telefon: +49 176 62915092<br />
                  E-Mail: info@obey24.de
                </p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">12. ULOCAT – Nutzung von Drittanbieterdiensten</h2>
            <div className="text-sm sm:text-base space-y-4">
              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">Google Analytics (Firebase)</h3>
              <p>
                Wir verwenden in unserer mobilen App „ULOCAT" den Analysedienst „Google Analytics for Firebase" (Google Analytics). Weitere Details zur Datenübermittlung, Zweck und Rechtsgrundlage siehe oben oder in der App selbst.
              </p>

              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">Google AdMob</h3>
              <p>
                Unsere App bindet Werbeanzeigen über den Dienst „Google AdMob" ein. Auch hier können Daten in die USA übertragen werden. Details zur Einwilligung und zum Widerruf finden Sie in den App-Einstellungen oder in den Geräteeinstellungen (Limit Ad Tracking).
              </p>

              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">OpenAI API</h3>
              <p>
                Wir nutzen Services der OpenAI, Inc., um KI-Funktionen (z. B. Chatfunktionen) anzubieten. Ihre Eingaben können an OpenAI-Server in den USA übertragen werden. Bitte beachten Sie, dass Sie keine sensiblen Daten eingeben sollten.
              </p>

              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">ElevenLabs API</h3>
              <p>
                Für Text-to-Speech-Funktionen binden wir Services der ElevenLabs, Inc. ein. Auch hierbei können Daten (Text/Audiodaten) an Server in den USA übertragen werden.
              </p>

              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">Google Gemini</h3>
              <p>
                Wir nutzen ggf. Funktionen des KI-Systems „Google Gemini" (Google Ireland Limited). Bei Nutzung werden relevante Eingaben an Google-Server übermittelt und verarbeitet.
              </p>

              <p className="mt-4">
                Die Datenübermittlung in die USA erfolgt auf Grundlage von Einwilligungen (Art. 6 Abs. 1 lit. a DSGVO) oder gegebenenfalls Standardvertragsklauseln.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-center">
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
