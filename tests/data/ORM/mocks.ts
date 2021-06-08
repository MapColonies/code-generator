import { IOrmCatalog, PropertiesTypes } from '@map-colonies/mc-model-types';
import { IPropCatalogDBMapping } from '@map-colonies/mc-model-types/Schema/models/common/interfaces/propCatalogDBMapping.interface';
import { ICatalogDBEntityMapping } from '@map-colonies/mc-model-types/Schema/models/layerMetadata/decorators/class/catalogDBEntity.decorator';

export const fields: IPropCatalogDBMapping[] = [
  {
    prop: 'id',
    column: { name: 'identifier', type: 'text', nullable: true },
    mappingType: { value: 'string', type: PropertiesTypes.PRIMITIVE }
  },
  {
    prop: 'version',
    column: { name: 'version', type: 'text', nullable: true },
    mappingType: { value: 'string', type: PropertiesTypes.PRIMITIVE }
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
