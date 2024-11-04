import { SourceFile, VariableDeclarationKind } from 'ts-morph';

type VAR_DECLARETION = 'Const' | 'Let' | 'Var';

export const objectToString = (object: Record<string, unknown>): string => {
  const dataParts: string[] = ['{ '];
  const props = Object.entries(object);
  if (!props.length) {
    return '';
  }
  props.forEach((pair: [string, unknown], index: number) => {
    const parsed = valueToString(pair);
    const value = parsed !== undefined ? parsed : 'undefined';
    let stringifyKey = `${pair[0]}: ${value}`;
    if (index !== props.length - 1) {
      stringifyKey += ',';
    }
    dataParts.push(stringifyKey + ' ');
  });
  dataParts.push('}');
  const data = dataParts.join('');
  data.trim();

  return data;
};

export const valueToString = (pair: [string, unknown]): string | undefined => {
  const value = pair[1];
  switch (typeof value) {
    case 'object':
      if (Array.isArray(value)) return `[${value.map((item) => `'${item}'`).join(', ')}]`;
      else {
        return objectToString(value as Record<string, unknown>);
      }
    case 'bigint':
    case 'boolean':
    case 'number':
      return value.toString();
    case 'string':
      return pair[0] !== 'enum' ? `'${value}'` : `${value}`;
    case 'undefined':
      return undefined;
    case 'symbol':
    case 'function':
      throw new Error(`unsupported value type: ${typeof value}`);
  }
};

export const generateVariable = (targetFile: SourceFile, position: number, varName: string, values: string[], varDeclaration: VAR_DECLARETION) => {
  targetFile?.insertVariableStatement(position, {
    isExported: true,
    declarationKind: VariableDeclarationKind[varDeclaration],
    declarations: [
      {
        name: `${varName}`,
        initializer: JSON.stringify(values),
      },
    ],
  });
};
