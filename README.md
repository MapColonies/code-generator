# code-generator

## package includes:
code-generator is using 'ts-morph' `(https://www.npmjs.com/package/ts-morph)` os package to generate ts classes, interfaces, enum, etc. dynamically based on map-colonies/mc-models `(https://github.com/MapColonies/mc-models)` profiles.
## package usage:

the package can be installed with `npm install @map-colonies/mc-code-generator`.

## building the package:

run `npm install` to install project dependencies.

to create local package tgz file run `npm pack` after the build

## run package

in your project package.json add script for generate:
`generate: 'node **/index.js -tf='path/to/file -p=your-project-name (raster, 3d, etc..) -gt=type-of-source (orm, graphQl, etc..)`


## parameters
* -p --project    - name of the project, available values:
 raster, 3d, polygonParts. (no default)

 * -tf --targetFile  - path to the generated file, override file if  exists. (no default)

 * -gt --generateType  - type of the wished generated code, avaiable values: orm, graphQl. (no default)
