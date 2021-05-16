

export type LocationTarget = {
  fullQueryString: string | undefined;
  destination: string;  
}

export type Location = {
  baseUrl: string;
  variants: LocationTarget[]
}

export const generateSingleRuleItem = (baseUrl: string, locationTarget: LocationTarget) => {
  return `
  # ${baseUrl}${locationTarget.fullQueryString?`?${locationTarget.fullQueryString}`:''}
  if ($query_string ~ "${locationTarget.fullQueryString ? locationTarget.fullQueryString : ''}") {
    rewrite ^${baseUrl}?$  ${locationTarget.destination}? permanent;
  }\n`
}

export const generateLocationRule = (baseUrl: string, rules: string[]) => {
  return `location ~ ^${baseUrl}$ {\n${rules.join('')}\n}`;
}

export const generateRule = (source: Location) => {
  const sortedVariants = source.variants.sort((a, b) => {  
    if (!a.fullQueryString) {
      return 1;
    }

    if (!b.fullQueryString) {
      return -1;
    }

    if (a.fullQueryString == b.destination) {
      return 0;
    }

    return a.fullQueryString > b.fullQueryString ? 1 : -1;
  })
  const rules = sortedVariants.map(item => generateSingleRuleItem(source.baseUrl, item));

  return generateLocationRule(source.baseUrl, rules);
}

/*

location ~ ^BASEURL$ {
    if ($query_string ~ ""){
        rewrite ^/BASEURL?$                     DESTINATION? permanent;
    }
    if ($query_string ~ "QUERYSTRING=PIPPO"){
        rewrite ^/BSEURL?$                      DESTINATION? permanent;
    }
}

*/
