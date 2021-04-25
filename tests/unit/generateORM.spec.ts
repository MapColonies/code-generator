import { promises } from 'fs';
import { SourceFile, Project, ClassDeclaration } from 'ts-morph';
import { IColumnProps } from '@map-colonies/mc-model-types'
import * as generate from '../../src/orm/generateORM';
import { generateORM } from '../../src/orm/generateORM';
import { fields, entity } from '../data/mock';
import { Source } from '../data/source';

describe('generateORM', function () {
  const targetFilePath = 'tests/data/output.ts';
  const expectedFilePath = 'tests/data/expected.ts';
  let getORMCatalogMappingsSpy: jest.SpyInstance;
  let getORMCatalogEntityMappingsSpy: jest.SpyInstance;
  let createSourceFileSpy: jest.SpyInstance;
  let addClassSpy: jest.SpyInstance;
  let addDecoratorSpy: jest.SpyInstance;
  let addImportDeclarationSpy: jest.SpyInstance;
  let addPropertySpy: jest.SpyInstance;
  let objectToStringSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeEach(() => {
    // spy functions
    getORMCatalogMappingsSpy = jest.spyOn(Source.prototype, 'getORMCatalogMappings');
    getORMCatalogEntityMappingsSpy = jest.spyOn(Source.prototype, 'getORMCatalogEntityMappings');
    createSourceFileSpy = jest.spyOn(Project.prototype, 'createSourceFile');
    addClassSpy = jest.spyOn(SourceFile.prototype, 'addClass');
    addDecoratorSpy = jest.spyOn(ClassDeclaration.prototype, 'addDecorator');
    addImportDeclarationSpy = jest.spyOn(SourceFile.prototype, 'addImportDeclaration');
    addPropertySpy = jest.spyOn(ClassDeclaration.prototype, 'addProperty');
    objectToStringSpy = jest.spyOn(generate, 'objectToString');

    getORMCatalogMappingsSpy.mockReturnValue(fields);
    getORMCatalogEntityMappingsSpy.mockReturnValue(entity);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should successfuly generate ORM mapping class',async () => {
    // mock
    saveSpy = jest.spyOn(SourceFile.prototype, 'save').mockImplementation( async () => {
      return Promise.resolve();
    });

    // action
    await generateORM(targetFilePath, new Source());

    // expect
    expect(getORMCatalogMappingsSpy).toHaveBeenCalledTimes(1);
    expect(getORMCatalogEntityMappingsSpy).toHaveBeenCalledTimes(1);
    expect(createSourceFileSpy).toHaveBeenCalledTimes(1);
    expect(addClassSpy).toHaveBeenCalledTimes(1);
    expect(addDecoratorSpy).toHaveBeenCalledTimes(1);
    expect(addImportDeclarationSpy).toHaveBeenCalledTimes(1);
    expect(addPropertySpy).toHaveBeenCalledTimes(fields.length);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(objectToStringSpy).toHaveBeenCalledTimes(fields.length + 1);
  });

  it('should create the ORM class equal to the expected class', async () => {
    // mock
    let outputFileContent = '';
    // used typescript feature https://www.typescriptlang.org/docs/handbook/functions.html (see "this parameters")
    saveSpy = jest.spyOn(SourceFile.prototype, 'save').mockImplementation(async function (this: SourceFile) {
      outputFileContent = this.getFullText();
      return Promise.resolve();
    });

    // action
    const expectedFileContent = await promises.readFile(expectedFilePath, { encoding: 'utf8' });
    await generateORM(targetFilePath, new Source());

    // expect
    expect(outputFileContent).toEqual(expectedFileContent);
  });

  it('should throw an error due invalid file path - illegal operation on a directory', async () => {
    // mock
    saveSpy = jest.spyOn(SourceFile.prototype, 'save').mockRejectedValue(new Error('test'));

    // action
    const action = async (): Promise<void> => {
      await generateORM(targetFilePath, new Source());
    };

    // expect
    await expect(action).rejects.toThrow();
    saveSpy.mockReset();
    saveSpy.mockRestore();
  })
});

describe('objectToString', function () {
  let objectToStringSpy: jest.SpyInstance;

  beforeEach(() => {
    // spy functions
    objectToStringSpy = jest.spyOn(generate, 'objectToString');

  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should successfuly convert column properties object to string', () => {
    // mock
    const decoratorAttr: IColumnProps = {name: "name", type: "text", nullable: true};
    const expectedResult = "{name: 'name',type: 'text',nullable: 'true'}";

    // action
    const result: string = generate.objectToString(decoratorAttr);

    // expect
    expect(typeof result).toBe('string');
    expect(objectToStringSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });
});