<div align="center">

<img src="public/icon/android-chrome-192x192.png" alt="Fast Read logo" width="96" height="96" />

# Fast Read

**Rapid Serial Visual Presentation, made calm.**
One word at a time. Big, centered, and impossible to lose your place.

![HTML5](https://img.shields.io/badge/HTML5-18181B?style=for-the-badge&logo=html5&logoColor=FFFAFA)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-2B2D31?style=for-the-badge&logo=tailwindcss&logoColor=FFFAFA)
![jQuery](https://img.shields.io/badge/jQuery_3.7-18181B?style=for-the-badge&logo=jquery&logoColor=FFFAFA)
![ES Modules](https://img.shields.io/badge/ES_Modules-2B2D31?style=for-the-badge&logo=javascript&logoColor=FFFAFA)

</div>

<br />

<p align="center">
  <img src="docs/screenshots/main.png" alt="Fast Read main view" width="820" />
</p>

## What is this?

Fast Read is a small web app for **speed reading with RSVP** (Rapid Serial Visual Presentation). Instead of moving your eyes across a page, the words appear one by one in the same spot, so your eyes stay still and your brain does the reading.

Paste any text, pick a speed, press **Start**.

## Highlights

| | Feature | Details |
|---|---|---|
| 🎯 | **Single-column stage** | The current word fills 80% of the screen width, nothing else competes for attention. |
| 📐 | **Auto-fit text** | Font size is recalculated for every word, so long words shrink instead of getting cut off. |
| ✂️ | **Long-word splitting** | Words over 14 characters are split with a hyphen (`extraordi-` → `narily`) to stay readable on small screens. |
| ⏱️ | **Natural rhythm** | Punctuation and long words stay on screen a bit longer than short ones. |
| 🚀 | **100 – 900 WPM** | Adjust speed live, even while reading. |
| 📊 | **Progress and estimates** | Progress bar, word counter and an estimated reading time. |
| 🔤 | **7 fonts** | Default, Lexend, Atkinson Hyperlegible, Inter, IBM Plex Sans, Roboto Mono and Quicksand. Your choice is remembered. |
| ⌨️ | **Keyboard friendly** | Full control without touching the mouse. |

## Screenshots

<table>
  <tr>
    <td align="center"><b>Settings</b><br /><img src="docs/screenshots/settings.png" alt="Font settings" width="480" /></td>
    <td align="center"><b>Mobile</b><br /><img src="docs/screenshots/mobile.png" alt="Mobile view" width="190" /></td>
  </tr>
</table>

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Space` | Start / pause / resume |
| `←` | Previous word |
| `→` | Next word |
| `Esc` | Close the settings panel |

Shortcuts are paused while you type in the text box.


## How it works

1. The text is split on whitespace and long words are broken into chunks.
2. A chain of `setTimeout` calls shows one word at a time. Delay = `60000 / WPM`, multiplied for punctuation and long words. Changing the slider applies from the next word.
3. After each word, the font size is fitted to the stage width.
4. The chosen font is saved in `localStorage` and applied on every visit.


<div align="center">
<sub>Built with focus, one word at a time.</sub>
</div>