import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

type TFeedState = {
  orders: TOrdersData['orders'];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchOrders = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feed/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (err) {
    return rejectWithValue('Ошибка загрузки заказов');
  }
});

export const fetchOrderById = createAsyncThunk<TOrder, string>(
  'feed/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(Number(orderId));

      if (!response.orders.length) {
        return rejectWithValue('Заказ не найден');
      }

      return response.orders[0];
    } catch (err) {
      return rejectWithValue('Ошибка загрузки заказа');
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orders.push(action.payload);
        }
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Неизвестная ошибка';
      });
  }
});

export const selectFeed = (state: { feed: TFeedState }) => state.feed;

export default feedSlice.reducer;
