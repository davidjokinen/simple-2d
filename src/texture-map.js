const SubTexture = require("./sub-texture");

// TODO: cleanup the static functions
class TextureMap {
  constructor(texture, splitter) {
    this.texture = texture;
    this.splitter = splitter;
  }

  getTexture(index) {
    return new SubTexture(
      this.texture,
      this.splitter,
      index,
    );
  }

  static UVScaler(countX, countY, subX, size) {
    countY = countY || countX;
    subX = subX || 0;
    size = size || 256;

    const buffer = subX/size;
    const fullSize = 1-buffer;
    const scaleX = fullSize/countX;
    const scaleY = countY ? fullSize/countY : scaleX;
    return function(uvs, _i, start) {
      const _x = ~~(_i%countX);
      const _y = ~~(_i/countX);
      
      const PAD = scaleX/(size/countX);
      
      const HALF_PAD = PAD/2;
  
      const SIZE_X = scaleX - HALF_PAD;
      const SIZE_Y = scaleY - HALF_PAD;
  
      let x = _x * SIZE_X + 0 + HALF_PAD;
      let y = -_y * SIZE_Y + 1 - SIZE_Y + HALF_PAD;
      
      const min = 0 ;
      const max_x = min + SIZE_X;
      const max_y = min + SIZE_Y;
  
      const index = ~~(start*12) || 0;
      
      uvs[0+index] = min + x;
      uvs[1+index] = min + y;
      uvs[2+index] = max_x + x;
      uvs[3+index] = min + y;
      uvs[4+index] = max_x + x;
      uvs[5+index] = max_y + y;

      uvs[6+index] = max_x + x;
      uvs[7+index] = max_y + y;
      uvs[8+index] = min + x;
      uvs[9+index] = max_y + y;
      uvs[10+index] = min + x;
      uvs[11+index] = min + y;
    }
  }

  static OrginalUVScaler(image, countX, countY, padding) {
    countY = countY || countX;
    padding = padding || 0;
    let subX = 0;
    let subY = 0;
    let width = 1;
    let height = 1;
    let bufferX = subX/width;
    let bufferY = subX/width;
    let fullSizeX = 1-bufferX;
    let fullSizeY = 1-bufferX;
    let paddingX = 0;
    let paddingY = 0;
    let paddingAddX = 0;
    let paddingAddY = 0;
    let scaleX = 1;
    let scaleY = 1; //countY ? fullSizeX/countY : scaleX;
    image.onLoad(image => {
      subX = image.size.width - image.orginalSize.width ;
      subY = image.size.height - image.orginalSize.height ;
      
      width = image.size.width;
      height = image.size.height;
      bufferX = subX/width;
      bufferY = subY/height;
      // bufferX = subX/(width-(padding*countX));
      // bufferY = subY/(height-(padding*countX));
      fullSizeX = 1-bufferX;
      fullSizeY = 1-bufferY;
      paddingX = (padding)/image.orginalSize.width * fullSizeX;
      paddingY = (padding)/image.orginalSize.height;
      scaleX = (fullSizeX/countX)-(paddingX*(fullSizeX));
      scaleY = countY ? fullSizeY/countY*(1-paddingY*countY): scaleX;
      paddingAddX = (paddingX/(fullSizeX))
      paddingAddY = (paddingY)
    });
    return function(uvs, _i, start) {
      const _x = ~~(_i%countX);
      const _y = ~~(_i/countX);
      const PAD_X = 0;
      const HALF_PAD_X = PAD_X/2;
      const PAD_Y = 0;
      const HALF_PAD_Y = PAD_Y/2;
  
      const SIZE_X = scaleX ;
      const SIZE_Y = scaleY ;

      let ADD_PADDING_BACK_X = 0;//paddingX*(_x/countX);
      let ADD_PADDING_BACK_Y = paddingY*(_y/countY);
      // UV are % not pixel numbers
      // const UNIT_OF_PADDING_X = padding*_x;
      // const UNIT_OF_PADDING_Y = padding*_y;
      // if (padding != 0 && countX != 0) {
      //   ADD_PADDING_BACK_X = ;
      // }
      // if (padding != 0 && countY != 0) {
      //   ADD_PADDING_BACK_Y = (_y*padding)/height;
      // }
  
      let x = _x * SIZE_X + 0 + _x * paddingAddX;
      let y = -_y * SIZE_Y + 1 - SIZE_Y + ADD_PADDING_BACK_Y;
      
      const min_x = 0 + HALF_PAD_X + paddingAddX;
      const min_y = 0 + HALF_PAD_Y;
      const max_x = min_x + SIZE_X - PAD_X;
      const max_y = min_y + SIZE_Y - PAD_Y;
  
      const index = ~~(start*12) || 0;
      
      uvs[0+index] = min_x + x;
      uvs[1+index] = min_y + y;
      uvs[2+index] = max_x + x;
      uvs[3+index] = min_y + y;
      uvs[4+index] = max_x + x;
      uvs[5+index] = max_y + y;

      uvs[6+index] = max_x + x;
      uvs[7+index] = max_y + y;
      uvs[8+index] = min_x + x;
      uvs[9+index] = max_y + y;
      uvs[10+index] = min_x + x;
      uvs[11+index] = min_y + y;
    }
  }

  static OrginalUVScalerPadding(image, spriteWidth, spriteHeight, padding) {
    padding = padding || 0;
    let countX = 0;
    let countY = 0;
    let subX = 0;
    let subY = 0;
    let width = 1;
    let height = 1;
    let bufferX = subX/width;
    let bufferY = subX/width;
    let fullSizeX = 1-bufferX;
    let fullSizeY = 1-bufferX;
    let paddingX = 0;
    let paddingY = 0;
    let scaleX = 1;//fullSizeX/countX;
    let scaleY = 1;//countY ? fullSizeX/countY : scaleX;
    image.onLoad(image => {
      countX = (image.orginalSize.width+1) / (spriteWidth+padding);
      countY = (image.orginalSize.height+1) / (spriteHeight+padding);
      subX = image.size.width - image.orginalSize.width;
      subY = image.size.height - image.orginalSize.height;
      width = image.size.width;
      height = image.size.height;
      bufferX = subX/width;
      bufferY = subY/height;
      fullSizeX = 1-bufferX;
      fullSizeY = 1-bufferY;
      scaleX = spriteWidth/image.orginalSize.width*fullSizeX;
      scaleY = spriteHeight/image.orginalSize.height*fullSizeY;
      paddingX = (padding/spriteWidth)*scaleX;
      paddingY = (padding/spriteHeight)*scaleY;
    });
    return function(uvs, _i, start) {
      const _x = ~~(_i%countX);
      const _y = ~~(_i/countX);
      const PAD_X = paddingX/4;
      const HALF_PAD_X = PAD_X/2;
      const PAD_Y = paddingY/4;
      const HALF_PAD_Y = PAD_Y/2;
  
      const SIZE_X = scaleX ;
      const SIZE_Y = scaleY ;

      let ADD_PADDING_BACK_X =  _x * paddingX;
      let ADD_PADDING_BACK_Y =  _y * paddingY;
  
      let x = _x * SIZE_X + 0 + ADD_PADDING_BACK_X;
      let y = -_y * SIZE_Y + 1 - SIZE_Y - ADD_PADDING_BACK_Y;
      
      const min_x = 0 + HALF_PAD_X ;
      const min_y = 0 + HALF_PAD_Y;
      const max_x = min_x + SIZE_X - PAD_X;
      const max_y = min_y + SIZE_Y - PAD_Y;
  
      const index = ~~(start*12) || 0;
      
      uvs[0+index] = min_x + x;
      uvs[1+index] = min_y + y;
      uvs[2+index] = max_x + x;
      uvs[3+index] = min_y + y;
      uvs[4+index] = max_x + x;
      uvs[5+index] = max_y + y;

      uvs[6+index] = max_x + x;
      uvs[7+index] = max_y + y;
      uvs[8+index] = min_x + x;
      uvs[9+index] = max_y + y;
      uvs[10+index] = min_x + x;
      uvs[11+index] = min_y + y;
    }
  }
}

module.exports = TextureMap;