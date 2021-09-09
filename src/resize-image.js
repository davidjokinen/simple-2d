

class ResizeImage {
  constructor(file, done) {
    this.file = file;
    this.done = done;
    this.init();
  }

  init() {
    var canvas = document.createElement("CANVAS");
    var context = canvas.getContext("2d"); 
    var myImg = new Image();
    myImg.onload = () => {
      const size = this.newSize(myImg);
      canvas.height = size.height;
      canvas.width = size.width;
      context.drawImage(myImg, 0, 0);
      if (this.done) 
        this.done(this);
    };
    myImg.src = this.file;
    this.canvas = canvas;
  }

  newSize(img) {
    const curHeight = img.height;
    const curWidth = img.width;
    this.orginalSize = {
      width: curWidth,
      height: curHeight,
    }
    let newHeight = 512;
    let newWidth = 512;
    while (newHeight < curHeight) {
      newHeight *= 2;
    }
    while (newWidth < curWidth) {
      newWidth *= 2;
    }
    if (newHeight > newWidth)
      newWidth = newHeight;
    if (newWidth > newHeight)
      newHeight = newWidth;
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

module.exports = ResizeImage;