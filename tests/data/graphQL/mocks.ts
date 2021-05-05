import { IGraphQLClassMapping, PropertiesTypes } from '@map-colonies/mc-model-types';

export const getGraphQLClassMapping = (): IGraphQLClassMapping[] => {
  return [
    {
      name: 'MockLayer',
      fields: [
        {
          prop: 'source',
          nullable: true,
          mappingType: {
            value: 'string',
            type: PropertiesTypes.PRIMITIVE,
          },
        },
        {
          prop: 'id',
          nullable: true,
          mappingType: {
            value: 'string',
            type: PropertiesTypes.PRIMITIVE,
          },
        },
        {
          prop: 'mockEnum',
          nullable: true,
          mappingType: {
            value: 'mockEnum',
            type: PropertiesTypes.ENUM,
            importFromPackage: 'mockPackage'
          },
        },
        {
          prop: 'mockScalar',
          nullable: true,
          mappingType: {
            value: 'string',
            type: PropertiesTypes.OBJECT,
          },
        },
        {
          prop: 'stringArray',
          nullable: true,
          mappingType: {
            value: 'String',
            type: PropertiesTypes.ARRAY,
          },
        },
      ],
    },
  ];
};
