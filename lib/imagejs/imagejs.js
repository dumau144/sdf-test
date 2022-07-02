export class ImageJS {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.imageData = new ImageData(width, height);
    this.arrayLength = this.imageData.data.length;
    this.channels = 4;
  };

  fragColor(indexPixel) {
    return (r, g, b, a) => {
      this.imageData.data[indexPixel + 0] = 255 * r;
      this.imageData.data[indexPixel + 1] = 255 * g;
      this.imageData.data[indexPixel + 2] = 255 * b;
      this.imageData.data[indexPixel + 3] = 255 * a;
    };
  };

  draw(mainImage) {
    for(let i = 0; i < this.arrayLength; i += this.channels) {
      const indexPixel = i / this.channels;

      const fragCoord = {
        x: indexPixel % this.width,
        y: Math.floor(indexPixel / this.width),
      };

      mainImage(this.fragColor(i), fragCoord);
    };
  };

  putImage(context) {
    context.putImageData(this.imageData, 0, 0);
  };
};
