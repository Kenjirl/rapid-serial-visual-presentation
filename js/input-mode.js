// js/input-mode.js
// Toggle "Plain text" / "Novel" + tabel pewarnaan dialog.
import { PALETTE, parseNovel, setDialogueColor, resetDialogueColors, themed } from "./novel-parser.js";
import { SAMPLES } from "./samples.js";

const KEY = "rsvp_input_mode";
const ON = "bg-cl-18181B text-cl-FFFAFA";
const OFF = "text-cl-2B2D31 hover:bg-cl-D9D5D5";
const RING = "ring-2 ring-offset-1 ring-cl-18181B";

const PLACEHOLDER = {
    plain: "Paste or type the text you want to read...",
    novel: 'Paste or type the text you want to read...\nPut spoken lines inside quotation marks to see the dialogue color table.\nOr use the provided sample.',
};

export const getMode = () => (localStorage.getItem(KEY) === "novel" ? "novel" : "plain");

/* ---------- Popover pemilih warna (satu instance dipakai semua chip) ---------- */
let pop = null;
let cur = null; // { index, chip, paint, color }

function markSwatches() {
    pop.find("button").each(function () {
        $(this).toggleClass(RING, $(this).data("color") === cur.color.toLowerCase());
    });
}

function choose(color) {
    cur.color = color;
    setDialogueColor(cur.index, color);
    cur.paint(color);
    markSwatches();
}

function closePopover() {
    if (pop) pop.addClass("hidden");
    cur = null;
}

function ensurePopover() {
    if (pop) return;
    pop = $('<div class="hidden fixed z-40 w-36 p-2 grid grid-cols-5 gap-1.5 rounded-xl bg-white border border-cl-D9D5D5 shadow-lg"></div>');
    PALETTE.forEach((c) => {
        $(`<button type="button" class="w-5 h-5 rounded-full" style="background:${c}" aria-label="Color ${c}"></button>`)
            .data("color", c.toLowerCase())
            .on("click", () => { choose(c); closePopover(); })
            .appendTo(pop);
    });
    $('<label class="col-span-5 flex items-center justify-between pt-1.5 border-t border-cl-EDEAEA text-[11px] text-cl-8A8A8E">Custom<input type="color" aria-label="Custom color" /></label>')
        .appendTo(pop)
        .find("input")
        .on("input", function () { if (cur) choose(this.value); });
    $("body").append(pop);

    // tutup saat klik di luar, Esc, atau scroll/resize
    $(document).on("click", (e) => {
        if (cur && !$(e.target).closest(pop).length && !$(e.target).closest("#dialogueList button").length) closePopover();
    });
    $(document).on("keydown", (e) => {
        if (e.key === "Escape") closePopover();
    });
    $(window).on("resize scroll", closePopover);
    $("#dialogueScroll").on("scroll", closePopover);
}

function openPopover($chip, index, color, paint) {
    ensurePopover();
    if (cur && cur.chip[0] === $chip[0]) return closePopover(); // klik chip yang sama = tutup
    cur = { index, chip: $chip, paint, color };
    pop.removeClass("hidden").find("input").val(color);
    markSwatches();

    const r = $chip[0].getBoundingClientRect();
    const w = pop.outerWidth();
    const h = pop.outerHeight();
    const left = Math.min(Math.max(8, r.right - w), window.innerWidth - w - 8);
    let top = r.bottom + 6;
    if (top + h > window.innerHeight - 8) top = r.top - h - 6;
    pop.css({ left, top });
}

/* ---------- Tabel dialog ---------- */
function renderDialogues() {
    closePopover();
    const $body = $("#dialogueList").empty();
    if (getMode() !== "novel") return;

    const { dialogues } = parseNovel($("#textInput").val());
    if (!dialogues.length) {
        $body.append('<tr><td colspan="2" class="px-3 py-3 text-center text-cl-8A8A8E">No dialogue found. Put spoken lines inside quotation marks.</td></tr>');
        return;
    }

    dialogues.forEach((d) => {
        const $tr = $('<tr><td class="px-3 py-1.5"><div class="truncate"></div></td><td class="px-2 py-1.5 text-right"></td></tr>');
        const $text = $tr.find("div").text(d.text).attr("title", d.text);

        const $chip = $(`
            <button type="button" aria-haspopup="true" aria-label="Change color"
                class="inline-flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-cl-D9D5D5 bg-cl-FFFAFA hover:bg-cl-EDEAEA transition-colors">
                <span class="dot w-4 h-4 rounded-full"></span>
                <i class="fa-solid fa-chevron-down text-[9px] text-cl-8A8A8E" aria-hidden="true"></i>
            </button>`);

        let now = d.color;
        const paint = (color) => {
            now = color;
            $text.css("color", themed(color));
            $chip.find(".dot").css("background", color);
            $chip.attr("aria-label", `Change color (current ${color})`);
        };
        paint(d.color);

        $chip.on("click", () => openPopover($chip, d.index, now, paint));
        $tr.children().last().append($chip);
        $body.append($tr);
    });
}


/* ---------- Mode ---------- */
function setMode(mode) {
    localStorage.setItem(KEY, mode);
    $("#modeToggle button").each(function () {
        const active = $(this).data("mode") === mode;
        $(this).removeClass(ON + " " + OFF).addClass(active ? ON : OFF).attr("aria-pressed", active);
    });
    $("#novelHint, #dialoguePanel").toggleClass("hidden", mode !== "novel");
    $("#textInput").attr("placeholder", PLACEHOLDER[mode]);
    renderDialogues();
    $(document).trigger("rsvp:modechange");
}

export function initInputMode() {
    $("#modeToggle button").on("click", function () {
        setMode($(this).data("mode"));
    });

    // Isi textarea dengan contoh sesuai mode yang sedang dipilih
    $("#sampleBtn").on("click", () => {
        const mode = getMode();
        const sample = SAMPLES[mode];
        const $ta = $("#textInput");
        const current = $ta.val().trim();
        if (current && current !== sample.text.trim() && !window.confirm("Replace the current text with the sample?")) return;

        if (mode === "novel") sample.colors.forEach((p, i) => setDialogueColor(i, PALETTE[p]));
        $ta.val(sample.text).trigger("input");
        renderDialogues();
        $(document).trigger("rsvp:sample");
    });

    // Tombol Clear: tampil hanya saat textarea berisi teks
    const syncClear = () => $("#clearBtn").toggleClass("hidden", !$("#textInput").val());
    $("#textInput").on("input", syncClear);
    $("#clearBtn").on("click", () => {
        resetDialogueColors(); // warna dialog lama tidak boleh terbawa ke teks berikutnya
        $("#textInput").val("").trigger("input").trigger("focus");
        $("#scanStatus").addClass("hidden").text("");
        renderDialogues();
        $(document).trigger("rsvp:textreplaced"); // hentikan bacaan & reset counter
    });
    syncClear();

    let t;
    $("#textInput").on("input", () => {
        clearTimeout(t);
        t = setTimeout(renderDialogues, 300);
    });

    $(document).on("theme:change", renderDialogues); // warna dialog menyesuaikan tema

    setMode(getMode());
}