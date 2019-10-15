int[] imgDim = {28, 28};
int imgPixels = imgDim[0] * imgDim[1];
//int[] displayGrid = {10, 10};
int headerBytes = 80;

int total = 2500; // Number of imgs to save
String dataLabel = "rainbow";

// imgDim * displayGrid
size(800, 800);

byte[] data = loadBytes(dataLabel + ".npy");
println(data.length);

byte[] outData = new byte[total * imgPixels];
int outindex = 0;

for (int n = 0; n < total; n++) {
  int start = headerBytes + n * imgPixels;

  //PImage img = createImage(imgDim[0], imgDim[1], RGB);
  //img.loadPixels();
  for (int i = 0; i < imgPixels; i++) {
    int index = i + start;
    byte val = data[index];
    outData[outindex] = val;
    outindex++;
    //img.pixels[i] = color(255 - val & 0xFF);
  }

  //img.updatePixels();
  //int x = imgDim[0] * (n % displayGrid[0]);
  //int y = imgDim[1] * (n / displayGrid[1]);
  //image(img, x, y);
}

saveBytes(dataLabel + "s" + total + ".bin", outData);
