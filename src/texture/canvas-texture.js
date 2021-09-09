const THREE = require('three');
const BaseTexture = require('./base-texture');

class CanvasTexture extends BaseTexture {
  constructor(size) {
    super();
    this.size = size;
    this.file = `${Math.random()}`;
    this.init();
  }

  init() {
    const canvas = document.createElement("CANVAS");
    const context = canvas.getContext("2d");
    const size = this.newSize(this.size);
    canvas.height = size.height;
    canvas.width = size.width;
    this.canvas = canvas;
    this.context = context;
    const texture = new THREE.Texture(this.canvas);

    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.anisotropy = 16;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      alphaTest: 0.5,
      // transparent: true,
      side : THREE.DoubleSide,
    });

    this._texture = texture;
    this._material = material;
    this._loaded = true;
    this._waiting.forEach(promise => promise());
    this._onLoad.forEach(promise => promise(this));
  }

  update() {
    this._texture.needsUpdate = true;
    this._onUpdated.forEach(promise => promise(this));
  }

  newSize(img) {
    const curHeight = img.height;
    const curWidth = img.width;
    this.orginalSize = {
      width: curWidth,
      height: curHeight,
    }
    let newHeight = 8;
    let newWidth = 8;
    while (newHeight < curHeight) {
      newHeight *= 2;
    }
    while (newWidth < curWidth) {
      newWidth *= 2;
    }
    this.size = {
      width: newWidth,
      height: newHeight,
    };
    return this.size;
  }

  url() {
    return this.canvas.toDataURL();
  }
}

module.exports = CanvasTexture;