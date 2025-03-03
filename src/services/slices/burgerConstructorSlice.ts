import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TConstructorIngredient, TOrder } from '@utils-types';

type TConstructorItems = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TBurgerConstructorState = {
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TBurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'burgerConstructor/createOrder',
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (err) {
      return rejectWithValue('Ошибка при создании заказа');
    }
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    resetConstructor: (state) => {
      state.constructorItems = { bun: null, ingredients: [] };
    },
    resetOrder: (state) => {
      state.orderModalData = null;
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        [
          state.constructorItems.ingredients[index - 1],
          state.constructorItems.ingredients[index]
        ] = [
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index - 1]
        ];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.constructorItems.ingredients.length - 1) {
        [
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index + 1]
        ] = [
          state.constructorItems.ingredients[index + 1],
          state.constructorItems.ingredients[index]
        ];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
          state.constructorItems = { bun: null, ingredients: [] };
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  setBun,
  resetConstructor,
  resetOrder,
  moveIngredientUp,
  moveIngredientDown
} = burgerConstructorSlice.actions;

export const selectConstructorItems = (state: {
  burgerConstructor: TBurgerConstructorState;
}) => state.burgerConstructor.constructorItems;
export const selectOrderRequest = (state: {
  burgerConstructor: TBurgerConstructorState;
}) => state.burgerConstructor.orderRequest;
export const selectOrderModalData = (state: {
  burgerConstructor: TBurgerConstructorState;
}) => state.burgerConstructor.orderModalData;

export default burgerConstructorSlice.reducer;
