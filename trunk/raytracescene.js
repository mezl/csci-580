// -----------------------------------------------------------
// raytracer.js
// 2012 Spring CS580 Final Project 4/18/2012
// Author: Yun-Yu Chen,Sophia Chang,Vince Liao,Chin-Kai Chang
// -----------------------------------------------------------
testCommon();
//
//#############################################################################
//code testing
function testCommon()
{
	console.log("Test raytracer.js");
	//var A = new vector3(1,1,1);
	var m_Origin = new vector3();
	var m_Direction = new vector3();
	var a_Origin = new vector3( 3, 3, 3);
	var a_Dir = new vector3( 4, 4, 4);
	console.log("Test Ray a_Origin: " + a_Origin.toString());
	console.log("Test Ray a_Dir: " + a_Dir.toString());
	var A = new Ray( a_Origin, a_Dir);
	console.log("Test Ray A: " + A.m_Origin.toString());
	console.log("Test Ray A: " + A.m_Direction.toString());
	var B = new Ray();//test default constructor
	console.log("Test Ray B: " + B.m_Origin.toString());
	console.log("Test Ray B: " + B.m_Direction.toString());
	B.SetOrigin(a_Origin);
	console.log("Test Ray B.SetOrigin: " + B.m_Origin.toString());
	B.SetDirection(a_Dir);
	console.log("Test Ray B.SetDirection: " + B.m_Direction.toString());
	B.GetOrigin();
	console.log("Test Ray B.GetOrigin: " + B.m_Origin.toString());
	B.GetDirection();
	console.log("Test Ray B.GetDirection: " + B.m_Direction.toString());
	/////////////////////////////////////////
	var C = new Engine();
	//console.log("Test Engine C: " + C.m_Scene.toString());	
	///////////////////////////////////////
	C.SetTarget( 20, 200, 500);
	console.log("Test Engine C.SetTarget: " + C.m_Dest);
	console.log("Test Engine C.SetTarget: " + C.m_Width);
	console.log("Test Engine C.SetTarget: " + C.m_Height);
	
	var o = new vector3(0, 0, -5);
	var dir = new vector3(10, 20, 0);
	var acc = new Color(0, 0, 0);
	var a_Ray = ( o, dir);
	C.Raytrace( a_Ray, acc, 10, 1.0, 2.0);
	console.log("Test Engine C.Raytrace: ");
	var D = C.GetScene();
	console.log("Test Engine C.GetScene = D: ");
	C.InitRender( );
	console.log("Test Engine C.InitRender: ");
	C.Render();
	console.log("Test Engine C.Render: ");//*/
}
//#############################################################################
// class Material
function Material()
{
	// default constructor
	this.m_color = new Color(0.2, 0.2, 0.2); //?
	this.m_Refl = 0;
	this.m_Diff = 0.2;
	
	// @param {Color} a_color
	this.SetColor = function(a_color) { this.m_color = a_color; }
	
	// @return {Color} color of this material
	this.GetColor = function() { return this.m_color; }
	
	// @param {float} a_Diff
	this.SetDiffuse = function(a_Diff) { this.m_Diff = a_Diff; }
	
	// @param {float} a_Refl
	this.SetReflection = function(a_Refl) { this.m_Refl = a_Refl; }

	// @return {float} specular of this material
	this.GetSpecular = function() { return 1.0 - this.m_Diff; }
	
	// @return {float} diffuse of this material
	this.GetDiffuse = function() { return this.m_Diff; }
	
	// @return {float} reflection of this material
	this.GetReflection = function () { return this.m_Refl; }
	
	// @return {String}
	this.toString = function() { 
		return "[ Material Color: " + this.m_color.toString +" Refl: " + this.m_Refl 
		+ " Diff: " + this.m_Diff + " Spec: " + this.GetSpecular() + " ]"; 
	}
}

//#############################################################################
/*
var SPHERE = 1;
var PLANE = 2;
*/
//class Primitive
function Primitive()
{
	// default constructor
	this.m_Name = 0;
	this.m_Light = new Boolean(false);
	this.m_Material = new Material();

	// @return {Material} material of this primitive
	this.GetMaterial = function() { return this.m_Material; }

	// @param {Material} a_Mat
	this.SetMaterial = function(a_Mat) { this.m_Material = a_Mat; }

	// @return {int} type of this primitive
	this.GetType  = function() { return 0; }
	
	// @param {Ray} a_Ray
	// @param {float} a_Dist
	// @return {int} intersection type
	this.Intersect = function(a_Ray, a_Dist) { return 0; }

	// @param {vector3} a_Pos
	// @return {vector3} normal of the primitive
	this.GetNormal = function(a_Pos) { return 0; }
	
	// @return {Color} color of this material
	this.GetColor = function() { return this.m_Material.GetColor(); }

	// @param {Boolean} a_Light
	this.Light = function(a_Light) { this.m_Light = a_Light; }
	
	// @return {Boolean} is this primitive a light
	this.IsLight = function() { return this.m_Light.valueOf(); }
	
	// @param {String} a_Name
	this.SetName = function(a_Name) { this.m_Name = a_Name; }
	
	// @return {String} name of this primitive
	this.GetName = function() { return this.m_Name; }
	
	// @return {String}
	this.toString = function(){
		return "[ Primitive Name: " + this.m_Name + " Material: " + this.m_Material.toString()
		+ " Type: " + this.GetType() + " Normal: " + this.GetNormal(new vector3(0, 0, 0)).toString() 
		+ " Light: " + this.IsLight().toString() + " ]";
	}
	this.primToString = function() { 
		return "[ Primitive Name: " + this.m_Name + " Material: " + this.m_Material.toString()
		+ " Type: " + this.GetType() + " Normal: " + this.GetNormal(new vector3(0, 0, 0)).toString() 
		+ " Light: " + this.IsLight().toString() + " ]";
	}

}

//#############################################################################
// class Sphere
// @param {vector3} a_Centre
// @param {float} a_Radius

function Sphere(a_Centre, a_Radius)
{
	// Intersection method return values
	var HIT = 1;		// Ray hit primitive
	var MISS = 0;		// Ray missed primitive
	var INPRIM = -1;	// Ray started inside primitive
	
	var SPHERE = 1;
	// @return {int} type of this primitive
	this.GetType = function() { return SPHERE; }
	
	if(typeof(a_Centre) == "undefined")
	{
		// default constructor
		this.m_Centre = new vector3(0, 0, 0);
		this.m_SqRadius = 1.0 * 1.0;
		this.m_Radius = 1.0;
		this.m_RRadius = 1.0 / 1.0;
	}else
	{
		// constructor
		this.m_Centre = a_Centre;
		this.m_SqRadius = a_Radius * a_Radius;
		this.m_Radius = a_Radius;
		this.m_RRadius = 1.0 / a_Radius;
	}

	// @return {vertor3} centre of this sphere
	this.GetCertre = function() { return this.m_Centre; }
	
	// @return {float} radius of this sphere
	this.GetSqRadius = function() { return this.m_SqRadius; }
	
	// @param {Ray} a_Ray
	// @param {float} a_Dist
	// @return {int} intersection type
	this.Intersect = function(a_Ray, a_Dist) {
		//console.log(a_Ray.GetOrigin() + " " + this.m_Centre);
		var v = a_Ray.GetOrigin().Sub(this.m_Centre);
		//console.log("Intersect: v = " + v);
		var b = - DOT(v, a_Ray.GetDirection());
		//console.log("Intersect: b = " + b);
		var det = (b * b) - DOT(v, v) + this.m_SqRadius;
		//console.log("Intesect: det = " + det);
		var retval = MISS;
		if(det > 0)
		{
			det = Math.sqrt(det);
			var i1 = b - det;
			var i2 = b + det;
			if( i2 > 0 )
			{
				if( i1 < 0 )
				{
					if( i2 < a_Dist )
					{
						a_Dist = i2;
						retval = INPRIM;
					}
				}
				else
				{
					if( i1 < a_Dist )
					{
						a_Dist = i1;
						retval = HIT;
					}
				}
			}
		}
		return retval;
	}
	
	// @param {vector3} a_Pos
	// @return {vector3} normal
	this.GetNormal = function(a_Pos) {return (a_Pos.Sub(this.m_Centre)).Mul(this.m_RRadius); }
	
	this.toString = function() {
		return "[ Sphere Primitive: " + this.primToString() + " Centre: " + this.m_Centre.toString() + " SqRadius: " + this.m_SqRadius
		+ " Radius: " + this.m_Radius + " RRadius: " + this.m_RRadius + " ]";
	}
}

//#############################################################################
// class PlanePrim
// @param {vector3} a_Normal
// @param {float} a_D
function PlanePrim(a_Normal, a_D)
{
	// Intersection method return values
	var HIT = 1;		// Ray hit primitive
	var MISS = 0;		// Ray missed primitive
	var INPRIM = -1;	// Ray started inside primitive
	
	var PLANE = 2;
	// @return {int} type of this primitive
	this.GetType = function() { return PLANE; }
	
	if(typeof(a_Normal) == "undefined")
	{
		// default constructor
		this.m_Plane = new plane(new vector3(0, 1, 0), 1.0);
	}else
	{
		//constructor
		this.m_Plane = new plane(a_Normal, a_D);
	}
	// @return {vector3} normal of this planeprim
	this.GetNormal = function() { return this.m_Plane.N; }
	
	// @return {float} d of this planeprim
	this.GetD = function() { return this.m_Plane.D; }
	
	// @param {Ray} a_Ray
	// @param {float} a_Dist
	// @return {int} intersection type
	this.Intersect = function(a_Ray, a_Dist) {
		var d = DOT(this.m_Plane.N, a_Ray.GetDirection());
		if(d != 0)
		{
			var dist = - (DOT(this.m_Plane.N, a_Ray.GetOrigin()) + this.m_Plane.D) / d;
			if( dist > 0 )
			{
				if( dist < a_Dist)
				{
					a_Dist = dist;
					return HIT;
				}
			}
		}
		return MISS;
	}
	
	// @param {vector3} a_Pos
	// @return {vector3} normal
	this.GetNormal = function(a_Pos) { return this.m_Plane.N; }
	
	this.toString = function() {
		return "[ PlanePrim Primitive: " + this.primToString() + " Normal: " 
		+ this.GetNormal().toString() + " D: " + this.GetD() + " ]";
	}
}

//#############################################################################
//class Scene
function Scene()
{
	// default constructor
	this.m_Primitives = 0;
	this.m_Primtive = 0;
	
	// init scene
	this.InitScene = function() {
		this.m_Primitive = new Array(100);
		// ground plane
		this.m_Primitive[0] = new PlanePrim(new vector3(0, 1, 0), 4.4);
		this.m_Primitive[0].SetName("plane");
		this.m_Primitive[0].GetMaterial().SetReflection(0);
		this.m_Primitive[0].GetMaterial().SetDiffuse(1);
		this.m_Primitive[0].GetMaterial().SetColor(new Color(0.4, 0.3, 0.3));
		// big sphere
		this.m_Primitive[1] = new Sphere(new vector3(1, -0.8, 3), 2.5);
		this.m_Primitive[1].SetName("big sphere");
		this.m_Primitive[1].GetMaterial().SetReflection(0.6);
		this.m_Primitive[1].GetMaterial().SetColor(new Color(0.7, 0.7, 0.7));
		// small sphere
		this.m_Primitive[2] = new Sphere(new vector3(-5.5, -0.5, 7), 2);
		this.m_Primitive[2].SetName("small sphere");
		this.m_Primitive[2].GetMaterial().SetReflection(1.0);
		this.m_Primitive[2].GetMaterial().SetDiffuse(0.1);
		this.m_Primitive[2].GetMaterial().SetColor(new Color(0.7, 0.7, 1.0));
		// light source 1
		this.m_Primitive[3] = new Sphere(new vector3(0, 5, 5), 0.1);
		this.m_Primitive[3].Light(new Boolean(true));
		this.m_Primitive[3].GetMaterial().SetColor(new Color(0.6, 0.6, 0.6));
		// light source 2
		this.m_Primitive[4] = new Sphere(new vector3(2, 5, 1), 0.1);
		this.m_Primitive[4].Light(new Boolean(true));
		this.m_Primitive[4].GetMaterial().SetColor(new Color(0.7, 0.7, 0.9));
		
		this.m_Primitives = 5;
	}
	
	// @return {float} number of primitives in this scene
	this.GetNrPrimitives = function() { return this.m_Primitives; }
	
	// @return {Array} array containing all the primitives in this scene
	this.GetPrimitive = function(a_Idx) { return this.m_Primitive[a_Idx]; }
	
	this.toString = function(){
		var result = "Number of primitives: " + this.GetNrPrimitives() + " Primitives: ";
		for(i = 0; i < this.GetNrPrimitives(); i= i + 1)
		{
			result += this.GetPrimitive(i).toString() + " ";
		}
		return result;
	}
}
//#############################################################################
// @param {vector3} m_Origin m_Direction
// class Ray
function Ray(m_Origin, m_Direction)
{
	//default constructor
	if(typeof(m_Origin) == "undefined") {	
											this.m_Origin = new vector3( 0, 0, 0 );
											this.m_Direction = new vector3( 0, 0, 0 );
										}										
	//constructor
	else	{ 
				this.m_Origin = m_Origin; 
				this.m_Direction = m_Direction;
			}

	
	//@param {vector3} a_Origin
	this.SetOrigin = function( a_Origin) { this.m_Origin = a_Origin;}

	//@param {vector3} a_Origin
	this.SetDirection = function( a_Direction) { this.m_Direction = a_Direction;}

	this.GetOrigin = function() { return this.m_Origin;}

	this.GetDirection = function() { return this.m_Direction;}

	//@param {vector3}
	var m_Origin = new vector3();
	//@param {vector3}
	var m_Direction = new vector3();
}

// class Engine
function Engine()
{
	//default constructor
	this.m_Scene = new Scene();

	//@param {Pixel} a_Dest
	//@param {int} a_Width a_Height
	this.SetTarget = function( a_Dest, a_Width, a_Height) 	{	
																this.m_Dest = a_Dest; 
																this.m_Width = a_Width; 
																this.m_Height = a_Height;
															}
	// @return {Scene} 
	this.GetScene = function()  { return this.m_Scene;}

	//@param {Ray} a_Ray
	//@param {Color} a_Acc
	//@param {int} a_Depth
	//@param {float} a_RIndex a_Dist
	this.Raytrace = function( a_Ray, a_Acc, a_Depth, a_RIndex, a_Dist) 
	{																		
		if(a_Depth > TRACEDEPTH) return 0;

		a_Depth = 1000000.0;

		//@param  {vector3}
		var pi;
		//@param {Primitive}
		var prim = 0;
		//@param {int}
		var result;

		for( var s = 0; s < this.m_Scene.GetNrPrimitives(); s++ )
		{
			//@param {Primitive}
			var pr = this.m_Scene.GetPrimitive( s );
			//@param {int}
			var res;
			if(res = pr.Intersect( a_Ray, a_Dist ))
			{
				prim = pr;
				result = res; 
			}
		}

		if (!prim) return 0;

		if (prim.IsLight())
		{
			a_Acc = Color( 1, 1, 1 );
		}
		else
		{
			// determine color at point of intersection
			pi = a_Ray.GetOrigin() + a_Ray.GetDirection() * a_Dist;
			// trace lights
			for ( var l = 0; l < this.m_Scene.GetNrPrimitives(); l++ )
			{
				//@param {Primitive}
				var p = this.m_Scene.GetPrimitive( l );
				if (p.IsLight()) 
				{
					//@param {Primitive}
					var light = p;
					//@param {vector3}
					var L = light.GetCentre() - pi;
					NORMALIZE( L );
					//@param {vector3}
					var N = prim.GetNormal( pi );
					if (prim.GetMaterial().GetDiffuse() > 0)
					{
						//@param {float}
						var dot = DOT( N, L );
						if (dot > 0)
						{
							//@param {float}
							var diff = dot * prim.GetMaterial().GetDiffuse();
							// add diffuse component to ray color
							a_Acc += diff * prim.GetMaterial().GetColor() * light.GetMaterial().GetColor();
						}
					}
				}
			}
		}
		return prim;
	}
	
	this.InitRender = function()	
	{
		this.m_CurrLine = 20;
		this.m_PPos = this.m_CurrLine * this.m_Width;
		this.m_WX1 = -4, this.m_WX2 = 4, this.m_WY1 = this.m_SY = 3, this.m_WY2 = -3;
		this.m_DX = (this.m_WX2 - this.m_WX1) / this.m_Width;
		this.m_DY = (this.m_WY2 - this.m_WY1) / this.m_Height;
		this.m_SY += this.m_CurrLine * this.m_DY;
		this.m_LastRow = new Primitive*[this.m_Width];
		for( var i = 0; i < this.m_Width * 4; i++)
			this.m_LastRow[i] = 0;
	}
	
	this.Render = function(imageData)
	{
		//@param {vector3}
		var o = new vector3( 0, 0, -5 );
		//@param {int}
		var date = new Date();
		var msecs = date.getTime();//new GetTickCount();
		//@param {Primitive}
		var lastprim = 0;
		// render remaining lines
		for ( var y = this.m_CurrLine; y < (this.m_Height - 20); y++ )
		{
			m_SX = m_WX1;
			// render pixels for current line
			for ( var x = 0; x < this.m_Width; x++ )
			{
				//@param {Color}
				var acc = new vector3( 0, 0, 0 );
				//@param {vector3}
				var dir = vector3( m_SX, m_SY, 0 ) - o;
				NORMALIZE( dir );
				//@param {Ray}
				var r = new Ray( o, dir );
				//@param {float}
				var dist;
				//@param {Primitive}
				var prim = this.Raytrace( r, acc, 1, 1.0, dist );
				//@param {int}
				var red = acc.r * 256;
				var green = acc.g * 256;
				var blue = acc.b * 256;
			
				if (red > 255) red = 255;
				if (green > 255) green = 255;
				if (blue > 255) blue = 255;
				
				var cc = new Color( red, green, blue);
				setPixel(imageData, x, y, cc);
				this.m_SX += this.m_DX;
			}
			this.m_SY += this.m_DY;
			if ((/*GetTickCount()*/date.getTime() - msecs) > 100) 
			{
				// return control to windows so the screen gets updated
				this.m_CurrLine = y + 1;
				return false;
			}
			//var t = setTimeout("addOne( this.m_CurrLine)",100);
		}
		return true;
	}
	//@param {float}
	var m_WX1, m_WY1, m_WX2, m_WY2, m_DX, m_DY, m_SX, m_SY;
	//@param {Scene}
	var m_Scene;
	//@param {Pixel}
	var m_Dest;	
	//@param {int}
	var m_Width, m_Height, m_CurrLine, m_PPos;
	//@param {Primitive}
	var m_LastRow;
}

