import { fontSelectorModalHTML } from "../components/font-selector.js";
import { settingContainerHTML } from "../components/setting-container.js";
import { initFontSwitcher } from "./font-style-selection.js";
import { applyFontToElement } from "./font-storage.js";
import { initRSVPControls } from "./rsvp.js";

$(document).ready(function () {
    $("#modalRoot").html(fontSelectorModalHTML);
    $("#settingContainerRoot").html(settingContainerHTML);

    applyFontToElement("#rsvpContainer");

    const $modal = () => $("#fontSwitcherContainer");
    const openModal = () => $modal().css({ visibility: "visible", opacity: 1, pointerEvents: "auto" });
    const closeModal = () => $modal().css({ visibility: "hidden", opacity: 0, pointerEvents: "none" });

    $("#openFontSwitcher").on("click", openModal);
    $(document).on("click", "#closeFontSwitcher", closeModal);
    $(document).on("click", "#fontSwitcherContainer", (e) => {
        if (e.target.id === "fontSwitcherContainer") closeModal(); // klik di luar panel
    });
    $(document).on("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    initFontSwitcher();
    initRSVPControls();
});