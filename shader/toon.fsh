#version 100

precision highp float;

// Structures
// =============================================================================================================
struct Matrices
{
	mat4 mvp;
	mat4 mv;
	mat3 normal;
};

struct Light
{
    vec3 lightPos;
};

struct Normalized
{
    vec3 normal;
    vec3 lightDir;
    vec3 viewDir;
};

struct MaterialParams
{
	vec4 emission;
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	float shininess;
};

struct LightParams
{
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
}; 

// =============================================================================================================

// Variables
// =============================================================================================================
varying vec3 normalVert;
varying vec3 mvPos;
varying vec3 lightDir;
varying vec3 viewDir;

uniform Matrices matrices;

uniform Light light;

uniform MaterialParams material;

uniform LightParams lightsource;

uniform vec4 color;
// =============================================================================================================

// Methods
// =============================================================================================================
void main()
{
    if(color.w > 0.0) {
        gl_FragColor = color;
    } else {
        Normalized n;
        n.viewDir = normalize(viewDir);
        n.lightDir = normalize(lightDir);
        n.normal = normalize(normalVert);

        float intensity = dot(n.lightDir, n.normal);

        vec4 toon = vec4(1.);

        if(abs(intensity) > .9)
            toon = vec4(1.);

        else if(abs(intensity) > .8)
            toon = vec4(.8);

        else if(abs(intensity) > .7)
            toon = vec4(.7);

        else if(abs(intensity) > .6)
            toon = vec4(.6);

        else if(abs(intensity) > .5)
            toon = vec4(.5);

        else if(intensity > .4)
            toon = vec4(.4);

        else if(intensity > .3)
            toon = vec4(.3);

        else
            toon = vec4(.2);

        toon.w = 1.;

        gl_FragColor = toon * vec4((normalVert * .5) + .5, 1);
    }
}
// =============================================================================================================