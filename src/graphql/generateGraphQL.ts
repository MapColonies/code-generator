import { IPropGraphQLMapping, getGraphQLClassMapping, IGraphQLClassMapping, TsTypes } from '@map-colonies/mc-model-types';
import { Project, SourceFile, VariableDeclarationKind } from 'ts-morph';
import Generator from '../generator';
import { Projects, Tasks } from '../models/enums';

const TOP_COMMENT = '/* This file was auto-generated by MC-GENERATOR, DO NOT modify it manually */';

const generateGraphQL = async (targetFilePath: string): Promise<void> => {
  const graphQLClasses = getGraphQLClassMapping() as IGraphQLClassMapping[];
  const project = new Project();
  const targetFile = project.createSourceFile(targetFilePath, {}, { overwrite: true });
  targetFile.insertStatements(0, TOP_COMMENT);
  targetFile.addImportDeclaration({
    namedImports: ['ObjectType', 'Field', 'Resolver'],
    moduleSpecifier: 'type-graphql',
  });

  targetFile.addImportDeclaration({
    namedImports: ['GraphQLScalarType'],
    moduleSpecifier: 'graphql',
  });

  graphQLClasses.forEach((graphQLClass) => {
    const classDeclaration = targetFile.addClass({
      name: graphQLClass.name,
      isExported: true,
    });
    classDeclaration.addDecorator({
      name: 'ObjectType',
      arguments: [],
    });

    graphQLClass.fields.forEach((field) => {
      classDeclaration.addProperty({
        name: field.prop,
        type: field.mappingType,
        hasQuestionToken: field.nullable,
        decorators: [
          {
            name: 'Field',
            arguments: parseOptions(field, targetFile),
          },
        ],
      });
    });
  });

  graphQLClasses.forEach((graphQLClass) => {
    const classDeclaration = targetFile.addClass({
      name: `${graphQLClass.name}Resolver`,
      isExported: true,
    });
    classDeclaration.addDecorator({
      name: 'Resolver',
      arguments: [graphQLClass.name],
    });
  });

  await targetFile.save();
};

const createNewScalarType = (name: string, targetFile: SourceFile): void => {
  targetFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${name}Object`,
        initializer: `new GraphQLScalarType({ name: "${name}Object"})`,
      },
    ],
    isExported: true,
  });
};

const parseOptions = (field: IPropGraphQLMapping, targetFile: SourceFile): string[] => {
  let args: string[] = [];
  let mappingType = '';

  if (field.mappingType === TsTypes.OBJECT) {
    createNewScalarType(field.prop, targetFile);
    const returnType: string = `(type) => ${field.prop}Object`;
    args.push(returnType);
  }

  if (field.mappingType.includes('[')) {
    mappingType = '[' + field.mappingType.replace(/[^a-zA-Z]+/g, '') + ']';
    const returnType: string = `(type) => ${mappingType}`;
    args.push(returnType);
  }

  args.push(`{ nullable: ${Boolean(field.nullable)} }`);

  return args;
};

const generateGraphQLRaster = async (output: string): Promise<void> => {
  await generateGraphQL(output);
};

Generator.register(Projects.RASTER, Tasks.GRAPHQL, generateGraphQLRaster);
