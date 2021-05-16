import { readAll } from '../RedirectFileReader';
import * as path from 'path';
import { Location } from '../Location';

describe('RedirectFileReader', () => {

  describe('readAll', () => {
    it('testRedirectFile is read', async () => {
      const result = await readAll(path.join(__dirname, './testRedirectFile.csv'),undefined);

      const expected: Location[] = [
        {
         baseUrl: '/uomo.html',
         variants: [
          {
           destination: 'https://prod.pittarosso.com/it/scarpe-uomo-c',
           fullQueryString: undefined,
          },
          {
           destination: 'https://prod.pittarosso.com/it/contenuto-non-piu-disponibile',
           fullQueryString: "cat=591"
          },
          {
           destination: 'https://prod.pittarosso.com/it/contenuto-non-piu-disponibile',
           fullQueryString: "brand=1656"
          }
         ]
        }
       ];

      expect(result).toEqual(expected);
    })
    
  });
})