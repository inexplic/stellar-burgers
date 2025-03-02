import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import {
  addIngredient,
  selectConstructorItems,
  setBun
} from '../../services/slices/burgerConstructorSlice';
import { nanoid } from '@reduxjs/toolkit';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const { bun, ingredients } = useSelector(selectConstructorItems);

    const calculatedCount =
      ingredient.type === 'bun'
        ? bun?._id === ingredient._id
          ? 1
          : undefined
        : ingredients.filter((item) => item._id === ingredient._id).length ||
          undefined;

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(setBun({ ...ingredient, id: ingredient._id }));
      } else {
        dispatch(addIngredient({ ...ingredient, id: nanoid() }));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={calculatedCount}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
