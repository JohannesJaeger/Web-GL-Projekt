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
    vec3 L = normalize(lightDir);
	vec3 N = normalize(normalVert);
    vec3 H = -normalize(viewDir);

    vec4 emissiv = material.emission;
    vec4 ambient = material.ambient * lightsource.ambient;

    float diffuseLight = max(dot(N, L), 0.0);
    vec4 diffuse = vec4(0.0, 0.0, 0.0, 1.0);
    if (diffuseLight > 0.0) {
        vec4 diff = material.diffuse * lightsource.diffuse;
        diffuse = diffuseLight * diff;
    }
    
    vec4 specular = vec4(0.0, 0.0, 0.0, 1.0);
    
    float specLight = pow(max(dot(H, N), 0.0), material.shininess);
    vec4 spec = material.specular * lightsource.specular;
    specular = specLight * spec;

    gl_FragColor = emissiv + ambient + diffuse + specular;
}
// =============================================================================================================