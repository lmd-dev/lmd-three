/**
 * the web application
 */
class ThreeApp {
    /**
     * Constructor
     */
    constructor() {
        this._controller = new Controller();
        this._view = new View(this._controller);
    }
}
//Entry point
window.onload = () => {
    let app = new ThreeApp();
};
