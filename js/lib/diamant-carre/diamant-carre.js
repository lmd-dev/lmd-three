class DiamantCarre {
    getMatrixSize() { return this.matriceSize; }
    ;
    getValue(x, y) { return this.matrice[x][y]; }
    ;
    /**
     * Constructor
     * @param powerOfTwo Power of two used to compute the size of the matrix (2^n + 1)
     */
    constructor(powerOfTwo = 10) {
        this.matriceSize = Math.pow(2, powerOfTwo) + 1;
        this.matrice = new Array();
        for (let row = 0; row < this.matriceSize; ++row) {
            let temp = new Array();
            for (let column = 0; column < this.matriceSize; ++column) {
                temp.push(0);
            }
            this.matrice.push(temp);
        }
    }
    //Compute new matrix values
    computeMatrix() {
        this.matrice[0][0] = Math.floor(Math.random() * this.matriceSize / 1.5);
        this.matrice[this.matriceSize - 1][0] = Math.floor(Math.random() * this.matriceSize / 1.5);
        this.matrice[0][this.matriceSize - 1] = Math.floor(Math.random() * this.matriceSize / 1.5);
        this.matrice[this.matriceSize - 1][this.matriceSize - 1] = Math.floor(Math.random() * this.matriceSize / 1.5);
        this.build();
    }
    //Compute matrix values from corner values
    build() {
        let i = this.matriceSize - 1;
        while (i > 1) {
            let id = i / 2;
            //Carre
            for (let x = id; x < this.matriceSize; x += i) {
                for (let y = id; y < this.matriceSize; y += i) {
                    this.matrice[y][x] = (this.matrice[y - id][x - id] + this.matrice[y + id][x - id] + this.matrice[y + id][x + id] + this.matrice[y - id][x + id]) / 4 + ((Math.random() * 2 * id) - id);
                }
            }
            //Diamant
            let shift = 0;
            for (let x = 0; x < this.matriceSize; x += id) {
                if (shift == 0)
                    shift = id;
                else
                    shift = 0;
                for (let y = shift; y < this.matriceSize; y += i) {
                    let sum = 0;
                    let points = 0;
                    if (x >= id) {
                        sum += this.matrice[y][x - id];
                        ++points;
                    }
                    if (x + id < this.matriceSize) {
                        sum += this.matrice[y][x + id];
                        ++points;
                    }
                    if (y >= id) {
                        sum += this.matrice[y - id][x];
                        ++points;
                    }
                    if (y + id < this.matriceSize) {
                        sum += this.matrice[y + id][x];
                        ++points;
                    }
                    this.matrice[y][x] = sum / points + ((Math.random() * 2 * id) - id);
                }
            }
            i = id;
        }
    }
    /**
     * Creates a pixels grid from the matrix
     * @param colorizeFunction Pixel colorization function
     */
    renderCanvas(colorizeFunction = null) {
        let canvas = document.createElement('canvas');
        canvas.width = this.matriceSize;
        canvas.height = this.matriceSize;
        let imageData = canvas.getContext('2d').getImageData(0, 0, this.matriceSize, this.matriceSize);
        for (let row = 0; row < this.matriceSize; ++row) {
            for (let column = 0; column < this.matriceSize; ++column) {
                let color = { r: 0, g: 0, b: 0 };
                let value = this.matrice[row][column];
                if (colorizeFunction)
                    colorizeFunction(value, color);
                else {
                    color.r = color.g = color.b = (1.0 * value / (this.matriceSize / 1.5)) * 255;
                }
                let iPixel = (row * this.matriceSize + column) * 4;
                imageData.data[iPixel] = color.r;
                imageData.data[iPixel + 1] = color.g;
                imageData.data[iPixel + 2] = color.b;
                imageData.data[iPixel + 3] = 255;
            }
        }
        canvas.getContext('2d').putImageData(imageData, 0, 0);
        return canvas;
    }
    /**
     * Default class function to colorize pixels as a landscape
     * @param matrixValue Value of the matrix to interpret
     * @param resultColor RGB color result
     */
    static landscapeColoration(matrixValue, resultColor) {
        if (matrixValue < 70) {
            resultColor.r = 0;
            resultColor.g = 19;
            resultColor.b = 74;
        }
        else if (matrixValue < 100) {
            resultColor.r = 45;
            resultColor.g = 81;
            resultColor.b = 185;
        }
        else if (matrixValue < 110) {
            resultColor.r = 208;
            resultColor.g = 183;
            resultColor.b = 137;
        }
        else if (matrixValue < 195) {
            resultColor.r = 67;
            resultColor.g = 142;
            resultColor.b = 80;
        }
        else if (matrixValue < 240) {
            resultColor.r = 54;
            resultColor.g = 67;
            resultColor.b = 76;
        }
        else {
            resultColor.r = 225;
            resultColor.g = 228;
            resultColor.b = 230;
        }
    }
}
