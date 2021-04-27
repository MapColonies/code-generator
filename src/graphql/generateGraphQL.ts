import { IPropGraphQLMapping, getGraphQLClassMapping, IGraphQLClassMapping, IDescribeTsType, PropertiesTypes } from '@map-colonies/mc-model-types';
import { Project, SourceFile, VariableDeclarationKind } from 'ts-morph';
import Generator from '../generator';
import { Projects, Tasks } from '../models/enums';

const TOP_COMMENT = '/* This file was auto-generated by MC-GENERATOR, DO NOT modify it manually */';
const allImports: Record<string, string[] | undefined> = {};

const generateGraphQL = async (targetFilePath: string): Promise<void> => {
  const graphQLClasses = getGraphQLClassMapping() as IGraphQLClassMapping[];
  const project = new Project();
  const targetFile = project.createSourceFile(targetFilePath, {}, { overwrite: true });
  targetFile.insertStatements(0, TOP_COMMENT);
  targetFile.addImportDeclaration({
    namedImports: ['ObjectType', 'Field', 'Resolver', 'registerEnumType'],
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
        type: getType(field.mappingType),
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

  importEnums(targetFile);
  await targetFile.save();
};

const getType = (mappingType: IDescribeTsType): string => {
  if (mappingType.type === PropertiesTypes.ARRAY) {
    return `${mappingType.value}[]`;
  } else {
    return mappingType.value;
  }
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
  const args: string[] = [];
  let returnType = '';

  switch (field.mappingType.type) {
    case PropertiesTypes.ENUM:
      returnType = `(type) => ${field.mappingType.value}`;
      const packageName = field.mappingType.importFromPackage as string;
      if (allImports[packageName] === undefined) {
        allImports[packageName] = [];
      }
      allImports[packageName]?.push(field.mappingType.value);
      break;

    case PropertiesTypes.CLASS:
      returnType = `(type) => ${field.mappingType.value}`;
      break;

    case PropertiesTypes.ARRAY:
      returnType = `(type) => [${field.mappingType.value}]`;
      break;

    case PropertiesTypes.OBJECT:
      returnType = `(type) => ${field.prop}Object`;
      createNewScalarType(field.prop, targetFile);
      break;
  }

  if (returnType) {
    args.push(returnType);
  }
  args.push(`{ nullable: ${Boolean(field.nullable).toString()} }`);
  return args;
};

const importEnums = (targetFile: SourceFile): void => {
  for (const key of Object.keys(allImports)) {
    targetFile.addImportDeclaration({ namedImports: allImports[key], moduleSpecifier: key });

    for (const module of allImports[key] as string[]) {
      const registerEnums = `registerEnumType(${module}, {name: "${module}"});`;
      targetFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: `${module}Register`,
            initializer: registerEnums,
          },
        ],
      });
    }
  }
};

const generateGraphQLRaster = async (output: string): Promise<void> => {
  await generateGraphQL(output);
};

Generator.register(Projects.RASTER, Tasks.GRAPHQL, generateGraphQLRaster);
