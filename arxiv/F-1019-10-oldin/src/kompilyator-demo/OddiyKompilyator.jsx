import React from 'react'
import ReactDOM from 'react-dom/client'
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx'

// Oddiy kompilyator sahifasi (13.10): bitta topshiriq — h1, p, a. Darsga bog'lanmagan, faqat ko'rish uchun.
const TASK = {
  eyebrow: { uz: 'Praktika', ru: 'Практика' },
  title: { uz: 'Birinchi sahifangizni yozing', ru: 'Напишите свою первую страницу' },
  brief: {
    uz: "Sarlavha, matn va havola qo'shing — natijani o'ngda ko'rasiz.",
    ru: 'Добавьте заголовок, текст и ссылку — результат увидите справа.',
  },
  requirements: [
    { id: 'h1', label: { uz: '<h1> — sarlavha', ru: '<h1> — заголовок' }, check: C.text('h1', { uz: "`<h1>` ichiga sarlavha yozing", ru: 'Напишите заголовок внутри `<h1>`' }) },
    { id: 'p', label: { uz: '<p> — matn', ru: '<p> — текст' }, check: C.text('p', { uz: "`<p>` ichiga bir-ikki gap yozing", ru: 'Напишите пару предложений внутри `<p>`' }) },
    { id: 'a', label: { uz: '<a> — havola (href bilan)', ru: '<a> — ссылка (с href)' }, check: C.attr('a', 'href', { uz: "`<a href=\"https://...\">matn</a>` havola qo'shing", ru: 'Добавьте ссылку `<a href="https://...">текст</a>`' }) },
  ],
}

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#F6F4EF' }}>
      <HtmlCompiler stage="m1-03" lang="uz" task={TASK} starterCode={'<!-- Bu yerga yozing -->\n\n'}
        storageKey="ccCode:oddiy-kompilyator" onContinue={() => {}} onBack={() => {}} />
    </div>
  )
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
