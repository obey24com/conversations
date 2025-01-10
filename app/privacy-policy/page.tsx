import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen zum Datenschutz und zur Verarbeitung Ihrer personenbezogenen Daten bei ULOCAT.",
};

export default function PrivacyPage() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Zurück-Button */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
        </Link>
      </div>

      {/* Haupt-Content */}
      <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
        {/* Haupt-Überschrift */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Datenschutzerklärung</h1>

        {/* Verantwortlicher */}
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
          Wir freuen uns über Ihr Interesse an unserem Online-Angebot. Der Schutz Ihrer Privatsphäre ist für uns sehr
          wichtig. Nachstehend informieren wir Sie ausführlich über den Umgang mit Ihren Daten.
        </p>

        <div className="space-y-8">
          {/* 1. Zugriffsdaten und Hosting */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">1. Zugriffsdaten und Hosting</h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Sie können unsere Webseiten (z. B. ulocat.com) besuchen, ohne Angaben zu Ihrer Person zu machen. Bei jedem
                Aufruf einer Webseite speichert der Webserver lediglich automatisch ein sogenanntes Server-Logfile, das z.
                B. den Namen der angeforderten Datei, Ihre IP-Adresse, Datum und Uhrzeit des Abrufs, übertragene Datenmenge
                und den anfragenden Provider (Zugriffsdaten) enthält und den Abruf dokumentiert.
              </p>
              <p>
                Diese Zugriffsdaten werden ausschließlich zum Zwecke der Sicherstellung eines störungsfreien Betriebs der
                Seite sowie zur Verbesserung unseres Angebots ausgewertet. Dies dient gemäß Art. 6 Abs. 1 S. 1 lit. f
                DSGVO der Wahrung unserer im Rahmen einer Interessensabwägung überwiegenden berechtigten Interessen an
                einer korrekten Darstellung unseres Angebots. Alle Zugriffsdaten werden spätestens sieben Tage nach Ende
                Ihres Seitenbesuchs gelöscht.
              </p>
              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">Hostingdienstleistungen durch einen Drittanbieter</h3>
              <p>
                Im Rahmen einer Verarbeitung in unserem Auftrag erbringt ein Drittanbieter für uns die Dienste zum Hosting
                und zur Darstellung der Webseite. Alle Daten, die im Rahmen der Nutzung dieser Webseite oder in dafür
                vorgesehenen Formularen wie nachfolgend beschrieben erhoben werden, werden auf dessen Servern verarbeitet.
                Eine Verarbeitung auf anderen Servern findet nur in dem hier erläuterten Rahmen statt.
              </p>
              <p>Dieser Dienstleister sitzt innerhalb eines Landes der Europäischen Union oder des Europäischen Wirtschaftsraums.</p>
            </div>
          </section>

          {/* 2. Datenerhebung und -verwendung zur Vertragsabwicklung */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">
              2. Datenerhebung und -verwendung zur Vertragsabwicklung
            </h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Wir erheben personenbezogene Daten, wenn Sie uns diese im Rahmen Ihrer Bestellung oder bei einer
                Kontaktaufnahme mit uns (z. B. per Kontaktformular oder E-Mail) freiwillig mitteilen. Pflichtfelder werden
                als solche gekennzeichnet, da wir in diesen Fällen die Daten zwingend zur Vertragsabwicklung bzw. zur
                Bearbeitung Ihrer Kontaktaufnahme benötigen und Sie ohne deren Angabe die Bestellung bzw. die
                Kontaktaufnahme nicht versenden können. Welche Daten erhoben werden, ist aus den jeweiligen
                Eingabeformularen ersichtlich. Wir verwenden die von Ihnen mitgeteilten Daten gemäß Art. 6 Abs. 1 S. 1
                lit. b DSGVO zur Vertragsabwicklung und Bearbeitung Ihrer Anfragen.
              </p>
            </div>
          </section>

          {/* 3. Datenweitergabe */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">3. Datenweitergabe</h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Zur Vertragserfüllung gemäß Art. 6 Abs. 1 S. 1 lit. b DSGVO geben wir Ihre Daten an das mit der Lieferung
                beauftragte Versandunternehmen weiter, soweit dies zur Lieferung bestellter Waren erforderlich ist. Je
                nachdem, welchen Zahlungsdienstleister Sie im Bestellprozess auswählen, geben wir zur Abwicklung von
                Zahlungen die hierfür erhobenen Zahlungsdaten an das mit der Zahlung beauftragte Kreditinstitut und ggf.
                von uns beauftragte Zahlungsdienstleister weiter bzw. an den ausgewählten Zahlungsdienst. Zum Teil erheben
                die ausgewählten Zahlungsdienstleister diese Daten auch selbst, soweit Sie dort ein Konto anlegen. In
                diesem Fall müssen Sie sich im Bestellprozess mit Ihren Zugangsdaten bei dem Zahlungsdienstleister
                anmelden. Es gilt insoweit die Datenschutzerklärung des jeweiligen Zahlungsdienstleisters.
              </p>
              <p>
                Zur Bestell- und Vertragsabwicklung setzen wir zudem ein externes Warenwirtschaftssystem ein. Die
                insoweit stattfindende Datenweitergabe bzw. Verarbeitung basiert auf einer Auftragsverarbeitung.
              </p>
              <p>
                Wir setzen Zahlungsdienstleister und Versanddienstleister ein, die ihren Sitz in einem Staat außerhalb
                der Europäischen Union haben. Die Übermittlung personenbezogener Daten an diese Unternehmen erfolgt
                lediglich im Rahmen der Notwendigkeit zur Vertragserfüllung.
              </p>
              <p>
                Entsprechendes gilt für die Datenweitergabe an unsere Hersteller bzw. Großhändler in den Fällen, in denen
                sie den Versand für uns übernehmen (Streckengeschäft).
              </p>
              <p>
                <strong>Datenweitergabe an Inkassounternehmen:</strong> Zur Vertragserfüllung gemäß Art. 6 Abs. 1 S. 1
                lit. b DSGVO geben wir Ihre Daten an ein beauftragtes Inkassounternehmen weiter, soweit unsere
                Zahlungsforderung trotz vorausgegangener Mahnung nicht beglichen wurde. In diesem Fall wird die Forderung
                unmittelbar vom Inkassounternehmen eingetrieben. Darüber hinaus dient die Weitergabe der Wahrung unserer
                im Rahmen einer Interessensabwägung überwiegenden berechtigten Interessen an einer effektiven
                Geltendmachung bzw. Durchsetzung unserer Zahlungsforderung gemäß Art. 6 Abs. 1 S. 1 lit. f DSGVO.
              </p>
            </div>
          </section>

          {/* 4. E-Mail-Newsletter */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">4. E-Mail-Newsletter</h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Wenn Sie sich zu unserem Newsletter anmelden, verwenden wir die hierfür erforderlichen oder gesondert von
                Ihnen mitgeteilten Daten, um Ihnen regelmäßig unseren E-Mail-Newsletter aufgrund Ihrer Einwilligung
                gemäß Art. 6 Abs. 1 S. 1 lit. a DSGVO zuzusenden. Die Abmeldung vom Newsletter ist jederzeit möglich und
                kann entweder durch eine Nachricht an die unten beschriebene Kontaktmöglichkeit oder über einen dafür
                vorgesehenen Link im Newsletter erfolgen.
              </p>
              <p>
                Wenn wir Ihre E-Mail-Adresse im Zusammenhang mit dem Verkauf einer Ware oder Dienstleistung erhalten und
                Sie dem nicht widersprochen haben, behalten wir uns vor, Ihnen auf Grundlage von § 7 Abs. 3 UWG regelmäßig
                Angebote zu ähnlichen Produkten per E-Mail zuzusenden. Dies dient unserem berechtigten Interesse an einer
                werblichen Ansprache unserer Kunden.
              </p>
            </div>
          </section>

          {/* 5. Datenverwendung bei Zahlungsabwicklung */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">
              5. Datenverwendung bei Zahlungsabwicklung
            </h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Wenn Sie sich für bestimmte Zahlungsdienstleistungen (z. B. Klarna) entscheiden, bitten wir Sie um Ihre
                Einwilligung nach Art. 6 Abs. 1 S. 1 lit. a DSGVO, dass wir die für die Abwicklung der Zahlung und eine
                Identitäts- und Bonitätsprüfung notwendigen Daten an den jeweiligen Dienstleister übermitteln dürfen.
                Weitere Hinweise zur Datenverarbeitung finden Sie in der Datenschutzerklärung des jeweiligen Anbieters.
              </p>
              <p>
                Die im Bestellprozess durch Einwilligung erfolgte Zustimmung zur Datenweitergabe kann jederzeit, auch ohne
                Angabe von Gründen, uns gegenüber mit Wirkung für die Zukunft widerrufen werden. Dies kann jedoch zur
                Folge haben, dass wir Ihnen bestimmte Zahlungsoptionen nicht mehr anbieten können.
              </p>
            </div>
          </section>

          {/* 6. Cookies und Webanalyse */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">6. Cookies und Webanalyse</h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Um den Besuch unserer Website attraktiv zu gestalten und die Nutzung bestimmter Funktionen zu
                ermöglichen, verwenden wir auf verschiedenen Seiten sogenannte Cookies. Dies dient der Wahrung unserer
                im Rahmen einer Interessensabwägung überwiegenden berechtigten Interessen an einer optimierten
                Darstellung unseres Angebots gemäß Art. 6 Abs. 1 S. 1 lit. f DSGVO. Einige der von uns verwendeten
                Cookies werden nach Ende der Browser-Sitzung gelöscht (Sitzungs-Cookies). Andere verbleiben auf Ihrem
                Endgerät (persistente Cookies) und ermöglichen uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.
              </p>
              <p>
                <strong>Einsatz von Google (Universal) Analytics zur Webanalyse:</strong> Soweit Sie hierzu Ihre
                Einwilligung nach Art. 6 Abs. 1 S. 1 lit. a DSGVO erteilt haben, setzt diese Website zum Zweck der
                Webseitenanalyse Google (Universal) Analytics ein (Google Ireland Limited). Die automatisch erhobenen
                Informationen werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.
                Durch die Aktivierung der IP-Anonymisierung wird Ihre IP-Adresse zuvor gekürzt. Sie können Ihre
                Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, z. B. über ein Browser-Plugin oder einen
                Opt-Out-Link.
              </p>
            </div>
          </section>

          {/* 7. Online-Marketing */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">7. Online-Marketing</h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Unsere Website verwendet verschiedene Online-Marketing-Dienste wie Google AdSense, Google Ads
                Remarketing oder Microsoft Advertising, sofern Sie uns hierzu Ihre Einwilligung erteilen (Art. 6 Abs. 1
                S. 1 lit. a DSGVO). Dabei können Cookies gesetzt werden, die eine interessenbasierte Werbung ermöglichen.
                Nähere Informationen zum Opt-Out finden Sie in den Einstellungen der jeweiligen Dienste.
              </p>
            </div>
          </section>

          {/* 8. Social Media */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">8. Social Media</h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Auf unserer Website werden Social Buttons (z. B. von Facebook, Twitter, Instagram) verwendet. Diese
                dienen der Wahrung unserer im Rahmen einer Interessensabwägung überwiegenden berechtigten Interessen an
                einer optimalen Vermarktung unseres Angebots gemäß Art. 6 Abs. 1 S. 1 lit. f DSGVO. Um Ihre Daten beim
                Besuch unserer Website zu schützen, sind die Buttons lediglich über die sog. „Shariff-Lösung“ eingebunden.
                Daher wird noch keine Verbindung zu den Servern des jeweiligen Anbieters hergestellt, wenn Sie unsere
                Seite besuchen. Erst wenn Sie auf den Button klicken, öffnet sich die Seite des jeweiligen
                Diensteanbieters.
              </p>
              <p>
                Bitte beachten Sie auch unsere Onlinepräsenzen auf Facebook, Twitter, Youtube, Instagram, Pinterest,
                Xing, LinkedIn usw. Bei dem Besuch unserer Onlinepräsenzen können Ihre Daten für Marktforschungs- und
                Werbezwecke automatisch erhoben und gespeichert werden (Art. 6 Abs. 1 lit. f DSGVO). Weitere
                Informationen entnehmen Sie bitte den Datenschutzhinweisen der jeweiligen Plattformbetreiber.
              </p>
            </div>
          </section>

          {/* 9. Versand von Bewertungserinnerungen per E-Mail */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">
              9. Versand von Bewertungserinnerungen per E-Mail
            </h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Sofern Sie uns hierzu während oder nach Ihrer Bestellung Ihre ausdrückliche Einwilligung gemäß Art. 6
                Abs. 1 S. 1 lit. a DSGVO erteilt haben, verwenden wir Ihre E-Mail-Adresse zur Erinnerung an die Abgabe
                einer Bewertung Ihrer Bestellung über ein von uns eingesetztes Bewertungssystem. Diese Einwilligung kann
                jederzeit durch eine Nachricht an die unten beschriebene Kontaktmöglichkeit widerrufen werden.
              </p>
            </div>
          </section>

          {/* 10. Widerspruchsrecht */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">10. Widerspruchsrecht</h2>
            <div className="text-sm sm:text-base space-y-4">
              <p>
                Soweit wir zur Wahrung unserer im Rahmen einer Interessensabwägung überwiegenden berechtigten Interessen
                personenbezogene Daten wie oben erläutert verarbeiten, können Sie dieser Verarbeitung mit Wirkung für die
                Zukunft widersprechen. Erfolgt die Verarbeitung zu Zwecken des Direktmarketings, können Sie dieses Recht
                jederzeit ausüben. Soweit die Verarbeitung zu anderen Zwecken erfolgt, steht Ihnen ein Widerspruchsrecht
                nur bei Vorliegen von Gründen zu, die sich aus Ihrer besonderen Situation ergeben.
              </p>
              <p>
                Nach Ausübung Ihres Widerspruchsrechts werden wir Ihre personenbezogenen Daten nicht weiter zu diesen
                Zwecken verarbeiten, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung
                nachweisen oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von
                Rechtsansprüchen.
              </p>
            </div>
          </section>

          {/* 11. Kontaktmöglichkeiten und Ihre Rechte */}
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
                  Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten wenden Sie sich bitte
                  an:<br />
                  <br />
                  Orhan Yilmaz
                  <br />
                  Fischenzstraße 6d
                  <br />
                  78462 Konstanz
                  <br />
                  Deutschland
                  <br />
                  Telefon: +49 176 62915092
                  <br />
                  E-Mail: info@obey24.de
                </p>
              </div>
            </div>
          </section>

          {/* 12. ULOCAT – Nutzung von Drittanbieterdiensten */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">12. ULOCAT – Nutzung von Drittanbieterdiensten</h2>
            <div className="text-sm sm:text-base space-y-4">
              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">Google Analytics (Firebase)</h3>
              <p>
                Wir verwenden in unserer mobilen App „ULOCAT“ den Analysedienst „Google Analytics for Firebase“ (Google
                Analytics). Weitere Details zur Datenübermittlung, Zweck und Rechtsgrundlage siehe oben oder in der App
                selbst.
              </p>

              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">Google AdMob</h3>
              <p>
                Unsere App bindet Werbeanzeigen über den Dienst „Google AdMob“ ein. Auch hier können Daten in die USA
                übertragen werden. Details zur Einwilligung und zum Widerruf finden Sie in den App-Einstellungen oder in
                den Geräteeinstellungen (Limit Ad Tracking).
              </p>

              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">OpenAI API</h3>
              <p>
                Wir nutzen Services der OpenAI, Inc., um KI-Funktionen (z. B. Chatfunktionen) anzubieten. Ihre Eingaben
                können an OpenAI-Server in den USA übertragen werden. Bitte beachten Sie, dass Sie keine sensiblen Daten
                eingeben sollten.
              </p>

              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">ElevenLabs API</h3>
              <p>
                Für Text-to-Speech-Funktionen binden wir Services der ElevenLabs, Inc. ein. Auch hierbei können Daten
                (Text/Audiodaten) an Server in den USA übertragen werden.
              </p>

              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">Google Gemini</h3>
              <p>
                Wir nutzen ggf. Funktionen des KI-Systems „Google Gemini“ (Google Ireland Limited). Bei Nutzung werden
                relevante Eingaben an Google-Server übermittelt und verarbeitet.
              </p>

              <p className="mt-4">
                Die Datenübermittlung in die USA erfolgt auf Grundlage von Einwilligungen (Art. 6 Abs. 1 lit. a DSGVO)
                oder gegebenenfalls Standardvertragsklauseln. Weitere Informationen zum Opt-Out oder Widerruf finden Sie
                in den App-Einstellungen oder unter „Kontaktmöglichkeiten und Ihre Rechte“.
              </p>
            </div>
          </section>
        </div>

        {/* Zurück zur Startseite */}
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
