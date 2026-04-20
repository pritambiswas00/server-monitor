import { mock as MockFn, type MockProxy } from 'vitest-mock-extended';

declare global {
     var mock: typeof MockFn;
     type Mocked<T> = MockProxy<T>;
}