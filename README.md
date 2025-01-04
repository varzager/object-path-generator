# object-path-generator

`object-path-generator` is a lightweight TypeScript utility library for dynamically generating paths for object properties at runtime. This tool simplifies the creation of data hooks, translation keys, and object paths for use with utilities like Lodash's `get` and `set`.

---

## Features

- **Dynamic Path Generation**: Easily generate object paths in a type-safe way.
- **Flexible Usage**: Ideal for creating `data-hook` strings, accessing translation keys, or using deep getters/setters of Lodash, and more.
- **TypeScript Support**: Built with TypeScript, ensuring strong type safety and autocompletion in your IDE.

---

## Installation

Install the library via npm or yarn:

```bash
# Using npm
npm install object-path-generator

# Using yarn
yarn add object-path-generator
```

---

## Usage

### Basic js Example
```js
const { pathgen } = require('object-path-generator');
const gen = pathgen();
console.log(gen.blah.blah()); // Output: "blah.blah"
console.log(gen.blah.blah.blah()); // Output: "blah.blah.blah"
console.log(gen.testing.something[9][2].complex()); 
// Output: "testing.something.9.2.run"
console.log(gen.Down.The.Rabbit.Hole('Alice', {In: 'Wonderland'})); 
// Output: "Down.The.Rabbit.Hole Alice In-Wonderland"
```
___

### Basic Typescript Example

Generate type-safe object paths dynamically:

```ts
import { pathgen } from 'object-path-generator';
export const AlignmentDataHooks = pathgen<{
  Root: string;
  Label: string;
  HorizontalOption(alignment: ContentJustification): string;
  Item({ id: string }): string;
}>('AlignmentDataHooks');

console.log(AlignmentDataHooks.Root()); 
// Outputs: "AlignmentDataHooks.Root"
console.log(AlignmentDataHooks.Label()); 
// Outputs: "AlignmentDataHooks.Label"
console.log(AlignmentDataHooks.HorizontalOption(ContentJustification.Center)); 
// Outputs: "AlignmentDataHooks.HorizontalOption center"
console.log(AlignmentDataHooks.Item({ id: '123' })); 
// Outputs: "AlignmentDataHooks.Item id-123"
```


### Advanced Usage with Custom Function

You can customize the behavior of the generated paths by providing a custom function as the second argument.

#### Example 1: Using Lodash for Deep Object Access

```ts
import { pathgen } from 'object-path-generator';
import { get } from 'lodash';

interface MyObject {
  user: {
    name: string;
    details: {
      address: string;
    };
  };
}

const realObject: MyObject = {
  name: 'Ash Williams',
};

const objectProxy = pathgen<MyObject>('', (path, options) => {
  return get(realObject, path, 'default value');
});

console.log(objectProxy.name()); // Outputs: "Ash Williams"
console.log(objectProxy.details.address()); // Outputs: "default value"
```

#### Example 2: Using Translations

```js
// messages_en.json
{
  "common": {
    "loggedIn": {
      "message": "Hey {{username}}, you have successfully logged in!"
    }
  },
  "readingWarning": "{{reader}} reads message from {{writer}}"
}
```

```ts
import { pathgen } from 'object-path-generator';

interface Translations {
  common: {
    loggedIn: {
      message: (data: Record<'username', unknown>) => string;
    };
  };
  readingWarning: (data: Record<'reader' | 'writer', unknown>) => string;
}

// useTransaltions.ts
const useTransaltions = () => {
   const { t } = useI18n();
   const translations = useMemo(pathgen<Translations>(undefined, (path, ...options) => {
     return t(path, ...options);
   }), [t]);

   return {translations};
}

// main.tsx
const {translations} = useTranslations();
console.log(translations.common.loggedIn.message({ username: 'Ash' }));
// Outputs: "Hey Ash, you have successfully logged in!"
console.log(translations.readingWarning({ reader: 'Sam', writer: 'Alex' }));
// Outputs: "Sam reads message from Alex"
```

---

## API

### `pathgen`
`pathgen<T, R>(root?: string, customFn?: (path: string, ...options: any[]) => R)`

#### Generic Types

1. **`T`**:
   - Represents the structure of the object for which paths are generated. This is typically an interface or type defining the shape of your object.
2. **`R`** *(optional)*:
   - The return type of the generated functions. Defaults to `string`.

#### Parameters

1. **`root`** *(optional)*:
    - A string representing the root prefix for the generated paths. Typically, this is the name of the object you are generating paths for.

2. **`customFn`** *(optional)*:
    - A function called when a path is accessed. It receives:
        - `path`: The current path as a string.
        - `...options`: Additional arguments passed when the path is accessed.

#### Returns

An object with the same structure as the input type `T` where:
- Nested objects are recursively transformed into proxies.
- Leaf properties that are primitive become functions (`() => R`(`string` by default)) that return their path or the result of `customFn`.

---

## Why Use `object-path-generator`?

- **Simplify Path Handling**: Avoid hardcoding object paths in your code.
- **Reusable Paths**: Generate paths dynamically for use in multiple contexts (e.g., `data-hook` attributes, translations, and object access).
- **Type Safety**: Leverage TypeScript to ensure type safety and autocompletion for object paths.
- **Customizable Behavior**: Extend functionality with custom logic for dynamic path generation.

---

## License

This library is licensed under the MIT License.

---

## Contribution

We welcome contributions, issues, and feature requests! Feel free to create a pull request or submit an issue on GitHub.

---

Happy path generating! 🚀
