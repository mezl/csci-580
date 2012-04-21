/**
 *  HTML5 Canvas Example
 *
 *  @author Chin-Kai Chang(chinkaic@usc.edu) 2012/01/27
 */
var canvasWidth = 255;
var canvasHeight = 255;
var imageData;
var Engine;
var context;
var line = 0;
var animateRequest;
//#############################################################################
initMain();
main()
function initMain()
{
	// Load the context of the canvas
  console.log("Init Main");
	var canvas = document.getElementById('simpleCanvas');
	canvasWidth = canvas.width;
  canvasHeight= canvas.height;
	context = canvas.getContext("2d");
	imageData = context.createImageData(canvas.width,canvas.height);
	Engine = new Engine();
	Engine.SetTarget( 20, canvas.width, canvas.height);
	Engine.InitRender( );

}

function main()
{

  //Draw a Gray background
  for(var i=0;i<canvasWidth;i++)
  {
    for(var j=0;j<canvasHeight;j++)
    {
      setPixel(imageData,i,j,GRAY);
    }
  }
    animate();
}
function animate(){
  if(!Engine.Render(imageData))
  {
    context.putImageData(imageData,0,0);
    // request new frame
    animateRequest = requestAnimFrame(function(){
        animate();
    });
  }else{
    console.log("Render Done");
    cancelRequestAnimFrame(animateRequest);
  }

}
