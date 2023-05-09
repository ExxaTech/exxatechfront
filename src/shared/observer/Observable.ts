export interface IObserver<T> {
  update(data: T): void;
}

export class Observable<T> {
  private observers: IObserver<T>[] = [];

  addObserver(observer: IObserver<T>): void {
    this.observers.push(observer);
  }

  removeObserver(observer: IObserver<T>): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(data: T): void {
    this.observers.forEach((observer) => {
      observer.update(data);
    });
  }
}
