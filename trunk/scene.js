var HIT = 1;
var MISS = 0;
var INPRIM = -1;

// class Material
function Material()
{
	this.m_color = new color(0.2, 0.2, 0.2); //?
	this.m_Refl = 0;
	this.m_Diff = 0.2;
	this.SetColor = function(a_color) { this.m_color = a_color; }
	this.GetColor = function() { return this.m_color; }
	this.SetDiffuse = function(a_Diff) { this.m_Diff = a_Diff; }
	this.SetReflection = function(a_Refl) { this.m_Refl = a_Refl; }
	this.GetSpecular = function() { return 1.0 - this.m_Diff; }
	this.GetDiffuse = function() { return this.m_Diff; }
	this.GetReflection = function () { return this.m_Refl; }
}

//class Primitive
var SPHERE = 1; //enum ??
var PLANE = 2;

function Primitive()
{
	this.m_Name = 0;
	this.m_Light = new Boolean(false);
	this.GetMaterial = function() { return this.m_Material; }
	this.SetMaterial = function(a_Mat) { this.m_Material = a_Mat; }
	this.GetType  = function() { return 0; }
	this.Intersect = function(a_Ray, a_Dist) { return 0; }
	this.GetNormal = function(a_Pos) { return 0; }
	this.GetColor = function() { return this.m_Material.GetColor(); }
	this.Light = function(a_Light) { this.m_Light = a_Light; }
	this.IsLight = function() { return this.m_Light.valueOf(); }
	this.SetName = function(a_Name) { this.m_Name = a_Name; }
	this.GetName = function() { return this.m_Name; }

}
//class Sphere
function Sphere(a_Centre, a_Radius)
{
	this.GetType = function() { return SPHERE; }
	this.m_Centre = a_Centre;
	this.m_SqRadius = a_Radius * a_Radius;
	this.m_Radius = a_Radius;
	this.m_RRadius = 1.0 / a_Radius;
	this.GetCertre = function() { reuturn this.m_Centre; }
	this.GetSqRadius = function() { return this.m_SqRadius; }
	this.Intersect = function(a_Ray, a_Dist) {
		var v = a_Ray.GetOrigin().Sub(this.m_Centre);
		var b = - v.Dot(a_Ray.GetDirection());
		var det = (b * b) - v.Dot(v) + this.m_SqRadius;
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
	this.GetNormal = function(a_Pos) {return (a_Pos.Sub(this.m_Centre)).Mul(this.m_RRadius); }
}
Sphere.prototype = new Primitive();

//class PlanePrim
function PlanePrim(a_Normal, a_D)
{
	this.GetType = function() { return PLANE; }
	this.m_Plane = new plane(a_Normal, a_D);
	this.GetNormal = function() { return this.m_Plane.N; }
	this.GetD = function() { return this.m_Plane.D; }
	this.Intersect = function(a_Ray, a_Dist) {
		var d = this.m_Plane.N.Dot(a_Ray.GetDirection());
		if(d != 0)
		{
			var dist = - (this.m_Plane.N.Dot(a_Ray.GetOrigin()) + this.m_Plane.D) / d;
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
	this.GetNormal = function(a_Pos) { return this.m_Plane.N; }
}
PlanePrim.prototype = new Primitive();

//class Scene
function Scene()
{
	this.m_Primitives = 0;
	this.m_Primtive = 0;
	this.InitScene() = function() {
		this.m_Primitive = new Array(100);
		// ground plane
		this.m_Primitive[0] = new PlanePrim(new vector3(0, 1, 0), 4.4);
		this.m_Primitive[0].SetName("plane");
		this.m_Primitive[0].GetMaterial().SetReflection(0);
		this.m_Primitive[0].GetMaterial().SetDiffuse(1);
		this.m_Primitive[0].GetMaterial().SetColor(new color(0.4, 0.3, 0.3));
		// big sphere
		this.m_Primitive[1] = new Sphere(new vector3(1, -0.8, 3), 2.5);
		this.m_Primitive[1].SetName("big sphere");
		this.m_Primitive[1].GetMaterial().SetReflection(0.6);
		this.m_Primitive[1].GetMaterial().SetColor(new color(0.7, 0.7, 0.7));
		// small sphere
		this.m_Primitive[2] = new Sphere(new vector3(-5.5, -0.5, 7), 2));
		this.m_Primitive[2].SetName("small sphere");
		this.m_Primitive[2].GetMaterial().SetReflection(1.0);
		this.m_Primitive[2].GetMaterial().SetDiffuse(0.1);
		this.m_Primitive[2].GetMaterial().SetColor(new color(0.7, 0.7, 1.0));
		// light source 1
		this.m_Primitive[3] = new Sphere(new vector3(0, 5, 5), 0.1));
		this.m_Primitive[3].Light(new Boolean(true));
		this.m_Primitive[3].GetMaterial().SetColor(new color(0.6, 0.6, 0.6));
		// light source 2
		this.m_Primitive[4] = new Sphere(new vector3(2, 5, 1), 0.1));
		this.m_Primitive[4].Light(new Boolean(true));
		this.m_Primitive[4].GetMaterial().SetColor(new color(0.7, 0.7, 0.9));
		
		this.m_Primitives = 5;
	}
	this.GetNrPrimitives = function() { return this.m_Primitives; }
	this.GetPrimitive = function(a_Idx) { return this.m_Primitive[a_Idx]; }
}