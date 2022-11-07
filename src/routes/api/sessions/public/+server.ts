import type {RequestHandler} from '@sveltejs/kit';
import htmlparser2 from 'htmlparser2';
import {selectAll, selectOne} from 'css-select';
import {getAttributeValue, textContent} from 'domutils';
import type { Element } from "domhandler";
import type {PublicSession} from '../../../../lib/models/public-session';

export const GET: RequestHandler = async ({fetch}) => {
  try {
    const response = await fetch('https://online.cockpit-xp.de/');
    const html = await response.text();
    const dom = htmlparser2.parseDocument(html);
    const rows = selectAll('.inhalt tr', dom) as any as Element[];

    const data = rows
      .filter(row => !!selectOne('.beschreibung', row))
      .map(row => ({
        link: selectOne('.beschreibung a', row),
        date: selectOne('.datum', row),
        activeImage: selectOne('.aktiviert img', row),
      }))
      .filter(({link, date, activeImage}) => !!link && !!date && !!activeImage)
      .map(({link, date, activeImage}) => ({
        sessionName: getAttributeValue(link!, 'href'),
        label: textContent(link!),
        date: textContent(date!),
        active: !getAttributeValue(activeImage!, 'src')?.includes('ampel-aus')
    } as PublicSession))

    return new Response(JSON.stringify(data));
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify([]));
  }
}
