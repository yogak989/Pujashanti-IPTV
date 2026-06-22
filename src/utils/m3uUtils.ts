import { Channel } from '../types';

export function base64ToHex(base64: string): string {
  if (base64.length > 0) {
    const raw = atob(base64);
    let hex = '';
    for (let i = 0; i < raw.length; i++) {
      let char = raw.charCodeAt(i).toString(16);
      hex += (char.length === 1 ? '0' : '') + char;
    }
    return hex;
  }
  return base64;
}

export function convertToHttps(url: string): string {
  return url.replace(/^http:/, 'https:');
}

export function extractKey(line: string) {
  const prefix = '#KODIPROP:inputstream.adaptive.license_key=';
  const extractedValue = line.substring(line.indexOf(prefix) + prefix.length);

  try {
    const json = JSON.parse(extractedValue);
    if (json && json.keys && json.keys.length > 0) {
      const KEY = base64ToHex(json.keys[0].k);
      const ID = base64ToHex(json.keys[0].kid);
      return { 'key_id': ID, 'key': KEY };
    }
  } catch (error) {
    return null;
  }
  return null;
}

export function parseM3U(content: string): Channel[] {
  const lines = content.split('\n');
  const items: Channel[] = [];
  let currentItem: any = null;

  for (let line of lines) {
    line = line.trim();

    if (line.match(/^#EXTINF:?(-?\d+)?/)) {
      currentItem = { id: Date.now().toString() + Math.random(), url: '', name: '' };

      const tvgNameMatch = line.match(/tvg-name="([^"]+)"/);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupTitleMatch = line.match(/group-title="([^"]+)"/);

      if (tvgNameMatch) currentItem.name = tvgNameMatch[1];
      if (tvgLogoMatch) currentItem.tvgLogo = convertToHttps(tvgLogoMatch[1]);
      if (groupTitleMatch) {
        currentItem.groupTitle = groupTitleMatch[1];
        currentItem.category = groupTitleMatch[1];
      }

      if (!currentItem.name) {
        const lastCommaIndex = line.lastIndexOf(",");
        if (lastCommaIndex !== -1) currentItem.name = line.substring(lastCommaIndex + 1).trim();
      }
    } else if (line.startsWith('#KODIPROP:')) {
      if (currentItem) {
        const keyInfo = extractKey(line);
        if (keyInfo) currentItem.key = keyInfo;
      }
    } else if (line.length > 0 && !line.startsWith('#')) {
      if (currentItem) {
        currentItem.url = convertToHttps(line);
        items.push(currentItem);
        currentItem = null;
      }
    }
  }
  return items;
}
