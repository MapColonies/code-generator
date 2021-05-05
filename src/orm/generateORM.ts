import { IColumnProps, IOrmCatalog, PycswLayerCatalogRecord } from '@map-colonies/mc-model-types';
import { Project, Scope } from 'ts-morph';
import Generator from '../generator';
import { Projects, Tasks } from '../models/enums';
import * as utils from '../utils';

// eslint-disable-next-line import/exports-last
export const generateORM = async (targetFilePath: string, ormCatalog: IOrmCatalog): Promise<void> => {
  const dbFields = ormCatalog.getORMCatalogMappings();
  const ormEntity = ormCatalog.getORMCatalogEntityMappings();
  const project = new Project();
  const targetFile = project.createSourceFile(targetFilePath, {}, { overwrite: true });
  utils.generateTopComments(targetFile);
  const classDeclaration = targetFile.addClass({
    name: 'Metadata',
    isExported: true,
  });
  classDeclaration.addDecorator({
    name: 'Entity',
    arguments: [`{name: '${ormEntity.table}'}`],
  });
  targetFile.addImportDeclaration({
    namedImports: ['Column', 'Entity', 'Index', 'PrimaryColumn'],
    moduleSpecifier: 'typeorm',
  });

  dbFields.forEach((field) => {
    classDeclaration.addProperty({
      scope: Scope.Public,
      name: field.prop,
      type: field.field?.overrideType !== undefined ? field.field.overrideType.value : field.mappingType.value,
      hasExclamationToken: field.column.nullable !== undefined ? true : false,
      hasQuestionToken: field.column.nullable,
      decorators: [
        {
          name: 'Column',
          arguments: [objectToString(field.column)],
        },
      ],
    });
  });
  objectToString(dbFields[0].column);
  await targetFile.save();
};

// eslint-disable-next-line import/exports-last
export const objectToString = (column: IColumnProps): string => {
  const dataParts: string[] = ['{'];
  const props = Object.entries(column);
  props.forEach((pair: string[], index: number) => {
    const value: string = typeof pair[1] === 'string' ? `'${pair[1]}'` : pair[1];
    let stringifyKey = `${pair[0]}: ${value}`;
    if (index !== props.length - 1) {
      stringifyKey += ',';
    }
    dataParts.push(stringifyKey);
  });
  dataParts.push('}');
  const data = dataParts.join('');
  data.trim();
  return data;
};

const generateORMRaster = async (output: string): Promise<void> => {
  await generateORM(output, new PycswLayerCatalogRecord());
};

Generator.register(Projects.RASTER, Tasks.ORM, generateORMRaster);
