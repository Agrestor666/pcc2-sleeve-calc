# Changelog

All notable changes to the PCC-2 Sleeve Type B web calculator are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-05-24

### Added

- Help modal: professional **symbol glossary** (P/MAWP, S, Y, E, CA, OD, D, GAP, THK, mill, TR, t<sub>required</sub>, etc.) with normative sources and in-app usage — EN/PL/FR/PT (`help-content.js`).

## [1.3.0] - 2026-05-24

### Added

- **TR** (retirement thickness) floor from Totalenergies sheet (GS-EP-PVV-112 §5.2.2.3): bracket **pipe OD** to adjacent nominal sizes in `table-tr.js` (e.g. 95 mm → 3" and 4"); final `t_required = max(after mill, TR)`.
- Calculation log and Help sections for mill tolerance and TR.

## [1.2.0] - 2026-05-24

### Added

- **t_calculated** vs **t_required** with editable mill tolerance (Totalenergies defaults: 12.5% / 8% at D = 457.2 mm). THK check uses t_required.

### Changed

- Main entry is `index.html` (`/`); `SleeveCalc.html` redirects for legacy URLs.
- Mill tolerance field labels use plain language (no visible `&lt;` entities).

## [1.1.0] - 2026-05-23

### Added

- Daylight (light) theme toggle with persisted preference.
- UI and calculation log translations: English, Polish, French, Portuguese.
- Help modal with Type B sleeve schematic (`type-b-sleeve-diagram.png`).
- PDF export for calculation log; default weld joint efficiency **E = 0.80** with log notes.

### Changed

- Header toolbar: language switcher (EN/PL/FR/PT) and theme toggle.

[1.3.1]: https://github.com/Agrestor666/pcc2-sleeve-calc/releases/tag/v1.3.1

[1.3.0]: https://github.com/Agrestor666/pcc2-sleeve-calc/releases/tag/v1.3.0

[1.2.0]: https://github.com/Agrestor666/pcc2-sleeve-calc/releases/tag/v1.2.0

[1.1.0]: https://github.com/Agrestor666/pcc2-sleeve-calc/releases/tag/v1.1.0

## [1.0.0] - 2026-05-21

### Added

- Initial release of the web calculator (ASME PCC-2 Art. 2.6 / ASME B31.3).
- Chapter II formula for P &lt; 690 bar (Table A-1 stress lookup).
- Chapter IX Eq. (34a) for P ≥ 690 bar (Table K-1 stress lookup).
- Sleeve outside diameter: **D = OD + 2·GAP + 2·THK**.
- Reference fields: **PAZ** and **AVIS** (shown at top of calculation log).
- THK adequacy alert when required thickness exceeds assumed sleeve THK.
- Calculation log export (PNG, PDF) and copy to clipboard.
- Dialogflow chat assistant (EU).
- Favicon (SVG + PNG) and Open Graph meta tags.

### Notes

- Separate from the AutoCAD/VB.NET tool: [ASME_PCC_2](https://github.com/Agrestor666/ASME_PCC_2).

[1.0.0]: https://github.com/Agrestor666/pcc2-sleeve-calc/releases/tag/v1.0.0
