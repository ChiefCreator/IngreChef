import Router from './Router'
import { Provider } from 'react-redux'
import { SkeletonTheme } from 'react-loading-skeleton'

import { store } from './store'

export default function App() {

  return (
    <>
    <Provider store={store}>
      <SkeletonTheme baseColor="var(--color-neutral-main--dark)" highlightColor="var(--color-neutral-main--darken)">
        <Router />
      </SkeletonTheme>
    </Provider>
    </>
  )
}
