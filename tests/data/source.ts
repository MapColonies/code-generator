import { pycsw } from '@map-colonies/mc-model-types/Schema/models/layerMetadata/decorators/property/csw.decorator';
import { catalogDB, getCatalogDBMapping } from '@map-colonies/mc-model-types/Schema/models/layerMetadata/decorators/property/catalogDB.decorator';
import { getTsTypesMapping, tsTypes, TsTypes } from '@map-colonies/mc-model-types/Schema/models/layerMetadata/decorators/property/tsTypes.decorator';
import { IOrmCatalog } from '@map-colonies/mc-model-types';
import { IPropCatalogDBMapping } from '@map-colonies/mc-model-types/Schema/models/common/interfaces/IPropCatalogDBMapping';
import {
  catalogDBEntity,
  getCatalogDBEntityMapping,
  ICatalogDBEntityMapping,
} from '@map-colonies/mc-model-types/Schema/models/layerMetadata/decorators/class/catalogDBEntity.decorator';

@catalogDBEntity({
  table: 'records',
})
export class Source implements IOrmCatalog {
  @pycsw({
    profile: 'mc_raster',
    xmlElement: 'mc:id',
    queryableField: 'mc:id',
    pycswField: 'pycsw:Identifier',
  })
  @catalogDB({
    column: {
      name: 'identifier',
      type: 'text',
      nullable: true,
    },
  })
  @tsTypes({
    mappingType: TsTypes.STRING,
  })
  public id?: string = undefined;

  @pycsw({
    profile: 'mc_raster',
    xmlElement: 'mc:version',
    queryableField: 'mc:vserion',
    pycswField: 'pycsw:version',
  })
  @catalogDB({
    column: {
      name: 'version',
      type: 'text',
      nullable: true,
    },
  })
  @tsTypes({
    mappingType: TsTypes.STRING,
  })
  public version?: string = undefined;

  public getORMCatalogMappings(): IPropCatalogDBMapping[] {
    const ret = [];

    for (const prop in this) {
      const catalogDbMap = getCatalogDBMapping(this, prop);
      const tsTypesMap = getTsTypesMapping(this, prop);
      if (catalogDbMap && tsTypesMap) {
        ret.push({
          prop: prop,
          ...catalogDbMap,
          ...tsTypesMap,
        });
      }
    }
    return ret;
  }

  public getORMCatalogEntityMappings(): ICatalogDBEntityMapping {
    return getCatalogDBEntityMapping(this);
  }
}
