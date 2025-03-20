import reducer, {
  fetchProfileOrders,
  TProfileOrdersState
} from './profileOrdersSlice';
import { TOrder } from '@utils-types';

jest.mock('@api', () => ({
  getOrdersApi: jest.fn()
}));

describe('profileOrdersSlice', () => {
  const initialState: TProfileOrdersState = {
    orders: [],
    loading: false,
    error: null
  };

  it('должен вернуть initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен поставить loading в true при fetchProfileOrders.pending', () => {
    const action = { type: fetchProfileOrders.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранить заказы при fetchProfileOrders.fulfilled', () => {
    const mockOrders: TOrder[] = [
      {
        _id: '1',
        status: 'done',
        name: 'Supernova Infinity бургер',
        createdAt: '2025-03-17T12:00:00Z',
        updatedAt: '2025-03-17T12:15:00Z',
        number: 123,
        ingredients: ['ingredient1', 'ingredient2']
      },
      {
        _id: '2',
        status: 'done',
        name: 'Interstellar бургер',
        createdAt: '2025-03-17T12:30:00Z',
        updatedAt: '2025-03-17T12:45:00Z',
        number: 124,
        ingredients: ['ingredient3', 'ingredient4']
      }
    ];

    const action = {
      type: fetchProfileOrders.fulfilled.type,
      payload: mockOrders
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  it('должен сохранить ошибку при fetchProfileOrders.rejected', () => {
    const action = {
      type: fetchProfileOrders.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
