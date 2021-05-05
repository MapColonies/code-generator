import '../../src/graphql/generateGraphQL';
import { promises } from 'fs';
import { Project, SourceFile } from 'ts-morph';
import Generator from '../../src/generator';

describe('generateGraphQL', function () {
    const targetFilePath = 'tests/data/ORM//output.ts';
    const expectedFilePath = 'tests/data/graphQL/expected.ts';
    let generator: { dict: Record<string,Record<string, ((target: string) => Promise<void>)>> };
    let dict: Record<string,Record<string, ((target: string) => Promise<void>)>>;
    let createSourceFileSpy: jest.SpyInstance;
    let saveSpy: jest.SpyInstance;

    beforeEach(() => {
      generator = Generator as unknown as { dict: Record<string,Record<string, ((target: string) => Promise<void>)>> };
      dict = generator.dict;
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
        generator.dict = {}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        dict = {};
    });

    it ('should run the entire generate graphql loop and work', async () => {
        let outputFileContent = '';
        createSourceFileSpy = jest.spyOn(Project.prototype, 'createSourceFile');
        // used typescript feature https://www.typescriptlang.org/docs/handbook/functions.html (see "this parameters")
        saveSpy = jest.spyOn(SourceFile.prototype, 'save').mockImplementation(async function (this: SourceFile) {
            outputFileContent = this.getFullText();
            return Promise.resolve();
        });
        await dict.raster.graphQl(targetFilePath);
        const expectedFileContent = await promises.readFile(expectedFilePath, { encoding: 'utf8' });

        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(createSourceFileSpy).toHaveBeenCalledTimes(1);
        expect(outputFileContent).toEqual(expectedFileContent);
    });
});
