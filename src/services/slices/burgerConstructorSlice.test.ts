import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  setBun,
  resetConstructor,
  resetOrder,
  moveIngredientUp,
  moveIngredientDown,
  TBurgerConstructorState
} from './burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

describe('burgerConstructorSlice', () => {
  const ingredient1: TConstructorIngredient = {
    id: '1',
    _id: '1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  };

  const ingredient2: TConstructorIngredient = {
    id: '2',
    _id: '2',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 125,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  let initialState: TBurgerConstructorState;

  beforeEach(() => {
    initialState = {
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null,
      error: null
    };
  });

  it('должен вернуть initialState по умолчанию', () => {
    expect(burgerConstructorReducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  it('должен добавить ингредиент', () => {
    const nextState = burgerConstructorReducer(
      initialState,
      addIngredient(ingredient1)
    );
    expect(nextState.constructorItems.ingredients).toHaveLength(1);
    expect(nextState.constructorItems.ingredients[0]).toEqual(ingredient1);
  });

  it('должен удалить ингредиент', () => {
    initialState.constructorItems.ingredients.push(ingredient1);
    const nextState = burgerConstructorReducer(
      initialState,
      removeIngredient(ingredient1.id)
    );
    expect(nextState.constructorItems.ingredients).toHaveLength(0);
  });

  it('должен установить булку', () => {
    const nextState = burgerConstructorReducer(
      initialState,
      setBun(ingredient2)
    );
    expect(nextState.constructorItems.bun).toEqual(ingredient2);
  });

  it('должен сбросить конструктор', () => {
    initialState.constructorItems.bun = ingredient2;
    initialState.constructorItems.ingredients.push(ingredient1);

    const nextState = burgerConstructorReducer(
      initialState,
      resetConstructor()
    );
    expect(nextState.constructorItems.bun).toBeNull();
    expect(nextState.constructorItems.ingredients).toHaveLength(0);
  });

  it('должен сбросить заказ', () => {
    initialState.orderModalData = {
      _id: 'order1',
      status: 'done',
      name: 'Заказ 1',
      createdAt: '',
      updatedAt: '',
      number: 123,
      ingredients: []
    };

    const nextState = burgerConstructorReducer(initialState, resetOrder());
    expect(nextState.orderModalData).toBeNull();
  });

  it('должен поменять ингредиенты местами (вверх)', () => {
    initialState.constructorItems.ingredients = [ingredient1, ingredient2];

    const nextState = burgerConstructorReducer(
      initialState,
      moveIngredientUp(1)
    );
    expect(nextState.constructorItems.ingredients[0]).toEqual(ingredient2);
    expect(nextState.constructorItems.ingredients[1]).toEqual(ingredient1);
  });

  it('должен поменять ингредиенты местами (вниз)', () => {
    initialState.constructorItems.ingredients = [ingredient1, ingredient2];

    const nextState = burgerConstructorReducer(
      initialState,
      moveIngredientDown(0)
    );
    expect(nextState.constructorItems.ingredients[0]).toEqual(ingredient2);
    expect(nextState.constructorItems.ingredients[1]).toEqual(ingredient1);
  });
});
