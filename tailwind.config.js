/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                montserrat: ["var(--font-montserrat)"],
                lato: ["var(--font-lato)"],
            },
        },
    },
    plugins: [],
};