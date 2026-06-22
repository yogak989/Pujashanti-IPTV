import { EPGProgram } from '../types';

export function parseXMLTV(xmlString: string): Record<string, EPGProgram[]> {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  const programmes = xmlDoc.getElementsByTagName('programme');
  const epgData: Record<string, EPGProgram[]> = {};

  for (let i = 0; i < programmes.length; i++) {
    const programme = programmes[i];
    const channelId = programme.getAttribute('channel') || '';
    const title = programme.getElementsByTagName('title')[0]?.textContent || '';
    const desc = programme.getElementsByTagName('desc')[0]?.textContent || '';
    const start = programme.getAttribute('start') || '';
    const stop = programme.getAttribute('stop') || '';

    if (!epgData[channelId]) {
      epgData[channelId] = [];
    }

    epgData[channelId].push({ title, desc, start, stop });
  }

  return epgData;
}
