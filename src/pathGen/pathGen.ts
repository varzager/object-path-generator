type DeepRequired<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends Function
    ? NonNullable<T[K]>
    : DeepRequired<NonNullable<T[K]>>;
};

type PathGenElements<T, R> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K] // Preserve existing function and arguments
    : T[K] extends object
      ? PathGenElements<T[K], R> // Recursively process nested objects, making them non-nullable
      : () => R; // Convert leaf properties to `() => string`
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

export const pathgen = <T = any, R = string>(
  root?: string,
  customFn?: (path: string, ...options: any[]) => R,
): PathGenElements<DeepRequired<T>, R> =>
  pathgenInner(root, root, customFn, customFn) as any;
