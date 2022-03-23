// For more usage about redux:  https://redux.js.org/tutorials/quick-start
// Browser extension Redux DevTools is supported by default.
import { configureStore } from '@reduxjs/toolkit';
import exampleSlice from './slices/example';

export default configureStore({
  reducer: {
    example: exampleSlice,
  },
});
