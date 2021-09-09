class SubTexture {
  constructor(texture, uvSetter, index ) {
    this.texture = texture;
    this.uvSetter = uvSetter;
    this.index = index;
    this.uvBufferAtt = null;
    this._onUpdate = [];
    texture.onLoad(() => {
      this._updated();
    });
    texture.onUpdate(() => {
      this._updated();
    });
  }

  _updated() {
    this._onUpdate.forEach(promise => promise());
  }

  onUpdate(promise) {
    this._onUpdate.push(promise);
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
}

module.exports = SubTexture;