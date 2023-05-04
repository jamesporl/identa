import { createContext } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { RouterOutput } from '../../../utils/trpc';
import { AUTH_TOKEN_KEY } from '../utils/storageKeys';

type MyAccountOutput = RouterOutput['base']['myAccount'];

export class Auth {
  constructor() {
    makeObservable(this);
  }

  @observable authToken = '';

  @observable isLoadingMyAccount = true;

  @observable myAccount: MyAccountOutput | undefined = undefined;

  @action login = (authToken: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    this.authToken = authToken;
  };

  @action logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.authToken = '';
  };

  @action setMyAccount = (account: MyAccountOutput) => {
    this.myAccount = account;
    this.isLoadingMyAccount = false;
  };

  @action setIsLoadingMyAccount = (value: boolean) => {
    this.isLoadingMyAccount = value;
  };
}

const AuthContext = createContext<Auth>(new Auth());

export default AuthContext;
