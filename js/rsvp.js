// js/rsvp.js
import { parseNovel, themed } from "./novel-parser.js";
import { getMode } from "./input-mode.js";

const MAX_CHARS = 14; // kata lebih panjang dari ini dipecah jadi beberapa bagian

let words = [];
let index = 0; // indeks kata berikutnya yang akan ditampilkan
let timer = null;
let state = "idle"; // idle | playing | paused | done

const getWPM = () => parseInt($("#speedSlider").val(), 10);

// "extraordinarily" -> ["extraordi-", "narily"]
function splitLong(word) {
    if (word.length <= MAX_CHARS) return [word];
    const n = Math.ceil(word.length / MAX_CHARS);
    const size = Math.ceil(word.length / n);
    return Array.from({ length: n }, (_, i) => {
        const part = word.slice(i * size, (i + 1) * size);
        return i < n - 1 ? part + "-" : part;
    }).filter((p) => p !== "-");
}

const TRANSITION_PAUSE = 0.6; // jeda ekstra (x delay dasar) saat pindah narasi <-> dialog

// -> [{ text, color, pause }]; narasi: color null
function tokenize(text) {
    const segments = getMode() === "novel" ? parseNovel(text).segments : [{ text }];
    return segments.flatMap((s) => {
        const toks = s.text.trim().split(/\s+/).filter(Boolean).flatMap(splitLong);
        return toks.map((t, i) => ({
            text: t,
            color: s.color || null,
            pause: s.pauseAfter && i === toks.length - 1 ? TRANSITION_PAUSE : 0,
        }));
    });
}

// Kata panjang & tanda baca tampil sedikit lebih lama
function delayFor(token) {
    const word = token.text;
    let extra = 0;
    if (/[.!?]["')]*$/.test(word)) extra = 1;
    else if (/[,;:]["')]*$/.test(word)) extra = 0.5;
    extra = Math.max(extra, token.pause || 0); // transisi petik tidak menumpuk dengan tanda baca
    const mult = 1 + extra + (word.length > 8 ? 0.3 : 0);
    return (60000 / getWPM()) * mult;
}

// Kecilkan font sampai kata muat di lebar container (kata selalu terlihat utuh)
function fit() {
    const box = $("#rsvpContainer")[0];
    const $w = $("#rsvpWord");
    const base = Math.min(box.clientHeight * 0.8, 360);
    $w.css("font-size", base + "px");
    const w = $w[0].getBoundingClientRect().width;
    if (w > box.clientWidth) {
        $w.css("font-size", Math.max((base * box.clientWidth) / w, 14) + "px");
    }
}

function updateMeta() {
    const count = tokenize($("#textInput").val()).length;
    const secs = Math.round((count * 60) / getWPM());
    const t = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
    $("#textMeta").text(`${count} words · about ${t}`);
}

function updateUI() {
    const label = { idle: ["fa-play", "Start"], playing: ["fa-pause", "Pause"], paused: ["fa-play", "Resume"], done: ["fa-rotate-right", "Replay"] }[state];
    $("#playBtn i").attr("class", `fa-solid ${label[0]} mr-2`);
    $("#playBtn span").text(label[1]);
}

function show(i) {
    const w = words[i];
    $("#rsvpWord").text(w.text).css("color", themed(w.color)).removeClass("text-cl-8A8A8E").addClass("text-cl-18181B");
    fit();
    $("#progressBar").css("width", `${((i + 1) / words.length) * 100}%`);
    $("#wordCounter").text(`${i + 1} / ${words.length}`);
}

function step() {
    show(index);
    const wait = delayFor(words[index]);
    index++;
    timer = setTimeout(index >= words.length ? finish : step, wait);
}

function finish() {
    timer = null;
    state = "done";
    updateUI();
}

function play() {
    if (state === "playing") return pause();
    if (state === "paused") {
        state = "playing";
        updateUI();
        return step();
    }
    words = tokenize($("#textInput").val());
    if (!words.length) return $("#textInput").trigger("focus");
    index = 0;
    state = "playing";
    updateUI();
    step();
}

function pause() {
    clearTimeout(timer);
    timer = null;
    state = "paused";
    updateUI();
}

function stop() {
    clearTimeout(timer);
    timer = null;
    state = "idle";
    index = 0;
    $("#rsvpWord").text("Ready").css("color", "").removeClass("text-cl-18181B").addClass("text-cl-8A8A8E");
    fit();
    $("#progressBar").css("width", "0%");
    $("#wordCounter").text("0 / 0");
    updateUI();
}

function restart() {
    stop();
    play();
}

function seek(delta) {
    if (!words.length || state === "idle") return;
    const cur = Math.max(0, Math.min(words.length - 1, index - 1 + delta));
    clearTimeout(timer);
    index = cur + 1;
    show(cur);
    if (state === "done") { state = "paused"; updateUI(); }
    if (state === "playing") timer = setTimeout(index >= words.length ? finish : step, delayFor(words[cur]));
}

export function initRSVPControls() {
    $("#playBtn").on("click", play);
    $("#stopBtn").on("click", stop);
    $("#restartBtn").on("click", restart);

    $("#speedSlider").on("input", function () {
        $("#speedValue").text($(this).val());
        updateMeta();
    });
    $("#textInput").on("input", updateMeta);

    $(window).on("resize", fit);
    $(document).on("rsvp:refit", fit);
    $(document).on("rsvp:modechange", updateMeta);

    $(document).on("keydown", function (e) {
        const tag = e.target.tagName;
        if (tag === "TEXTAREA" || tag === "INPUT" || tag === "BUTTON") return;
        if (e.code === "Space") { e.preventDefault(); play(); }
        else if (e.code === "ArrowLeft") seek(-1);
        else if (e.code === "ArrowRight") seek(1);
    });

    updateMeta();
    updateUI();
    fit();
}