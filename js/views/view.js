class View {
    /**
     * Constructor
     * @param controller Main controller of the application
     */
    constructor(controller) {
        this._controller = controller;
        this._controller.addObserver(this);
        this._canvas = document.querySelector('canvas');
        this._scene = null;
        this._camera = null;
        this._renderer = null;
        this._objects = new Map();
        this.resize();
        this.initialize3D();
        this.createObjects();
        this.render();
    }
    /**
     * Notification function of the view
     */
    notify() {
    }
    /**
     * Resizes the canvas context when browser window is resized
     */
    resize() {
        this._canvas.width = $(this._canvas).width();
        this._canvas.height = $(this._canvas).height();
    }
    /**
     * Initializes the 3D Scene
     */
    initialize3D() {
        let width = this._canvas.width;
        let height = this._canvas.height;
        //Creates the scene where 3D Objects will be added
        this._scene = new THREE.Scene();
        //Creates the camera which will be the point of view to render the scene
        this._camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this._camera.position.z = 50;
        this._camera.position.y = 30;
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        //Creates the renderer which will render the scene from the camera point of view
        this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas, antialias: true });
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._renderer.shadowMap.needsUpdate = true;
        //Adds an ambient light to the scene. It lights all the vertex of the scene with the same intensity.
        let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
        this._scene.add(ambientLight);
        //Adds a directional light to the scene.
        let spotLight = new THREE.DirectionalLight(0xFFAA44, 1);
        spotLight.position.set(20, 20, 20);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.camera.left = -100;
        spotLight.shadow.camera.right = 100;
        spotLight.shadow.camera.top = 100;
        spotLight.shadow.camera.bottom = -100;
        //Attaches the light to a pivot to rotate the light arround the scene
        let lightPivot = new THREE.Object3D();
        lightPivot.add(spotLight);
        this._scene.add(lightPivot);
        this._objects.set('light', spotLight);
        this._objects.set('lightPivot', lightPivot);
        //Adds orbital controls to control the scene from the mouse and the keyboard
        let controls = new THREE.OrbitControls(this._camera, this._canvas);
        controls.minDistance = 5;
        controls.maxDistance = 100;
    }
    /**
     * Creates objects of the scene
     */
    createObjects() {
        //this.createCube();
        //this.createSphere();
        //this.createFloor();
        this.createLandscape();
        this.createWater();
    }
    /**
     * Creates a cube (crate)
     */
    createCube() {
        //Load the texture of the crate
        let loader = new THREE.TextureLoader();
        let crateTexture = loader.load('img/crate/crate.jpg');
        //Creates the cube geometry
        let geometry = new THREE.BoxGeometry(10, 10, 10);
        //Creates a non reflective material
        let material = new THREE.MeshLambertMaterial({ map: crateTexture });
        //Creates the cube from its geometry and its material
        let cube = new THREE.Mesh(geometry, material);
        cube.rotation.y = Math.PI / 4;
        cube.position.x = 10;
        cube.castShadow = true;
        this._scene.add(cube);
        this._objects.set('cube', cube);
        this._objects.get('light').target = cube;
    }
    /**
     * Creates the earth sphere
     */
    createSphere() {
        //Laods required textures
        let loader = new THREE.TextureLoader();
        let cubeLoader = new THREE.CubeTextureLoader();
        let earthTexture = loader.load('img/earth/earth.jpg');
        let cloudTexture = loader.load('img/earth/earth-cloud-map.jpg');
        let cloudAlphaTexture = loader.load('img/earth/earth-cloud-map-transparency.jpg');
        let envTexture = cubeLoader.load([
            'img/env/milky-way/dark-s_px.jpg',
            'img/env/milky-way/dark-s_nx.jpg',
            'img/env/milky-way/dark-s_py.jpg',
            'img/env/milky-way/dark-s_ny.jpg',
            'img/env/milky-way/dark-s_pz.jpg',
            'img/env/milky-way/dark-s_nz.jpg'
        ]);
        //Creates the earth object
        let geometry = new THREE.SphereGeometry(20, 32, 32);
        let material = new THREE.MeshPhongMaterial({ map: earthTexture, shininess: 100, envMap: envTexture, reflectivity: 0.5 });
        let sphere = new THREE.Mesh(geometry, material);
        this._scene.add(sphere);
        this._objects.set('sphere', sphere);
        //Creates clouds 
        let geometryAtmo = new THREE.SphereGeometry(20.5, 32, 32);
        let materialAtmo = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: cloudTexture, transparent: true, alphaMap: cloudAlphaTexture });
        let atmo = new THREE.Mesh(geometryAtmo, materialAtmo);
        this._scene.add(atmo);
        this._objects.set('atmo', atmo);
        //Adds a skybox to the scene
        this._scene.background = envTexture;
    }
    /**
     * Creates the floor of the scene
     */
    createFloor() {
        //Load required textures
        let loader = new THREE.TextureLoader();
        let floorTexture = loader.load('img/floor/floor.png');
        let floorBumpTexture = loader.load('img/floor/floor-normal.png');
        //Creates the floor plane
        let geometry = new THREE.BoxGeometry(60, 0.1, 30);
        let material = new THREE.MeshPhongMaterial({ map: floorTexture, bumpMap: floorBumpTexture, bumpScale: 0.2 });
        let floor = new THREE.Mesh(geometry, material);
        floor.receiveShadow = true;
        floor.position.y = -5;
        this._scene.add(floor);
    }
    /**
     * Creates a landscapte from DiamoudSquare texture
     */
    createLandscape() {
        let diamound = new DiamantCarre(9);
        diamound.computeMatrix();
        let texture = new THREE.Texture(diamound.renderCanvas(DiamantCarre.landscapeColoration));
        texture.needsUpdate = true;
        let matrixSize = diamound.getMatrixSize();
        //Creates a plan geometry
        let geometry = new THREE.PlaneBufferGeometry(100, 100, matrixSize - 1, matrixSize - 1);
        //gets the array of vertices of the plan (points of the grid)
        let vertices = geometry.attributes.position.array;
        //Updates z value of each vertice
        for (let y = 0; y < matrixSize; ++y) {
            for (let x = 0; x < matrixSize; ++x) {
                vertices[(y * matrixSize + x) * 3 + 2] = diamound.getValue(y, x) / 10;
            }
        }
        //Refresh Normals to reflect lights
        geometry.computeVertexNormals();
        let material = new THREE.MeshPhongMaterial({ map: texture });
        let plan = new THREE.Mesh(geometry, material);
        plan.rotation.x = -Math.PI / 2;
        plan.castShadow = true;
        plan.receiveShadow = true;
        this._scene.add(plan);
        this._objects.get('light').target = plan;
    }
    /**
     * Creates water plane
     */
    createWater() {
        //Loads required textures
        let loader = new THREE.TextureLoader();
        let waterTexture = loader.load('img/water/1.jpg');
        waterTexture.repeat = new THREE.Vector2(4, 8);
        waterTexture.wrapS = THREE.RepeatWrapping;
        waterTexture.wrapT = THREE.RepeatWrapping;
        //Creates plane 
        let geometry = new THREE.PlaneBufferGeometry(100, 100, 10, 10);
        let material = new THREE.MeshPhongMaterial({ map: waterTexture, opacity: 0.5, transparent: true, shininess: 100 });
        let water = new THREE.Mesh(geometry, material);
        water.rotation.x = -Math.PI / 2;
        water.position.y = 10;
        this._scene.add(water);
    }
    /**
     * Renders the scene
     */
    render() {
        this._renderer.render(this._scene, this._camera);
        this._objects.get('lightPivot').rotation.y += 0.01;
        /*this._objects.get('sphere').rotation.y += 0.002;
        this._objects.get('atmo').rotation.y += 0.0025;*/
        //Render the scene again when the browser request a new frame
        window.requestAnimationFrame(() => { this.render(); });
    }
}
