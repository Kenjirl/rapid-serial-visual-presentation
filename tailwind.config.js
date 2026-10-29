const config = {
    theme: {
        extend: {
            colors: {
                "cl-FFFAFA": "#FFFAFA", // snow white (background)
                "cl-EDEAEA": "#EDEAEA", // border / soft surface
                "cl-D9D5D5": "#D9D5D5", // hover surface
                "cl-8A8A8E": "#8A8A8E", // muted text
                "cl-2B2D31": "#2B2D31", // charcoal (buttons)
                "cl-18181B": "#18181B", // ink (main text)
            },
        },
    },
};

if (typeof tailwind !== "undefined") {
    tailwind.config = config;
}

if (typeof module !== "undefined") {
    module.exports = config;
}