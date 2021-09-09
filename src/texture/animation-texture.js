
class AnimationTexture {
  constructor(list) {
    this.list = list;
    this.MAX_TIME = this.getMaxTime();

    this.animation = true;
    this.lastCount = 0;
  }

  get texture() {
    return this.getTexture().texture;
  }

  needsUpdate() {
    // TODO redo
    return true;
    const currentAnimation = 0;
    for (let i=0;i<this.list.length;i++) {
      const actionTime = this.list[i].time || 0;
      currentAnimation = i;
      if (time < actionTime)
        break
    }
    return currentAnimation !== this.lastCount;
  }

  getMaxTime() {
    let count = 0;
    for (let i=0;i<this.list.length;i++) {
      count += this.list[i].time || 0;
    }
    return count;
  }

  getTexture() {
    let time = Date.now() % this.MAX_TIME;
    for (let i=0;i<this.list.length;i++) {
      const actionTime = this.list[i].time || 0;
      if (time < actionTime) {
        this.lastCount = i;
        return this.list[i].texture;
      }
      time -= actionTime;
    }
  }

  updateBuffer(buffer, pos, index) {
    this.getTexture().updateBuffer(buffer, pos, index);
  }
}

module.exports = AnimationTexture;