// js/theme.js
// Pilihan tema: light | dark | system (mengikuti OS). Disimpan di localStorage.
const KEY = "rsvp_theme";
const ON = "bg-cl-18181B text-cl-FFFAFA";
const OFF = "text-cl-2B2D31 hover:bg-cl-D9D5D5";
const media = window.matchMedia("(prefers-color-scheme: dark)");

export const getTheme = () => localStorage.getItem(KEY) || "system";

function apply() {
    const theme = getTheme();
    const dark = theme === "dark" || (theme === "system" && media.matches);
    document.documentElement.classList.toggle("dark", dark);

    $("#themeToggle button").each(function () {
        const active = $(this).data("theme") === theme;
        $(this).removeClass(ON + " " + OFF).addClass(active ? ON : OFF).attr("aria-pressed", active);
    });
    $(document).trigger("theme:change");
}

export function setTheme(theme) {
    localStorage.setItem(KEY, theme);
    apply();
}

export function initTheme() {
    $(document).on("click", "#themeToggle button", function () {
        setTheme($(this).data("theme"));
    });
    media.addEventListener("change", () => {
        if (getTheme() === "system") apply();
    });
    apply();
}