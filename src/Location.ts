
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
  if ($query_string ~ "${locationTarget.fullQueryString ? escapeStringRegexp(locationTarget.fullQueryString) : ''}") {
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

const escapeStringRegexp = (string: string): string => {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}