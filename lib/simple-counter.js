export default class SimpleCounter {
  constructor() {
    this._currentCounter = 0;
  }

  get currentCount() {
    return this._currentCounter;
  }

  set currentCount(newCount) {
    this._currentCounter = newCount;
  }

  up(by = 1) {
    this._currentCounter += by;
    return this;
  }

  down(by = 1) {
    this._currentCounter -= by;
    return this;
  }
}
