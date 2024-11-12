import { IOrmCatalog, PropertiesTypes, ORMColumnType } from '@map-colonies/mc-model-types';
import { IPropCatalogDBMapping } from '@map-colonies/mc-model-types/Schema/models/common/interfaces/propCatalogDBMapping.interface';
import { ICatalogDBEntityMapping } from '@map-colonies/mc-model-types/Schema/models/layerMetadata/decorators/class/catalogDBEntity.decorator';

const entity: ICatalogDBEntityMapping = {
  table: 'records',
  className: 'Metadata'
};

const basicFieldsWithDecorators: IPropCatalogDBMapping[] = [
  {
    prop: 'id',
    column: { name: 'identifier', type: 'text', nullable: true },
    mappingType: { value: 'string', type: PropertiesTypes.PRIMITIVE }
  },
  {
    prop: 'array',
    column: { name: 'array', type: 'text', nullable: true },
    mappingType: { value: 'string', type: PropertiesTypes.ARRAY }
  },
  {
    prop: 'enum',
    column: { name: 'enum', type: 'text', nullable: true },
    mappingType: { value: 'PropertiesTypes', type: PropertiesTypes.ENUM, importFromPackage: '@map-colonies/mc-model-types' }
  },
  {
    prop: 'enumArray',
    column: { name: 'enumArray', type: 'text', nullable: true },
    mappingType: { value: 'PropertiesTypes', type: PropertiesTypes.ENUM_ARRAY, importFromPackage: '@map-colonies/mc-model-types' }
  },
  {
    prop: 'test',
    column: { name: 'test', type: 'text', nullable: true },
    mappingType: { value: 'string', type: PropertiesTypes.PRIMITIVE },
    field: { overrideType: { value: 'number', type: PropertiesTypes.PRIMITIVE } }
  },
  {
    prop: 'updateDate',
    column: { name: 'update_date', type: 'timestamp without time zone', nullable: true, columnType: ORMColumnType.UPDATE_DATE_COLUMN },
    mappingType: { value: 'Date', type: PropertiesTypes.PRIMITIVE },
  },
];

const extendedFieldsDecorators: IPropCatalogDBMapping[] = [
  {
    prop: 'productId',
    column: { name: 'product_id', type: 'text', nullable: false, collation: 'C.UTF-8', },
    index: {},
    mappingType: { value: 'string', type: PropertiesTypes.PRIMITIVE },
    validation: [
      {
        errorMsgCode: 'validation-field.productId.pattern',
        valueType: 'value',
        pattern: '^[A-Za-z]{1}[A-Za-z0-9_]{0,62}$',
      },]
  },
  {
    prop: 'productType',
    column: {
      name: 'product_type',
      type: 'enum',
      enum: {
        enumName: 'product_type_enum',
        enumValues: [
          'Orthophoto',
          'OrthophotoBest',
          'RasterAid',
        ],
      },
      nullable: false,
      collation: 'C.UTF-8',
    },
    index: {},
    mappingType: { value: 'ProductType', type: PropertiesTypes.PRIMITIVE, importFromPackage: 'mockPackage' }
  },
  {
    prop: 'productTypeWithVariableEnum',
    column: {
      name: 'product_type_with_variable_enum',
      type: 'enum',
      enum: {
        enumName: 'product_type_enum',
        enumValues: [
          'Orthophoto',
          'OrthophotoBest',
          'RasterAid',
        ],
        generateValuesConstName: 'PRODUCT_TYPES',
      },
      nullable: false,
    },
    index: { spatial: true },
    mappingType: { value: 'ProductType', type: PropertiesTypes.PRIMITIVE, importFromPackage: 'mockPackage' }
  },
  {
    prop: 'footprint',
    column: { name: 'footprint', type: 'geometry', spatialFeatureType: 'Polygon', srid: 4326, nullable: false, },
    field: { overrideType: { value: 'Polygon', type: PropertiesTypes.OBJECT, importFromPackage: 'geojson' } },
    mappingType: { value: 'string', type: PropertiesTypes.OBJECT },
    customChecks: [
      {
        name: 'valid geometry',
        expression: `ST_IsValid('footprint')`,
      },
      {
        name: 'geometry extent',
        expression: `Box2D('footprint') @Box2D(ST_GeomFromText('LINESTRING(-180 -90, 180 90)'))`,
      },
    ],
    index: { spatial: true },
  },
  {
    prop: 'sourceResolutionMeter',
    column: {
      name: 'source_resolution_meter',
      type: 'numeric',
      nullable: false,
    },
    mappingType: { value: 'number', type: PropertiesTypes.PRIMITIVE },
    validation: [
      {
        errorMsgCode: 'validation-general.required',
        required: true,
      },
      {
        errorMsgCode: 'validation-field.maxResolutionMeter.min',
        valueType: 'value',
        min: 0.0185,
      },
      {
        errorMsgCode: 'validation-field.maxResolutionMeter.max',
        valueType: 'value',
        max: 78271.52,
      },
    ],
  },
  {
    prop: 'imagingTimeBeginUTC',
    mappingType: { value: 'Date', type: PropertiesTypes.PRIMITIVE },
    column: {
      name: 'imaging_time_begin_utc',
      type: 'timestamp with time zone',
      nullable: false,
    },
    index: {}, validation: [
      {
        errorMsgCode: 'validation-general.required',
        required: true,
      },
      {
        errorMsgCode: 'validation-field.sourceDateStart.max',
        valueType: 'field',
        max: 'imagingTimeEndUTC',
      },
      {
        errorMsgCode: 'validation-general.date.future',
        valueType: 'value',
        max: '$NOW',
      },
    ],
  },
  {
    prop: 'productVersion',
    column: {
      name: 'product_version',
      type: 'text',
      nullable: false,
      collation: 'C.UTF-8',
    },
    // mappingType: TsTypes.STRING,
    mappingType: { value: 'string', type: PropertiesTypes.PRIMITIVE },
    validation: [
      {
        errorMsgCode: 'validation-field.productVersion.pattern',
        valueType: 'value',
        pattern: '^[1-9]\\d*(\\.(0|[1-9]\\d?))?$',
      },
    ],
  },
  {
    prop: 'productTypeImported',
    column: {
      name: 'product_type_imported',
      type: 'enum',
      enum: {
        enumName: 'product_type_enum',
        enumType: 'ProductType'
      },
      nullable: false,
    },
    index: { spatial: true },
    mappingType: { value: 'ProductType', type: PropertiesTypes.PRIMITIVE, importFromPackage: 'mockPackage' }
  },
];

class Source implements IOrmCatalog {
  public getORMCatalogMappings(): IPropCatalogDBMapping[] {
    return basicFieldsWithDecorators;
  };

  public getORMCatalogEntityMappings(): ICatalogDBEntityMapping {
    return entity;
  };
}

class SourceFieldDescriptors implements IOrmCatalog {
  public getORMCatalogMappings(): IPropCatalogDBMapping[] {
    return extendedFieldsDecorators;
  };

  public getORMCatalogEntityMappings(): ICatalogDBEntityMapping {
    return entity;
  };
};

export {basicFieldsWithDecorators, extendedFieldsDecorators, Source, SourceFieldDescriptors}
