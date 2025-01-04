import { pathgen } from '../src';
import * as _ from 'lodash';

describe('pathgen - advance', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Restore original implementations.
  });

  it('should get values and have fallbacks', () => {
    interface MYObject {
      FirstValue?: { name: string; lastName: string };
      names?: Array<{ name: string }>;
      calling?: (name: string) => string;
      isWorking?: boolean;
      numberInLine?: number;
      Mother?: {
        calling?: (SurName: string) => string;
        Daughter?: {
          Adopted?: {
            Linda?: string;
            Other?: string;
            Unknown?: string;
          };
        };
      };
    }

    const expectedDefaultValue = 'value not found';

    const defaultsValues: MYObject = {
      Mother: { Daughter: { Adopted: { Unknown: 'Unknown default value' } } },
    };

    const realObject: MYObject = {
      FirstValue: { name: 'John', lastName: 'Doe' },
      names: [{ name: 'Johnathan' }, { name: 'Jane' }],
      isWorking: true,
      numberInLine: 1,
      Mother: {
        calling: (SurName: string) => SurName,
        Daughter: {
          Adopted: {
            Linda: 'Linda',
          },
        },
      },
    };

    const objectProxy = pathgen<MYObject>('', (path, options) => {
      const val = _.get(
        realObject,
        path,
        _.get(defaultsValues, path, expectedDefaultValue),
      ) as any;
      return val && typeof val === 'function' ? val(options) : val;
    });
    expect(objectProxy.FirstValue.name()).toBe(realObject.FirstValue?.name);
    expect(objectProxy.names[0].name()).toBe(realObject.names?.[0].name);
    expect(objectProxy.Mother.Daughter.Adopted.Other()).toBe(
      expectedDefaultValue,
    );
    expect(objectProxy.Mother.Daughter.Adopted.Unknown()).toBe(
      defaultsValues.Mother?.Daughter?.Adopted?.Unknown,
    );
    expect(objectProxy.calling('Doe')).toBe(expectedDefaultValue);
    expect(objectProxy.Mother.calling('Doe')).toBe('Doe');
    expect(objectProxy.isWorking()).toBe(realObject.isWorking);
    expect(objectProxy.numberInLine()).toBe(realObject.numberInLine);
  });
});
