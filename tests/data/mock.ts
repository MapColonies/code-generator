export const fields = [
  {
    prop: 'id',
    column: { name: 'identifier', type: 'text', nullable: true },
    mappingType: 'string',
  },
  {
    prop: 'version',
    column: { name: 'version', type: 'text', nullable: true },
    mappingType: 'string',
  },
];

export const entity = {
  table: 'records',
};
