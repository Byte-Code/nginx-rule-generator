import { generateSingleRuleItem, generateRule, generateLocationRule, Location } from '../Location';

import * as fs from 'fs';
import * as path from 'path';

const readScenarioFile = (fileName: string) => fs.readFileSync(path.join(__dirname, fileName)).toString("utf-8");

describe('generateSingleRuleItem', () => {

  test('Location with more than one variant', () => {
    const result = generateSingleRuleItem('/BASE_URL', 
              { destination: 'DESTINATION', fullQueryString: undefined }
    );

    const expected = 
    `\n  # /BASE_URL\n  if ($query_string ~ "") {\n    rewrite ^/BASE_URL?$  DESTINATION? permanent;\n  }\n`;

    expect(result).toEqual(expected);
  })

});

describe('generateLocationRule', () => {
  test('Location rule is generated', () => {
    const result = generateLocationRule('/BASE_URL', ['this is a rule']);

    const expected = 
    `location ~ ^/BASE_URL$ {\nthis is a rule\n}`;

    expect(result).toEqual(expected);
  })
})

describe('generateRule', () => {
  const doTest = (source: Location, scenarioFileName: string) => () => {
    const result = generateRule(source);

    const scenario = readScenarioFile(scenarioFileName);
    
    expect(result).toEqual(scenario);
  }

  test('Emptyquery and multiple url with different queryparams', 
    doTest({
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
    }, './scenario01_location_multiplequery_emptyquery.rule.txt'));

    test('Emptyquery', 
    doTest({
      baseUrl: '/uomo.html',
      variants: [
        {
          fullQueryString: undefined,
          destination: 'https://prod.pittarosso.com/it/scarpe-uomo-c'
        },        
      ]
    }, './scenario02_location_emptyquery.rule.txt'));

    test('single url with queryparams', 
    doTest({
      baseUrl: '/uomo.html',
      variants: [        
        {
          fullQueryString: 'brand=1909',
          destination: 'https://prod.pittarosso.com/it/scarpe-uomo-c'
        }        
      ]
    }, './scenario03_location_singlequery.rule.txt'))
})

