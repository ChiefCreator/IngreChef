import { Request, Response, NextFunction } from 'express';

type NormalizationSource = "body" | "query";

interface EnumNormalizerOptions {
  fields: string[];
  sources?: NormalizationSource[];
}

function toEnumStyle(value: string): string {
  return value
    .replace(/-/g, '_')      
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toUpperCase();
}
function fromEnumStyle(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, '-');
}

export function createEnumNormalizer(options: EnumNormalizerOptions) {
  const { fields, sources = ["body"] } = options;

  return function enumNormalizer(req: Request, res: Response, next: NextFunction) {
    for (const source of sources) {
      const container = req[source];

      if (container && typeof container === "object") {
        for (const field of fields) {
          const val = container[field];

          if (typeof val === "string") {
            container[field] = toEnumStyle(val);
          }
        }
      }
    }
    next();
  };
}

export function denormalizeEnumFields(data: Record<string, any>, fields: string[]): Record<string, any> {
  const result = { ...data };

  for (const field of fields) {
    const val = result[field];

    if (typeof val === "string") {
      result[field] = fromEnumStyle(val);
    }
  }
  return result;
}
