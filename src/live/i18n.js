// Jonli-modul tarjimoni. Darslardagi modul-darajali `tr` bilan bir xil semantika:
// string/JSX o'zgarishsiz o'tadi, {uz, ru} obyektdan joriy til olinadi.
// Dars ildizi mount bo'lganda `setLiveLang(lang)` chaqiradi (o'zining `__lang = lang` qatori yonida).
import React from 'react';

let liveLang = 'uz';

export const setLiveLang = (lang) => { liveLang = lang === 'ru' ? 'ru' : 'uz'; };
export const getLiveLang = () => liveLang;

export const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[liveLang] ?? node.uz ?? node.ru ?? '';
};
