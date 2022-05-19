import { IOrmCatalog, PropertiesTypes, ORMColumnType }  from '@map-colonies/mc-model-types';
import { IPropCatalogDBMapping } from '@map-colonies/mc-model-types/Schema/models/common/interfaces/propCatalogDBMapping.interface';
import { ICatalogDBEntityMapping } from '@map-colonies/mc-model-types/Schema/models/layerMetadata/decorators/class/catalogDBEntity.decorator';


export const fields: IPropCatalogDBMapping[] = [
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
    mappingType: { value: 'PropertiesTypes', type: PropertiesTypes.ENUM, importFromPackage: '@map-colonies/mc-model-types'}
  },
  {
    prop: 'enumArray',
    column: { name: 'enumArray', type: 'text', nullable: true },
    mappingType: { value: 'PropertiesTypes', type: PropertiesTypes.ENUM_ARRAY, importFromPackage: '@map-colonies/mc-model-types'}
  },
  {
    prop: 'test',
    column: { name: 'test', type: 'text', nullable: true },
    mappingType: { value: 'string', type: PropertiesTypes.PRIMITIVE },
    field: { overrideType: { value: 'number', type: PropertiesTypes.PRIMITIVE } }
  },
  {
    prop: 'updateDate',
    columnType: ORMColumnType.UPDATE_DATE_COLUMN,
    column: { name: 'update_date', type: 'timestamp without time zone', nullable: true },
    mappingType: { value: 'Date', type: PropertiesTypes.PRIMITIVE },
  },
];


export const entity: ICatalogDBEntityMapping = {
  table: 'records',
  className: 'Metadata'
};

export class Source implements IOrmCatalog {
  public getORMCatalogMappings(): IPropCatalogDBMapping[] {
    return fields;
  }

  public getORMCatalogEntityMappings(): ICatalogDBEntityMapping {
    return entity;
  }
}
