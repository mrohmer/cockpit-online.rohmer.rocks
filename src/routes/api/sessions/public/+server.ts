import type {RequestHandler, RequestEvent} from '@sveltejs/kit';
import {parseDocument} from 'htmlparser2';
import {selectAll, selectOne} from 'css-select';
import {getAttributeValue, textContent} from 'domutils';
import type { Element } from "domhandler";
import type {PublicSession} from '$lib/models/public-session';

export const GET: RequestHandler = async ({fetch}) => {
  const data = await getData(fetch);

  return new Response(JSON.stringify({data, date: new Date()}))
}
const getData = async (fetch: RequestEvent['fetch']) => {
  try {
    const response = await fetch('https://online.cockpit-xp.de/');
    const html = await response.text();
    const dom = parseDocument(html);
    const rows = selectAll('.inhalt tr', dom) as any as Element[];

    return rows
      .filter(row => !!selectOne('.beschreibung', row))
      .map(row => ({
        link: selectOne('.beschreibung a', row),
        date: selectOne('.datum', row),
        activeImage: selectOne('.aktiviert img', row),
      }))
      .filter(({link, date, activeImage}) => !!link && !!date && !!activeImage)
      .map(({link, date, activeImage}) => ({
        sessionName: getAttributeValue(link!, 'href'),
        label: textContent(link!)?.trim(),
        date: parseDate(textContent(date!)?.trim()),
        active: !getAttributeValue(activeImage!, 'src')?.includes('ampel-aus')
      } as PublicSession))
  } catch (e) {
    console.error(e);
    return [];
  }
}
const parseDate = (dateStr: string|undefined): Date|undefined => {
  if (!dateStr || dateStr.trim().length < 10) {
    return undefined
  }

  const {day, month, year} = /^(?<day>(0[1-9]|[12][0-9]|3[01]))\.(?<month>(0[1-9]|1[0-2]))\.(?<year>20[2-9][0-9])$/.exec(dateStr)?.groups ?? {};
  const dayParsed = +day;
  const monthParsed = +month;
  const yearParsed = +year;

  if (!dayParsed || !monthParsed || !yearParsed) {
    return undefined;
  }

  const date = new Date();
  date.setDate(dayParsed);
  date.setMonth(monthParsed - 1);
  date.setFullYear(yearParsed)
  return date;
}
