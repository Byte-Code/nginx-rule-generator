import * as fs from 'fs';
import parse from 'csv-parse';
import * as url from 'url';
import { Location } from './Location';


const readAllFile = (fileName: string) => fs.readFileSync(fileName).toString("utf-8");

const parseSourceUrl = (sourceUrl: string) => {
  const splitted = sourceUrl.split('?');
  const parsed = url.parse(splitted[0]);
  const pathname = parsed.pathname as string;
  const serverName = parsed.hostname;
  return { serverName, baseUrl: pathname, fullQueryString: (splitted.length === 2 ? splitted[1] : undefined)};
}

export const readAll = (fileName: string, targetServerName: string | undefined) => {
  return new Promise<Location[]>((resolve, reject) => {
    parse(readAllFile(fileName), {
      skipEmptyLines: true,
      fromLine: 2,
      columns: [
        'sourceUrl', 'destination'
      ]
    }, (err, output: {sourceUrl: string, destination: string}[]) => {
      if (err) {
        return reject(err);        
      }

      const mappedItems = output.map(({ destination , sourceUrl }) => {      
        const parsedData = parseSourceUrl(sourceUrl);
        return { destination , ... parsedData };
      }).filter(item => targetServerName === undefined || item.serverName === targetServerName);
  
      const reduced = mappedItems.reduce((accumulator, item) => {
        if (!accumulator.has(item.baseUrl)) {
          accumulator.set(item.baseUrl, { baseUrl: item.baseUrl, variants: [] });
        }
  
        const location = accumulator.get(item.baseUrl);
        
        const existingItem = location?.variants.find((currentItem) => currentItem.fullQueryString === item.fullQueryString);

        if (!existingItem) {
          location?.variants.push({
            destination: item.destination,
            fullQueryString: item.fullQueryString
          })
        } else if (existingItem.destination !== item.destination) {
          console.warn(`Skipping duplicate fullquerystring with different destination '${location?.baseUrl}' '${existingItem.fullQueryString ? existingItem.fullQueryString : ''}' '${existingItem.destination}' '${item.destination}'`)
        }        
  
        return accumulator;
      }, new Map<string,Location>())
      const result = new Array(... reduced.values());
      return resolve(result);      
    })
  })
  
}
