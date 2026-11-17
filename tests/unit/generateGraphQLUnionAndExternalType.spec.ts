// ts-jest does not hoist jest.mock() calls like babel-jest does, so this must come before the imports below.
jest.mock('@map-colonies/mc-model-types', () => {
  const actual = jest.requireActual<typeof import('@map-colonies/mc-model-types')>('@map-colonies/mc-model-types');
  const { PropertiesTypes: propertiesTypes } = actual;

  const getGraphQLClassMapping = (): unknown[] => [
    {
      name: 'UnionHolder',
      fields: [
        {
          prop: 'payload',
          nullable: true,
          mappingType: {
            type: propertiesTypes.UNION,
            value: 'Payload',
            discriminant: 'kind',
            branches: [
              { className: 'PayloadA', discriminantValue: 'a' },
              { className: 'PayloadB', discriminantValue: 'b' },
            ],
            inputType: { type: propertiesTypes.CLASS, value: 'PayloadFlat' },
          },
        },
        {
          // same union `value` as `payload` - exercises the dedup guard in `ensureUnionDeclared`
          prop: 'payloadAlt',
          nullable: true,
          mappingType: {
            type: propertiesTypes.UNION,
            value: 'Payload',
            discriminant: 'kind',
            branches: [
              { className: 'PayloadA', discriminantValue: 'a' },
              { className: 'PayloadB', discriminantValue: 'b' },
            ],
            inputType: { type: propertiesTypes.CLASS, value: 'PayloadFlat' },
          },
        },
        {
          prop: 'capability',
          nullable: true,
          mappingType: {
            type: propertiesTypes.CLASS,
            value: 'CapabilityType',
            importFromPackage: '@external/capabilities',
          },
        },
      ],
    },
    {
      name: 'SkippedInput',
      skipInputType: true,
      fields: [
        {
          prop: 'id',
          nullable: true,
          mappingType: { type: propertiesTypes.PRIMITIVE, value: 'string' },
        },
      ],
    },
    {
      name: 'SkippedObject',
      skipObjectType: true,
      fields: [
        {
          prop: 'id',
          nullable: true,
          mappingType: { type: propertiesTypes.PRIMITIVE, value: 'string' },
        },
      ],
    },
  ];

  return {
    ...actual,
    getGraphQLClassMapping,
  };
});

/* eslint-disable import/first -- jest.mock() above must precede these imports; ts-jest does not hoist it */
import '../../src/graphql/generateGraphQL';
import { Project, SourceFile } from 'ts-morph';
import Generator from '../../src/generator';
/* eslint-enable import/first */

describe('generateGraphQL - union and external type support', function () {
  const targetFilePath = 'tests/data/ORM//output.ts';
  let generator: { dict: Record<string, Record<string, (target: string) => Promise<void>>> };

  beforeEach(() => {
    generator = Generator as unknown as { dict: Record<string, Record<string, (target: string) => Promise<void>>> };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('declares the union, imports the external class, and honors skipInputType/skipObjectType', async () => {
    let outputFileContent = '';
    jest.spyOn(Project.prototype, 'createSourceFile');
    jest.spyOn(SourceFile.prototype, 'save').mockImplementation(async function (this: SourceFile) {
      outputFileContent = this.getFullText();
      return Promise.resolve();
    });

    await generator.dict.raster.graphQl(targetFilePath);

    // external type is imported directly from its own package, once
    expect(outputFileContent).toContain('import { CapabilityType } from "@external/capabilities";');

    // the union is declared once, with its branches and discriminant switch
    expect(outputFileContent).toContain('export const PayloadUnion = createUnionType({');
    expect(outputFileContent).toContain("name: 'Payload',");
    expect(outputFileContent).toContain('types: () => [PayloadA, PayloadB] as const,');
    expect(outputFileContent).toContain('resolveType: (value: PayloadA | PayloadB) => {');
    expect(outputFileContent).toContain('switch (value.kind) {');
    expect(outputFileContent).toContain("case 'a':");
    expect(outputFileContent).toContain('return PayloadA;');
    expect(outputFileContent).toContain("case 'b':");
    expect(outputFileContent).toContain('return PayloadB;');
    expect(outputFileContent).toContain('default:');
    expect(outputFileContent).toContain('return undefined;');
    // the union is declared only once even though two fields of this shape would otherwise re-declare it
    expect(outputFileContent.match(/createUnionType\(/g)).toHaveLength(1);

    // ObjectType side uses the declared union and the external class verbatim, for both union fields
    expect(outputFileContent).toContain('public payload?: typeof PayloadUnion;');
    expect(outputFileContent).toContain('public payloadAlt?: typeof PayloadUnion;');
    expect(outputFileContent.match(/@Field\(\(type\) => PayloadUnion, \{ nullable: true \}\)/g)).toHaveLength(2);
    expect(outputFileContent).toContain('public capability?: CapabilityType;');
    expect(outputFileContent).toContain('@Field((type) => CapabilityType, { nullable: true })');

    // InputType side falls back to the union's flat input type instead, for both union fields
    expect(outputFileContent).toContain('public payload?: PayloadFlatInput;');
    expect(outputFileContent).toContain('public payloadAlt?: PayloadFlatInput;');
    expect(outputFileContent.match(/@Field\(\(type\) => PayloadFlatInput, \{ nullable: true \}\)/g)).toHaveLength(2);

    // skipInputType / skipObjectType are each respected on both the class and the resolver generation passes
    expect(outputFileContent).toContain('export class SkippedInput {');
    expect(outputFileContent).not.toContain('export class SkippedInputInput {');
    expect(outputFileContent).toContain('export class SkippedInputResolver {');

    expect(outputFileContent).toContain('export class SkippedObjectInput {');
    expect(outputFileContent).not.toContain('export class SkippedObject {');
    expect(outputFileContent).not.toContain('export class SkippedObjectResolver {');
  });
});
