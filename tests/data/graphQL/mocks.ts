import { IGraphQLClassMapping, PropertiesTypes } from '@map-colonies/mc-model-types';

export const getGraphQLClassMapping = (): IGraphQLClassMapping[] => {
  return [
    {
      name: 'MockLayer',
      fields: [
        {
          prop: 'lifecycleEnvolvedTrue',
          nullable: true,
          mappingType: {
            value: 'string',
            type: PropertiesTypes.PRIMITIVE,
          },
          isLifecycleEnvolved: true
        },
        {
          prop: 'lifecycleEnvolvedFalse',
          nullable: true,
          mappingType: {
            value: 'string',
            type: PropertiesTypes.PRIMITIVE,
          },
          isLifecycleEnvolved: false
        },
        {
          prop: 'autoGeneratedTrue',
          nullable: true,
          mappingType: {
            value: 'string',
            type: PropertiesTypes.PRIMITIVE,
          },
          isAutoGenerated: true
        },
        {
          prop: 'autoGeneratedFalse',
          nullable: true,
          mappingType: {
            value: 'string',
            type: PropertiesTypes.PRIMITIVE,
          },
          isAutoGenerated: false
        },
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
          prop: 'mockEnumArray',
          nullable: true,
          mappingType: {
            value: 'mockEnum',
            type: PropertiesTypes.ENUM_ARRAY,
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
