import { createContext } from 'react';
import { observable, action, makeObservable } from 'mobx';

class UI {
  constructor() {
    makeObservable(this);
  }

  // use lower case only because react is confused that it can be a div attribute
  @observable screenheight = 768;

  @observable screenwidth = 1200;

  @action setScreenSize = (width: number, height: number) => {
    this.screenwidth = width;
    this.screenheight = height;
  };
}

const UIContext = createContext<UI>(new UI());

export default UIContext;
