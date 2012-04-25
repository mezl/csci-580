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
var totalTime = 0;
//@param {Boolean}
var USE_SHADOW = false;
var USE_REFLECTION = false;
var USE_REFRACTION = false;
var USE_SPECULAR = false;
var USE_POLYGON = false;
//#############################################################################
initMain();
  animate();
function toggleShadow(chkbox) { 
    USE_SHADOW = (chkbox.checked);
    cancelRequestAnimFrame(animateRequest);
		redraw();
}
function toggleReflection(chkbox) { 
    USE_REFLECTION = (chkbox.checked);
    cancelRequestAnimFrame(animateRequest);
		redraw();
}
function toggleRefraction(chkbox) { 
    USE_REFRACTION= (chkbox.checked);
    cancelRequestAnimFrame(animateRequest);
		redraw();
}
function toggleSpecular(chkbox) { 
    USE_SPECULAR= (chkbox.checked);
    cancelRequestAnimFrame(animateRequest);
		redraw();
}
function togglePolygon(chkbox) { 
    USE_POLYGON = (chkbox.checked);
    cancelRequestAnimFrame(animateRequest);
		redraw();
}
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
	Engine.SetTarget( 20, canvasWidth, canvasHeight);
	redraw();
}
function redraw()
{
	totalTime = 0;
	Engine.InitRender();
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
  var date = new Date();
	var ms = date.getTime();
  if(!Engine.Render(imageData))
  {
    date = new Date();
    var eachRenderTime = date.getTime() - ms;
    totalTime+=eachRenderTime;
    context.putImageData(imageData,0,0);
    // request new frame
    animateRequest = requestAnimFrame(function(){
        animate();
    });
  }else{
    console.log("Render Done. Total takes "+totalTime/1000.0+" sec");
    cancelRequestAnimFrame(animateRequest);
  }

}
