// -----------------------------------------------------------
// raytracer.js
// 2012 Spring CS580 Final Project 4/18/2012
// Author: Yun-Yu Chen,Sophia Chang,Vince Liao,Chin-Kai Chang
// -----------------------------------------------------------
//
//#############################################################################
//code testing
function testRaytraceScene(imageData)
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
	C.SetTarget( 20, 400, 300);
	console.log("Test Engine C.SetTarget: " + C.m_Dest);
	console.log("Test Engine C.SetTarget: " + C.m_Width);
	console.log("Test Engine C.SetTarget: " + C.m_Height);
	
	var o = new vector3(0, 0, -5);
	var dir = new vector3(10, 20, 0);
	var acc = new vector3(0, 0, 0);
	var a_Ray = ( o, dir);
	var ret = C.Raytrace( a_Ray,10, 1.0);
	console.log("Test Engine C.Raytrace: ");
	var D = C.GetScene();
	console.log("Test Engine C.GetScene = D: ");
	C.InitRender( );
	console.log("Test Engine C.InitRender: ");
	C.Render(imageData);
	console.log("Test Engine C.Render: ");//*/
}
//#############################################################################
// class Texture
// @param {vector3} a_Bitmap
// @param {int} a_Width, a_Height
function Texture( a_Bitmap, a_Width, a_Height)	{
	//constructure
	if(typeof(a_Width) == "undefined"){
		// @param {FILE}
		a_File = a_Bitmap;
		//var f = fopen( a_File, 0 );
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var f = fso.OpenTextFile(a_File, 1, true); 		
		
		if (f)
		{
			var length = flength(f);
			// extract width and height from file header
			// @param {unsigned char}
			var buffer = new Array(20);
			fread( buffer, 1, 20, f );
			this.m_Width = buffer[12] + 256 * buffer[13];
			this.m_Height = buffer[14] + 256 * buffer[15];
			fclose( f );
			// read pixel data
			f = fopen( a_File, 0 );
			// @param {unsigned char}
			var length = this.m_Width * this.m_Height * 3 + 1024;
			var t = new Array(length);
			//fread( t, 1, this.m_Width * this.m_Height * 3 + 1024, f );
			//fclose( f );
			// convert RGB 8:8:8 pixel data to floating point RGB  new Color[m_Width * m_Height];
			this.m_Bitmap = new vector3(this.m_Width * this.m_Height);
			// @param {float}
			var rec = 1.0 / 256;
			for ( var size = this.m_Width * this.m_Height, i = 0; i < size; i++ )
				this.m_Bitmap[i] = vector3( t[i * 3 + 20] * rec, t[i * 3 + 19] * rec, t[i * 3 + 18] * rec );
			delete t;
		}		
	}
	//defualt constructor
	else{
		this.m_Bitmap = a_Bitmap;
		this.m_Width = a_Width;
		this.m_Height = a_Height;
	}
	
	// @param {vector3} GetBitmap, m_Bitmap
	this.GetBitmap = function() { return this.m_Bitmap;}
	
	// @param {vector3} GetTexel
	// @param {float} a_U, a_V
	this.GetTexel = function( a_U, a_V) {
		
		// fetch a bilinearly filtered texel
		// @param {float} 
		var fu = (a_U + 1000.5) * this.m_Width;
		var fv = (a_V + 1000.0) * this.m_Width;
		// @param {int} 
		var u1 = fu % this.m_Width;
		var v1 = fv % this.m_Height;
		var u2 = (u1 + 1) % this.m_Width;
		var v2 = (v1 + 1) % this.m_Height;
		// calculate fractional parts of u and v
		// @param {float} 
		var fracu = fu - Math.floor( fu );
		var fracv = fv - Math.floor( fv );
		// calculate weight factors
		// @param {float}
		var w1 = (1 - fracu) * (1 - fracv);
		var w2 = fracu * (1 - fracv);
		var w3 = (1 - fracu) * fracv;
		var w4 = fracu *  fracv;
		// fetch four texels
		// @param {vactor3} 
		var c1 = this.m_Bitmap[u1 + v1 * this.m_Width];
		var c2 = this.m_Bitmap[u2 + v1 * this.m_Width];
		var c3 = this.m_Bitmap[u1 + v2 * this.m_Width];
		var c4 = this.m_Bitmap[u2 + v2 * this.m_Width];
		// scale and sum the four colors
		//return c1 * w1 + c2 * w2 + c3 * w3 + c4 * w4;
		return c1.Mul(w1).Add(c2.Mul(w2).Add(c3.Mul(w3).Add(c4.Mul(w4))));
	};
	
	// @param {return int}
	this.GetWidth = function() { return this.m_Width;}
	
	// @param {return int}
	this.GetHeight = function() { return this.m_Height;}
	
	// @param {vector3}
	var m_Bitmap;
	// @param {int}
	var m_Width, m_Height;
}
//#############################################################################
// class Material
function Material() {
    // default constructor
    this.m_color = new vector3(0.2, 0.2, 0.2);
    this.m_Refl = 0;
    this.m_Refr = 0;
    this.m_Diff = 0.2;
    this.m_Spec = 0.8;
    this.m_RIndex = 1.5;
	this.m_Texture = 0;
	this.m_UScale = 1.0;
	this.m_VScale = 1.0;
	
    // @param {Color} a_color
    this.SetColor = function (a_color) { this.m_color = a_color; }

    // @return {Color} color of this material
    this.GetColor = function () { return this.m_color; }

    // @param {float} a_Diff
    this.SetDiffuse = function (a_Diff) { this.m_Diff = a_Diff; }

    // @param {float} a_Spec
    this.SetSpecular = function (a_Spec) { this.m_Spec = a_Spec; }

    // @param {float} a_Refl
    this.SetReflection = function (a_Refl) { this.m_Refl = a_Refl; }

    // @param {float} a_Refr
    this.SetRefraction = function (a_Refr) { this.m_Refr = a_Refr; }

    // @return {float} specular of this material
    this.GetSpecular = function () { return 1.0 - this.m_Diff; }

    // @return {float} diffuse of this material
    this.GetDiffuse = function () { return this.m_Diff; }

    // @return {float} reflection of this material
    this.GetReflection = function () { return this.m_Refl; }

    // @return {float} refraction of this material
    this.GetRefraction = function () { return this.m_Refr; }

    // @param {float} a_RIndex
    this.SetRefrIndex = function (a_RIndex) { this.m_RIndex = a_RIndex; }

    // @return {float} RIndex of this material
    this.GetRefrIndex = function () { return this.m_RIndex; }

	// @param {Texture} a_Tecture
	this.SetTexture = function (a_Tecture)	{ this.m_Texture = a_Texture; }

	// @param {float} a_UScale, a_VScale
	this.SetUVScale = function(a_UScale, a_VScale) {
		this.m_UScale = a_UScale; 
		this.m_VScale = a_VScale; 
		this.m_RUScale = 1.0 / a_UScale;
		this.m_RVScale = 1.0 / a_VScale;
	};
	
	// @param {float}
	this.GetUScale = function() { return this.m_UScale; }
	
	// @param {float}
	this.GetVScale = function() { return this.m_VScale; }
	
	// @param {float}
	this.GetUScaleReci = function() { return this.m_RUScale; }
	
	// @param {float}
	this.GetVScaleReci = function() { return this.m_RVScale; }
	
    // @return {String}
    this.toString = function () {
        return "[ Material Color: " + this.m_color.toString() + " Refl: " + this.m_Refl
		+ " Refr: " + this.m_Refr + " Diff: " + this.m_Diff
		+ " Spec: " + this.m_Spec + " RIndex: " + this.m_RIndex + " ]";
    }
}

//#############################################################################
/*
var SPHERE = 1;
var PLANE = 2;
*/
//class Primitive
function Primitive() {
    // default constructor
    this.m_Name = 0;
    this.m_Light = new Boolean(false);
    //this.m_RayID = -1;

    // @return {int} type of this primitive
    this.GetType = function () { return 0; }

    // @param {Ray} a_Ray
    // @param {float} a_Dist
    // @return {int} intersection type
    this.Intersect = function (a_Ray) { return 0; }

    // @param {aabb}
    // @return {Boolean}
    this.IntersectBox = function(a_Box) { return 0; }

    // @param {vector3} a_Pos
    // @return {vector3} normal of the primitive
    this.GetNormal = function (a_Pos) { return 0; }

    // @return {Color} color of this material
    this.GetColor = function () { return this.m_Material.GetColor(); }

    // @param {Boolean} a_Light
    this.Light = function (a_Light) { this.m_Light = a_Light; }

    // @return {aabb}
    this.GetAABB = function () { return 0; }

    // @return {Boolean} is this primitive a light
    this.IsLight = function () { return this.m_Light.valueOf(); }

    
    // @param {String} a_Name
    this.SetName = function (a_Name) { this.m_Name = a_Name; }

    // @return {String} name of this primitive
    this.GetName = function () { return this.m_Name; }

    // @return {String}
    this.toString = function () {
        return "[ Primitive Name: " + this.m_Name /*+ " Material: " + this.m_Material.toString()*/
		+ " Type: " + this.GetType() + " Normal: " + this.GetNormal(new vector3(0, 0, 0)).toString()
		+ " Light: " + this.IsLight().toString() + " ]";
    }
    this.primToString = function () {
        return "[ Primitive Name: " + this.m_Name /*+ " Material: " + this.m_Material.toString()*/
		+ " Type: " + this.GetType() + " Normal: " + this.GetNormal(new vector3(0, 0, 0)).toString()
		+ " Light: " + this.IsLight().toString() + " ]";
    }

}

//#############################################################################
// class Sphere
// @param {vector3} a_Centre
// @param {float} a_Radius

function Sphere(a_Centre, a_Radius) {
    // Intersection method return values
    var HIT = 1; 	// Ray hit primitive
    var MISS = 0; 	// Ray missed primitive
    var INPRIM = -1; // Ray started inside primitive

    var SPHERE = 1;
    // @return {int} type of this primitive
    this.GetType = function () { return SPHERE; }

    if (typeof (a_Centre) == "undefined") {
        // default constructor
        this.m_Centre = new vector3(0, 0, 0);
        this.m_SqRadius = 1.0 * 1.0;
        this.m_Radius = 1.0;
        this.m_RRadius = 1.0 / 1.0;
        this.m_Material = new Material();
        this.m_RayID = -1;
    } else {
        // constructor
        this.m_Centre = a_Centre;
        this.m_SqRadius = a_Radius * a_Radius;
        this.m_Radius = a_Radius;
        this.m_RRadius = 1.0 / a_Radius;
        this.m_Material = new Material();
        this.m_RayID = -1;
		this.m_Vn = new vector3( 0, 1, 0 );
		this.m_Ve = new vector3( 1, 0, 0 );
		this.m_Vc = this.m_Vn.Cross( this.m_Ve );
    }

    // @return {vertor3} centre of this sphere
    this.GetCentre = function () { return this.m_Centre; }

    // @return {float} radius of this sphere
    this.GetSqRadius = function () { return this.m_SqRadius; }

    // @param {Ray} a_Ray
    // @param {float} a_Dist
    // @return {Array} [0] intersection type [1] a_Dist
    this.Intersect = function (a_Ray, a_Dist) {
        var result = new Array(2);
        var v = a_Ray.GetOrigin().Sub(this.m_Centre);
        var b = -DOT(v, a_Ray.GetDirection());
        var det = (b * b) - DOT(v, v) + this.m_SqRadius;
        var retval = MISS;
        if (det > 0) {
            det = Math.sqrt(det);
            var i1 = b - det;
            var i2 = b + det;
            if (i2 > 0) {
                if (i1 < 0) {
                    if (i2 < a_Dist) {
                        a_Dist = i2;
                        retval = INPRIM;
                    }
                }
                else {
                    if (i1 < a_Dist) {
                        a_Dist = i1;
                        retval = HIT;
                    }
                }
            }
        }
        result[0] = retval;
        result[1] = a_Dist;

        return result;
    }

    // @param {aabb} a_Box
    // @return {Boolean}
    this.IntersectBox = function (a_Box) {
        // @param {float}
        var dmin = 0.0;
        // @param {vector3}
        var v1 = a_Box.GetPos();
        var v2 = a_Box.GetPos().Add(a_Box.GetSize());

        if (this.m_Centre.x < v1.x) {
            dmin = dmin + (this.m_Centre.x - v1.x) * (this.m_Centre.x - v1.x);
        } else if (this.m_Centre.x > v2.x) {
            dmin = dmin + (this.m_Centre.x - v2.x) * (this.m_Centre.x - v2.x);
        }

        if (this.m_Centre.y < v1.y) {
            dmin = dmin + (this.m_Centre.y - v1.y) * (this.m_Centre.y - v1.y);
        } else if (this.m_Centre.y > v2.y) {
            dmin = dmin + (this.m_Centre.y - v2.y) * (this.m_Centre.y - v2.y);
        }

        if (this.m_Centre.z < v1.z) {
            dmin = dmin + (this.m_Centre.z - v1.z) * (this.m_Centre.z - v1.z);
        } else if (this.m_Centre.z > v2.z) {
            dmin = dmin + (this.m_Centre.z - v2.z) * (this.m_Centre.z - v2.z);
        }
        return (dmin <= this.m_SqRadius);
    }

    // @param {vector3} a_Pos
    // @return {vector3} normal
    this.GetNormal = function (a_Pos) { return (a_Pos.Sub(this.m_Centre)).Mul(this.m_RRadius); }

    // @return {aabb}
    this.GetAABB = function () {
        // @param {vector3}
        var size = new vector3(this.m_Radius, this.m_Radius, this.m_Radius);
        return new aabb(this.m_Centre.Sub(size), size.Mul(2));
    }

    // @return {Material} material of this primitive
    this.GetMaterial = function () { return this.m_Material; }

    // @param {Material} a_Mat
    this.SetMaterial = function (a_Mat) { this.m_Material = a_Mat; }

	// @param {Texture} a_Texture
	this.SetTexture = function(a_Texture) { this.m_Texture = a_Texture; }
	
	// @param {vector3}
	this.GetColor = function (a_Pos){
		// @param {vector3}
		var retval = new vector3();
		if (!this.m_Material.GetTexture()) 
			retval = this.m_Material.GetColor(); 
		else
		{
			// @param {vector3}
			var vp = (a_Pos.Sub(this.m_Centre).Mul(m_RRadius));
			// @param {float}
			var phi = Math.acos( Math.PI * (-DOT( vp, m_Vn )/180) );
			var u, v = phi * this.m_Material.GetVScaleReci() * (1.0 / PI);
			var theta = (Math.acos( Math.PI * (DOT( this.m_Ve, vp ) / Math.sin( Math.PI * (phi / 180) )/ 180 ))) * (2.0 / PI);
			if (DOT( this.m_Vc, vp ) >= 0) 
				u = (1.0 - theta) * this.m_Material.GetUScaleReci();
			else 
				u = theta * this.m_Material.GetUScaleReci();
			retval = this.m_Material.GetColor().Mul(this.m_Material.GetTexture().GetTexel( u, v ));
		}
		return retval;
	}
	
    // @return {int} ray id
    this.GetLastRayID = function() { return m_RayID; }
    
    this.toString = function () {
        return "[ Sphere Primitive: " + this.primToString() + " Centre: " + this.m_Centre.toString() + " SqRadius: " + this.m_SqRadius
		+ " Radius: " + this.m_Radius + " RRadius: " + this.m_RRadius + " ]";
    }
}

//#############################################################################
// class PlanePrim
// @param {vector3} a_Normal
// @param {float} a_D
function PlanePrim(a_Normal, a_D) {
    // Intersection method return values
    var HIT = 1; 	// Ray hit primitive
    var MISS = 0; 	// Ray missed primitive
    var INPRIM = -1; // Ray started inside primitive

    var PLANE = 2;
    // @return {int} type of this primitive
    this.GetType = function () { return PLANE; }

    if (typeof (a_Normal) == "undefined") {
        // default constructor
        this.m_Plane = new plane(new vector3(0, 1, 0), 1.0);
        this.m_Material = new Material();
        this.m_RayID = -1;
    } else {
        //constructor
        this.m_Plane = new plane(a_Normal, a_D);
        this.m_Material = new Material();
        this.m_RayID = -1;
		this.m_UAxis = new vector3( this.m_Plane.N.y, this.m_Plane.N.z, -this.m_Plane.N.x );
		this.m_VAxis = this.m_UAxis.Cross( this.m_Plane.N );
    }
    // @return {vector3} normal of this planeprim
    this.GetNormal = function () { return this.m_Plane.N; }

    // @return {float} d of this planeprim
    this.GetD = function () { return this.m_Plane.D; }

    // @param {Ray} a_Ray
    // @param {float} a_Dist
    // @return {Array} [0] intersection type [1] a_Dist
    this.Intersect = function (a_Ray, a_Dist) {
        var result = new Array(2);
        var retval = MISS;
        var d = DOT(this.m_Plane.N, a_Ray.GetDirection());
        if (d != 0) {
            var dist = -(DOT(this.m_Plane.N, a_Ray.GetOrigin()) + this.m_Plane.D) / d;
            if (dist > 0) {
                if (dist < a_Dist) {
                    a_Dist = dist;
                    retval = HIT;
                }
            }
        }

        result[0] = retval;
        result[1] = a_Dist;
        return result;
    }

    // @param {aabb} a_Box
    // @return {Boolean}
    this.IntersectBox = function (a_Box) {
        // @param {vector3}
        var v = new Array(2);
        v[0] = a_Box.GetPos();
        v[1] = a_Box.GetPos().Add(a_Box.GetSize());
        // @param {int}
        var side1 = 0;
        var side2 = 0;
        for (var i = 0; i < 8; i++) {
            // @param {vector3}
            var p = new vector3(v[i & 1].x, v[(i >> 1) & 1].y, v[(i >> 2) & 1].z);
            if ((DOT(p, this.m_Plane.N) + this.m_Plane.D) < 0) {
                side1++;
            } else {
                side2++;
            }
        }
        if ((side1 == 0) || (side2 == 0))
            return false;
        else
            return true;
    }

    // @param {vector3} a_Pos
    // @return {vector3} normal
    this.GetNormal = function (a_Pos) { return this.m_Plane.N; }

    // @return {aabb}
    this.GetAABB = function () {
        return new aabb(new vector3(-10000, -10000, -10000), new vector3(20000, 20000, 20000));
    }

    // @return {Material} material of this primitive
    this.GetMaterial = function () { return this.m_Material; }

    // @param {Material} a_Mat
    this.SetMaterial = function (a_Mat) { this.m_Material = a_Mat; }
 
	// @param {Texture} a_Texture
	this.SetTexture = function(a_Texture) { this.m_Texture = a_Texture; }
	
	// @param {vector3}
	this.GetColor = function(a_Pos) {
		// @param {vector3}
		var retval = new vector3();
		if (this.m_Material.GetTexture())
		{
			// @param {Texture}
			t = this.m_Material.GetTexture();
			// @param {float}
			var u = DOT( a_Pos, this.m_UAxis ) * this.m_Material.GetUScale();
			var v = DOT( a_Pos, this.m_VAxis ) * this.m_Material.GetVScale();
			retval = this.m_Material.GetColor().Mul(t.GetTexel( u, v ));
		}
		else
		{
			retval = this.m_Material.GetColor();
		}
		return retval;
	}
 
    // @return {int} ray id
    this.GetLastRayID = function() { return m_RayID; }
    
    this.toString = function () {
        return "[ PlanePrim Primitive: " + this.primToString() + " Normal: "
		+ this.GetNormal().toString() + " D: " + this.GetD() + " ]";
    }
}

//#############################################################################
//class Vertex
function Vertex(a_Pos,a_U,a_V,scale,offset)
{
	//constructor Vertex(String)
	//2.400000	2.250000	1.000000	0.902861	-0.429934	0.000000	0.000000	0.000000
	//[0]x			[1]y			[2]z			[3]nx			[4]ny			[5]nz			[6]u			[7]v								
	if (typeof (scale) != "undefined") 
	{
			//array of number
			var s = a_Pos.split("	");			
		
			//@param {vector3} pos
			var pos =    new vector3((s[0]*scale)+offset,(s[1]*scale)+offset,(s[2]*scale)+offset);
			//var normal = new vector3((s[3]*scale)+offset,(s[4]*scale)+offset,(s[5]*scale)+offset);
			var normal = new vector3(s[3],s[4],s[5]);
			//@param {float} u,v
			var u = s[6]; var v = s[7];

			this.m_Pos = pos;
			this.m_Normal = normal;
			this.m_U = u;
			this.m_V = v;

	}	else {
		//constructor Vertex(pos,U,v)
		this.m_Pos = a_Pos;
		this.m_U = a_U;
		this.m_V = a_V;
	}
	// @return { float }
	this.GetU = function(){return this.m_U;}
	// @return { float }
	this.GetV = function(){return this.m_V;}
	// @retrun { vector3 }
	this.GetNormal = function(){return this.m_Normal;}
	// @return { vector3 }
	this.GetPos = function(){return this.m_Pos;}
	// @param { float }a_U,a_V
	this.SetUV = function(a_U,a_V){this.m_U = a_U;this.m_V = a_V;}
	// @param { vector3 } a_Pos
	this.SetPos = function(a_Pos){this.m_Pos = a_Pos;}
	// @param { vector3 }
	this.SetNormal = function(a_Normal){this.m_Normal = a_Normal;}
}

var MODULO = [0,1,2,0,1]; 
//#############################################################################
//class Triangle
// @param {Vertex} v1,v2,v3
function Triangle(v1,v2,v3) 
{
    // Intersection method return values
    var HIT = 1; 	// Ray hit primitive
    var MISS = 0; 	// Ray missed primitive
    var INPRIM = -1; // Ray started inside primitive

		this.m_Material = new Material();
    var TRIANGLE = 4;
    // @return {int} type of this primitive
    this.GetType = function () { return TRIANGLE; }

		//@param { Vertex }
		this.m_Vertex = new Array(3);
		this.m_Vertex[0] = v1;
		this.m_Vertex[1] = v2;
		this.m_Vertex[2] = v3;

		//@param { vector3 }
		var A = this.m_Vertex[0].GetPos();
		var B = this.m_Vertex[1].GetPos();
		var C = this.m_Vertex[2].GetPos();
		var cc = B.Sub(A);
		var bb = C.Sub(A);

		//compute Normal
		//@param { vector3 }
		this.m_N = bb.Cross(cc);

		//compute Axis
		//@param { int } axis
		var Nx = Math.abs(this.m_N.x);
		var Ny = Math.abs(this.m_N.y);
		var Nz = Math.abs(this.m_N.z);
		if(Nx > Ny){
			if(Nx > Nz){this.k = 0}else{this.k = 2}
		}else{
			if(Ny > Nz){this.k = 1}else{this.k = 2}
		}
		//@param {int}
		var u,v;
		u = MODULO[this.k+1];
		v = MODULO[this.k+2];
		this.ku = u;
		this.kv = v;

		//@param {float} krec,nu,nv,nd
		var krec = 1.0 / this.m_N.cell(this.k);
		this.nu = this.m_N.cell(u) * krec;
		this.nv = this.m_N.cell(v) * krec;
		this.nd = this.m_N.Dot( A ) * krec;


		//@param {float}
		var reci = 1.0/(bb.cell(u)*cc.cell(v) - bb.cell(v) * cc.cell(u));
		
		//@param { float }
		this.bnu =   bb.cell(u) * reci;
		this.bnv = -(bb.cell(v) * reci);
		this.cnu =   cc.cell(v) * reci;
		this.cnv = -(cc.cell(u) * reci );
		this.m_N.Normalize();

		//console.log("Triangle's Normal is "+this.m_N.toString());
	
		

		//@param { float }
		this.m_U = 0.0;
		this.m_V = 0.0;

		this.m_Vertex[0].SetNormal(this.m_N);
		this.m_Vertex[1].SetNormal(this.m_N);
		this.m_Vertex[2].SetNormal(this.m_N);
		


    // @param {Ray} a_Ray
    // @param {float} a_Dist
    // @return {Array} [0] intersection type [1] a_Dist
    this.Intersect = function (a_Ray, a_Dist) 
		{
			var ret = new Array(2);//return param
			ret[1] = a_Dist;

			//@param { float } ku,kv
			var ku = this.ku;
			var kv = this.kv;
			var nu = this.nu;
			var nv = this.nv;
			var nd = this.nd;
			//@param { int }
			var k = this.k;

			//@param { vector3 }
			var O = a_Ray.GetOrigin();
			var D = a_Ray.GetDirection();
			var A = this.m_Vertex[0].GetPos();

			//@param {float}
			var lnd = 1.0 / (D.cell(k) + nu*D.cell(ku) + nv*D.cell(kv));
			var t = (nd - O.cell(k) - nu* O.cell(ku) - nv * O.cell(kv) )*lnd;
			
			if(!(a_Dist > t && t > 0))	{
				ret[0] = MISS;
				return ret;
			}
			//@param {float} hu,hv,beta,gamma
			var hu = O.cell(ku) + t* D.cell(ku) - A.cell(ku);
			var hv = O.cell(kv) + t* D.cell(kv) - A.cell(kv);
			var beta = hv * this.bnu + hu*this.bnv;
			this.m_U = beta;
			var gamma = hu * this.cnu + hu * this.bnv;
			this.m_V = gamma;
			if(beta < 0 || gamma < 0 || ((beta+gamma)> 1.0))
			{
				ret[0] = MISS;
				return ret;
			}
			a_dist = t;
			ret[1] = t;
			if(DOT(D,this.m_N) > 0){
				ret[0] = INPRIM;
			}else{ 
				ret[0] = HIT;
			}
			return ret;
		}
		//##################################################################
		//@return {vector3}
		this.GetNormal = function()
		{
			return this.m_N;
			////@param {vector3} N1,N2,N3
			//var N1 = this.m_Vertex[0].GetPos();
			//var N2 = this.m_Vertex[1].GetPos();
			//var N3 = this.m_Vertex[2].GetPos();

			////N = N1 +
			////m_U * (N2 - N1) +
			////m_V * (N3 - N1) 
			////@param {vector3} N
			//var N = N1.Add( ((N2.Sub(N1)).Mul(this.m_U)).Add( (N3.Sub(N1)).Mul(this.m_V)) );
			//N.Normalize();
			//console.log("Triangle's Normal is "+N.toString());
			//return N;

		}	
		//##################################################################
    // @return {Material} material of this primitive
    this.GetMaterial = function () { return this.m_Material; }

    // @param {Material} a_Mat
    this.SetMaterial = function (a_Mat) { this.m_Material = a_Mat; }

	// @param {Texture} a_Texture
		this.SetTexture = function(a_Texture) { this.m_Texture = a_Texture; }
}
//#############################################################################
//class Box
function Box(a_Box) {
    // Intersection method return values
    var HIT = 1; 	// Ray hit primitive
    var MISS = 0; 	// Ray missed primitive
    var INPRIM = -1; // Ray started inside primitive
	
    var AABB = 3;
    // @return {int} type of this primitive
    this.GetType = function () { return AABB; }

    if (typeof (a_Box) == "undefined") {
        // default constructor
        this.m_Box = new aabb(new vector3(0, 0, 0), new vector3(0, 0, 0));
        this.m_Grid = 0.0;
        
        this.m_Material = new Material();
        this.m_RayID = -1;
        this.m_Light = new Boolean(false);
    } else {
        //constructor
        this.m_Box = a_Box;
        this.m_Grid = 0.0;
        
        this.m_Material = new Material();
        this.m_RayID = -1;
        this.m_Light = new Boolean(false);
    }
    
    // @param {Ray} a_Ray
    // @param {float} a_Dist
    // @return {Array} [0] intersection type [1] a_Dist
    this.Intersect = function (a_Ray, a_Dist) {
    	var result = new Array(2);
    	this.m_RayID = a_Ray.GetID();
        // @param {float}
    	var dist = new Array(6);
    	// @param {vector3}
    	var ip = new Array(6);
    	var d = a_Ray.GetDirection();
    	var o = a_Ray.GetOrigin();
    	// @param {Boolean}
    	var retval = MISS;
    	for (var i = 0; i < 6; i++)
    		dist[i] = -1;
    	// @param {vector3}
    	var v1 = this.m_Box.GetPos();
    	var v2 = this.m_Box.GetPos().Add(this.GetSize());
    	if(d.x)
    	{
    		// @param {float}
    		var rc = 1.0 / d.x;
    		dist[0] = (v1.x - o.x) * rc;
    		dist[3] = (v2.x - o.x) * rc;
    	}
    	if(d.y)
    	{
    		//@param {float}
    		var rc = 1.0 / d.y;
    		dist[1] = (v1.y - o.y) * rc;
    		dist[4] = (v2.y - o.y) * rc;
    	}
    	if (d.z) 
    	{
    		var rc = 1.0 / d.z;
    		dist[2] = (v1.z - o.z) * rc;
    		dist[5] = (v2.z - o.z) * rc;
    	}
    	for(var i = 0; i < 6; i++)
    	{
    		if(dist[i] > 0)
    		{
    			ip[i] = o.Add(d.Mul(dist[i]));
    			if ((ip[i].x > (v1.x - EPSILON)) && (ip[i].x < (v2.x + EPSILON)) && 
    				(ip[i].y > (v1.y - EPSILON)) && (ip[i].y < (v2.y + EPSILON)) &&
    				(ip[i].z > (v1.z - EPSILON)) && (ip[i].z < (v2.z + EPSILON)))
    			{
    				if (dist[i] < a_Dist) 
    				{
    					a_Dist = dist[i];
    					retval = HIT;
    				}
    			}
    		}
    	}
    	
        result[0] = retval;
        result[1] = a_Dist;
        return result;
    }
    
    // @param {aabb} a_Box
    // @return {Boolean} 
    this.IntersectBox = function(a_Box){ return this.m_Box.Intersect(a_Box); }
    
    // @param {vector3}
    // @return {vector3}
    this.GetNormal = function(a_Pos){
    	// @param {float}
    	var dist = new Array(6);
    	dist[0] = Math.abs(this.m_Box.GetSize().x - this.m_Box.GetPos().x);
    	dist[1] = Math.abs(this.m_Box.GetSize().x + this.m_Box.GetSize().x - this.m_Box.GetPos().x );
    	dist[2] = Math.abs(this.m_Box.GetSize().y - this.m_Box.GetPos().y );
    	dist[3] = Math.abs(this.m_Box.GetSize().y + this.m_Box.GetSize().y - this.m_Box.GetPos().y );
    	dist[4] = Math.abs(this.m_Box.GetSize().z - this.m_Box.GetPos().z );
    	dist[5] = Math.abs(this.m_Box.GetSize().z + this.m_Box.GetSize().z - this.m_Box.GetPos().z );
    	// @param {int}
    	var best = 0;
    	// @param {float}
    	var bdist = dist[0];
    	for(var i = 1; i < 6; i++)
    	{
    		if( dist[i] < bdist)
    		{
    			bdist = dist[i];
    			best = i;
    		}
    	}
    	if (best == 0) return new vector3( -1, 0, 0 );
    	else if (best == 1) return new vector3( 1, 0, 0 );
    	else if (best == 2) return new vector3( 0, -1, 0 );
    	else if (best == 3)  return new vector3( 0, 1, 0 );
    	else if (best == 4) return new vector3( 0, 0, -1 );
    	else return new vector3( 0, 0, 1 );
    }
    
    // @param {vector3} a_Pos
    // @return {Boolean}
    this.Contains = function(a_Pos) { return this.m_Box.Contains(a_Pos); }
    
    // @return {vector3} position of this box
    this.GetPos = function() { return this.m_Box.GetPos(); }
    
    // @return {vector3} size of this box
    this.GetSize = function() { return this.m_Box.GetSize(); }
    
    // @param {int} a_Idx
    // @return {float} 
    this.GetGridX = function(a_Idx) { return this.m_Grid[a_Idx << 1]; }
    
    // @param {int} a_Idx
    // @return {float}
    this.GetGridY = function(a_Idx) { return this.m_Grid[(a_Idx << 1) + 1]; }
    
    // @param {Boolean} a_Light
    this.Light = function(a_Light) {
    	this.m_Light = a_Light;
    	if(!this.m_Grid)
    	{
    		this.m_Grid = new Array(32);
    		this.m_Grid[ 0] = 1;
    		this.m_Grid[ 1] = 2;
    		this.m_Grid[ 2] = 3;
    		this.m_Grid[ 3] = 3;
    		this.m_Grid[ 4] = 2;
    		this.m_Grid[ 5] = 0;
    		this.m_Grid[ 6] = 0;
    		this.m_Grid[ 7] = 1;
    		this.m_Grid[ 8] = 2;
    		this.m_Grid[ 9] = 3;
    		this.m_Grid[10] = 0;
    		this.m_Grid[11] = 3;
    		this.m_Grid[12] = 0;
    		this.m_Grid[13] = 0;
    		this.m_Grid[14] = 2;
    		this.m_Grid[15] = 2;
    		this.m_Grid[16] = 3;
    		this.m_Grid[17] = 1;
    		this.m_Grid[18] = 1;
    		this.m_Grid[19] = 3;
    		this.m_Grid[20] = 1;
    		this.m_Grid[21] = 0;
    		this.m_Grid[22] = 3;
    		this.m_Grid[23] = 2;
    		this.m_Grid[24] = 2;
    		this.m_Grid[25] = 1;
    		this.m_Grid[26] = 3;
    		this.m_Grid[27] = 0;
    		this.m_Grid[28] = 1;
    		this.m_Grid[29] = 1;
    		this.m_Grid[30] = 0;
    		this.m_Grid[31] = 2;
    		for ( var i = 0; i < 16; i++ )
    		{
    			this.m_Grid[i * 2] = this.m_Grid[i * 2] * this.m_Box.GetSize().x / 4 + this.m_Box.GetPos().x;
    			this.m_Grid[i * 2 + 1] = this.m_Grid[i * 2 + 1] * this.m_Box.GetSize().z / 4 + this.m_Box.GetPos().z;
    		}
    	}
    }
    
    // @return {aabb}
    this.GetAABB = function() { return this.m_Box; }
    
    // @return {int} ray id
    this.GetLastRayID = function() { return m_RayID; }
    
}

//#############################################################################
//class Scene
function Scene() {
    // default constructor
    this.m_Primitives = 0;
    this.m_Primtive = 0;

    // init scene
    this.InitScene = function () {
        Sphere.prototype = new Primitive(); // set parent
        Triangle.prototype = new Primitive(); // set parent
        PlanePrim.prototype = new Primitive(); // set parent

        this.m_Primitive = new Array(500);
        
        var prim = 0;
        // ground plane
        this.m_Primitive[prim] = new PlanePrim(new vector3(0, 1, 0), 4.4);
        this.m_Primitive[prim].prototype = new Primitive();
        this.m_Primitive[prim].SetName("plane");
        this.m_Primitive[prim].GetMaterial().SetReflection(0);
        this.m_Primitive[prim].GetMaterial().SetRefraction(0);
        this.m_Primitive[prim].GetMaterial().SetDiffuse(1);
        this.m_Primitive[prim++].GetMaterial().SetColor(new vector3(0.3, 0.4, 0.4));
//		this.m_Primitive[0].GetMaterial().SetTexture(new Texture( "textures/wood.tga" ));
        
        // big sphere
        //this.m_Primitive[1] = new Sphere(new vector3(2, 0.8, 3), 2.5);
        this.m_Primitive[prim] = new Sphere(new vector3(0.5, 0, 3), 1.5);
        this.m_Primitive[prim].SetName("center sphere");
        this.m_Primitive[prim].GetMaterial().SetReflection(0.2);
        this.m_Primitive[prim].GetMaterial().SetRefraction(0.2);
        this.m_Primitive[prim].GetMaterial().SetRefrIndex(1.5);
        this.m_Primitive[prim++].GetMaterial().SetColor(new vector3(0.3, 0.7, 0.7));
//		this.m_Primitive[1].GetMaterial().SetTexture(new Texture( "textures/marble.tga" ));
        // small sphere
        //this.m_Primitive[2] = new Sphere(new vector3(-5.5, -0.5, 7), 2);
        this.m_Primitive[prim] = new Sphere(new vector3(-5, 0, 4), 1.5);
        this.m_Primitive[prim].SetName("left sphere");
        this.m_Primitive[prim].GetMaterial().SetReflection(0.5);
        this.m_Primitive[prim].GetMaterial().SetRefraction(0.2);
        this.m_Primitive[prim].GetMaterial().SetRefrIndex(1.1);
        this.m_Primitive[prim].GetMaterial().SetDiffuse(0.1);
        this.m_Primitive[prim++].GetMaterial().SetColor(new vector3(0.7, 0.7, 1.0));
//		this.m_Primitive[2].GetMaterial().SetTexture(new Texture( "textures/marble.tga" ));
        // light source 1
				if(USE_L1){
        	this.m_Primitive[prim] = new Sphere(new vector3(0, 5, 5), 0.1);
        	this.m_Primitive[prim].Light(new Boolean(true));
        	this.m_Primitive[prim++].GetMaterial().SetColor(new vector3(0.4, 0.4, 0.4));
				}
        // light source 2
				if(USE_L2){
					this.m_Primitive[prim] = new Sphere(new vector3(-3, 5, 1), 0.1);
					this.m_Primitive[prim].Light(new Boolean(true));
					this.m_Primitive[prim++].GetMaterial().SetColor(new vector3(0.6, 0.6, 0.8));
				}
				if(USE_L3){
					this.m_Primitive[prim] = new Sphere(new vector3(5, 0, 1), 0.1);
					this.m_Primitive[prim].Light(new Boolean(true));
					this.m_Primitive[prim++].GetMaterial().SetColor(new vector3(0.8, 0.2, 0.1));
				}
        // extra sphere
        //this.m_Primitive[5] = new Sphere(new vector3(-2, -3.8, 1), 1.5);
        this.m_Primitive[prim] = new Sphere(new vector3(3, 4, 5),4.5);
        this.m_Primitive[prim].SetName("right sphere");
        this.m_Primitive[prim].GetMaterial().SetReflection(0.2);
        this.m_Primitive[prim].GetMaterial().SetRefraction(0.8);
        this.m_Primitive[prim++].GetMaterial().SetColor(new vector3(1.0, 0.4, 0.4));
        // back plane
        this.m_Primitive[prim] = new PlanePrim(new vector3(-0.5, 0.7, -1), 12);
        this.m_Primitive[prim].SetName("back plane");
        this.m_Primitive[prim].GetMaterial().SetReflection(0);
        this.m_Primitive[prim].GetMaterial().SetRefraction(0);
        this.m_Primitive[prim].GetMaterial().SetSpecular(0);
        this.m_Primitive[prim].GetMaterial().SetDiffuse(0.6);
        this.m_Primitive[prim++].GetMaterial().SetColor(new vector3(0.2, 0.7, 0.7));
//		this.m_Primitive[6].GetMaterial().SetTexture(new Texture( "textures/wood.tga" ));
        // ceiling plane
        this.m_Primitive[prim] = new PlanePrim(new vector3(0, -1, 0), 7.4);
        this.m_Primitive[prim].SetName("back plane");
        this.m_Primitive[prim].GetMaterial().SetReflection(0);
        this.m_Primitive[prim].GetMaterial().SetRefraction(0);
        this.m_Primitive[prim].GetMaterial().SetSpecular(0);
        this.m_Primitive[prim].GetMaterial().SetDiffuse(0.5);
        this.m_Primitive[prim++].GetMaterial().SetColor(new vector3(0.4, 0.7, 0.7));
//		this.m_Primitive[7].GetMaterial().SetTexture(new Texture( "textures/wood.tga" ));
        
        // extra sphere
        this.m_Primitive[prim] = new Sphere(new vector3(-1.5, -4, 1),2);
        this.m_Primitive[prim].SetName("right sphere");
        this.m_Primitive[prim].GetMaterial().SetReflection(0.3);
        this.m_Primitive[prim].GetMaterial().SetRefraction(0.8);
        this.m_Primitive[prim].GetMaterial().SetSpecular(0.1);
        this.m_Primitive[prim++].GetMaterial().SetColor(new vector3(1.0, 0.4, 0.4));
        
        
        //grid
        //var prim = 9;
				if(USE_GRID_SPHERE)
				{
					for (x = 0; x < 10; x++) {
						for (y = 0; y < 3; y++) {
							this.m_Primitive[prim] = new Sphere(new vector3(-10 + x * 1.5,  y * 1.5, 10), 0.3);
							this.m_Primitive[prim].SetName("grid sphere");
							this.m_Primitive[prim].GetMaterial().SetReflection(0);
							this.m_Primitive[prim].GetMaterial().SetRefraction(0);
							this.m_Primitive[prim].GetMaterial().SetSpecular(0.6);
							this.m_Primitive[prim].GetMaterial().SetDiffuse(0.6);
							this.m_Primitive[prim].GetMaterial().SetColor(new vector3(0.2+Rand(0.6),0.2+Rand(0.6), 0.6+Rand(0.4)));
							prim++;
						}
					}
				}
				
				if(USE_POLYGON)
				{
					// Triangle 
					//x					y					z					nx				ny				nz				u					v
					//	var tri_data = ["2.400000	2.250000	1.000000	0.902861	-0.429934	0.000000	0.000000	0.000000",
					//			 					 "-1.291500	1.250000	0.549500	0.833024	-0.430810	-0.347093	0.250000	0.000000",
					//									"0.273482	-0.323828	2.541834	0.918898	0.095044	-0.382874	0.250000	0.250000"];
					//@param {float} x,y,z,scale,offset,u,v

					var asc = getASC();
					var lines = asc.split(/\r\n|\r|\n/);
					var scale = 1.0,offset = 0.0;
					//console.log("Total line of polygon is "+lines.length);
					for(var t = 0;t< lines.length;t++)			
					{
						var line = lines[t];
						if(line == 'triangle'){
							//@param {Vertex} v1,v2,v3
							var v1 = new Vertex(lines[t+1],0,0,scale,offset);
							var v2 = new Vertex(lines[t+2],0,0,scale,offset);
							var v3 = new Vertex(lines[t+3],0,0,scale,offset);

							this.m_Primitive[prim] = new Triangle(v1,v2,v3);
							this.m_Primitive[prim].SetName("Triangle");
							this.m_Primitive[prim].GetMaterial().SetReflection(0.2);
							this.m_Primitive[prim].GetMaterial().SetRefraction(0.8);
							this.m_Primitive[prim].GetMaterial().SetRefrIndex(1.3);
							this.m_Primitive[prim++].GetMaterial().SetColor(new vector3(0.7, 0.7, 1.0));
							//console.log("Prims is "+prim);
						}
					}
				}//if USE_POLYGON
		
				console.log("Finish Load All prims "+prim);
        this.m_Primitives = prim;
        
        /*
        for(i = 0; i < 8; i++)
        	console.log(i + " " + this.GetPrimitive(i).toString());
        */
    }

    // @return {float} number of primitives in this scene
    this.GetNrPrimitives = function () { return this.m_Primitives; }

    // @return {Array} array containing all the primitives in this scene
    this.GetPrimitive = function (a_Idx) { return this.m_Primitive[a_Idx]; }

    this.toString = function () {
        var result = "Number of primitives: " + this.GetNrPrimitives() + " Primitives: ";
        for (i = 0; i < this.GetNrPrimitives(); i = i + 1) {
            result += this.GetPrimitive(i).toString() + " ";
        }
        return result;
    }
}
//#############################################################################
// @param {vector3} a_Origin a_Direction
// @param {int} a_ID
// class Ray
function Ray(a_Origin, a_Direction, a_ID)
{
	//default constructor
	if(typeof(a_Origin) == "undefined") {	
											this.m_Origin = new vector3( 0, 0, 0 );
											this.m_Direction = new vector3(0, 0, 0);
                                            this.m_ID = 0;
										}										
	//constructor
	else	{ 
				this.m_Origin = a_Origin; 
				this.m_Direction = a_Direction;
				this.m_ID = a_ID;
			}

	
	//@param {vector3} a_Origin
	this.SetOrigin = function( a_Origin) { this.m_Origin = a_Origin;}

	//@param {vector3} a_Origin
	this.SetDirection = function( a_Direction) { this.m_Direction = a_Direction;}

	this.GetOrigin = function() { return this.m_Origin;}

	this.GetDirection = function() { return this.m_Direction;}

	// @param {int} a_ID
	this.SetID = function(a_ID){ this.m_ID = a_ID; }
	
	// @return {int} ID of this ray
	this.GetID = function(){ return this.m_ID; }
	
	//@param {vector3}
	var m_Origin = new vector3();
	//@param {vector3}
	var m_Direction = new vector3();
}


// class Engine
function Engine()
{
	console.log("Create Engine");
	//default constructor
	this.m_Scene = new Scene();
	this.m_Scene.InitScene();

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
	//@param {int} a_Depth
	//@param {float} a_RIndex 
	//@return[0] {int} normal return
	//@return[1] {Color} a_Acc 
	//@return[2] {float} a_Dist
	this.Raytrace = function( a_Ray, a_Depth, a_RIndex ) 
	{							



		var ret = new Array(3);	
		var a_Acc = new vector3();
		if(a_Depth > TRACEDEPTH) {ret[0] = 0;return ret;}

		//a_Depth = 1000000.0;
		var a_Dist = 1000000.0;
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
			//console.log("pr is "+pr.toString());
			//console.log("ray is "+a_Ray.m_Origin.toString()+"  Dir:"+a_Ray.m_Direction.toString());
			// @param [0] {int} [1] {float}
			var res = pr.Intersect(a_Ray, a_Dist);
			
			if(res[0] != 0)
			{
				a_Dist = res[1];
				prim = pr;
				result = res[0]; 
			}
		}

		if (!prim) { ret[0] = 0; ret[1] = a_Acc; ret[2] = a_Dist; return ret; };

		//check prim
		//console.log("Trace Prim "+prim.toString());
		
		if (prim.IsLight())
		{
			a_Acc = new vector3( 1, 1, 1 );
		}
		else
		{
			// determine color at point of intersection
			pi = a_Ray.GetDirection().Mul(a_Dist).Add(a_Ray.GetOrigin());
			// trace lights
			for ( var l = 0; l < this.m_Scene.GetNrPrimitives(); l++ )
			{
				//@param {Primitive}
				var p = this.m_Scene.GetPrimitive( l );
				
				if (p.IsLight()) 
				{
					//@param {Primitive}
					var light = p;
					
					// handle point light source
					//@param {float}
					var shade = 1.0;
					
					if (USE_SHADOW)
					{
						if (light.GetType() == 1) // SPHERE
						{
							//@param {vector3}
							var L = light.GetCentre().Sub(pi);
							//@param {float}
							var tdist = LENGTH( L );
							L = L.Mul( 1.0 / tdist );
							//@param {Ray}
							var r = new Ray( pi.Add(L.Mul(EPSILON)), L );
							for ( var s = 0; s < this.m_Scene.GetNrPrimitives(); s++ )
							{
								//@param {Primitive}
								var pr = this.m_Scene.GetPrimitive( s );
								var ret1 = pr.Intersect(r, tdist);
	
								if((pr != light) && (ret1[0]))
								{
									shade = 0;
									break;
								}
							}
						}
					}
					if (shade > 0)
					{
						// calculate diffuse shading
						//@param {vector3}
						var L = light.GetCentre().Sub(pi);
						L.Normalize();
						//@param {vector3}
						var N = prim.GetNormal( pi );
						if (prim.GetMaterial().GetDiffuse() > 0)
						{
							//@param {float}
							var dot = DOT( N, L );
							if (dot > 0)
							{
								//@param {float}
								var diff = dot * prim.GetMaterial().GetDiffuse() * shade;
								// add diffuse component to ray color
								a_Acc = a_Acc.Add( (prim.GetMaterial().GetColor().Mul(light.GetMaterial().GetColor())).Mul(diff)); 
							}
						}
						
						if(USE_SPECULAR)
						{
							// determine specular component
							if(prim.GetMaterial().GetSpecular() > 0)
							{
								// @param {vector3}
								var V = a_Ray.GetDirection();
								// @param {vector3}
								var R = L.Sub(N.Mul(2.0 * DOT(L, N)));
								R.Normalize();
								// @param {float}
								var dot = DOT(V, R);
								if(dot > 0)
								{
									// @param {float}
									var spec = Math.pow( dot, 20) * prim.GetMaterial().GetSpecular() * shade;
									a_Acc = a_Acc.Add(light.GetMaterial().GetColor().Mul(spec));
								}
							}
						}
					} // end of if shade > 0
				} // end of if p is light
			} // end of for loop
		}
		// calculate reflection
		if(USE_REFLECTION)
		{
			//@param {float}
			var refl = prim.GetMaterial().GetReflection();
				
			if ((refl > 0.0) && (a_Depth < TRACEDEPTH))
			{
				//@param {vector3}
				var N = prim.GetNormal( pi );
				var R = a_Ray.GetDirection().Sub(N.Mul(2.0 * DOT(a_Ray.GetDirection(), N)));
				var rcol = new vector3( 0, 0, 0 );
				//@param {float}
				//var dist;
				var ret = this.Raytrace( new Ray( pi.Add(R.Mul(EPSILON)), R ), a_Depth + 1, a_RIndex);
				rcol = ret[1];
				a_Acc = a_Acc.Add((prim.GetMaterial().GetColor()).Mul(rcol.Mul(refl)));
			}
		}
		// calculate refraction
		if(USE_REFRACTION)
		{
			//@param {float}
			var refr = prim.GetMaterial().GetRefraction();
			if ((refr > 0) && (a_Depth < TRACEDEPTH))
			{
				//@param {float}
				var rindex = prim.GetMaterial().GetRefrIndex();
				var n = a_RIndex / rindex;
				//@param {vector3}
				var N = prim.GetNormal( pi ).Mul(result);
				//@param {float}
				var cosI = -DOT( N, a_Ray.GetDirection() );
				var cosT2 = 1.0 - n * n * (1.0 - cosI * cosI);
				
				if (cosT2 > 0.0)
				{
					//@param {vector3}
					var T = (a_Ray.GetDirection().Mul(n)).Add(N.Mul(n * cosI - Math.sqrt( cosT2 )));
					var rcol = new vector3( 0, 0, 0 );
					//@param {float}
					var dist;
					var ret = this.Raytrace( new Ray( pi.Add(T.Mul(EPSILON)), T ), a_Depth + 1, rindex);
					rcol = ret[1];
					dist = ret[2];
					// apply Beer's law
					// @param {vector3}
					var absorbance = (prim.GetMaterial().GetColor().Mul(0.15)).Mul(-dist);
					var transparancy = new vector3(Math.exp(absorbance.x), Math.exp(absorbance.y), Math.exp(absorbance.z));
					a_Acc = a_Acc.Add(rcol.Mul(transparancy));
				}
			}
		}
		//console.log("Color in Raytrace "+a_Acc.toString());
		ret[0] = prim;
		ret[1] = a_Acc;
		ret[2] = a_Dist;
		return ret;
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
		var msecs = date.getTime();
		//@param {Primitive}
		var lastprim = 0;
		// render remaining lines
		for ( var y = this.m_CurrLine; y < (this.m_Height - 20); y++ )
		{
			//console.log("currLine="+this.m_CurrLine+" y="+y+" Height="+this.m_Height);
			this.m_SX = this.m_WX1;
			// render pixels for current line
			for ( var x = 0; x < this.m_Width; x++ )
			{
				//@param {vector3}
				var acc = new vector3( 0, 0, 0 );
				//@param {vector3}
				var dir = new vector3( this.m_SX, this.m_SY, 0 ).Sub(o);
				var nDir = NORMALIZE( dir );
				//@param {Ray}
				var r = new Ray( o, nDir );
        
				//@param {float}
				var dist;
				//@param {Primitive}
				var ret = this.Raytrace( r, 1, 1.0 );
				prim = ret[0];
				
				if(prim != 0)
				{
					acc = ret[1];
					//console.log("Ray acc"+ acc.toString());
					dist = ret[2];
				}
				
				//@param {int}
				var red;
				var green;
				var blue;
			
				if(prim != lastprim)
				{
					lastprim = prim;
					//@param {vector3}
					var acc = new vector3( 0, 0, 0 );
					for ( var tx = -1; tx < 2; tx++ ) for ( var ty = -1; ty < 2; ty++ )
					{
						//@param {vector3}
						var dir = new vector3( this.m_SX + this.m_DX * tx / 2.0, this.m_SY + this.m_DY * ty / 2.0, 0 ).Sub(o);
						var n_Dir = NORMALIZE( dir );
						//@param {Ray}
						var r = new Ray( o, n_Dir );
						//@param {float}
						var dist;
						//@param {Primitive}
						var prim = this.Raytrace( r, 1, 1.0);
					}
					red = acc.x * (256 / 9);
					green = acc.y * (256 / 9);
					blue = acc.z * (256 / 9);
				}
				else
				{
					red = acc.x * 256;
					green = acc.y * 256;
					blue = acc.z * 256;
				}
				if (red > 255) red = 255;
				if (green > 255) green = 255;
				if (blue > 255) blue = 255;
				
				var cc = new Color( red, green, blue);
				//console.log("X:"+x+" y:"+y+" col"+cc.toString);
				setPixel(imageData, x, y, cc);
				this.m_SX += this.m_DX;
			}
			this.m_SY += this.m_DY;
      date = new Date();
			if ((date.getTime() - msecs) > 100) 
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

//#############################################################################
// @param {image} imageData
// @param {int} x,y
// @return {Color} col
function setPixel(imageData, x, y, col) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = col.r;
    imageData.data[index + 1] = col.g;
    imageData.data[index + 2] = col.b;
    imageData.data[index + 3] = col.a;
}

