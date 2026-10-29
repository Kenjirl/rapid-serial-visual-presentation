// components/font-selector.js
export const fontSelectorModalHTML = `
<div id="fontSwitcherContainer" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-200">
    <div role="dialog" aria-modal="true" aria-label="Font settings" class="w-full max-w-2xl bg-cl-FFFAFA border border-cl-EDEAEA rounded-3xl shadow-xl p-8">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-cl-18181B">Font</h2>
            <button id="closeFontSwitcher" aria-label="Close" class="w-9 h-9 rounded-full text-cl-2B2D31 hover:bg-cl-EDEAEA transition-colors">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div id="demoText" class="font-default text-3xl text-cl-18181B mb-8 text-center">
            The quick brown fox jumps over the lazy dog
        </div>
        <div id="fontButtonContainer" class="flex flex-wrap gap-2 justify-center"></div>
    </div>
</div>
`;