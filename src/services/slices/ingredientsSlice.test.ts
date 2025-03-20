import reducer, { getIngredients, TIngredientsState } from './ingredientsSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('должен вернуть initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен поставить loading в true при getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранить ингредиенты при getIngredients.fulfilled', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 200,
        price: 100,
        image: 'image-url',
        image_large: 'image-large-url',
        image_mobile: 'image-mobile-url'
      },
      {
        _id: '2',
        name: 'Сыр',
        type: 'main',
        proteins: 15,
        fat: 10,
        carbohydrates: 25,
        calories: 250,
        price: 50,
        image: 'image-url',
        image_large: 'image-large-url',
        image_mobile: 'image-mobile-url'
      }
    ];

    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('должен сохранить ошибку при getIngredients.rejected', () => {
    const action = {
      type: getIngredients.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
