import reducer, {
  register,
  login,
  logout,
  fetchUser,
  updateUser,
  checkUserAuth,
  authChecked,
  TAuthState,
  initialState
} from './authSlice';
import { TUser } from '@utils-types';

// Мокаем API
jest.mock('@api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn()
}));

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => null)
}));

describe('authSlice', () => {
  it('должен вернуть initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен установить isAuthChecked в true при authChecked', () => {
    const action = authChecked();
    const state = reducer(initialState, action);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен установить isLoading в true при register.pending', () => {
    const action = { type: register.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранить пользователя при register.fulfilled', () => {
    const mockUser: TUser = {
      email: 'test@example.com',
      name: 'Test User'
    };

    const action = { type: register.fulfilled.type, payload: mockUser };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранить ошибку при register.rejected', () => {
    const action = {
      type: register.rejected.type,
      payload: 'Ошибка регистрации'
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка регистрации');
  });

  it('должен сохранить пользователя при login.fulfilled', () => {
    const mockUser: TUser = {
      email: 'test@example.com',
      name: 'Test User'
    };

    const action = { type: login.fulfilled.type, payload: mockUser };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('должен сбросить пользователя при logout.fulfilled', () => {
    const prevState: TAuthState = {
      user: { email: 'test@example.com', name: 'Test User' },
      isLoading: false,
      isAuthenticated: true,
      isAuthChecked: true,
      error: null
    };

    const action = { type: logout.fulfilled.type };
    const state = reducer(prevState, action);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('должен обновить пользователя при updateUser.fulfilled', () => {
    const prevState: TAuthState = {
      user: { email: 'old@example.com', name: 'Old Name' },
      isLoading: false,
      isAuthenticated: true,
      isAuthChecked: true,
      error: null
    };

    const updatedUser: TUser = {
      email: 'new@example.com',
      name: 'New Name'
    };

    const action = { type: updateUser.fulfilled.type, payload: updatedUser };
    const state = reducer(prevState, action);
    expect(state.user).toEqual(updatedUser);
  });

  it('должен сохранить ошибку при updateUser.rejected', () => {
    const action = {
      type: updateUser.rejected.type,
      payload: 'Ошибка обновления'
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка обновления');
  });

  it('должен установить isAuthChecked в true при checkUserAuth.fulfilled', () => {
    const action = { type: checkUserAuth.fulfilled.type };
    const state = reducer(initialState, action);
    expect(state.isAuthChecked).toBe(true);
  });
});
