import { rootReducer } from './store';

describe('Root Reducer Initialization', () => {
  it('should return the initial state when called with undefined state and an unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({
      burgerConstructor: expect.any(Object),
      ingredients: expect.any(Object),
      feed: expect.any(Object),
      auth: expect.any(Object),
      profileOrders: expect.any(Object)
    });
  });
});
