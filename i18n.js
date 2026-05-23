/**
 * UI / log / toast / help translations — en (default), pl, fr, pt
 */
const I18N_LOCALES = ["en", "pl", "fr", "pt"];

const I18N = {
    en: {
        meta: { title: "ASME PCC-2 — Sleeve Type B Calculator", htmlLang: "en" },
        ui: {
            headerTitle: "ASME PCC-2 — Sleeve Type B Thickness Calculator",
            badge: "ASME B31.3",
            helpTitle: "Help — PCC-2, Type B sleeve, and this application",
            helpAria: "Open help",
            themeLight: "Switch to daylight theme",
            themeDark: "Switch to dark theme",
            langAria: "Language",
            reference: "Reference",
            pazLabel: "PAZ Number (PAZ)",
            avisLabel: "AVIS Number (AVIS)",
            pazPh: "e.g. PAZ-2026-001",
            avisPh: "e.g. AVIS-12345",
            inputData: "Input Data",
            defectSize: "Size of Defect",
            longitudinal: "Longitudinal s [mm]",
            circumferential: "Circumferential c [mm]",
            sleeveParams: "Predicted Sleeve Parameters and parent pipe details",
            thk: "Thickness (sleeve) THK [mm]",
            od: "Outside Diameter (pipe) OD [mm]",
            gap: "GAP [mm]",
            gapNote: "Radial clearance between the sleeve bore and the carrier pipe outside diameter (annular gap, each side).",
            ca: "Corrosion allowance CA [mm]",
            material: "Material",
            processData: "Process Data",
            mawp: "MAWP / Design Pressure P [bar]",
            tmax: "Design Temperature Tmax [°C]",
            ch9Note: "When <strong>P ≥ 690 bar</strong>, allowable stress <strong>S</strong> is taken from <strong>Table K-1</strong> (B31.3-2024, SI) for the selected material at design temperature <strong>Tmax</strong> (table in °C, stress in MPa; converted to bar for Eq. (34a): 1 MPa = 10 bar).",
            ch2Note: "When <strong>P &lt; 690 bar</strong>, allowable stress <strong>S</strong> is taken from <strong>Table A-1</strong> (B31.3-2024, SI) for the selected material at design temperature <strong>Tmax</strong> (table in °C, stress in MPa; converted to bar for Chapter II: 1 MPa = 10 bar).",
            coeffY: "Coefficient Y [—]",
            yNote: "Default <strong>0.4</strong> matches ASME B31.3 Table 304.1.1 for <strong>ferritic</strong> steels at <strong>≤ 482 °C</strong> (≤ 900 °F). At higher temperatures, <strong>Y</strong> increases—edit per your edition.",
            weldEff: "Weld Joint Efficiency",
            factorE: "Factor E",
            eNote: "Default <strong>0.80</strong> — typical for sleeve welds <strong>without 100% RT</strong> (per B31.3 joint efficiency for the assumed category). Use <strong>1.00</strong> only when full NDE (e.g. 100% RT) applies.",
            runCalc: "Run Sleeve THK Calculation",
            outputData: "Output Data",
            outputHp: "OUTPUT DATA — high pressure",
            ch2Title: "ASME B31.3, Chapter II — Process Piping (P < 690 bar)",
            ch9Title: "ASME B31.3, Chapter IX — High Pressure (P ≥ 690 bar)",
            legendCh2: "<span>CA</span> &ndash; corrosion allowance [mm]<br><span>P</span> &ndash; design pressure<br><span>D</span> &ndash; outside diameter of sleeve, <strong>D = OD + 2&middot;GAP + 2&middot;THK</strong><br><span>GAP</span> &ndash; radial clearance between sleeve bore and pipe OD [mm]<br><span>S</span> &ndash; allowable stress of sleeve material<br><span>E</span> &ndash; weld joint efficiency (default <strong>0.80</strong>; 1.00 if 100% RT)<br><span>Y</span> &ndash; temperature coefficient (ASME B31.3 Table 304.1.1). Default <strong>0.4</strong> for <strong>ferritic</strong> steels at <strong>&le; 482&nbsp;&deg;C</strong> (&le; 900&nbsp;&deg;F).",
            legendCh9: "<span>CA</span> &ndash; corrosion allowance [mm]<br><span>P</span> &ndash; design pressure<br><span>D</span> &ndash; outside diameter of sleeve, <strong>D = OD + 2&middot;GAP + 2&middot;THK</strong> [mm]<br><span>GAP</span> &ndash; radial clearance between sleeve bore and pipe OD [mm]<br><span>S</span> &ndash; allowable stress from Table K-1 (MPa at Tmax, converted to bar)",
            reqThk: "Required sleeve thickness (incl. CA)",
            sleeveLen: "Sleeve Length",
            calcLog: "Calculation Log",
            exportPng: "Export to PNG",
            exportPdf: "Export to PDF",
            copyLog: "Copy to Clipboard",
            closeHelp: "Close help",
            helpModalTitle: "Help & technical overview",
            selectA1: "Select material and Tmax to look up S in Table A-1.",
            selectK1: "Select material and Tmax to look up S in Table K-1.",
            noA1: "No Table A-1 data for “{mat}” at {tmax} °C — check material or edition.",
            noK1: "No Table K-1 data for “{mat}” at {tmax} °C — check material or edition.",
            bannerHp: "P = {p} bar ≥ {thr} bar — Chapter IX Eq. (34a) active; Chapter II formula shown inactive.",
            bannerCh2: "P = {p} bar < {thr} bar — Chapter II formula active; high-pressure formula shown inactive.",
            alertThk: "Calculated t = {t} mm exceeds assumed sleeve THK = {thk} mm. Increase THK to at least {t} mm.",
            matInfoCh9: "Material: {mat}  |  S = {mpa} MPa ({bar} bar) @ {tmax} °C  |  D = {d} mm  |  P = {p} bar",
            matInfoCh2: "Material: {mat}  |  S = {mpa} MPa ({bar} bar) @ {tmax} °C  |  E = {e}  |  D = {d} mm"
        },
        toast: {
            calcDone: "Calculation complete",
            fixFields: "Please fix invalid fields",
            noA1: "Table A-1: no allowable stress for {mat} at {tmax} °C.",
            noK1: "Table K-1: no allowable stress for {mat} at {tmax} °C.",
            dInvalid: "Sleeve outside diameter D = OD + 2·GAP + 2·THK must be > 0.",
            denomInvalid: "Denominator 2·(S·E + P·Y) ≤ 0 — check S, E, P, and Y.",
            ch9dInvalid: "Ch. IX: require D − 2·CA > 0 (D = OD + 2·GAP + 2·THK; check OD, GAP, THK, CA).",
            pngDone: "PNG exported",
            pdfDone: "PDF exported",
            pdfLib: "PDF library not loaded — check network",
            copied: "Copied to clipboard"
        },
        log: {
            reference: "Reference:",
            paz: "    PAZ Number (PAZ)             = {paz}",
            avis: "    AVIS Number (AVIS)           = {avis}",
            calcVer: "Calculator version             v{ver}",
            codeBasis: "Code basis                     {basis}",
            noteTitle: "Sleeve Type B — Calculation Note",
            ch2Hdr: "Per ASME PCC-2 Art. 2.6 / ASME B31.3 Chapter II",
            ch2P: "Design pressure P = {p} bar (< {thr} bar → Chapter II)",
            ch9Hdr: "Per ASME PCC-2 Art. 2.6 / ASME B31.3 Chapter IX (high pressure)",
            ch9P: "Design pressure P = {p} bar (≥ {thr} bar → Eq. 34a)",
            inputData: "Input Data:",
            defectSize: "  Size of defect",
            longS: "    Longitudinal              s  = {s} mm",
            circC: "    Circumferential           c  = {c} mm  (record only)",
            sleeveBlock: "  Predicted sleeve parameters and parent pipe",
            thk: "    Wall thickness (sleeve)  THK = {thk} mm",
            od: "    Outside diameter (pipe)   OD = {od} mm",
            gap: "    Gap (sleeve bore ↔ pipe) GAP = {gap} mm  (radial, each side)",
            dCalc: "    Sleeve outside diameter    D = OD + 2·GAP + 2·THK = {d} mm",
            ca: "    Corrosion allowance        CA = {ca} mm",
            mat: "    Material                     = {mat}",
            process: "  Process info",
            p: "    Design pressure            P = {p} bar",
            tmax: "    Design temperature      Tmax = {tmax} °C",
            weld: "  Weld joint efficiency",
            factorE: "    Factor                     E = {e}",
            eNote80: [
                "    Note (E): E = 0.80 is the default for Type B sleeve welds that are",
                "    typically not 100% radiographically examined. Per B31.3, lower E",
                "    reduces S·E in the denominator (2·(S·E + P·Y)) → greater required",
                "    wall thickness than E = 1.00. Change to 1.00 only if full RT/UT",
                "    and joint efficiency per your code case are documented."
            ],
            eNote100: [
                "    Note (E): E = 1.00 assumes full weld joint efficiency (e.g. 100% RT",
                "    per B31.3 for the applicable joint category). Yields the lowest",
                "    required sleeve thickness from this formula — use only when project",
                "    NDE and joint category justify E = 1.00."
            ],
            dDetail: "    D = OD + 2·GAP + 2·THK = {od} + 2×{gap} + 2×{thk} = {d} mm",
            formulaCh2: "Formula (Chapter II):",
            formulaCh9: "Formula (K304.1.2 — Eq. 34a):",
            results: "Results:",
            reqT: "    Required sleeve thickness   t = {t} mm  (incl. CA)",
            sleeveL: "    Sleeve length               L = {L} mm",
            typeBNote: [
                "  Note: Type B sleeve designed for 100% of design",
                "  pressure — no credit for remaining carrier pipe wall."
            ],
            yNote: [
                "  Note (Y): Default 0.4 aligns with ASME B31.3 Table 304.1.1",
                "  for ferritic steels typically when design temperature ≤ 482 °C",
                "  (900 °F), with other code conditions; use another Y if not applicable."
            ],
            sNoteA1: [
                "  Note (S): Table A-1 from B31.3-2024 Appendix A (A1.pdf, SI units);",
                "  materials without an A-1 row use conservative mapping — verify."
            ],
            sNoteK1: [
                "  Note (S): Table K-1 from B31.3-2024 Appendix K (K1.pdf, SI units);",
                "  materials without a K-1 row use conservative mapping — verify."
            ],
            allowS: "    Allowable stress           S = {S} bar",
            coeffY: "    Coefficient                Y = {Y}  (B31.3 Table 304.1.1; default 0.4 → ferritic, T ≤ 482 °C typical)",
            tmaxA1: "    Tmax = {tmax} °C, interpolated per Appendix A",
            tmaxK1: "    Tmax = {tmax} °C, interpolated per Appendix K"
        }
    },
    pl: {
        meta: { title: "ASME PCC-2 — Kalkulator rękawa typu B", htmlLang: "pl" },
        ui: {
            headerTitle: "ASME PCC-2 — Kalkulator grubości rękawa typu B",
            badge: "ASME B31.3",
            helpTitle: "Pomoc — PCC-2, rękaw typu B i aplikacja",
            helpAria: "Otwórz pomoc",
            themeLight: "Przełącz na jasny motyw (daylight)",
            themeDark: "Przełącz na ciemny motyw",
            langAria: "Język",
            reference: "Odniesienie",
            pazLabel: "Numer PAZ (PAZ)",
            avisLabel: "Numer AVIS (AVIS)",
            pazPh: "np. PAZ-2026-001",
            avisPh: "np. AVIS-12345",
            inputData: "Dane wejściowe",
            defectSize: "Wymiar usterki",
            longitudinal: "Podłużna s [mm]",
            circumferential: "Obwodowa c [mm]",
            sleeveParams: "Parametry rękawa i rura macierzysta",
            thk: "Grubość (rękaw) THK [mm]",
            od: "Średnica zewn. (rura) OD [mm]",
            gap: "GAP [mm]",
            gapNote: "Luz promieniowy między wnętrzem rękawa a zewnętrzną średnicą rury (szczelina pierścieniowa, z każdej strony).",
            ca: "Naddatek korozyjny CA [mm]",
            material: "Materiał",
            processData: "Dane procesowe",
            mawp: "MAWP / Ciśnienie projektowe P [bar]",
            tmax: "Temperatura projektowa Tmax [°C]",
            ch9Note: "Gdy <strong>P ≥ 690 bar</strong>, naprężenie dopuszczalne <strong>S</strong> z tabeli <strong>K-1</strong> (B31.3-2024, SI) przy <strong>Tmax</strong> (°C / MPa; wzór (34a): 1 MPa = 10 bar).",
            ch2Note: "Gdy <strong>P &lt; 690 bar</strong>, naprężenie dopuszczalne <strong>S</strong> z tabeli <strong>A-1</strong> (B31.3-2024, SI) przy <strong>Tmax</strong> (°C / MPa; rozdz. II: 1 MPa = 10 bar).",
            coeffY: "Współczynnik Y [—]",
            yNote: "Domyślnie <strong>0,4</strong> — ASME B31.3 tabela 304.1.1 dla stali ferrytycznych przy <strong>≤ 482 °C</strong>. Przy wyższej temperaturze <strong>Y</strong> rośnie.",
            weldEff: "Sprawność połączenia spawalniczego",
            factorE: "Współczynnik E",
            eNote: "Domyślnie <strong>0,80</strong> — typowe dla spoin rękawa <strong>bez 100% RT</strong>. Wartość <strong>1,00</strong> tylko przy pełnym NDE (np. 100% RT).",
            runCalc: "Oblicz grubość rękawa THK",
            outputData: "Dane wynikowe",
            outputHp: "WYNIKI — wysokie ciśnienie",
            ch2Title: "ASME B31.3, rozdz. II — rurociągi procesowe (P < 690 bar)",
            ch9Title: "ASME B31.3, rozdz. IX — wysokie ciśnienie (P ≥ 690 bar)",
            legendCh2: "<span>CA</span> &ndash; naddatek korozyjny [mm]<br><span>P</span> &ndash; ciśnienie projektowe<br><span>D</span> &ndash; średnica zewn. rękawa, <strong>D = OD + 2&middot;GAP + 2&middot;THK</strong><br><span>GAP</span> &ndash; luz promieniowy między rękawem a rurą [mm]<br><span>S</span> &ndash; naprężenie dopuszczalne materiału rękawa<br><span>E</span> &ndash; sprawność spoiny (domyślnie <strong>0,80</strong>; 1,00 przy 100% RT)<br><span>Y</span> &ndash; współczynnik temperatury (B31.3 tabela 304.1.1). Domyślnie <strong>0,4</strong> dla stali <strong>ferrytycznych</strong> przy <strong>&le; 482&nbsp;&deg;C</strong>.",
            legendCh9: "<span>CA</span> &ndash; naddatek korozyjny [mm]<br><span>P</span> &ndash; ciśnienie projektowe<br><span>D</span> &ndash; średnica zewn. rękawa, <strong>D = OD + 2&middot;GAP + 2&middot;THK</strong> [mm]<br><span>GAP</span> &ndash; luz promieniowy między rękawem a rurą [mm]<br><span>S</span> &ndash; naprężenie dopuszczalne z tabeli K-1 (MPa przy Tmax, przeliczone na bar)",
            reqThk: "Wymagana grubość rękawa (z CA)",
            sleeveLen: "Długość rękawa",
            calcLog: "Log obliczeń",
            exportPng: "Eksport do PNG",
            exportPdf: "Eksport do PDF",
            copyLog: "Kopiuj do schowka",
            closeHelp: "Zamknij pomoc",
            helpModalTitle: "Pomoc i przegląd techniczny",
            selectA1: "Wybierz materiał i Tmax, aby odczytać S z tabeli A-1.",
            selectK1: "Wybierz materiał i Tmax, aby odczytać S z tabeli K-1.",
            noA1: "Brak danych tabeli A-1 dla „{mat}” przy {tmax} °C — sprawdź materiał lub wydanie.",
            noK1: "Brak danych tabeli K-1 dla „{mat}” przy {tmax} °C — sprawdź materiał lub wydanie.",
            bannerHp: "P = {p} bar ≥ {thr} bar — aktywny rozdz. IX wzór (34a); rozdz. II nieaktywny.",
            bannerCh2: "P = {p} bar < {thr} bar — aktywny rozdz. II; wzór wysokiego ciśnienia nieaktywny.",
            alertThk: "Obliczone t = {t} mm przekracza przyjęte THK = {thk} mm. Zwiększ THK do co najmniej {t} mm.",
            matInfoCh9: "Materiał: {mat}  |  S = {mpa} MPa ({bar} bar) @ {tmax} °C  |  D = {d} mm  |  P = {p} bar",
            matInfoCh2: "Materiał: {mat}  |  S = {mpa} MPa ({bar} bar) @ {tmax} °C  |  E = {e}  |  D = {d} mm"
        },
        toast: {
            calcDone: "Obliczenie zakończone",
            fixFields: "Popraw nieprawidłowe pola",
            noA1: "Tabela A-1: brak S dla {mat} przy {tmax} °C.",
            noK1: "Tabela K-1: brak S dla {mat} przy {tmax} °C.",
            dInvalid: "Średnica zewn. rękawa D = OD + 2·GAP + 2·THK musi być > 0.",
            denomInvalid: "Mianownik 2·(S·E + P·Y) ≤ 0 — sprawdź S, E, P i Y.",
            ch9dInvalid: "Rozdz. IX: wymagane D − 2·CA > 0 (D = OD + 2·GAP + 2·THK).",
            pngDone: "Wyeksportowano PNG",
            pdfDone: "Wyeksportowano PDF",
            pdfLib: "Biblioteka PDF nie załadowana — sprawdź sieć",
            copied: "Skopiowano do schowka"
        },
        log: {
            reference: "Odniesienie:",
            paz: "    Numer PAZ (PAZ)              = {paz}",
            avis: "    Numer AVIS (AVIS)            = {avis}",
            calcVer: "Wersja kalkulatora             v{ver}",
            codeBasis: "Podstawa normowa               {basis}",
            noteTitle: "Rękaw typu B — notatka obliczeniowa",
            ch2Hdr: "Według ASME PCC-2 art. 2.6 / ASME B31.3 rozdział II",
            ch2P: "Ciśnienie projektowe P = {p} bar (< {thr} bar → rozdział II)",
            ch9Hdr: "Według ASME PCC-2 art. 2.6 / ASME B31.3 rozdział IX (wysokie ciśnienie)",
            ch9P: "Ciśnienie projektowe P = {p} bar (≥ {thr} bar → wzór 34a)",
            inputData: "Dane wejściowe:",
            defectSize: "  Wymiar usterki",
            longS: "    Podłużna                  s  = {s} mm",
            circC: "    Obwodowa                  c  = {c} mm  (tylko zapis)",
            sleeveBlock: "  Parametry rękawa i rura",
            thk: "    Grubość (rękaw)          THK = {thk} mm",
            od: "    Średnica zewn. (rura)     OD = {od} mm",
            gap: "    Szczelina (rękaw ↔ rura) GAP = {gap} mm  (promieniowa, strona)",
            dCalc: "    Średnica zewn. rękawa      D = OD + 2·GAP + 2·THK = {d} mm",
            ca: "    Naddatek korozyjny         CA = {ca} mm",
            mat: "    Materiał                     = {mat}",
            process: "  Dane procesowe",
            p: "    Ciśnienie projektowe       P = {p} bar",
            tmax: "    Temperatura projektowa  Tmax = {tmax} °C",
            weld: "  Sprawność spoiny",
            factorE: "    Współczynnik                E = {e}",
            eNote80: [
                "    Uwaga (E): E = 0,80 — domyślnie dla spoin rękawa bez pełnego RT.",
                "    Niższe E zmniejsza S·E w mianowniku → większa wymagana grubość",
                "    niż przy E = 1,00. Zmień na 1,00 tylko przy udokumentowanym RT/UT."
            ],
            eNote100: [
                "    Uwaga (E): E = 1,00 — pełna sprawność spoiny (np. 100% RT).",
                "    Najmniejsza grubość z tego wzoru — tylko gdy NDE to uzasadnia."
            ],
            dDetail: "    D = OD + 2·GAP + 2·THK = {od} + 2×{gap} + 2×{thk} = {d} mm",
            formulaCh2: "Wzór (rozdział II):",
            formulaCh9: "Wzór (K304.1.2 — wzór 34a):",
            results: "Wyniki:",
            reqT: "    Wymagana grubość rękawa    t = {t} mm  (z CA)",
            sleeveL: "    Długość rękawa              L = {L} mm",
            typeBNote: [
                "  Uwaga: rękaw typu B na 100% ciśnienia projektowego",
                "  — bez uwzględnienia pozostałej ścianki rury."
            ],
            yNote: [
                "  Uwaga (Y): Domyślnie 0,4 — ASME B31.3 tabela 304.1.1,",
                "  stale ferrytyczne typowo przy T ≤ 482 °C; w innych przypadkach zmień Y."
            ],
            sNoteA1: [
                "  Uwaga (S): Tabela A-1 z B31.3-2024 zał. A (A1.pdf, SI);",
                "  materiały bez wiersza — mapowanie konserwatywne — zweryfikuj."
            ],
            sNoteK1: [
                "  Uwaga (S): Tabela K-1 z B31.3-2024 zał. K (K1.pdf, SI);",
                "  materiały bez wiersza — mapowanie konserwatywne — zweryfikuj."
            ],
            allowS: "    Naprężenie dopuszczalne     S = {S} bar",
            coeffY: "    Współczynnik                Y = {Y}  (B31.3 tabela 304.1.1; domyślnie 0,4)",
            tmaxA1: "    Tmax = {tmax} °C, interpolacja zał. A",
            tmaxK1: "    Tmax = {tmax} °C, interpolacja zał. K"
        }
    },
    fr: {
        meta: { title: "ASME PCC-2 — Calculateur manchon type B", htmlLang: "fr" },
        ui: {
            headerTitle: "ASME PCC-2 — Calculateur d'épaisseur manchon type B",
            badge: "ASME B31.3",
            helpTitle: "Aide — PCC-2, manchon type B et application",
            helpAria: "Ouvrir l'aide",
            themeLight: "Passer au thème clair (daylight)",
            themeDark: "Passer au thème sombre",
            langAria: "Langue",
            reference: "Référence",
            pazLabel: "Numéro PAZ (PAZ)",
            avisLabel: "Numéro AVIS (AVIS)",
            pazPh: "ex. PAZ-2026-001",
            avisPh: "ex. AVIS-12345",
            inputData: "Données d'entrée",
            defectSize: "Taille du défaut",
            longitudinal: "Longitudinale s [mm]",
            circumferential: "Circumférentielle c [mm]",
            sleeveParams: "Paramètres du manchon et tuyau parent",
            thk: "Épaisseur (manchon) THK [mm]",
            od: "Diamètre ext. (tuyau) OD [mm]",
            gap: "GAP [mm]",
            gapNote: "Jeu radial entre l'alésage du manchon et le diamètre extérieur du tuyau (jeu annulaire, chaque côté).",
            ca: "Surépaisseur corrosion CA [mm]",
            material: "Matériau",
            processData: "Données de service",
            mawp: "MAWP / Pression de conception P [bar]",
            tmax: "Température de conception Tmax [°C]",
            ch9Note: "Si <strong>P ≥ 690 bar</strong>, contrainte admissible <strong>S</strong> selon <strong>table K-1</strong> (B31.3-2024, SI) au matériau et <strong>Tmax</strong> (°C / MPa ; éq. (34a) : 1 MPa = 10 bar).",
            ch2Note: "Si <strong>P &lt; 690 bar</strong>, contrainte admissible <strong>S</strong> selon <strong>table A-1</strong> (B31.3-2024, SI) au matériau et <strong>Tmax</strong> (°C / MPa ; ch. II : 1 MPa = 10 bar).",
            coeffY: "Coefficient Y [—]",
            yNote: "Par défaut <strong>0,4</strong> — ASME B31.3 tableau 304.1.1 pour aciers ferritiques à <strong>≤ 482 °C</strong>. Au-delà, <strong>Y</strong> augmente.",
            weldEff: "Efficacité de joint soudé",
            factorE: "Facteur E",
            eNote: "Par défaut <strong>0,80</strong> — typique pour soudures de manchon <strong>sans RT 100 %</strong>. <strong>1,00</strong> seulement si END complet (ex. RT 100 %).",
            runCalc: "Calculer l'épaisseur THK du manchon",
            outputData: "Données de sortie",
            outputHp: "SORTIE — haute pression",
            ch2Title: "ASME B31.3, chapitre II — tuyauterie de procédé (P < 690 bar)",
            ch9Title: "ASME B31.3, chapitre IX — haute pression (P ≥ 690 bar)",
            legendCh2: "<span>CA</span> &ndash; surépaisseur corrosion [mm]<br><span>P</span> &ndash; pression de conception<br><span>D</span> &ndash; diamètre ext. du manchon, <strong>D = OD + 2&middot;GAP + 2&middot;THK</strong><br><span>GAP</span> &ndash; jeu radial entre manchon et tuyau [mm]<br><span>S</span> &ndash; contrainte admissible du matériau<br><span>E</span> &ndash; efficacité de soudure (défaut <strong>0,80</strong> ; 1,00 si RT 100 %)<br><span>Y</span> &ndash; coefficient de température (B31.3 tableau 304.1.1). Défaut <strong>0,4</strong> pour aciers <strong>ferritiques</strong> à <strong>&le; 482&nbsp;&deg;C</strong>.",
            legendCh9: "<span>CA</span> &ndash; surépaisseur corrosion [mm]<br><span>P</span> &ndash; pression de conception<br><span>D</span> &ndash; diamètre ext. du manchon, <strong>D = OD + 2&middot;GAP + 2&middot;THK</strong> [mm]<br><span>GAP</span> &ndash; jeu radial entre manchon et tuyau [mm]<br><span>S</span> &ndash; contrainte admissible table K-1 (MPa à Tmax, convertie en bar)",
            reqThk: "Épaisseur requise du manchon (CA incl.)",
            sleeveLen: "Longueur du manchon",
            calcLog: "Journal de calcul",
            exportPng: "Exporter en PNG",
            exportPdf: "Exporter en PDF",
            copyLog: "Copier dans le presse-papiers",
            closeHelp: "Fermer l'aide",
            helpModalTitle: "Aide et aperçu technique",
            selectA1: "Sélectionnez matériau et Tmax pour S dans la table A-1.",
            selectK1: "Sélectionnez matériau et Tmax pour S dans la table K-1.",
            noA1: "Pas de données table A-1 pour « {mat} » à {tmax} °C — vérifier matériau ou édition.",
            noK1: "Pas de données table K-1 pour « {mat} » à {tmax} °C — vérifier matériau ou édition.",
            bannerHp: "P = {p} bar ≥ {thr} bar — chapitre IX actif (éq. 34a) ; chapitre II inactif.",
            bannerCh2: "P = {p} bar < {thr} bar — chapitre II actif ; formule haute pression inactive.",
            alertThk: "t calculé = {t} mm dépasse THK = {thk} mm. Augmenter THK à au moins {t} mm.",
            matInfoCh9: "Matériau : {mat}  |  S = {mpa} MPa ({bar} bar) @ {tmax} °C  |  D = {d} mm  |  P = {p} bar",
            matInfoCh2: "Matériau : {mat}  |  S = {mpa} MPa ({bar} bar) @ {tmax} °C  |  E = {e}  |  D = {d} mm"
        },
        toast: {
            calcDone: "Calcul terminé",
            fixFields: "Corrigez les champs invalides",
            noA1: "Table A-1 : pas de S pour {mat} à {tmax} °C.",
            noK1: "Table K-1 : pas de S pour {mat} à {tmax} °C.",
            dInvalid: "Diamètre ext. manchon D = OD + 2·GAP + 2·THK doit être > 0.",
            denomInvalid: "Dénominateur 2·(S·E + P·Y) ≤ 0 — vérifier S, E, P et Y.",
            ch9dInvalid: "Ch. IX : exiger D − 2·CA > 0 (D = OD + 2·GAP + 2·THK).",
            pngDone: "PNG exporté",
            pdfDone: "PDF exporté",
            pdfLib: "Bibliothèque PDF non chargée — vérifier le réseau",
            copied: "Copié dans le presse-papiers"
        },
        log: {
            reference: "Référence :",
            paz: "    Numéro PAZ (PAZ)              = {paz}",
            avis: "    Numéro AVIS (AVIS)            = {avis}",
            calcVer: "Version du calculateur          v{ver}",
            codeBasis: "Base normative                  {basis}",
            noteTitle: "Manchon type B — note de calcul",
            ch2Hdr: "Selon ASME PCC-2 art. 2.6 / ASME B31.3 chapitre II",
            ch2P: "Pression de conception P = {p} bar (< {thr} bar → chapitre II)",
            ch9Hdr: "Selon ASME PCC-2 art. 2.6 / ASME B31.3 chapitre IX (haute pression)",
            ch9P: "Pression de conception P = {p} bar (≥ {thr} bar → éq. 34a)",
            inputData: "Données d'entrée :",
            defectSize: "  Taille du défaut",
            longS: "    Longitudinale             s  = {s} mm",
            circC: "    Circonférentielle         c  = {c} mm  (enregistrement)",
            sleeveBlock: "  Paramètres manchon et tuyau",
            thk: "    Épaisseur (manchon)      THK = {thk} mm",
            od: "    Diamètre ext. (tuyau)     OD = {od} mm",
            gap: "    Jeu (manchon ↔ tuyau)    GAP = {gap} mm  (radial, côté)",
            dCalc: "    Diamètre ext. manchon      D = OD + 2·GAP + 2·THK = {d} mm",
            ca: "    Surépaisseur corrosion     CA = {ca} mm",
            mat: "    Matériau                     = {mat}",
            process: "  Données de service",
            p: "    Pression de conception     P = {p} bar",
            tmax: "    Température de conception Tmax = {tmax} °C",
            weld: "  Efficacité de soudure",
            factorE: "    Facteur                     E = {e}",
            eNote80: [
                "    Note (E) : E = 0,80 par défaut pour soudures de manchon sans RT 100 %.",
                "    E plus faible réduit S·E au dénominateur → épaisseur requise plus grande",
                "    qu'avec E = 1,00. Passer à 1,00 seulement si RT/UT complet documenté."
            ],
            eNote100: [
                "    Note (E) : E = 1,00 suppose efficacité complète (ex. RT 100 %).",
                "    Épaisseur minimale de cette formule — seulement si l'END le justifie."
            ],
            dDetail: "    D = OD + 2·GAP + 2·THK = {od} + 2×{gap} + 2×{thk} = {d} mm",
            formulaCh2: "Formule (chapitre II) :",
            formulaCh9: "Formule (K304.1.2 — éq. 34a) :",
            results: "Résultats :",
            reqT: "    Épaisseur requise manchon   t = {t} mm  (CA incl.)",
            sleeveL: "    Longueur du manchon         L = {L} mm",
            typeBNote: [
                "  Note : manchon type B pour 100 % de la pression de conception",
                "  — pas de crédit pour la paroi restante du tuyau."
            ],
            yNote: [
                "  Note (Y) : 0,4 par défaut — ASME B31.3 tableau 304.1.1,",
                "  aciers ferritiques typiquement à T ≤ 482 °C ; sinon adapter Y."
            ],
            sNoteA1: [
                "  Note (S) : Table A-1 B31.3-2024 annexe A (A1.pdf, SI) ;",
                "  matériaux sans ligne — mapping conservateur — vérifier."
            ],
            sNoteK1: [
                "  Note (S) : Table K-1 B31.3-2024 annexe K (K1.pdf, SI) ;",
                "  matériaux sans ligne — mapping conservateur — vérifier."
            ],
            allowS: "    Contrainte admissible        S = {S} bar",
            coeffY: "    Coefficient                 Y = {Y}  (B31.3 tableau 304.1.1 ; défaut 0,4)",
            tmaxA1: "    Tmax = {tmax} °C, interpolation annexe A",
            tmaxK1: "    Tmax = {tmax} °C, interpolation annexe K"
        }
    },
    pt: {
        meta: { title: "ASME PCC-2 — Calculadora manga tipo B", htmlLang: "pt" },
        ui: {
            headerTitle: "ASME PCC-2 — Calculadora de espessura manga tipo B",
            badge: "ASME B31.3",
            helpTitle: "Ajuda — PCC-2, manga tipo B e aplicação",
            helpAria: "Abrir ajuda",
            themeLight: "Mudar para tema claro (daylight)",
            themeDark: "Mudar para tema escuro",
            langAria: "Idioma",
            reference: "Referência",
            pazLabel: "Número PAZ (PAZ)",
            avisLabel: "Número AVIS (AVIS)",
            pazPh: "ex. PAZ-2026-001",
            avisPh: "ex. AVIS-12345",
            inputData: "Dados de entrada",
            defectSize: "Dimensão do defeito",
            longitudinal: "Longitudinal s [mm]",
            circumferential: "Circunferencial c [mm]",
            sleeveParams: "Parâmetros da manga e tubo principal",
            thk: "Espessura (manga) THK [mm]",
            od: "Diâmetro ext. (tubo) OD [mm]",
            gap: "GAP [mm]",
            gapNote: "Folga radial entre o furo da manga e o diâmetro externo do tubo (folga anular, cada lado).",
            ca: "Sobrespessura de corrosão CA [mm]",
            material: "Material",
            processData: "Dados de processo",
            mawp: "MAWP / Pressão de projeto P [bar]",
            tmax: "Temperatura de projeto Tmax [°C]",
            ch9Note: "Se <strong>P ≥ 690 bar</strong>, tensão admissível <strong>S</strong> da <strong>tabela K-1</strong> (B31.3-2024, SI) em <strong>Tmax</strong> (°C / MPa; eq. (34a): 1 MPa = 10 bar).",
            ch2Note: "Se <strong>P &lt; 690 bar</strong>, tensão admissível <strong>S</strong> da <strong>tabela A-1</strong> (B31.3-2024, SI) em <strong>Tmax</strong> (°C / MPa; cap. II: 1 MPa = 10 bar).",
            coeffY: "Coeficiente Y [—]",
            yNote: "Padrão <strong>0,4</strong> — ASME B31.3 tabela 304.1.1 para aços ferríticos a <strong>≤ 482 °C</strong>. Acima disso, <strong>Y</strong> aumenta.",
            weldEff: "Eficiência de junta soldada",
            factorE: "Fator E",
            eNote: "Padrão <strong>0,80</strong> — típico para soldas de manga <strong>sem RT 100 %</strong>. <strong>1,00</strong> só com END completo (ex. RT 100 %).",
            runCalc: "Calcular espessura THK da manga",
            outputData: "Dados de saída",
            outputHp: "SAÍDA — alta pressão",
            ch2Title: "ASME B31.3, capítulo II — tubulação de processo (P < 690 bar)",
            ch9Title: "ASME B31.3, capítulo IX — alta pressão (P ≥ 690 bar)",
            legendCh2: "<span>CA</span> &ndash; sobrepessura de corrosão [mm]<br><span>P</span> &ndash; pressão de projeto<br><span>D</span> &ndash; diâmetro ext. da manga, <strong>D = OD + 2&middot;GAP + 2&middot;THK</strong><br><span>GAP</span> &ndash; folga radial entre manga e tubo [mm]<br><span>S</span> &ndash; tensão admissível do material<br><span>E</span> &ndash; eficiência de solda (padrão <strong>0,80</strong>; 1,00 com RT 100 %)<br><span>Y</span> &ndash; coeficiente de temperatura (B31.3 tabela 304.1.1). Padrão <strong>0,4</strong> para aços <strong>ferríticos</strong> a <strong>&le; 482&nbsp;&deg;C</strong>.",
            legendCh9: "<span>CA</span> &ndash; sobrepessura de corrosão [mm]<br><span>P</span> &ndash; pressão de projeto<br><span>D</span> &ndash; diâmetro ext. da manga, <strong>D = OD + 2&middot;GAP + 2&middot;THK</strong> [mm]<br><span>GAP</span> &ndash; folga radial entre manga e tubo [mm]<br><span>S</span> &ndash; tensão admissível da tabela K-1 (MPa em Tmax, convertida para bar)",
            reqThk: "Espessura requerida da manga (incl. CA)",
            sleeveLen: "Comprimento da manga",
            calcLog: "Registo de cálculo",
            exportPng: "Exportar PNG",
            exportPdf: "Exportar PDF",
            copyLog: "Copiar para área de transferência",
            closeHelp: "Fechar ajuda",
            helpModalTitle: "Ajuda e visão técnica",
            selectA1: "Selecione material e Tmax para obter S na tabela A-1.",
            selectK1: "Selecione material e Tmax para obter S na tabela K-1.",
            noA1: "Sem dados tabela A-1 para «{mat}» a {tmax} °C — verifique material ou edição.",
            noK1: "Sem dados tabela K-1 para «{mat}» a {tmax} °C — verifique material ou edição.",
            bannerHp: "P = {p} bar ≥ {thr} bar — capítulo IX ativo (eq. 34a); capítulo II inativo.",
            bannerCh2: "P = {p} bar < {thr} bar — capítulo II ativo; fórmula alta pressão inativa.",
            alertThk: "t calculado = {t} mm excede THK = {thk} mm. Aumente THK para pelo menos {t} mm.",
            matInfoCh9: "Material: {mat}  |  S = {mpa} MPa ({bar} bar) @ {tmax} °C  |  D = {d} mm  |  P = {p} bar",
            matInfoCh2: "Material: {mat}  |  S = {mpa} MPa ({bar} bar) @ {tmax} °C  |  E = {e}  |  D = {d} mm"
        },
        toast: {
            calcDone: "Cálculo concluído",
            fixFields: "Corrija os campos inválidos",
            noA1: "Tabela A-1: sem S para {mat} a {tmax} °C.",
            noK1: "Tabela K-1: sem S para {mat} a {tmax} °C.",
            dInvalid: "Diâmetro ext. manga D = OD + 2·GAP + 2·THK deve ser > 0.",
            denomInvalid: "Denominador 2·(S·E + P·Y) ≤ 0 — verifique S, E, P e Y.",
            ch9dInvalid: "Cap. IX: exige D − 2·CA > 0 (D = OD + 2·GAP + 2·THK).",
            pngDone: "PNG exportado",
            pdfDone: "PDF exportado",
            pdfLib: "Biblioteca PDF não carregada — verifique a rede",
            copied: "Copiado para a área de transferência"
        },
        log: {
            reference: "Referência:",
            paz: "    Número PAZ (PAZ)              = {paz}",
            avis: "    Número AVIS (AVIS)            = {avis}",
            calcVer: "Versão da calculadora           v{ver}",
            codeBasis: "Base normativa                  {basis}",
            noteTitle: "Manga tipo B — nota de cálculo",
            ch2Hdr: "Segundo ASME PCC-2 art. 2.6 / ASME B31.3 capítulo II",
            ch2P: "Pressão de projeto P = {p} bar (< {thr} bar → capítulo II)",
            ch9Hdr: "Segundo ASME PCC-2 art. 2.6 / ASME B31.3 capítulo IX (alta pressão)",
            ch9P: "Pressão de projeto P = {p} bar (≥ {thr} bar → eq. 34a)",
            inputData: "Dados de entrada:",
            defectSize: "  Dimensão do defeito",
            longS: "    Longitudinal              s  = {s} mm",
            circC: "    Circunferencial           c  = {c} mm  (apenas registo)",
            sleeveBlock: "  Parâmetros manga e tubo",
            thk: "    Espessura (manga)        THK = {thk} mm",
            od: "    Diâmetro ext. (tubo)      OD = {od} mm",
            gap: "    Folga (manga ↔ tubo)     GAP = {gap} mm  (radial, lado)",
            dCalc: "    Diâmetro ext. manga        D = OD + 2·GAP + 2·THK = {d} mm",
            ca: "    Sobrespessura corrosão     CA = {ca} mm",
            mat: "    Material                     = {mat}",
            process: "  Dados de processo",
            p: "    Pressão de projeto         P = {p} bar",
            tmax: "    Temperatura de projeto  Tmax = {tmax} °C",
            weld: "  Eficiência de solda",
            factorE: "    Fator                       E = {e}",
            eNote80: [
                "    Nota (E): E = 0,80 — padrão para soldas de manga sem RT 100 %.",
                "    E menor reduz S·E no denominador → maior espessura requerida",
                "    que com E = 1,00. Mude para 1,00 só com RT/UT documentado."
            ],
            eNote100: [
                "    Nota (E): E = 1,00 assume eficiência total (ex. RT 100 %).",
                "    Menor espessura desta fórmula — só se o END o justificar."
            ],
            dDetail: "    D = OD + 2·GAP + 2·THK = {od} + 2×{gap} + 2×{thk} = {d} mm",
            formulaCh2: "Fórmula (capítulo II):",
            formulaCh9: "Fórmula (K304.1.2 — eq. 34a):",
            results: "Resultados:",
            reqT: "    Espessura requerida manga    t = {t} mm  (incl. CA)",
            sleeveL: "    Comprimento da manga         L = {L} mm",
            typeBNote: [
                "  Nota: manga tipo B para 100 % da pressão de projeto",
                "  — sem crédito pela parede restante do tubo."
            ],
            yNote: [
                "  Nota (Y): Padrão 0,4 — ASME B31.3 tabela 304.1.1,",
                "  aços ferríticos tipicamente a T ≤ 482 °C; noutros casos altere Y."
            ],
            sNoteA1: [
                "  Nota (S): Tabela A-1 B31.3-2024 apêndice A (A1.pdf, SI);",
                "  materiais sem linha — mapeamento conservador — verificar."
            ],
            sNoteK1: [
                "  Nota (S): Tabela K-1 B31.3-2024 apêndice K (K1.pdf, SI);",
                "  materiais sem linha — mapeamento conservador — verificar."
            ],
            allowS: "    Tensão admissível           S = {S} bar",
            coeffY: "    Coeficiente                 Y = {Y}  (B31.3 tabela 304.1.1; padrão 0,4)",
            tmaxA1: "    Tmax = {tmax} °C, interpolação apêndice A",
            tmaxK1: "    Tmax = {tmax} °C, interpolação apêndice K"
        }
    }
};

let currentLang = localStorage.getItem("pcc2-lang") || "en";

function t(key, params = {}, lang = currentLang) {
    const parts = key.split(".");
    let node = I18N[lang] || I18N.en;
    for (const p of parts) {
        node = node?.[p];
        if (node === undefined) break;
    }
    if (node === undefined) {
        node = I18N.en;
        for (const p of parts) {
            node = node?.[p];
        }
    }
    if (Array.isArray(node)) return node;
    if (typeof node !== "string") return key;
    return node.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? String(params[k]) : `{${k}}`));
}

/** Calculation log is always English (formal engineering record). */
function tEn(key, params = {}) {
    return t(key, params, "en");
}

function setLanguage(lang) {
    if (!I18N_LOCALES.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem("pcc2-lang", lang);
    document.documentElement.lang = I18N[lang].meta.htmlLang;
    document.title = I18N[lang].meta.title;
}

function getLanguage() {
    return currentLang;
}

/** Apply data-i18n, data-i18n-placeholder, data-i18n-title to DOM */
function applyI18nToDom() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const val = t(key);
        if (typeof val === "string") el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        el.title = t(el.getAttribute("data-i18n-title"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
        el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
        el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("lang-btn--active", btn.getAttribute("data-lang") === currentLang);
    });
}

function renderHelpModalBody() {
    const body = document.getElementById("helpModalBody");
    if (!body) return;
    const L = currentLang;
    const blocks = {
        en: helpHtmlEn(),
        pl: helpHtmlPl(),
        fr: helpHtmlFr(),
        pt: helpHtmlPt()
    };
    body.innerHTML = blocks[L] || blocks.en;
}

function helpHtmlEn() {
    return `
<section class="modal-section"><h3>This application</h3>
<p>Web tool for <strong>Type B full encirclement repair sleeve</strong> minimum wall thickness per <strong>ASME PCC-2 Art. 2.6</strong> and <strong>ASME B31.3</strong> (<span id="helpAppVersion"></span>).</p>
<ul><li><strong>P &lt; 690 bar</strong> — Ch. II, Table A-1, default <strong>E = 0.80</strong>.</li>
<li><strong>P ≥ 690 bar</strong> — Ch. IX Eq. (34a), Table K-1.</li>
<li><strong>D = OD + 2·GAP + 2·THK</strong>; <strong>L = s + 100 mm</strong>.</li></ul>
<p class="modal-disclaimer">Engineering support only — verify code edition, tables, and NDE before formal use.</p></section>
<section class="modal-section"><h3>ASME PCC-2</h3>
<p><strong>PCC-2</strong> covers repair of pressure equipment and piping. <strong>Article 2.6</strong> addresses full encirclement sleeves over defects or thin areas.</p></section>
<section class="modal-section"><h3>Type B sleeve</h3>
<p><strong>Type B</strong> carries <strong>100% design pressure</strong>; carrier pipe wall is <strong>not credited</strong>.</p>
<figure class="modal-figure"><img src="assets/type-b-sleeve-diagram.png" alt="Type B sleeve schematic" width="800" height="450" loading="lazy">
<figcaption>Conceptual schematic — confirm against PCC-2 and project drawings.</figcaption></figure>
<ul><li>Localized defect length <em>s</em>; annular <strong>GAP</strong>; weld <strong>E</strong>; <strong>CA</strong> added to pressure thickness.</li></ul></section>
<section class="modal-section"><h3>Related</h3>
<p>Stresses from <strong>B31.3-2024</strong> Tables A-1 / K-1 (SI). Legacy AutoCAD: <a href="https://github.com/Agrestor666/ASME_PCC_2" target="_blank" rel="noopener">ASME_PCC_2</a>.</p></section>`;
}

function helpHtmlPl() {
    return `
<section class="modal-section"><h3>Aplikacja</h3>
<p>Narzędzie do grubości <strong>rękawa naprawczego typu B</strong> wg <strong>ASME PCC-2 art. 2.6</strong> i <strong>ASME B31.3</strong> (<span id="helpAppVersion"></span>).</p>
<ul><li><strong>P &lt; 690 bar</strong> — rozdz. II, tabela A-1, domyślnie <strong>E = 0,80</strong>.</li>
<li><strong>P ≥ 690 bar</strong> — rozdz. IX wzór (34a), tabela K-1.</li>
<li><strong>D = OD + 2·GAP + 2·THK</strong>; <strong>L = s + 100 mm</strong>.</li></ul>
<p class="modal-disclaimer">Wsparcie inżynierskie — zweryfikuj wydanie normy, tabele i NDE przed użyciem formalnym.</p></section>
<section class="modal-section"><h3>ASME PCC-2</h3>
<p><strong>PCC-2</strong> — naprawy aparatury i rurociągów. <strong>Art. 2.6</strong> — rękawy pełnoobwodowe na usterki.</p></section>
<section class="modal-section"><h3>Rękaw typu B</h3>
<p><strong>Typ B</strong> na <strong>100% ciśnienia projektowego</strong>; ścianka rury <strong>nie jest kredytowana</strong>.</p>
<figure class="modal-figure"><img src="assets/type-b-sleeve-diagram.png" alt="Schemat rękawa typu B" width="800" height="450" loading="lazy">
<figcaption>Schemat orientacyjny — potwierdź z PCC-2 i rysunkiem projektu.</figcaption></figure></section>
<section class="modal-section"><h3>Zasoby</h3>
<p>Tabele <strong>B31.3-2024</strong> A-1 / K-1 (SI). AutoCAD: <a href="https://github.com/Agrestor666/ASME_PCC_2" target="_blank" rel="noopener">ASME_PCC_2</a>.</p></section>`;
}

function helpHtmlFr() {
    return `
<section class="modal-section"><h3>Cette application</h3>
<p>Outil web pour l'épaisseur d'un <strong>manchon de réparation type B</strong> selon <strong>ASME PCC-2 art. 2.6</strong> et <strong>ASME B31.3</strong> (<span id="helpAppVersion"></span>).</p>
<ul><li><strong>P &lt; 690 bar</strong> — ch. II, table A-1, <strong>E = 0,80</strong> par défaut.</li>
<li><strong>P ≥ 690 bar</strong> — ch. IX éq. (34a), table K-1.</li>
<li><strong>D = OD + 2·GAP + 2·THK</strong> ; <strong>L = s + 100 mm</strong>.</li></ul>
<p class="modal-disclaimer">Aide à l'ingénierie uniquement — vérifier édition, tables et END avant usage formel.</p></section>
<section class="modal-section"><h3>ASME PCC-2</h3>
<p><strong>PCC-2</strong> — réparation équipements sous pression. <strong>Art. 2.6</strong> — manchons pleine circonférence.</p></section>
<section class="modal-section"><h3>Manchon type B</h3>
<p><strong>Type B</strong> à <strong>100 % de la pression</strong> ; paroi du tuyau <strong>non créditée</strong>.</p>
<figure class="modal-figure"><img src="assets/type-b-sleeve-diagram.png" alt="Schéma manchon type B" width="800" height="450" loading="lazy">
<figcaption>Schéma conceptuel — confirmer avec PCC-2 et plans projet.</figcaption></figure></section>
<section class="modal-section"><h3>Ressources</h3>
<p>Tables <strong>B31.3-2024</strong> A-1 / K-1 (SI). AutoCAD : <a href="https://github.com/Agrestor666/ASME_PCC_2" target="_blank" rel="noopener">ASME_PCC_2</a>.</p></section>`;
}

function helpHtmlPt() {
    return `
<section class="modal-section"><h3>Esta aplicação</h3>
<p>Ferramenta web para espessura de <strong>manga de reparação tipo B</strong> segundo <strong>ASME PCC-2 art. 2.6</strong> e <strong>ASME B31.3</strong> (<span id="helpAppVersion"></span>).</p>
<ul><li><strong>P &lt; 690 bar</strong> — cap. II, tabela A-1, <strong>E = 0,80</strong> padrão.</li>
<li><strong>P ≥ 690 bar</strong> — cap. IX eq. (34a), tabela K-1.</li>
<li><strong>D = OD + 2·GAP + 2·THK</strong>; <strong>L = s + 100 mm</strong>.</li></ul>
<p class="modal-disclaimer">Apoio de engenharia — verifique edição, tabelas e END antes de uso formal.</p></section>
<section class="modal-section"><h3>ASME PCC-2</h3>
<p><strong>PCC-2</strong> — reparação de equipamentos sob pressão. <strong>Art. 2.6</strong> — mangas de circunferência completa.</p></section>
<section class="modal-section"><h3>Manga tipo B</h3>
<p><strong>Tipo B</strong> suporta <strong>100% da pressão de projeto</strong>; parede do tubo <strong>não é creditada</strong>.</p>
<figure class="modal-figure"><img src="assets/type-b-sleeve-diagram.png" alt="Esquema manga tipo B" width="800" height="450" loading="lazy">
<figcaption>Esquema conceptual — confirmar com PCC-2 e desenhos do projeto.</figcaption></figure></section>
<section class="modal-section"><h3>Recursos</h3>
<p>Tabelas <strong>B31.3-2024</strong> A-1 / K-1 (SI). AutoCAD: <a href="https://github.com/Agrestor666/ASME_PCC_2" target="_blank" rel="noopener">ASME_PCC_2</a>.</p></section>`;
}
