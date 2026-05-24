/**
 * Retirement thickness TR [mm] vs standard pipe OD (ASME B36.10M).
 * Source: Totalenergies wall-thickness sheet (GS-EP-PVV-112 §5.2.2.3), column TR.
 * Sorted ascending by odMm for bracket lookup.
 */
const TR_BY_NPS = [
    { nps: '1/2"', odMm: 21.34, trMm: 1.0 },
    { nps: '3/4"', odMm: 26.67, trMm: 1.0 },
    { nps: '1"', odMm: 33.4, trMm: 1.5 },
    { nps: '1-1/2"', odMm: 48.26, trMm: 1.5 },
    { nps: '2"', odMm: 60.33, trMm: 1.5 },
    { nps: '3"', odMm: 88.9, trMm: 1.5 },
    { nps: '4"', odMm: 114.3, trMm: 1.5 },
    { nps: '6"', odMm: 168.28, trMm: 1.5 },
    { nps: '8"', odMm: 219.08, trMm: 1.5 },
    { nps: '10"', odMm: 273.05, trMm: 2.3 },
    { nps: '12"', odMm: 323.85, trMm: 2.8 },
    { nps: '14"', odMm: 355.6, trMm: 2.8 },
    { nps: '16"', odMm: 406.4, trMm: 3.1 },
    { nps: '18"', odMm: 457.2, trMm: 3.1 },
    { nps: '20"', odMm: 508.0, trMm: 3.1 },
    { nps: '24"', odMm: 609.6, trMm: 3.1 },
    { nps: '26"', odMm: 660.4, trMm: 3.8 },
    { nps: '28"', odMm: 711.2, trMm: 3.8 },
    { nps: '30"', odMm: 762.0, trMm: 3.8 },
    { nps: '32"', odMm: 812.8, trMm: 3.8 },
    { nps: '34"', odMm: 863.6, trMm: 3.8 },
    { nps: '36"', odMm: 914.4, trMm: 3.8 },
    { nps: '38"', odMm: 965.2, trMm: 4.6 },
    { nps: '40"', odMm: 1016.0, trMm: 4.6 },
    { nps: '42"', odMm: 1066.8, trMm: 4.6 },
    { nps: '44"', odMm: 1117.6, trMm: 4.6 },
    { nps: '46"', odMm: 1168.4, trMm: 4.6 },
    { nps: '48"', odMm: 1219.2, trMm: 5.3 },
    { nps: '52"', odMm: 1320.8, trMm: 6.4 },
    { nps: '54"', odMm: 1371.6, trMm: 6.4 },
    { nps: '56"', odMm: 1422.4, trMm: 6.4 },
    { nps: '60"', odMm: 1524.0, trMm: 6.4 }
];
