import React from 'react'
import ReactDOM from 'react-dom/client'
import M34DemoApp from '../m34-demo/M34DemoApp.jsx'

// 3-Modul ko'rik-demosi: katalog va darslar UZ-RU. 4-Modul ko'rsatilmaydi.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <M34DemoApp only={['m3']} />
  </React.StrictMode>,
)
