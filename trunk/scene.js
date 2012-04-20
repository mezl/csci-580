// -----------------------------------------------------------
// scene.js
// 2012 Spring CS580 Final Project 4/18/2012
// Author: Yun-Yu Chen,Sophia Chang,Vince Liao,Chin-Kai Chang
// -----------------------------------------------------------

testScene();
//#############################################################################
// test
function testScene()
{
	var mat = new Material();
	console.log("Test Material Default: " + mat.toString());
	console.log("Test Material Default Color: " + mat.GetColor().toString());
	console.log("Test Material Default Refl: " + mat.GetReflection().toString());
	console.log("Test Material Default Diff: " + mat.GetDiffuse().toString());
	console.log("Test Material Default Spec: " + mat.GetSpecular().toString());
	mat.SetColor(new Color(0.1, 0.1, 0.1));
	mat.SetDiffuse(0.5);
	mat.SetReflection(0.2);
	console.log("Test Material: " + mat.toString());
	console.log("Test Material Set Color: " + mat.GetColor().toString());
	console.log("Test Material Set Refl: " + mat.GetReflection().toString());
	console.log("Test Material Set Diff: " + mat.GetDiffuse().toString());
	console.log("Test Material Set Spec: " + mat.GetSpecular().toString());
	
	console.log("########################################################");
	
	var prim = new Primitive();
	console.log("Test Primitive Default: " + prim.toString());
	
	console.log("########################################################");
	
	Sphere.prototype = new Primitive(); // set parent
	var sphere = new Sphere();
	console.log("Test Sphere Default: " + sphere.toString());
	var sphere2 = new Sphere(new vector3(1, -0.8, 3), 2.5);
	sphere2.SetName("big sphere");
	sphere2.GetMaterial().SetReflection(0.6);
	sphere2.GetMaterial().SetColor(new Color(0.7, 0.7, 0.7));
	console.log("Test Sphere Set: " + sphere2.toString());
	console.log("Test Sphere Intersect: " 
			+ sphere2.Intersect(new Ray(new vector3(1, -0.8, 3), new vector3(1, 1, 1)), 10000000) + " == -1");
	console.log("Test Sphere Intersect: "
			+ sphere2.Intersect(new Ray(new vector3(10, 10, 10), new vector3(1, 1, 1)), 10000000) + " == 0");
	console.log("Test Sphere Intersect: "
			+ sphere2.Intersect(new Ray(new vector3(0, 0, 0), new vector3(1, -0.8, 3)), 10000000) + " == 1");
	
	console.log("########################################################");
	
	PlanePrim.prototype = new Primitive(); // set parent
	var plane = new PlanePrim();
	console.log("Test PlanePrim Default: " + plane.toString());
	var plane2 = new PlanePrim(new vector3(0, 1, 0), 4.4);
	plane2.SetName("plane");
	plane2.GetMaterial().SetReflection(0);
	plane2.GetMaterial().SetDiffuse(1);
	plane2.GetMaterial().SetColor(new Color(0.4, 0.3, 0.3));
	console.log("Test PlanePrim Set: " + plane.toString());
	console.log("Test PlanePrim Intersect: "
			+ plane2.Intersect(new Ray(new vector3(0, -10, 0), new vector3(0, 1, 0)), 1000000000) + " == 1");
	console.log("Test PlanePrim Intersect: "
			+ plane2.Intersect(new Ray(new vector3(0, 2, 0), new vector3(1, 0, 0)), 1000000000) + " == 0");
	
	console.log("########################################################");
	
	var scene = new Scene();
	scene.InitScene();
	console.log(scene.toString());
	
}
//#############################################################################
// Intersection method return values
/*
var HIT = 1;		// Ray hit primitive
var MISS = 0;		// Ray missed primitive
var INPRIM = -1;	// Ray started inside primitive
*/
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
		return "[ Material Color: " + this.m_color.toString() +" Refl: " + this.m_Refl 
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
