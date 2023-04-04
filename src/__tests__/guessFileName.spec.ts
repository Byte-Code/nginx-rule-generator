import { guessFileName } from "../file-name-generator";

describe('guessFileName', () => {
  it('should return a file name', () => {
    const result = guessFileName({
      baseUrl: '/uomo.html',
      variants: [
        {
          fullQueryString: undefined,
          destination: 'https://prod.pittarosso.com/it/scarpe-uomo-c'
        },
        {
          fullQueryString: 'brand=1909',
          destination: 'https://prod.pittarosso.com/it/scarpe-uomo-c'
        },
        {
          fullQueryString: 'cat=527&color=379&size=279',
          destination: 'https://prod.pittarosso.com/it/contenuto-non-piu-disponibile'
        },
      ]
    });

    expect(result).toMatch(/uomo_html_[a-z0-9-]+\.rule/);
  })
})