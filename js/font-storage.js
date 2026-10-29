// js/font-storage.js
const STORAGE_KEY = "rsvp_selected_font";
const DEFAULT_FONT = "font-default";
export const FONT_CLASSES = [
    "font-default", "font-lexend", "font-atkinson", "font-inter",
    "font-plex", "font-robotomono", "font-quicksand",
];

export function saveFont(fontClass) {
    localStorage.setItem(STORAGE_KEY, fontClass);
}

export function getSavedFont() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_FONT;
}

// Ganti hanya class font-*, class lain pada elemen tetap aman
export function setFont(selector, fontClass) {
    $(selector).removeClass(FONT_CLASSES.join(" ")).addClass(fontClass);
}

export function applyFontToElement(selector) {
    const fontClass = getSavedFont();
    setFont(selector, fontClass);
    return fontClass;
}