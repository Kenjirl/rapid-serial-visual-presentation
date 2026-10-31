// js/scan.js
// Scan teks dari foto (kamera atau galeri) memakai OCR di browser (Tesseract.js).
// Mesin OCR baru diunduh saat tombol Scan dipakai pertama kali. Foto tidak diunggah ke server mana pun.
import { getMode } from "./input-mode.js";

const TESSERACT_SRC = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
const OCR_LANGS = ["eng", "ind"]; // bahasa yang dikenali; tambahkan kode bahasa lain bila perlu
const MAX_SIDE = 2000; // sisi terpanjang foto diperkecil ke ukuran ini sebelum OCR

let workerPromise = null;
let busy = false;
let onProgress = () => {};

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (window.Tesseract) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = () => reject(new Error("Could not load the OCR engine. Check your connection."));
        document.head.appendChild(s);
    });
}

function getWorker() {
    if (!workerPromise) {
        workerPromise = loadScript(TESSERACT_SRC)
            .then(() => window.Tesseract.createWorker(OCR_LANGS, 1, { logger: (m) => onProgress(m) }))
            .catch((e) => {
                workerPromise = null;
                throw e;
            });
    }
    return workerPromise;
}

// Perkecil foto, ubah ke abu-abu dan naikkan kontras supaya OCR lebih cepat dan akurat
async function prepare(file) {
    const url = URL.createObjectURL(file);
    try {
        const img = await new Promise((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = () => reject(new Error("Could not open that image."));
            i.src = url;
        });
        const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = frame.data;
        for (let k = 0; k < d.length; k += 4) {
            const gray = 0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2];
            const v = Math.max(0, Math.min(255, (gray - 128) * 1.4 + 128));
            d[k] = d[k + 1] = d[k + 2] = v;
        }
        ctx.putImageData(frame, 0, 0);
        return canvas;
    } finally {
        URL.revokeObjectURL(url);
    }
}

// Rapikan hasil OCR: sambung kata yang terpotong tanda hubung di akhir baris,
// gabungkan baris dalam satu paragraf. Mode novel: 1 paragraf = 1 baris (dibutuhkan parser dialog).
export function cleanText(raw, mode) {
    return raw
        .replace(/\r/g, "")
        .replace(/(\p{L})-\n(\p{Ll})/gu, "$1$2")
        .split(/\n\s*\n/)
        .map((p) => p.replace(/\s*\n\s*/g, " ").replace(/[ \t]{2,}/g, " ").trim())
        .filter(Boolean)
        .join(mode === "novel" ? "\n" : "\n\n");
}

function status(msg) {
    $("#scanStatus").text(msg).removeClass("hidden");
}

function setBusy(on) {
    busy = on;
    $("#scanBtn").prop("disabled", on).find("i").attr("class", on ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-camera");
}

async function handleFiles(files) {
    if (busy || !files.length) return;
    setBusy(true);
    try {
        status("Preparing the text reader (first time only)...");
        const worker = await getWorker();
        const found = [];

        for (let i = 0; i < files.length; i++) {
            const label = files.length > 1 ? `Photo ${i + 1} of ${files.length}: ` : "";
            status(`${label}preparing image...`);
            const canvas = await prepare(files[i]);

            onProgress = (m) => {
                if (m.status === "recognizing text") status(`${label}reading text... ${Math.round(m.progress * 100)}%`);
            };
            const { data } = await worker.recognize(canvas);
            const text = cleanText(data.text, getMode());
            if (text) found.push(text);
        }

        if (!found.length) return status("No text found. Try a sharper, well-lit photo taken straight above the page.");

        const $ta = $("#textInput");
        const sep = getMode() === "novel" ? "\n" : "\n\n";
        const prev = $ta.val().trim();
        $ta.val((prev ? prev + sep : "") + found.join(sep)).trigger("input");
        $(document).trigger("rsvp:textreplaced");
        status("Text added. Please check it before reading, OCR can make mistakes.");
    } catch (e) {
        status(e.message || "Scan failed. Please try again.");
    } finally {
        onProgress = () => {};
        setBusy(false);
        $("#scanInput").val(""); // agar foto yang sama bisa dipilih lagi
    }
}

export function initScan() {
    $("#scanBtn").on("click", () => $("#scanInput").trigger("click"));
    $("#scanInput").on("change", function () {
        handleFiles(Array.from(this.files));
    });
}