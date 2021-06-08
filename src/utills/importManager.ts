import { IDescribeTsType } from '@map-colonies/mc-model-types';
import { SourceFile } from 'ts-morph';

export class ImportManager {
  private readonly allImports: Record<string, Set<string> | undefined> = {};

  public addImport(packageName: string, component: string | string[]): void {
    if (this.allImports[packageName] === undefined) {
      this.allImports[packageName] = new Set<string>();
    }
    if (Array.isArray(component)) {
      component.map((value) => this.allImports[packageName]?.add(value));
    } else {
      this.allImports[packageName]?.add(component);
    }
  }

  public addType(type: IDescribeTsType): void {
    if (type.importFromPackage !== undefined) {
      this.addImport(type.importFromPackage, type.value);
    }
  }

  public generateImports(targetFile: SourceFile): void {
    for (const key of Object.keys(this.allImports)) {
      targetFile.addImportDeclaration({ namedImports: Array.from(this.allImports[key] as Set<string>), moduleSpecifier: key });
    }
  }

  public getImports(): Record<string, Set<string> | undefined> {
    return this.allImports;
  }
}
