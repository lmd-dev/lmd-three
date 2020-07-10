/**
 * the web application
 */
class ThreeApp
{
    //Main controller of the application
    private _controller: Controller;

    //Main view of the application
    private _view: View;

    /**
     * Constructor
     */
    constructor()
    {
        this._controller = new Controller();
        this._view = new View(this._controller);
    }
}

//Entry point
window.onload = () =>
{
    let app = new ThreeApp();
}