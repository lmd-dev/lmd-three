class Subject {
    constructor() {
        this._observers = new Array();
    }
    addObserver(observer) {
        this._observers.push(observer);
    }
    notify(data = null) {
        this._observers.forEach((observer) => {
            observer.notify(data);
        });
    }
}
