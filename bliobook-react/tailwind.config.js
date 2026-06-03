/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

/** @type {import('tailwindcss').Config} */
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        bgColor: 'var(--bg-color)',
        textColor: 'var(--text-color)',
        cardBg: 'var(--card-bg)',
        btnText: 'var(--btn-text-color)',
        inputBorder: 'var(--input-border)',
      }
    },
  },
  plugins: [],
}