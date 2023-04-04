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

    expect(result).toMatch(/uomo_html_[a-f0-9]+\.rule/);
  })

  it('long url with regexp special chars', () => {
    const result = guessFileName({
      baseUrl: '/it/1277-saldi/s-1/taglia-4_anni/brand_2-armani_junior+balmain_kids+calvin_klein_kids+dolce_gabbana_kids+dsquared2+fay_kids+fendi_kids+givenchy_kids+moschino_kids+msgm_kids+ralph_lauren_kids+hugo_boss+diesel/prezzo-15:150/extra_sconto-saldi',
      variants: [
        {
          fullQueryString: undefined,
          destination: 'https://coccolebimbi.com/it-it/c/saldi'
        }
      ]
    })

    expect(result).toMatch(/it_1277-saldi_s-1_taglia-4_anni_brand_2-armani_junior_balmain_kids_calvin_klein_kids_dolce_gabbana_kids_dsquared2_fay_kids_fendi_kids_givenchy_kids_moschino_kids_msgm_kids_ralph_lauren_kids_hugo_boss__[a-f0-9]+\.rule/);
  })





  ///https://redirects.coccolebimbi.com/it/1277-saldi/s-1/taglia-4_anni/brand_2-armani_junior+balmain_kids+calvin_klein_kids+dolce_gabbana_kids+dsquared2+fay_kids+fendi_kids+givenchy_kids+moschino_kids+msgm_kids+ralph_lauren_kids+hugo_boss+diesel/prezzo-15:150/extra_sconto-saldi,
  
  
  
  
})