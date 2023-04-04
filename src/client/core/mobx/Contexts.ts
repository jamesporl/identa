import React from 'react';
import AuthStore from './AuthStore';

export default React.createContext({
  authStore: new AuthStore(),
});
