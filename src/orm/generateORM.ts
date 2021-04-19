import { IColumnProps, IOrmCatalog, LayerMetadataORM } from '@map-colonies/mc-model-types';
import { Project, Scope } from 'ts-morph';
import Generator from '../dictionary';
import { Projects, Tasks } from '../models/enums';

const generateORM = async (targetFilePath: string, ormCatalog: IOrmCatalog): Promise<void> => {
  const dbFields = ormCatalog.getORMCatalogMappings();
  const ormEntity = ormCatalog.getORMCatalogEntityMappings();
  const project = new Project();
  const targetFile = project.createSourceFile(targetFilePath, {}, { overwrite: true });
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
      type: field.mappingType,
      hasExclamationToken: !field.column.nullable,
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

const objectToString = (column: IColumnProps): string => {
  const dataParts: string[] = ['{'];
  const props = Object.entries(column);
  props.forEach((pair: string[], index: number) => {
    const value: string = pair[1];
    let stringifyKey = `${pair[0]}: '${value}'`;
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
  await generateORM(output, new LayerMetadataORM());
};

Generator.register(Projects.RASTER, Tasks.ORM, generateORMRaster);
