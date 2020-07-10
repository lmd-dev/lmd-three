class Subject
{
    private _observers: Array<Observer>;

    constructor()
    {
        this._observers = new Array<Observer>();
    }

    addObserver(observer: Observer)
    {
        this._observers.push(observer);
    }

    notify(data: any = null)
    {
        this._observers.forEach((observer) =>
        {
            observer.notify(data);
        });
    }
}