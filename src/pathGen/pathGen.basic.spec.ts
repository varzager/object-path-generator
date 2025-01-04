import {pathgen} from './pathGen';

describe('pathgen - basic', () => {
  let ProxySpy: jest.SpyInstance;

  beforeEach(() => {
    const originalProxy = Proxy;
    ProxySpy = jest.spyOn(global, 'Proxy').mockImplementation((target, handler) => {
      return new originalProxy(target, handler);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original implementations.
  });

  it('should support typeless', () => {
    const Simple = pathgen();
    expect(Simple.blah.blah()).toBe('blah.blah');
  })

  it('should have simple path', () => {
    const Simple = pathgen<{
      FirstValue: string;
      SecondValue: string;
      ThirdValue: string;
    }>('Simple');
    expect(Simple.FirstValue()).toBe('Simple.FirstValue');
    expect(Simple.SecondValue()).toBe('Simple.SecondValue');
    expect(Simple.ThirdValue()).toBe('Simple.ThirdValue');
  });

  it('should have nested path', () => {
    const Nested = pathgen<{
      Parent: {
        Child: {
          GrandChild: string;
        };
      };
    }>('Nested');

    expect(Nested.Parent.Child.GrandChild()).toBe('Nested.Parent.Child.GrandChild');
  });

  it('should have complex datahook', () => {
    const Complex = pathgen<{
      FirstValue: {name: string};
      Mother: {
        Daughter: {
          Sophie: string;
          Lora: string;
          Adopted: {
            Linda: string;
            Other(name: string): string;
          };
        };
        Son(name: string): string;
      };
    }>('Complex');

    expect(Complex.FirstValue.name()).toBe('Complex.FirstValue.name');
    expect(Complex.Mother.Son('donny')).toBe('Complex.Mother.Son donny');
    expect(Complex.Mother.Daughter.Sophie()).toBe('Complex.Mother.Daughter.Sophie');
    expect(Complex.Mother.Daughter.Lora()).toBe('Complex.Mother.Daughter.Lora');
    expect(Complex.Mother.Daughter.Adopted.Linda()).toBe('Complex.Mother.Daughter.Adopted.Linda');
    expect(Complex.Mother.Daughter.Adopted.Other('virginia')).toBe('Complex.Mother.Daughter.Adopted.Other virginia');
  });

  it('should use cache', () => {
    const Complex = pathgen<{
      FirstValue: {name: string};
      Mother: {
        Daughter: {
          Sophie: string;
          Lora: string;
          Adopted: {
            Linda: string;
            Other(name: string): string;
          };
        };
        Son(name: string): string;
      };
    }>('Complex');

    expect(ProxySpy).toHaveBeenCalledTimes(1);

    Complex.FirstValue.name();
    expect(ProxySpy).toHaveBeenCalledTimes(3);
    Complex.Mother.Son('donny');
    expect(ProxySpy).toHaveBeenCalledTimes(5);
    Complex.Mother.Daughter.Sophie();
    expect(ProxySpy).toHaveBeenCalledTimes(7);
    Complex.Mother.Daughter.Lora();
    expect(ProxySpy).toHaveBeenCalledTimes(8);
    Complex.Mother.Daughter.Adopted.Linda();
    expect(ProxySpy).toHaveBeenCalledTimes(10);
    Complex.Mother.Daughter.Adopted.Other('virginia');
    expect(ProxySpy).toHaveBeenCalledTimes(11);

    Complex.FirstValue.name();
    Complex.Mother.Son('donny');
    Complex.Mother.Daughter.Sophie();
    Complex.Mother.Daughter.Lora();
    Complex.Mother.Daughter.Adopted.Linda();
    Complex.Mother.Daughter.Adopted.Other('virginia');
    expect(ProxySpy).toHaveBeenCalledTimes(11);
  });
});
