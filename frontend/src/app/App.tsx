import Router from './Router'
import { Provider } from 'react-redux'
import { SkeletonTheme } from 'react-loading-skeleton'

import { store } from './store'
import { useAppDispatch } from './hooks'
import { useGetIngredientsQuery } from '../features/api/ingredientsApi/ingredientsApi'
import { setIngredients } from '../features/ingredients/ingredientsSlice'
import { useEffect } from 'react'

function InitIngredients() {
  const dispatch = useAppDispatch();
  const { data: ingredientsFromServer } = useGetIngredientsQuery({ query: "" }, {
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (ingredientsFromServer) {
      dispatch(setIngredients(ingredientsFromServer));
    }
  }, [ingredientsFromServer]);

  return <Router />;
}

export default function App() {

  return (
    <Provider store={store}>
      <SkeletonTheme baseColor="var(--color-neutral-main--dark)" highlightColor="var(--color-neutral-main--darken)">
        <InitIngredients />
      </SkeletonTheme>
    </Provider>
  )
}
