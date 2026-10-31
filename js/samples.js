// js/samples.js
// Contoh teks untuk tombol "Use sample" (dipilih sesuai mode input).

export const SAMPLES = {
    // Satu paragraf, sudut pandang orang ketiga
    plain: {
        text: "On a scorching afternoon, Kancil the mouse-deer walked along the riverbank, hungry and thirsty. Across the river he spotted a field of ripe cucumbers, but in the water a pack of crocodiles lay waiting with their jaws wide open. Kancil thought for a moment, then smiled and announced that the King of the Forest would share meat with every crocodile, as long as they lined up along the river so he could count them. The greedy crocodiles quickly formed a neat line from one bank to the other, and Kancil hopped across their backs one by one, counting aloud, until he safely reached the far side. From there he laughed and thanked them for the bridge, while the crocodiles could only sit in silence, fooled by the clever little trickster.",
    },

    // Narasi + dialog (di dalam tanda petik)
    novel: {
        text: `On a scorching afternoon, Kancil arrived at the bank of a wide river.
"Those cucumbers must be so sweet," he murmured.
But in the water, a pack of crocodiles lurked with glowing eyes.
"Hey, Kancil! Where do you think you're going?" asked the Crocodile.
Kancil smiled, then said, "The King of the Forest will share meat with all of you. Line up, so I can count you."
The crocodiles lined up neatly from one bank to the other.
"One, two, three..." Kancil counted as he hopped across their backs.
Once on the far side, he laughed cheerfully. "Thanks for the bridge, my friends!"
The crocodiles could only sit in silence, ashamed to have been fooled.`,
        // Warna awal tiap dialog (indeks PALETTE): Kancil biru, Buaya merah
        colors: [1, 0, 1, 1, 1],
    },
};