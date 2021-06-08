import { PropertiesTypes } from "@map-colonies/mc-model-types";
import { SourceFile } from "ts-morph";
import { ImportManager } from "../../src/utills/importManager"


describe('ImportManager',()=>{
  let manager: ImportManager;

  beforeEach(()=>{
    manager = new ImportManager();
  });

  it('add single import from package updates internal dictionary',()=>{
    manager.addImport('testPackage1','import1');
    manager.addImport('testPackage1','import2');
    manager.addImport('testPackage2','import1');

    expect(manager.getImports()).toEqual({
      testPackage1: new Set<string>(['import1','import2']),
      testPackage2: new Set<string>(['import1'])
    });
  });

  it('add multiple import from package updates internal dictionary',()=>{
    manager.addImport('testPackage1',['import1','import2']);
    manager.addImport('testPackage1','import3');
    manager.addImport('testPackage1',['import4','import5']);
    manager.addImport('testPackage2',['import1','import2']);

    expect(manager.getImports()).toEqual({
      testPackage1: new Set<string>(['import1','import2','import3','import4','import5']),
      testPackage2: new Set<string>(['import1','import2'])
    });
  });

  it('add import from type updates internal dictionary',()=>{
    manager.addType({
      type: PropertiesTypes.ENUM,
      value: 'import',
      importFromPackage: 'testPackage'
    });

    expect(manager.getImports()).toEqual({
      testPackage: new Set<string>(['import'])
    });
  });

  it('generate imports adds import to target',()=>{
    const imports = manager.getImports();
    imports['testPackage1']=new Set<string>(['import1','import2','import3','import4','import5']);
    imports['testPackage2']=new Set<string>(['import1','import2']);

    const addImportDeclarationMock = jest.fn();
    const targetFileMock = {
      addImportDeclaration: addImportDeclarationMock
    } as unknown as SourceFile;

    manager.generateImports(targetFileMock);

    const expectedCall1 = { 
      namedImports: Array.from(imports['testPackage1']), 
      moduleSpecifier: 'testPackage1' 
    };
    const expectedCall2 = { 
      namedImports: Array.from(imports['testPackage2']),
      moduleSpecifier: 'testPackage2' 
    };
    expect(addImportDeclarationMock).toHaveBeenCalledTimes(2);
    expect(addImportDeclarationMock).toHaveBeenCalledWith(expectedCall1);
    expect(addImportDeclarationMock).toHaveBeenCalledWith(expectedCall2);
  });
})
