export const SUB_REQUEST_EVENT_NAME: string = 'subscribablerequest';

/**
 * A SubscribableWrapper value
 */
export class SubscribableWrapper<T extends Subscribable> {
  public readonly name: string;
  private subscriptions: Array<Subscription> = new Array<Subscription>();

  constructor(name: string, value: T) {
    this.name = name;
    this._value = value;
  }

  private _value: T;

  get value(): T {
    return this._value
  }

  set value(value: T) {
    this._value = value;
    this.subscriptions.forEach((value) => value(this.value))
  }

  public subscribe(fn: Subscription<T>) {
    this.subscriptions.push(fn);
  }
}

export class SubscribableRequest<T extends Subscribable> {
  subscribableName: string;
  subscribable?: SubscribableWrapper<T>;

  constructor(name: string) {
    this.subscribableName = name;
  }
}

export class Subscribable {
  readonly name: string;

  constructor(name) {
    this.name = name;
  }
}

export interface Subscription<T> {(subscribable: T): void;}

export function publish<T extends Subscribable>(el: HTMLElement, s: Subscribable): SubscribableWrapper<T> {
  let wrapper = new SubscribableWrapper<T>(s.name, s);
  let publisher = (event: CustomEvent) => {
    let request: SubscribableRequest = event.detail;
    if (request.subscribableName === wrapper.name) {
      request.subscribable = wrapper;
      event.stopPropagation();
    }
  };
  el.addEventListener(SUB_REQUEST_EVENT_NAME, publisher);
  return wrapper
}

export function subscribeTo<T extends Subscribable>(dispatcher: HTMLElement, name: string, subsciption: Subscription<T>) {
  const request = new SubscribableRequest<T>(name);
  let event = new CustomEvent(
    SUB_REQUEST_EVENT_NAME,
    {
      detail: request,
      bubbles: true,
      cancelable: true,
      composed: true
    });
  dispatcher.dispatchEvent(event);
  request.subscribable.subscribe(subsciption);
  //consume initial value
  subsciption(request.subscribable.value);
}



