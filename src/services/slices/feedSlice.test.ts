import reducer, { fetchOrders, fetchOrderById, TFeedState } from './feedSlice';
import { TOrder, TOrdersData } from '@utils-types';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

describe('feedSlice', () => {
  const initialState: TFeedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  it('должен вернуть initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен поставить isLoading в true при fetchOrders.pending', () => {
    const action = { type: fetchOrders.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранить заказы при fetchOrders.fulfilled', () => {
    const mockOrdersData: TOrdersData = {
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Interstellar бургер',
          createdAt: '2025-03-17T12:00:00Z',
          updatedAt: '2025-03-17T12:15:00Z',
          number: 101,
          ingredients: ['ingredient1', 'ingredient2']
        }
      ],
      total: 5000,
      totalToday: 150
    };

    const action = {
      type: fetchOrders.fulfilled.type,
      payload: mockOrdersData
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrdersData.orders);
    expect(state.total).toBe(5000);
    expect(state.totalToday).toBe(150);
    expect(state.error).toBeNull();
  });

  it('должен сохранить ошибку при fetchOrders.rejected', () => {
    const action = {
      type: fetchOrders.rejected.type,
      payload: 'Ошибка загрузки заказов'
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказов');
  });

  it('должен добавить заказ при fetchOrderById.fulfilled', () => {
    const mockOrder: TOrder = {
      _id: '2',
      status: 'done',
      name: 'Supernova Infinity бургер',
      createdAt: '2025-03-17T13:00:00Z',
      updatedAt: '2025-03-17T13:15:00Z',
      number: 102,
      ingredients: ['ingredient3', 'ingredient4']
    };

    const action = { type: fetchOrderById.fulfilled.type, payload: mockOrder };
    const state = reducer(initialState, action);
    expect(state.orders).toContainEqual(mockOrder);
  });

  it('должен сохранить ошибку при fetchOrderById.rejected', () => {
    const action = {
      type: fetchOrderById.rejected.type,
      payload: 'Заказ не найден'
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe('Заказ не найден');
  });
});
