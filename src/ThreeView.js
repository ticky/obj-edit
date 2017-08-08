import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Detector from 'three/examples/js/Detector.js';

// These add-ons need a global THREE defined to load
// I guess that's useful for debugging anyway, lol
const THREE = window.THREE = require('three');
require('three/examples/js/controls/OrbitControls.js');
require('three/examples/js/loaders/MTLLoader.js');
require('three/examples/js/loaders/OBJLoader.js');

export default class ThreeView extends PureComponent {
  static propTypes = {
    objData: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired
  };

  static defaultProps = {
    onSuccess() {},
    onError() {}
  }

  componentDidMount() {
    const container = this._container;

    if (!Detector.webgl) {
      Detector.addGetWebGLMessage({ parent: this._container });
      return;
    }

    window.addEventListener('resize', this.handleResize);

    // Make us a scene
    this._scene = new THREE.Scene();
    this._ambient = new THREE.AmbientLight(0xffffff, 1.0);
    this._scene.add(this._ambient);

    // Make us a camera
    this._camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    this._camera.position.z = 10;

    // Set up our renderer
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(container.clientWidth, container.clientHeight);
    this._renderer.setClearColor(0x333333);

    // Set up controls
    this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;
    this._controls.dampingFactor = 0.25;
    this._controls.enableZoom = true;

    // Load a texture
    this._texture = new THREE.Texture();
    this._imageLoader = new THREE.ImageLoader();
    this._imageLoader.load(require('./examples/default.png'), (image) => {
      this._texture.image = image;
      this._texture.needsUpdate = true;
    });

    // Load our OBJ file
    this._objLoader = new THREE.OBJLoader();
    this.updateObject(this.props.objData);

    container.appendChild(this._renderer.domElement);

    requestAnimationFrame(this.renderWebGL);
  }

  updateObject(objData) {
    let parsedObject;

    console.debug('parsing supplied object...');

    try {
      parsedObject = this._objLoader.parse(objData);
      console.debug('object parsed...');
    } catch (error) {
      console.error('failed to parse object', error);
      this.props.onError(error);
      return;
    }

    console.debug('updating camera...');
    // Check the object is valid
    const objectBounds = new THREE.Box3();
    objectBounds.setFromObject(parsedObject);
    const objectSphere = objectBounds.getBoundingSphere();
    const newObjectRadius = objectSphere.radius;

    if (isNaN(newObjectRadius)) {
      console.error('object is invalid');
      this.props.onError('Object\'s geometry is invalid.');
      return;
    }

    // Apply our texture to the object
    if (this._texture) {
      parsedObject.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.map = this._texture;
        }
      });
    }

    // Center the camera on the object, as long as the object works
    objectBounds.getCenter(this._controls.target);

    let lastObjectRadius;

    if (this._displayedObject) {
      console.debug('removing existing object...');
      const lastObjectBox = new THREE.Box3();
      // We need to pull this from the *first* child
      lastObjectBox.setFromObject(this._displayedObject.children.shift());
      lastObjectRadius = lastObjectBox.getBoundingSphere().radius;

      this._scene.remove(this._displayedObject);
    }

    if (lastObjectRadius !== undefined) {
      console.debug(`offsetting camera by ${newObjectRadius / lastObjectRadius}×...`);
      this._camera.position.multiplyScalar(newObjectRadius / lastObjectRadius);
    }

    this._displayedObject = this.createGroupFor(parsedObject);

    // TODO: Make this work properly
    // this._displayedObject.rotateX(Math.PI);

    console.debug('adding object to scene...');
    this._scene.add(this._displayedObject);

    this.props.onSuccess();
    console.debug('done.');
  }

  componentWillUpdate(nextProps) {
    this.updateObject(nextProps.objData);
  }

  createGroupFor(object) {
    const group = new THREE.Group();
    group.add(object);

    const box = new THREE.BoxHelper(object, 0xffff00);
    group.add(box);

    const axisHelper = new THREE.AxisHelper(500);
    group.add(axisHelper);

    return group;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this._controls.dispose();
  }

  handleResize = () => {
    console.debug('resized');
    const container = this._container;

    this._camera.aspect = container.clientWidth / container.clientHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(container.clientWidth, container.clientHeight);
  };

  renderWebGL = () => {
    requestAnimationFrame(this.renderWebGL);
    this._controls.update();
    this._renderer.render(this._scene, this._camera);
  };

  render() {
    return <div ref={(div) => this._container = div} />;
  }
}
