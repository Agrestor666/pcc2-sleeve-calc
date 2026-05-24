/**
 * Help modal content — symbol glossary and technical reference (EN / PL / FR / PT).
 * Loaded before i18n.js; exposes buildHelpModalHtml(lang).
 */

const HELP_I18N = {
    en: {
        groups: {
            pressure: "Pressure & temperature",
            b31: "ASME B31.3 design factors",
            geometry: "Geometry & defect size",
            thickness: "Wall thickness quantities",
            project: "Project reference"
        },
        sections: {
            overviewTitle: "Purpose",
            overview: `<p>Engineering calculator for the minimum wall thickness of a <strong>Type B full-encirclement repair sleeve</strong> per <strong>ASME PCC-2 Article 2.6</strong>, using pressure-design rules from <strong>ASME B31.3-2024</strong> (<span id="helpAppVersion"></span>).</p>
<p class="help-lead">The sleeve is designed for <strong>100% of design pressure</strong> with <strong>no credit</strong> for the remaining carrier-pipe wall.</p>`,
            codeTitle: "Calculation path",
            codeList: `<ul class="help-list">
<li><strong>P &lt; 690 bar</strong> — ASME B31.3 <strong>Chapter II</strong>, Barlow-type formula with <strong>S</strong> from <strong>Table A-1</strong>, coefficients <strong>Y</strong> and <strong>E</strong>.</li>
<li><strong>P ≥ 690 bar</strong> — <strong>Chapter IX</strong>, Eq. (34a) with <strong>S</strong> from <strong>Table K-1</strong>.</li>
<li><strong>D</strong> = OD + 2·GAP + 2·THK (sleeve outside diameter); <strong>L</strong> = s + 100 mm.</li>
</ul>`,
            flowTitle: "Thickness workflow",
            flow: `<ol class="help-flow">
<li><strong>t<sub>pressure</sub></strong> — from B31.3 pressure design (Ch. II or IX).</li>
<li><strong>t<sub>calculated</sub></strong> = t<sub>pressure</sub> + <strong>CA</strong>.</li>
<li><strong>Mill tolerance</strong> on sleeve <strong>D</strong>: t after mill = t<sub>calculated</sub> / (1 − f).</li>
<li><strong>TR floor</strong> from pipe <strong>OD</strong> (bracket to adjacent table nominals).</li>
<li><strong>t<sub>required</sub></strong> = max(after mill, TR); compare to assumed sleeve <strong>THK</strong>.</li>
</ol>`,
            typeBTitle: "Type B sleeve",
            typeBCaption: "Conceptual schematic — confirm dimensions and NDE with PCC-2 and project drawings.",
            refsTitle: "Normative & project sources",
            refs: `<ul class="help-list help-list--compact">
<li><strong>ASME PCC-2</strong> — repair of pressure equipment and piping (Art. 2.6, Type B sleeves).</li>
<li><strong>ASME B31.3-2024</strong> — Tables A-1 / K-1 (SI), §304.1.2, Table 304.1.1 (<strong>Y</strong>), joint efficiency (<strong>E</strong>).</li>
<li><strong>Totalenergies</strong> wall-thickness sheet — mill tolerance defaults; <strong>GS-EP-PVV-112 §5.2.2.3</strong> — <strong>TR</strong>.</li>
<li>Legacy AutoCAD tool: <a href="https://github.com/Agrestor666/ASME_PCC_2" target="_blank" rel="noopener">ASME_PCC_2</a>.</li>
</ul>`,
            disclaimer: "Engineering aid only. Verify code edition, material data, joint category, NDE, and project specifications before formal submission.",
            glossaryTitle: "Symbol glossary",
            glossaryIntro: "Definitions aligned with ASME B31.3 / PCC-2 terminology and project practice. “Source” is the authoritative basis; “In this app” describes how the field is used here.",
            labelSource: "Source",
            labelRole: "In this app"
        },
        symbols: [
            { group: "pressure", sym: "P (MAWP)", name: "Design pressure / MAWP", def: "Internal design gage pressure used for thickness design of the sleeve.", source: "ASME B31.3 — design pressure (process conditions); MAWP is plant terminology for the maximum allowable working pressure at the design temperature.", role: "Input as MAWP / Design Pressure [bar]. Governs t<sub>pressure</sub> and selects Chapter II (&lt; 690 bar) vs Chapter IX (≥ 690 bar)." },
            { group: "pressure", sym: "Tmax", name: "Design temperature", def: "Metal design temperature for the sleeve material at the pressure condition being evaluated.", source: "ASME B31.3 — design temperature (line list / process).", role: "Input [°C]. Used to interpolate allowable stress S from Table A-1 or K-1." },
            { group: "b31", sym: "S", name: "Allowable stress", def: "Maximum allowable stress value for the sleeve material at Tmax, used in the pressure-thickness formula.", source: "ASME B31.3-2024 Appendix A, Table A-1 (SI, °C / MPa) for P &lt; 690 bar; Appendix K, Table K-1 for high-pressure Chapter IX. Converted in-app: 1 MPa = 10 bar.", role: "Looked up from material + Tmax. Displayed in MPa and bar in the log." },
            { group: "b31", sym: "Y", name: "Temperature coefficient", def: "Coefficient in the B31.3 cylindrical shell formula relating design pressure, diameter, and allowable stress (Table 304.1.1).", source: "ASME B31.3 Table 304.1.1 — function of material class and temperature (e.g. 0.4 for ferritic steels ≤ 482 °C).", role: "Input [—], default 0.4. Used only in Chapter II calculation." },
            { group: "b31", sym: "E", name: "Weld joint efficiency", def: "Joint efficiency factor for the sleeve longitudinal / girth welds in the Chapter II formula.", source: "ASME B31.3 §302.3 / Table A-1B and project NDE (e.g. E = 1.00 for 100% RT; E = 0.80 for reduced examination).", role: "Selectable 0.80 (default) or 1.00. Lower E increases required thickness." },
            { group: "geometry", sym: "OD", name: "Pipe outside diameter", def: "Outside diameter of the carrier (parent) pipe, typically per ASME B36.10M for the nominal size.", source: "Piping datasheet / isometric; ASME B36.10M standard OD.", role: "Input [mm]. Used in D = OD + 2·GAP + 2·THK and for TR bracketing (retirement thickness table)." },
            { group: "geometry", sym: "D", name: "Sleeve outside diameter", def: "Outside diameter of the repair sleeve as installed (including both sleeve walls and annular gap).", source: "Derived: ASME PCC-2 / project mechanical fit-up.", role: "Computed: D = OD + 2·GAP + 2·THK. Used in pressure formulas and mill-tolerance band (vs 457.2 mm)." },
            { group: "geometry", sym: "GAP", name: "Annular radial clearance", def: "Radial gap between the sleeve bore and the pipe OD (each side).", source: "Project fit-up / installation procedure.", role: "Input [mm]. Increases D and therefore required thickness." },
            { group: "geometry", sym: "THK", name: "Assumed sleeve thickness", def: "Wall thickness of the sleeve assumed for verification (purchase / fabrication target).", source: "Engineering estimate or plate schedule.", role: "Input [mm]. Compared to final t<sub>required</sub>; alert if THK is too thin." },
            { group: "geometry", sym: "s, c", name: "Defect extent", def: "Longitudinal (s) and circumferential (c) dimensions of the defect or thinning under the sleeve.", source: "NDE report / fitness-for-service assessment.", role: "Inputs [mm]. s drives sleeve length L = s + 100 mm." },
            { group: "geometry", sym: "L", name: "Sleeve length", def: "Axial length of the full-encirclement sleeve covering the defect region.", source: "ASME PCC-2 Art. 2.6 / project repair procedure.", role: "Output: L = s + 100 mm (application rule)." },
            { group: "thickness", sym: "CA", name: "Corrosion allowance", def: "Additional thickness added to the pressure design thickness for future metal loss.", source: "ASME B31.3 §302.2.4 and project corrosion specification.", role: "Input [mm]. t<sub>calculated</sub> = t<sub>pressure</sub> + CA." },
            { group: "thickness", sym: "t<sub>pressure</sub>", name: "Pressure design thickness", def: "Thickness required to contain internal pressure per B31.3 §304.1.2 (before corrosion allowance).", source: "ASME B31.3 Chapter II or IX formula.", role: "Intermediate result in the log." },
            { group: "thickness", sym: "t<sub>calculated</sub>", name: "Calculated thickness", def: "Pressure design thickness plus corrosion allowance (and other mechanical allowances if applicable).", source: "Totalenergies / B31.3 wall-thickness sheet terminology.", role: "Displayed before mill tolerance." },
            { group: "thickness", sym: "Mill (f)", name: "Mill tolerance (under-thickness)", def: "Manufacturing tolerance: minimum delivered wall may be (1 − f) of nominal. Ordering thickness must compensate: t<sub>order</sub> = t<sub>calculated</sub> / (1 − f).", source: "Totalenergies internal wall-thickness calculator; typical pipe mill practice (12.5% &lt; NPS 18, 8% ≥ NPS 18 on sleeve D).", role: "Editable [%] and D break [mm]. Applied to sleeve D, not pipe OD." },
            { group: "thickness", sym: "TR", name: "Retirement thickness", def: "Minimum wall thickness below which the pipe must be replaced or repaired per operator specification (end-of-life limit).", source: "GS-EP-PVV-112 §5.2.2.3; column TR in Totalenergies B31.3 sheet (by nominal pipe OD / NPS).", role: "Bracket pipe OD to two adjacent table nominals; t<sub>required</sub> ≥ max(TR). Log shows Passed/Failed per nominal." },
            { group: "thickness", sym: "t<sub>required</sub>", name: "Required sleeve thickness", def: "Final minimum thickness after mill tolerance and TR floor — the value to meet in specification.", source: "Application rule: max(after mill, TR<sub>lower</sub>, TR<sub>upper</sub>).", role: "Primary output; compared to THK." },
            { group: "project", sym: "PAZ / AVIS", name: "Work order references", def: "Project document numbers for traceability of the calculation (permit / notification IDs).", source: "Project QA / permit system (operator-specific).", role: "Optional text fields; printed in the calculation log header." }
        ]
    },
    pl: {
        groups: {
            pressure: "Ciśnienie i temperatura",
            b31: "Współczynniki ASME B31.3",
            geometry: "Geometria i wymiar usterki",
            thickness: "Wielkości grubości ścianki",
            project: "Odniesienia projektowe"
        },
        sections: {
            overviewTitle: "Przeznaczenie",
            overview: `<p>Kalkulator grubości <strong>pełnoobwodowego rękawa naprawczego typu B</strong> wg <strong>ASME PCC-2 art. 2.6</strong>, z obliczeniem ciśnieniowym <strong>ASME B31.3-2024</strong> (<span id="helpAppVersion"></span>).</p>
<p class="help-lead">Rękaw na <strong>100% ciśnienia projektowego</strong> — <strong>bez kredytowania</strong> pozostałej ścianki rury.</p>`,
            codeTitle: "Ścieżka obliczeń",
            codeList: `<ul class="help-list">
<li><strong>P &lt; 690 bar</strong> — <strong>rozdz. II</strong> B31.3, wzór typu Barlowa, <strong>S</strong> z <strong>tabeli A-1</strong>, współczynniki <strong>Y</strong> i <strong>E</strong>.</li>
<li><strong>P ≥ 690 bar</strong> — <strong>rozdz. IX</strong>, wzór (34a), <strong>S</strong> z <strong>tabeli K-1</strong>.</li>
<li><strong>D</strong> = OD + 2·GAP + 2·THK; <strong>L</strong> = s + 100 mm.</li>
</ul>`,
            flowTitle: "Przebieg grubości",
            flow: `<ol class="help-flow">
<li><strong>t<sub>pressure</sub></strong> — z obliczenia ciśnieniowego B31.3 (rozdz. II lub IX).</li>
<li><strong>t<sub>calculated</sub></strong> = t<sub>pressure</sub> + <strong>CA</strong>.</li>
<li><strong>Tolerancja wytwórni</strong> na <strong>D</strong> rękawa: t po wytwórni = t<sub>calculated</sub> / (1 − f).</li>
<li><strong>Podłoga TR</strong> z <strong>OD</strong> rury (bracket do sąsiednich nominalów).</li>
<li><strong>t<sub>required</sub></strong> = max(po wytwórni, TR); porównanie z <strong>THK</strong>.</li>
</ol>`,
            typeBTitle: "Rękaw typu B",
            typeBCaption: "Schemat orientacyjny — wymiary i NDE potwierdź z PCC-2 i rysunkiem projektu.",
            refsTitle: "Źródła normowe i projektowe",
            refs: `<ul class="help-list help-list--compact">
<li><strong>ASME PCC-2</strong> — naprawy (art. 2.6, rękawy typu B).</li>
<li><strong>ASME B31.3-2024</strong> — tabele A-1 / K-1 (SI), §304.1.2, tabela 304.1.1 (<strong>Y</strong>), sprawność spoiny (<strong>E</strong>).</li>
<li>Arkusz <strong>Totalenergies</strong> — tolerancja wytwórni; <strong>GS-EP-PVV-112 §5.2.2.3</strong> — <strong>TR</strong>.</li>
<li>AutoCAD: <a href="https://github.com/Agrestor666/ASME_PCC_2" target="_blank" rel="noopener">ASME_PCC_2</a>.</li>
</ul>`,
            disclaimer: "Wsparcie inżynierskie. Przed użyciem formalnym zweryfikuj wydanie normy, dane materiałowe, kategorię spoiny, NDE i specyfikację projektu.",
            glossaryTitle: "Słownik symbolów",
            glossaryIntro: "Definicje zgodne z terminologią ASME B31.3 / PCC-2 i praktyką projektu. „Źródło” — podstawa normatywna; „W aplikacji” — zastosowanie w tym narzędziu.",
            labelSource: "Źródło",
            labelRole: "W aplikacji"
        },
        symbols: [
            { group: "pressure", sym: "P (MAWP)", name: "Ciśnienie projektowe / MAWP", def: "Ciśnienie manometryczne projektowe do obliczenia grubości rękawa.", source: "ASME B31.3 — ciśnienie projektowe (warunki procesu); MAWP — maksymalne dopuszczalne ciśnienie robocze instalacji.", role: "Pole MAWP / ciśnienie P [bar]. Wyznacza t<sub>pressure</sub> i wybór rozdz. II (&lt; 690 bar) lub IX (≥ 690 bar)." },
            { group: "pressure", sym: "Tmax", name: "Temperatura projektowa", def: "Temperatura metalu projektowa materiału rękawa dla rozpatrywanego ciśnienia.", source: "ASME B31.3 — temperatura projektowa (wykaz linii / proces).", role: "Wejście [°C]. Interpolacja S z tabeli A-1 lub K-1." },
            { group: "b31", sym: "S", name: "Naprężenie dopuszczalne", def: "Dopuszczalne naprężenie materiału rękawa przy Tmax w wzorze grubości.", source: "ASME B31.3-2024 zał. A tabela A-1 (SI) dla P &lt; 690 bar; zał. K tabela K-1 dla rozdz. IX. W aplikacji: 1 MPa = 10 bar.", role: "Z materiału i Tmax. W logu MPa i bar." },
            { group: "b31", sym: "Y", name: "Współczynnik temperaturowy Y", def: "Współczynnik we wzorze B31.3 na cylindryczną ściankę (tabela 304.1.1).", source: "ASME B31.3 tabela 304.1.1 — klasa materiału i temperatura (np. 0,4 dla stali ferrytycznych ≤ 482 °C).", role: "Wejście [—], domyślnie 0,4. Tylko rozdział II." },
            { group: "b31", sym: "E", name: "Sprawność spoiny E", def: "Współczynnik sprawności spoin podłużnych / obwodowych rękawa we wzorze rozdz. II.", source: "ASME B31.3 §302.3 / tabela A-1B i NDE projektu (np. E = 1,00 przy 100% RT; E = 0,80 przy ograniczonym badaniu).", role: "Wybór 0,80 (domyślnie) lub 1,00. Niższe E zwiększa grubość." },
            { group: "geometry", sym: "OD", name: "Średnica zewnętrzna rury", def: "Średnica zewnętrzna rury nośnej, zwykle wg ASME B36.10M dla danego NPS.", source: "Karta linii / izometryk; standardowe OD B36.10M.", role: "Wejście [mm]. D = OD + 2·GAP + 2·THK oraz bracket TR." },
            { group: "geometry", sym: "D", name: "Średnica zewnętrzna rękawa", def: "Średnica zewnętrzna zamontowanego rękawa (obie ścianki + szczelina).", source: "PCC-2 / dopasowanie mechaniczne projektu.", role: "Obliczane: D = OD + 2·GAP + 2·THK. Wzór ciśnieniowy i próg tolerancji wytwórni." },
            { group: "geometry", sym: "GAP", name: "Radialna szczelina pierścieniowa", def: "Luz promieniowy między otworem rękawa a OD rury (z każdej strony).", source: "Procedura montażu / projektu.", role: "Wejście [mm]. Zwiększa D i wymaganą grubość." },
            { group: "geometry", sym: "THK", name: "Przyjęta grubość rękawa", def: "Grubość ścianki rękawa przyjęta do weryfikacji (zakup / wykonanie).", source: "Oszacowanie lub harmonogram płyt.", role: "Wejście [mm]. Porównanie z końcowym t<sub>required</sub>." },
            { group: "geometry", sym: "s, c", name: "Rozmiar usterki", def: "Wymiar podłużny (s) i obwodowy (c) usterki lub przerzedzenia.", source: "Raport NDE / ocena stanu.", role: "Wejścia [mm]. s → L = s + 100 mm." },
            { group: "geometry", sym: "L", name: "Długość rękawa", def: "Długość osiowa rękawa obejmująca strefę usterki.", source: "PCC-2 art. 2.6 / procedura naprawy.", role: "Wynik: L = s + 100 mm." },
            { group: "thickness", sym: "CA", name: "Naddatek korozyjny", def: "Dodatek na przyszłą korozję do grubości ciśnieniowej.", source: "ASME B31.3 §302.2.4 i specyfikacja korozji projektu.", role: "Wejście [mm]. t<sub>calculated</sub> = t<sub>pressure</sub> + CA." },
            { group: "thickness", sym: "t<sub>pressure</sub>", name: "Grubość ciśnieniowa", def: "Grubość do przeniesienia ciśnienia wg §304.1.2 (przed CA).", source: "Wzór B31.3 rozdz. II lub IX.", role: "Wynik pośredni w logu." },
            { group: "thickness", sym: "t<sub>calculated</sub>", name: "Grubość obliczona", def: "Grubość ciśnieniowa plus naddatek korozyjny.", source: "Terminologia arkusza Totalenergies / B31.3.", role: "Wyświetlana przed tolerancją wytwórni." },
            { group: "thickness", sym: "Mill (f)", name: "Tolerancja wytwórni", def: "Tolerancja producenta: minimalna grubość dostawy może być (1−f) × nominalna. Zamówienie: t = t<sub>calculated</sub> / (1 − f).", source: "Kalkulator Totalenergies; typowo 12,5% / 8% wg średnicy rękawa D.", role: "Edytowalne [%] i próg D [mm]. Na D rękawa, nie OD rury." },
            { group: "thickness", sym: "TR", name: "Grubość emerytalna", def: "Minimalna grubość, poniżej której rura wymaga wymiany lub naprawy wg specyfikacji operatora.", source: "GS-EP-PVV-112 §5.2.2.3; kolumna TR arkusza Totalenergies (NPS / OD).", role: "Bracket OD rury; t<sub>required</sub> ≥ max(TR). Log: OK/Błąd per nominal." },
            { group: "thickness", sym: "t<sub>required</sub>", name: "Wymagana grubość rękawa", def: "Końcowa minimum po wytwórni i TR — wartość do specyfikacji.", source: "max(po wytwórni, TR dolny, TR górny).", role: "Główny wynik; porównanie z THK." },
            { group: "project", sym: "PAZ / AVIS", name: "Numery zleceń", def: "Identyfikatory dokumentów projektu dla śledzenia obliczenia.", source: "System QA / zezwoleń operatora.", role: "Pola tekstowe w nagłówku logu." }
        ]
    },
    fr: {
        groups: {
            pressure: "Pression & température",
            b31: "Coefficients ASME B31.3",
            geometry: "Géométrie & défaut",
            thickness: "Épaisseurs de paroi",
            project: "Références projet"
        },
        sections: {
            overviewTitle: "Objectif",
            overview: `<p>Calculateur d&apos;épaisseur minimale d&apos;un <strong>manchon de réparation type B</strong> (pleine circonférence) selon <strong>ASME PCC-2 art. 2.6</strong> et <strong>ASME B31.3-2024</strong> (<span id="helpAppVersion"></span>).</p>
<p class="help-lead">Manchon à <strong>100 % de la pression de conception</strong> — <strong>sans crédit</strong> de la paroi restante du tuyau.</p>`,
            codeTitle: "Parcours de calcul",
            codeList: `<ul class="help-list">
<li><strong>P &lt; 690 bar</strong> — <strong>ch. II</strong>, formule type Barlow, <strong>S</strong> table <strong>A-1</strong>, <strong>Y</strong> et <strong>E</strong>.</li>
<li><strong>P ≥ 690 bar</strong> — <strong>ch. IX</strong>, éq. (34a), <strong>S</strong> table <strong>K-1</strong>.</li>
<li><strong>D</strong> = OD + 2·GAP + 2·THK ; <strong>L</strong> = s + 100 mm.</li>
</ul>`,
            flowTitle: "Enchaînement des épaisseurs",
            flow: `<ol class="help-flow">
<li><strong>t<sub>pressure</sub></strong> — calcul pression B31.3 (ch. II ou IX).</li>
<li><strong>t<sub>calculated</sub></strong> = t<sub>pressure</sub> + <strong>CA</strong>.</li>
<li><strong>Tolérance de laminage</strong> sur <strong>D</strong> manchon : t = t<sub>calculated</sub> / (1 − f).</li>
<li><strong>Plancher TR</strong> selon <strong>OD</strong> tuyau (nominaux adjacents).</li>
<li><strong>t<sub>required</sub></strong> = max(après laminage, TR) ; comparer au <strong>THK</strong>.</li>
</ol>`,
            typeBTitle: "Manchon type B",
            typeBCaption: "Schéma conceptuel — confirmer cotes et END avec PCC-2 et plans projet.",
            refsTitle: "Sources normatives & projet",
            refs: `<ul class="help-list help-list--compact">
<li><strong>ASME PCC-2</strong> — réparations (art. 2.6, manchons type B).</li>
<li><strong>ASME B31.3-2024</strong> — tables A-1 / K-1 (SI), §304.1.2, table 304.1.1 (<strong>Y</strong>), efficacité soudure (<strong>E</strong>).</li>
<li>Fiche <strong>Totalenergies</strong> — laminage ; <strong>GS-EP-PVV-112 §5.2.2.3</strong> — <strong>TR</strong>.</li>
<li>AutoCAD : <a href="https://github.com/Agrestor666/ASME_PCC_2" target="_blank" rel="noopener">ASME_PCC_2</a>.</li>
</ul>`,
            disclaimer: "Aide à l'ingénierie uniquement. Vérifier édition du code, matériau, catégorie de joint, END et spécifications projet avant usage formel.",
            glossaryTitle: "Glossaire des symboles",
            glossaryIntro: "Définitions alignées sur ASME B31.3 / PCC-2. « Source » = base normative ; « Dans l'application » = usage ici.",
            labelSource: "Source",
            labelRole: "Dans l'application"
        },
        symbols: [
            { group: "pressure", sym: "P (MAWP)", name: "Pression de conception / MAWP", def: "Pression manométrique de conception pour l'épaisseur du manchon.", source: "ASME B31.3 — pression de conception ; MAWP = pression maximale de service admissible.", role: "Saisie P [bar]. Détermine t<sub>pressure</sub> et ch. II (&lt; 690 bar) vs IX (≥ 690 bar)." },
            { group: "pressure", sym: "Tmax", name: "Température de conception", def: "Température métal de conception du manchon à la pression considérée.", source: "ASME B31.3 — température de conception (ligne / process).", role: "Saisie [°C]. Interpolation de S (tables A-1 ou K-1)." },
            { group: "b31", sym: "S", name: "Contrainte admissible", def: "Contrainte admissible du matériau du manchon à Tmax dans la formule d'épaisseur.", source: "ASME B31.3-2024 ann. A table A-1 (SI) ; ann. K table K-1 (haute pression). 1 MPa = 10 bar dans l'app.", role: "Matériau + Tmax. Journal en MPa et bar." },
            { group: "b31", sym: "Y", name: "Coefficient Y", def: "Coefficient de la formule B31.3 pour coque cylindrique (table 304.1.1).", source: "ASME B31.3 table 304.1.1 — classe de matériau et température (ex. 0,4 aciers ferritiques ≤ 482 °C).", role: "Saisie [—], défaut 0,4. Chapitre II seulement." },
            { group: "b31", sym: "E", name: "Efficacité de joint E", def: "Facteur d'efficacité des soudures longitudinales / circonférentielles du manchon (ch. II).", source: "ASME B31.3 §302.3 / table A-1B et END projet (E = 1,00 si RT 100 % ; E = 0,80 sinon).", role: "0,80 (défaut) ou 1,00. E plus bas → épaisseur plus grande." },
            { group: "geometry", sym: "OD", name: "Diamètre extérieur tuyau", def: "Diamètre extérieur du tuyau porteur, en général selon ASME B36.10M.", source: "Fiche ligne / isométrique ; OD normalisés B36.10M.", role: "Saisie [mm]. D et bracket TR." },
            { group: "geometry", sym: "D", name: "Diamètre extérieur manchon", def: "Diamètre extérieur du manchon en place (deux parois + jeu annulaire).", source: "PCC-2 / ajustement mécanique projet.", role: "Calcul : D = OD + 2·GAP + 2·THK. Formule pression et seuil laminage." },
            { group: "geometry", sym: "GAP", name: "Jeu radial annulaire", def: "Clearance radiale entre l'alésage du manchon et l'OD du tuyau (chaque côté).", source: "Procédure de pose / projet.", role: "Saisie [mm]. Augmente D et l'épaisseur requise." },
            { group: "geometry", sym: "THK", name: "Épaisseur supposée du manchon", def: "Épaisseur de paroi retenue pour vérification (achat / fabrication).", source: "Estimation ou nuancier tôles.", role: "Saisie [mm]. Comparée au t<sub>required</sub> final." },
            { group: "geometry", sym: "s, c", name: "Étendue du défaut", def: "Dimensions longitudinale (s) et circonférentielle (c) du défaut.", source: "Rapport END / fit-for-service.", role: "Saisies [mm]. s → L = s + 100 mm." },
            { group: "geometry", sym: "L", name: "Longueur du manchon", def: "Longueur axiale couvrant la zone de défaut.", source: "PCC-2 art. 2.6 / procédure de réparation.", role: "Sortie : L = s + 100 mm." },
            { group: "thickness", sym: "CA", name: "Surépaisseur de corrosion", def: "Épaisseur ajoutée pour perte de métal future.", source: "ASME B31.3 §302.2.4 et spec corrosion projet.", role: "Saisie [mm]. t<sub>calculated</sub> = t<sub>pressure</sub> + CA." },
            { group: "thickness", sym: "t<sub>pressure</sub>", name: "Épaisseur de conception pression", def: "Épaisseur pour contenir la pression (§304.1.2), avant CA.", source: "Formule B31.3 ch. II ou IX.", role: "Résultat intermédiaire au journal." },
            { group: "thickness", sym: "t<sub>calculated</sub>", name: "Épaisseur calculée", def: "Épaisseur pression + surépaisseur de corrosion.", source: "Terminologie fiche Totalenergies / B31.3.", role: "Affichée avant laminage." },
            { group: "thickness", sym: "Mill (f)", name: "Tolérance de laminage", def: "Tolérance fabricant : paroi minimale ≈ (1−f) × nominale. Commande : t = t<sub>calculated</sub> / (1 − f).", source: "Calculateur Totalenergies ; 12,5 % / 8 % selon D manchon.", role: "Modifiable [%] et seuil D. Sur D manchon, pas OD tuyau." },
            { group: "thickness", sym: "TR", name: "Épaisseur de retraite", def: "Épaisseur minimale en dessous de laquelle le tuyau doit être remplacé ou réparé (fin de vie).", source: "GS-EP-PVV-112 §5.2.2.3 ; colonne TR fiche Totalenergies.", role: "Bracket OD ; t<sub>required</sub> ≥ max(TR). Journal OK/échec par nominal." },
            { group: "thickness", sym: "t<sub>required</sub>", name: "Épaisseur requise du manchon", def: "Épaisseur minimale finale après laminage et TR.", source: "max(après laminage, TR inf, TR sup).", role: "Sortie principale ; comparée au THK." },
            { group: "project", sym: "PAZ / AVIS", name: "Références dossier", def: "Numéros de documents projet pour traçabilité du calcul.", source: "Système QA / permis (opérateur).", role: "Champs texte en tête du journal." }
        ]
    },
    pt: {
        groups: {
            pressure: "Pressão & temperatura",
            b31: "Fatores ASME B31.3",
            geometry: "Geometria & defeito",
            thickness: "Espessuras de parede",
            project: "Referências de projeto"
        },
        sections: {
            overviewTitle: "Objetivo",
            overview: `<p>Calculadora de espessura mínima de <strong>manga de reparação tipo B</strong> (circunferência completa) segundo <strong>ASME PCC-2 art. 2.6</strong> e <strong>ASME B31.3-2024</strong> (<span id="helpAppVersion"></span>).</p>
<p class="help-lead">Manga para <strong>100% da pressão de projeto</strong> — <strong>sem crédito</strong> pela parede restante do tubo.</p>`,
            codeTitle: "Percurso de cálculo",
            codeList: `<ul class="help-list">
<li><strong>P &lt; 690 bar</strong> — <strong>cap. II</strong>, fórmula tipo Barlow, <strong>S</strong> tabela <strong>A-1</strong>, <strong>Y</strong> e <strong>E</strong>.</li>
<li><strong>P ≥ 690 bar</strong> — <strong>cap. IX</strong>, eq. (34a), <strong>S</strong> tabela <strong>K-1</strong>.</li>
<li><strong>D</strong> = OD + 2·GAP + 2·THK; <strong>L</strong> = s + 100 mm.</li>
</ul>`,
            flowTitle: "Fluxo de espessura",
            flow: `<ol class="help-flow">
<li><strong>t<sub>pressure</sub></strong> — cálculo de pressão B31.3 (cap. II ou IX).</li>
<li><strong>t<sub>calculated</sub></strong> = t<sub>pressure</sub> + <strong>CA</strong>.</li>
<li><strong>Tolerância de laminação</strong> em <strong>D</strong> da manga: t = t<sub>calculated</sub> / (1 − f).</li>
<li><strong>Piso TR</strong> pela <strong>OD</strong> do tubo (nominais adjacentes).</li>
<li><strong>t<sub>required</sub></strong> = max(após laminação, TR); comparar com <strong>THK</strong>.</li>
</ol>`,
            typeBTitle: "Manga tipo B",
            typeBCaption: "Esquema conceptual — confirmar cotas e END com PCC-2 e desenhos do projeto.",
            refsTitle: "Fontes normativas & projeto",
            refs: `<ul class="help-list help-list--compact">
<li><strong>ASME PCC-2</strong> — reparações (art. 2.6, mangas tipo B).</li>
<li><strong>ASME B31.3-2024</strong> — tabelas A-1 / K-1 (SI), §304.1.2, tabela 304.1.1 (<strong>Y</strong>), eficiência de junta (<strong>E</strong>).</li>
<li>Folha <strong>Totalenergies</strong> — laminação; <strong>GS-EP-PVV-112 §5.2.2.3</strong> — <strong>TR</strong>.</li>
<li>AutoCAD: <a href="https://github.com/Agrestor666/ASME_PCC_2" target="_blank" rel="noopener">ASME_PCC_2</a>.</li>
</ul>`,
            disclaimer: "Apoio de engenharia. Verifique edição do código, material, categoria de junta, END e especificação do projeto antes de uso formal.",
            glossaryTitle: "Glossário de símbolos",
            glossaryIntro: "Definições alinhadas à terminologia ASME B31.3 / PCC-2. «Fonte» = base normativa; «Nesta aplicação» = uso aqui.",
            labelSource: "Fonte",
            labelRole: "Nesta aplicação"
        },
        symbols: [
            { group: "pressure", sym: "P (MAWP)", name: "Pressão de projeto / MAWP", def: "Pressão manométrica de projeto para espessura da manga.", source: "ASME B31.3 — pressão de projeto; MAWP = pressão máxima admissível de trabalho.", role: "Entrada P [bar]. Define t<sub>pressure</sub> e cap. II (&lt; 690 bar) vs IX (≥ 690 bar)." },
            { group: "pressure", sym: "Tmax", name: "Temperatura de projeto", def: "Temperatura de metal de projeto do material da manga na pressão considerada.", source: "ASME B31.3 — temperatura de projeto (linha / processo).", role: "Entrada [°C]. Interpolação de S (tabelas A-1 ou K-1)." },
            { group: "b31", sym: "S", name: "Tensão admissível", def: "Tensão admissível do material da manga a Tmax na fórmula de espessura.", source: "ASME B31.3-2024 an. A tabela A-1 (SI); an. K tabela K-1 (alta pressão). 1 MPa = 10 bar na app.", role: "Material + Tmax. Registo em MPa e bar." },
            { group: "b31", sym: "Y", name: "Coeficiente Y", def: "Coeficiente da fórmula B31.3 para casca cilíndrica (tabela 304.1.1).", source: "ASME B31.3 tabela 304.1.1 — classe de material e temperatura (ex. 0,4 aços ferríticos ≤ 482 °C).", role: "Entrada [—], padrão 0,4. Apenas capítulo II." },
            { group: "b31", sym: "E", name: "Eficiência de junta E", def: "Fator de eficiência das soldas longitudinal / circunferencial da manga (cap. II).", source: "ASME B31.3 §302.3 / tabela A-1B e END do projeto (E = 1,00 com RT 100%; E = 0,80 caso contrário).", role: "0,80 (padrão) ou 1,00. E menor → espessura maior." },
            { group: "geometry", sym: "OD", name: "Diâmetro externo do tubo", def: "Diâmetro externo do tubo transportador, em geral segundo ASME B36.10M.", source: "Folha de linha / isométrico; OD normalizados B36.10M.", role: "Entrada [mm]. D e bracket TR." },
            { group: "geometry", sym: "D", name: "Diâmetro externo da manga", def: "Diâmetro externo da manga instalada (duas paredes + folga anular).", source: "PCC-2 / ajuste mecânico do projeto.", role: "Calculado: D = OD + 2·GAP + 2·THK. Fórmula de pressão e limite de laminação." },
            { group: "geometry", sym: "GAP", name: "Folga radial anular", def: "Folga radial entre o furo da manga e a OD do tubo (cada lado).", source: "Procedimento de montagem / projeto.", role: "Entrada [mm]. Aumenta D e a espessura requerida." },
            { group: "geometry", sym: "THK", name: "Espessura assumida da manga", def: "Espessura de parede assumida para verificação (compra / fabrico).", source: "Estimativa ou lista de chapas.", role: "Entrada [mm]. Comparada ao t<sub>required</sub> final." },
            { group: "geometry", sym: "s, c", name: "Extensão do defeito", def: "Dimensões longitudinal (s) e circunferencial (c) do defeito.", source: "Relatório END / fit-for-service.", role: "Entradas [mm]. s → L = s + 100 mm." },
            { group: "geometry", sym: "L", name: "Comprimento da manga", def: "Comprimento axial cobrindo a zona do defeito.", source: "PCC-2 art. 2.6 / procedimento de reparação.", role: "Saída: L = s + 100 mm." },
            { group: "thickness", sym: "CA", name: "Sobrespessura de corrosão", def: "Espessura adicional para perda futura de metal.", source: "ASME B31.3 §302.2.4 e especificação de corrosão.", role: "Entrada [mm]. t<sub>calculated</sub> = t<sub>pressure</sub> + CA." },
            { group: "thickness", sym: "t<sub>pressure</sub>", name: "Espessura de projeto à pressão", def: "Espessura para conter a pressão (§304.1.2), antes da CA.", source: "Fórmula B31.3 cap. II ou IX.", role: "Resultado intermédio no registo." },
            { group: "thickness", sym: "t<sub>calculated</sub>", name: "Espessura calculada", def: "Espessura de pressão + sobrespessura de corrosão.", source: "Terminologia folha Totalenergies / B31.3.", role: "Mostrada antes da laminação." },
            { group: "thickness", sym: "Mill (f)", name: "Tolerância de laminação", def: "Tolerância do fabricante: espessura mínima ≈ (1−f) × nominal. Encomenda: t = t<sub>calculated</sub> / (1 − f).", source: "Calculadora Totalenergies; 12,5% / 8% conforme D da manga.", role: "Editável [%] e limite D. Sobre D da manga, não OD do tubo." },
            { group: "thickness", sym: "TR", name: "Espessura de reforma", def: "Espessura mínima abaixo da qual o tubo deve ser substituído ou reparado (fim de vida).", source: "GS-EP-PVV-112 §5.2.2.3; coluna TR folha Totalenergies.", role: "Bracket OD; t<sub>required</sub> ≥ max(TR). Registo OK/falha por nominal." },
            { group: "thickness", sym: "t<sub>required</sub>", name: "Espessura requerida da manga", def: "Espessura mínima final após laminação e TR.", source: "max(após laminação, TR inf, TR sup).", role: "Saída principal; comparada ao THK." },
            { group: "project", sym: "PAZ / AVIS", name: "Referências de obra", def: "Números de documentos de projeto para rastreabilidade.", source: "Sistema QA / permissões do operador.", role: "Campos de texto no cabeçalho do registo." }
        ]
    }
};

function renderHelpGlossary(c) {
    const order = ["pressure", "b31", "geometry", "thickness", "project"];
    const byGroup = {};
    for (const item of c.symbols) {
        if (!byGroup[item.group]) byGroup[item.group] = [];
        byGroup[item.group].push(item);
    }
    let html = `<p class="help-glossary-intro">${c.sections.glossaryIntro}</p>`;
    for (const key of order) {
        const items = byGroup[key];
        if (!items?.length) continue;
        html += `<h4 class="help-group-title">${c.groups[key]}</h4><dl class="help-glossary">`;
        for (const item of items) {
            html += `<dt>${item.sym}</dt><dd>
                <span class="help-term-name">${item.name}</span>
                <p class="help-term-def">${item.def}</p>
                <p class="help-term-meta"><span class="help-meta-label">${c.sections.labelSource}:</span> ${item.source}</p>
                <p class="help-term-meta"><span class="help-meta-label">${c.sections.labelRole}:</span> ${item.role}</p>
            </dd>`;
        }
        html += "</dl>";
    }
    return html;
}

function buildHelpModalHtml(lang) {
    const c = HELP_I18N[lang] || HELP_I18N.en;
    const s = c.sections;
    return `
<section class="modal-section help-section">
<h3>${s.overviewTitle}</h3>
${s.overview}
</section>
<section class="modal-section help-section">
<h3>${s.codeTitle}</h3>
${s.codeList}
</section>
<section class="modal-section help-section help-section--glossary">
<h3>${s.glossaryTitle}</h3>
${renderHelpGlossary(c)}
</section>
<section class="modal-section help-section">
<h3>${s.flowTitle}</h3>
${s.flow}
</section>
<section class="modal-section help-section">
<h3>${s.typeBTitle}</h3>
<figure class="modal-figure"><img src="type-b-sleeve-diagram.png" alt="" width="800" height="450" loading="lazy">
<figcaption>${s.typeBCaption}</figcaption></figure>
</section>
<section class="modal-section help-section">
<h3>${s.refsTitle}</h3>
${s.refs}
<p class="modal-disclaimer">${s.disclaimer}</p>
</section>`;
}
