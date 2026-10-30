// components/font-selector.js  (panel pengaturan: tema + font)
export const fontSelectorModalHTML = `
<div id="fontSwitcherContainer" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-200">
    <div role="dialog" aria-modal="true" aria-label="Settings" class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cl-FFFAFA border border-cl-EDEAEA rounded-3xl shadow-xl p-8">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-cl-18181B">Settings</h2>
            <button id="closeFontSwitcher" aria-label="Close" class="w-9 h-9 rounded-full text-cl-2B2D31 hover:bg-cl-EDEAEA transition-colors">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <section class="mb-8">
            <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-cl-8A8A8E text-center">Appearance</h3>
            <div class="flex justify-center">
                <div id="themeToggle" class="inline-flex p-1 rounded-full bg-cl-EDEAEA text-sm">
                    <button data-theme="light" aria-pressed="false" class="px-4 py-1.5 rounded-full transition-colors"><i class="fa-solid fa-sun mr-2"></i>Light</button>
                    <button data-theme="dark" aria-pressed="false" class="px-4 py-1.5 rounded-full transition-colors"><i class="fa-solid fa-moon mr-2"></i>Dark</button>
                    <button data-theme="system" aria-pressed="false" class="px-4 py-1.5 rounded-full transition-colors"><i class="fa-solid fa-desktop mr-2"></i>System</button>
                </div>
            </div>
        </section>

        <section>
            <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-cl-8A8A8E text-center">Font</h3>
            <div id="demoText" class="font-default text-3xl text-cl-18181B mb-6 text-center">
                The quick brown fox jumps over the lazy dog
            </div>
            <div id="fontButtonContainer" class="flex flex-wrap gap-2 justify-center"></div>
        </section>
    </div>
</div>
`;