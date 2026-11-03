// Dev-demo (faqat lokal, F-1103-02): tekshiruv ekrani dizayn variantlari. URL: /mentor-demo.html?s=0 (A) · ?s=1 (B)
import React from 'react';
import { createRoot } from 'react-dom/client';
import DemoMcLesson from './DemoMcLesson.jsx';
const q = new URLSearchParams(location.search);
createRoot(document.getElementById('root')).render(<DemoMcLesson lang="uz" startAt={q.get('s') != null ? Number(q.get('s')) : 0} />);
