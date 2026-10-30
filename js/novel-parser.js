// js/novel-parser.js
// Teks di dalam tanda petik = dialog, selain itu = narasi.

// 10 warna siap pakai untuk dialog (semuanya cukup gelap untuk latar putih salju)
export const PALETTE = [
    "#E11D48", "#2563EB", "#059669", "#D97706", "#7C3AED",
    "#0891B2", "#EA580C", "#65A30D", "#C026D3", "#92400E",
];

// Warna pilihan user per dialog (urutan dialog ke-n), disimpan di memori saja
const colors = new Map();
export const setDialogueColor = (index, color) => colors.set(index, color);

// Mendukung " " lurus maupun “ ” melengkung. Petik yang tidak ditutup berakhir di akhir baris.
// -> { segments: [{ text, dialogue, color, pauseAfter, index? }], dialogues: [...] }
export function parseNovel(text) {
    const raw = [];

    text.split(/\r?\n/).forEach((line) => {
        let buf = "";
        let quoted = false;
        const flush = () => {
            const t = buf.trim();
            if (t) raw.push({ text: t, dialogue: quoted });
            buf = "";
        };
        for (const ch of line) {
            if (ch === "“") { flush(); quoted = true; }
            else if (ch === "”") { flush(); quoted = false; }
            else if (ch === '"') { flush(); quoted = !quoted; }
            else buf += ch;
        }
        flush();
    });

    let n = 0;
    const segments = raw.map((s, i) => {
        const next = raw[i + 1];
        const seg = {
            text: s.text,
            dialogue: s.dialogue,
            color: null,
            // jeda ekstra di akhir segmen kalau berikutnya pindah narasi <-> dialog
            pauseAfter: !!next && next.dialogue !== s.dialogue,
        };
        if (s.dialogue) {
            seg.index = n++;
            seg.color = colors.get(seg.index) || PALETTE[0];
        }
        return seg;
    });

    return { segments, dialogues: segments.filter((s) => s.dialogue) };
}

// Padanan lebih terang untuk dark mode (urutan sama dengan PALETTE)
const PALETTE_DARK = [
    "#FB7185", "#60A5FA", "#34D399", "#FBBF24", "#A78BFA",
    "#22D3EE", "#FB923C", "#A3E635", "#E879F9", "#D4A373",
];

// Warna untuk ditampilkan: di dark mode warna palet diganti padanan terangnya.
// Warna custom dari user tidak diubah.
export function themed(color) {
    if (!color) return "";
    if (!document.documentElement.classList.contains("dark")) return color;
    const i = PALETTE.findIndex((c) => c.toLowerCase() === color.toLowerCase());
    return i >= 0 ? PALETTE_DARK[i] : color;
}