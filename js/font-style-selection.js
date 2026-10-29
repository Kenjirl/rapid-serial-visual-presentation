// js/font-style-selection.js
import { saveFont, getSavedFont, setFont } from "./font-storage.js";

const ACTIVE = "bg-cl-18181B text-cl-FFFAFA";
const IDLE = "bg-cl-EDEAEA text-cl-18181B hover:bg-cl-D9D5D5";

export function initFontSwitcher() {
    const fontData = [
        { name: "Default", class: "default" },
        { name: "Lexend", class: "lexend" },
        { name: "Atkinson Hyperlegible", class: "atkinson" },
        { name: "Inter", class: "inter" },
        { name: "IBM Plex Sans", class: "plex" },
        { name: "Roboto Mono", class: "robotomono" },
        { name: "Quicksand", class: "quicksand" },
    ];

    const activeFont = getSavedFont();

    fontData.forEach((font) => {
        const fontClass = `font-${font.class}`;
        const isActive = fontClass === activeFont;

        const button = $(`
            <button data-font="${fontClass}"
                class="font-btn px-4 py-2 rounded-full text-sm transition-colors duration-200 ${isActive ? ACTIVE : IDLE}">
                ${font.name}
            </button>`);

        button.on("click", function () {
            const selected = $(this).data("font");
            setFont("#demoText", selected);
            setFont("#rsvpContainer", selected);
            saveFont(selected);

            $(".font-btn").removeClass(ACTIVE).addClass(IDLE);
            $(this).removeClass(IDLE).addClass(ACTIVE);

            $(document).trigger("rsvp:refit"); // ukuran kata dihitung ulang
        });

        $("#fontButtonContainer").append(button);
    });

    setFont("#demoText", activeFont);
}