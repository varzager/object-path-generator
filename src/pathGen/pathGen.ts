type DeepRequired<T = any> = {
  [K in keyof T]-?: NonNullable<T[K]> extends Function
    ? NonNullable<T[K]>
    : DeepRequired<NonNullable<T[K]>>;
};

type PropertyType<PropertyType, GeneralType> =
  () => GeneralType extends undefined ? PropertyType : GeneralType;

type PathGenElements<T, R = undefined> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K]
    : T[K] extends object
      ? PathGenElements<T[K], R>
      : PropertyType<T[K], R>;
};

const getNewPath = (currPath: string, newProp: string) =>
  [currPath, newProp].filter(Boolean).join('.');

const pathgenInner = (
  name: string | undefined,
  path: string = name ?? '',
  customFn?: (path: string, ...options: any[]) => any,
  cache: Record<string, any> = {},
) =>
  new Proxy(
    (...options: any[]) => {
      if (customFn) {
        return customFn(path, ...options);
      }
      let finalPath = path;
      if (options.length > 0) {
        const finalOptions = options.flatMap((option) => {
          if (Array.isArray(option)) {
            return option;
          } else if (typeof option === 'object') {
            return Object.entries(option).map(
              ([key, value]) => `${key}-${value}`,
            );
          } else {
            return [option];
          }
        });

        finalPath = [finalPath, ...finalOptions].join(' ');
      }
      return finalPath;
    },
    {
      get(_target, prop: string) {
        if (!cache[prop]) {
          const newPath = getNewPath(path, prop);
          cache[prop] = pathgenInner(prop, newPath, customFn);
        }

        return cache[prop];
      },
    },
  );

export const pathgen = <T = any, R = undefined>(
  root?: string,
  customFn?: (path: string, ...options: any[]) => any,
): PathGenElements<
  DeepRequired<T>,
  R extends undefined ? (typeof customFn extends undefined ? string : R) : R
> => pathgenInner(root, root, customFn, customFn) as any;
