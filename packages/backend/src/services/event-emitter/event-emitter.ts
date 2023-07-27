type EventCallback = (...args: any[]) => void;
type Events = Record<string, EventCallback>;

export class EventEmitter<T extends Events> {
  private listeners: Map<keyof T, Array<EventCallback>>;

  constructor() {
    this.listeners = new Map();
  }

  /**
   * Adds a listener for the given event
   */
  public on<K extends keyof T>(event: K, callback: T[K]): void {
    const listeners = this.listeners.get(event) ?? [];
    listeners.push(callback);
    this.listeners.set(event, listeners);
  }

  /**
   * Removes a listener for the given event
   */
  public off<K extends keyof T>(event: K, callback: T[K]): void {
    const listeners = this.listeners.get(event) ?? [];
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Emits an event with the given data
   */
  public emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const listeners = this.listeners.get(event) ?? [];
    listeners.forEach(listener => listener(...args));
  }
}
