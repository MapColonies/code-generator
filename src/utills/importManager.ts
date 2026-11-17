import { IDescribeTsType } from '@map-colonies/mc-model-types';
import { SourceFile } from 'ts-morph';

export class ImportManager {
  private readonly allImports: Record<string, Set<string> | undefined> = {};
  // Separate from `allImports`: that bucket feeds `registerEnumType()` generation (every entry there is
  // an enum), whereas an external CLASS reference (e.g. `capabilities` -> `CapabilityType`) just needs a
  // plain import statement.
  private readonly externalClassImports: Record<string, Set<string> | undefined> = {};

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

  public addExternalType(type: IDescribeTsType): void {
    if (type.importFromPackage === undefined) {
      return;
    }
    if (this.externalClassImports[type.importFromPackage] === undefined) {
      this.externalClassImports[type.importFromPackage] = new Set<string>();
    }
    this.externalClassImports[type.importFromPackage]?.add(type.value);
  }

  public generateImports(targetFile: SourceFile): void {
    for (const key of Object.keys(this.allImports)) {
      targetFile.addImportDeclaration({ namedImports: Array.from(this.allImports[key] as Set<string>), moduleSpecifier: key });
    }
  }

  public generateExternalImports(targetFile: SourceFile): void {
    for (const key of Object.keys(this.externalClassImports)) {
      targetFile.addImportDeclaration({ namedImports: Array.from(this.externalClassImports[key] as Set<string>), moduleSpecifier: key });
    }
  }

  public getImports(): Record<string, Set<string> | undefined> {
    return this.allImports;
  }
}
