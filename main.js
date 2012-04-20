/**
 *  HTML5 Canvas Example
 *
 *  @author Chin-Kai Chang(chinkaic@usc.edu) 2012/01/27
 */
var canvasWidth = 255;
var canvasHeight = 255;
//#############################################################################
main();
function main()
{
	// Load the context of the canvas
	var canvas = document.getElementById('simpleCanvas');
	var context = canvas.getContext("2d");

	var imageData = context.createImageData(canvas.width,canvas.height);


	//Just draw line for test now
	for(var i=0;i<256;i++)
					setPixel(imageData,i,i,WHITE);

	context.putImageData(imageData,0,0);
}

//#############################################################################
// @param {image} imageData
// @param {int} x,y
// @return {Color} col
function setPixel(imageData, x, y, col) {
	index = (x + y * imageData.width) * 4;
	imageData.data[index+0] = col.r;
	imageData.data[index+1] = col.g;
	imageData.data[index+2] = col.b;
	imageData.data[index+3] = col.a;	
}

