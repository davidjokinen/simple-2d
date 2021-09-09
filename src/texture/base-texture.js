const TextureMap = require("../texture-map");

const defaultUV = TextureMap.UVScaler(1);

class BaseTexture {
  constructor() {
    this._loaded = false;
    this._texture = null;
    this._material = null;
    this._waiting = [];
    this._onLoad = [];
    this._onUpdated = [];
    this.uvSetter = defaultUV;
  }

  updateBuffer(buffer, pos, index) {
    if (index)
      this.index = index;
    pos = pos || 0;
    this.uvSetter(buffer.array, this.index, pos);
  }

  copyBuffer(buffer, pos) {
    buffer.copyAt(pos, this.uvBufferAtt, 0);
  }

  onLoad(promise) {
    if (this._loaded) {
      promise(this);
      return;
    }
    this._onLoad.push(promise);
  }

  onUpdate(promise) {
    // if (this._loaded) {
    //   promise(this);
    //   // return;
    // }
    this._onUpdated.push(promise);
  }

  updated() {
    this._onUpdated.forEach(promise => promise(this));
  }

  async _getMaterial() {
    return new Promise(resolve => {
      if (this._loaded)
        resolve(this._material);
      this._waiting.push(() => {
        resolve(this._material);
      })
    });
  }

  async getMaterial() {
    return await this._getMaterial();
  }
}

module.exports = BaseTexture;