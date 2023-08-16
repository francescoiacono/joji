class EventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  addListener(eventName: string, callback: Function) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  removeListener(eventName: string, callback: Function) {
    if (!this.listeners[eventName]) return;
    const index = this.listeners[eventName].indexOf(callback);
    if (index > -1) {
      this.listeners[eventName].splice(index, 1);
    }
  }

  emit(eventName: string, data: any) {
    if (!this.listeners[eventName]) return;
    for (const callback of this.listeners[eventName]) {
      callback(data);
    }
  }
}

export default EventEmitter;
