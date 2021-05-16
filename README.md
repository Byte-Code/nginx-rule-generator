# NGINX Rule Generator

This project will generate a location rule for each page, with multiple conditional statements, one for each variation of the URL.
The variance without querystrigs will be generated at the end of the file, the ones with querystrings will be sorted based on their querystrings alphabetically.

```
location ~ ^/uomo.html$ {

  # /uomo.html?brand=1909
  if ($query_string ~ "brand=1909") {
    rewrite ^/uomo.html?$  https://prod.pittarosso.com/it/scarpe-uomo-c? permanent;
  }

  # /uomo.html?cat=527&color=379&size=279
  if ($query_string ~ "cat=527&color=379&size=279") {
    rewrite ^/uomo.html?$  https://prod.pittarosso.com/it/contenuto-non-piu-disponibile? permanent;
  }

  # /uomo.html
  if ($query_string ~ "") {
    rewrite ^/uomo.html?$  https://prod.pittarosso.com/it/scarpe-uomo-c? permanent;
  }

}
```

## input file format

The file must me a `CSV` file with 2 columnns, the first is the url that we want to redirect, the second one is the target URL

## output

A folder will be created under the provided output dir, will have a a name startig with `rules-` and a generated suffix.

## usage

Intall the dependencies with `npm install` then runs `npx ts-node src/index.ts` to output the commad usage
