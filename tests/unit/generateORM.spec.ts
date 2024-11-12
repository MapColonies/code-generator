import { promises } from 'fs';
import { SourceFile, Project, ClassDeclaration } from 'ts-morph';
import { IColumnProps } from '@map-colonies/mc-model-types'
import { basicFieldsWithDecorators, extendedFieldsDecorators, Source as SourceBasicFieldDescriptors, SourceFieldDescriptors } from '../data/ORM/mocks';
import { OrmGenerator } from '../../src/orm/generateORM';
import * as helperOrm from '../../src/orm/orm.helper';

//Basic
describe('generateORM', function () {
  const targetFilePath = 'tests/data/ORM//output.ts';
  const expectedFilePath = 'tests/data/ORM/basicFieldsAndTheyDecorators.expected.txt';
  let getORMCatalogMappingsSpy: jest.SpyInstance;
  let getORMCatalogEntityMappingsSpy: jest.SpyInstance;
  let createSourceFileSpy: jest.SpyInstance;
  let addClassSpy: jest.SpyInstance;
  let addDecoratorSpy: jest.SpyInstance;
  let addImportDeclarationSpy: jest.SpyInstance;
  let addPropertySpy: jest.SpyInstance;
  let objectToStringSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  let generator: OrmGenerator;

  beforeEach(() => {
    generator = new OrmGenerator(targetFilePath, new SourceBasicFieldDescriptors());
    // spy functions
    getORMCatalogMappingsSpy = jest.spyOn(SourceBasicFieldDescriptors.prototype, 'getORMCatalogMappings');
    getORMCatalogEntityMappingsSpy = jest.spyOn(SourceBasicFieldDescriptors.prototype, 'getORMCatalogEntityMappings');
    createSourceFileSpy = jest.spyOn(Project.prototype, 'createSourceFile');
    addClassSpy = jest.spyOn(SourceFile.prototype, 'addClass');
    addDecoratorSpy = jest.spyOn(ClassDeclaration.prototype, 'addDecorator');
    addImportDeclarationSpy = jest.spyOn(SourceFile.prototype, 'addImportDeclaration');
    addPropertySpy = jest.spyOn(ClassDeclaration.prototype, 'addProperty');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objectToStringSpy = jest.spyOn<any, any>(helperOrm, 'objectToString');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should successfuly generate ORM class', async () => {
    // mock
    saveSpy = jest.spyOn(SourceFile.prototype, 'save').mockImplementation(async () => {
      return Promise.resolve();
    });

    // action
    await generator.generate();

    // expect
    expect(getORMCatalogMappingsSpy).toHaveBeenCalledTimes(1);
    expect(getORMCatalogEntityMappingsSpy).toHaveBeenCalledTimes(1);
    expect(createSourceFileSpy).toHaveBeenCalledTimes(1);
    expect(addClassSpy).toHaveBeenCalledTimes(1);
    expect(addDecoratorSpy).toHaveBeenCalledTimes(1);
    expect(addImportDeclarationSpy).toHaveBeenCalledTimes(2);
    expect(addPropertySpy).toHaveBeenCalledTimes(basicFieldsWithDecorators.length);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(objectToStringSpy).toHaveBeenCalledTimes(basicFieldsWithDecorators.length);
  });

  it('should create the ORM class with basic fields and they decorators', async () => {
    // mock
    let outputFileContent = '';
    // used typescript feature https://www.typescriptlang.org/docs/handbook/functions.html (see "this parameters")
    saveSpy = jest.spyOn(SourceFile.prototype, 'save').mockImplementation(async function (this: SourceFile) {
      outputFileContent = this.getFullText();
      return Promise.resolve();
    });

    // action
    const expectedFileContent = await promises.readFile(expectedFilePath, { encoding: 'utf8' });
    await generator.generate();

    // expect
    expect(outputFileContent).toEqual(expectedFileContent);
  });

  it('should throw an error due invalid file path - illegal operation on a directory', async () => {
    // mock
    saveSpy = jest.spyOn(SourceFile.prototype, 'save').mockRejectedValue(new Error('test'));

    // action
    const action = async (): Promise<void> => {
      await generator.generate();
    };

    // expect
    await expect(action).rejects.toThrow();
    saveSpy.mockReset();
    saveSpy.mockRestore();
  });
});

//Expanded
describe('generateExtendedFields', function () {
  const targetFilePath = 'tests/data/ORM/output.ts';
  const expectedFilePath = 'tests/data/ORM/extendedFieldsAndTheyDecorators.expected.txt';
  let generator: OrmGenerator;

  let getORMCatalogMappingsSpy: jest.SpyInstance;
  let getORMCatalogEntityMappingsSpy: jest.SpyInstance;
  let createSourceFileSpy: jest.SpyInstance;
  let addClassSpy: jest.SpyInstance;
  let addDecoratorSpy: jest.SpyInstance;
  let addImportDeclarationSpy: jest.SpyInstance;
  let addPropertySpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeEach(() => {
    generator = new OrmGenerator(targetFilePath, new SourceFieldDescriptors(), ['index', 'check']);

    // spy functions
    getORMCatalogMappingsSpy = jest.spyOn(SourceFieldDescriptors.prototype, 'getORMCatalogMappings');
    getORMCatalogEntityMappingsSpy = jest.spyOn(SourceFieldDescriptors.prototype, 'getORMCatalogEntityMappings');
    createSourceFileSpy = jest.spyOn(Project.prototype, 'createSourceFile');
    addClassSpy = jest.spyOn(SourceFile.prototype, 'addClass');
    addDecoratorSpy = jest.spyOn(ClassDeclaration.prototype, 'addDecorator');
    addImportDeclarationSpy = jest.spyOn(SourceFile.prototype, 'addImportDeclaration');
    addPropertySpy = jest.spyOn(ClassDeclaration.prototype, 'addProperty');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should successfuly generate ORM class', async () => {
    // mock
    saveSpy = jest.spyOn(SourceFile.prototype, 'save').mockImplementation(async () => {
      return Promise.resolve();
    });

    // action
    await generator.generate();

    // expect
    expect(getORMCatalogMappingsSpy).toHaveBeenCalledTimes(1);
    expect(getORMCatalogEntityMappingsSpy).toHaveBeenCalledTimes(1);
    expect(createSourceFileSpy).toHaveBeenCalledTimes(1);
    expect(addClassSpy).toHaveBeenCalledTimes(1);
    expect(addImportDeclarationSpy).toHaveBeenCalledTimes(3);
    expect(addPropertySpy).toHaveBeenCalledTimes(extendedFieldsDecorators.length);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('should create the ORM class with fields and they decorators', async () => {
    // mock
    let outputFileContent = '';
    saveSpy = jest.spyOn(SourceFile.prototype, 'save').mockImplementation(
      async function (this: SourceFile) {
        outputFileContent = this.getFullText();
        return Promise.resolve();
      }
    );

    // action
    const expectedFileContent = await promises.readFile(expectedFilePath, { encoding: 'utf8' });
    await generator.generate();

    // expect
    expect(outputFileContent).toEqual(expectedFileContent);
  });

  it('should check how many times a decorator is applied above the class', async () => {
    // mock
    let outputFileContent = '';
    saveSpy = jest.spyOn(SourceFile.prototype, 'save').mockImplementation(
      async function (this: SourceFile) {
        outputFileContent = this.getFullText();
        return Promise.resolve();
      }
    );

    // action
    const expectedFileContent = await promises.readFile(expectedFilePath, { encoding: 'utf8' });
    await generator.generate();
    const decoratorRegex = /^@(Entity|Check)\s*\([^\n]*\)/gm;
    const numberOfClassDecoratorsExpected = expectedFileContent.match(decoratorRegex);
    const numberOfClassDecoratorsOutput = outputFileContent.match(decoratorRegex);

    // expect
    expect(numberOfClassDecoratorsExpected).toEqual(numberOfClassDecoratorsOutput)
    expect(addDecoratorSpy).toHaveBeenCalledTimes(numberOfClassDecoratorsExpected != null ? numberOfClassDecoratorsExpected.length : 0)
  });
});

describe('objectToString', function () {

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should successfuly convert column properties object to string', () => {
    // mock
    const decoratorAttr: IColumnProps = { name: "name", type: "text", nullable: true };
    const expectedResult = `{ name: 'name', type: 'text', nullable: true }`;

    // action
    const result: string = helperOrm.objectToString(decoratorAttr as unknown as Record<string, unknown>);

    // expect
    expect(typeof result).toBe('string');
    expect(result).toEqual(expectedResult);
  });

  it('should successfully convert an object with an array as value to a string', () => {
    // mock
    const decoratorAttr: Record<string, unknown> = { 'enum': ["name", "text", "enum", "value"] }
    const expectedResult = `{ enum: ['name', 'text', 'enum', 'value'] }`;

    // action
    const result = helperOrm.objectToString(decoratorAttr);

    // expect
    expect(typeof result).toBe('string');
    expect(result).toEqual(expectedResult);
  });
});
