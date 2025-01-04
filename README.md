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

### Import the Library

```ts
import { pathgen } from 'object-path-generator';
```

---

### Basic Example

Generate type-safe object paths dynamically:

```ts
export const AlignmentDataHooks = pathgen<{
  Root: string;
  Label: string;
  HorizontalOption(alignment: ContentJustification): string;
  Item({ id: string }): string;
}>('AlignmentDataHooks');

console.log(AlignmentDataHooks.Root()); // Outputs: "AlignmentDataHooks.Root"
console.log(AlignmentDataHooks.Label()); // Outputs: "AlignmentDataHooks.Label"
console.log(AlignmentDataHooks.HorizontalOption(ContentJustification.Center)); 
// Outputs: "AlignmentDataHooks.HorizontalOption center"
console.log(AlignmentDataHooks.Item({ id: '123' })); 
// Outputs: "AlignmentDataHooks.Item id-123"
```

---

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

const realObject = {
  name: 'John Doe',
};

const objectProxy = pathgen<MyObject>('', (path, options) => {
  return get(realObject, path, 'default value');
});

console.log(objectProxy.name()); // Outputs: "John Doe"
console.log(objectProxy.address()); // Outputs: "default value"
```

---

#### Example 2: Using Translations

```json
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

const translations = pathgen<Translations>(undefined, (path, ...options) => {
  const { t } = useI18n(); // Example translation function
  return t(path, ...options);
});

console.log(translations.common.loggedIn.message({ username: 'Ash' }));
// Outputs: "Hey Ash, you have successfully logged in!"
console.log(translations.readingWarning({ reader: 'Sam', writer: 'Alex' }));
// Outputs: "Sam reads message from Alex"
```

---

## API

### `pathgen`

#### Parameters

1. **`root`** *(optional)*:
    - A string representing the root prefix for the generated paths. Typically, this is the name of the object you are generating paths for.

2. **`customFn`** *(optional)*:
    - A function called when a path is accessed. It receives:
        - `path`: The current path as a string.
        - `...options`: Additional arguments passed when the path is accessed.

#### Returns

An object with the same shape as the input type `T` and return type `R` (`string` by default), where:
- Nested objects are recursively transformed into proxies.
- Leaf properties become functions (`() => R`) that return their path or the result of `customFn`.

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
