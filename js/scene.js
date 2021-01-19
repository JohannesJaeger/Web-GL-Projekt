async function addObjects() {
    // Create static plane
    vbo.addObject(new RenderObject(shaders.get("phong"), function(object) {
        new CommonObject(object).cuboid(vec3.fromValues(-5, -0.1, -5), vec3.fromValues(5, 0, 5), -1)
    }, function(shader, time) {
        defaultModelViewProjection(shader, null)

        phongUniforms(shader, {
            lightAmbient: [0.5, 0.5, 0.5, 1],
            lightDiffuse: [0.5, 0.5, 0.5, 1],
            lightSpecular: [1, 1, 1, 1],

            matEmissive: [0, 0, 0, 1],
            matAmbient: [0.05, 0.05, 0.07, 0.8],
            matDiffuse: [0.18, 0.17, 0.23, 0.8],
            matSpecular: [0.33, 0.33, 0.35, 0.8],
            matShininess: [38.4],
        })
    }))

    // Create static cylinder
    vbo.addObject(new RenderObject(shaders.get("phong"), function(object) {
        new CommonObject(object).cylinder(1, 1, 1024, -1)
    }, function(shader, time) {
        defaultModelViewProjection(shader, function(model) {
            mat4.translate(model, model, vec3.fromValues(2, 0.5, 2))
        })

        phongUniforms(shader, {
            lightAmbient: [0.5, 0.5, 0.5, 1],
            lightDiffuse: [0.5, 0.5, 0.5, 1],
            lightSpecular: [1, 1, 1, 1],

            matEmissive: [0, 0, 0, 1],
            matAmbient: [0.21, 0.13, 0.05, 1],
            matDiffuse: [0.71, 0.43, 0.18, 1],
            matSpecular: [0.39, 0.27, 0.17, 1],
            matShininess: [25.6],
        })
    }))

    // Create static cone
    vbo.addObject(new RenderObject(shaders.get("phong"), function(object) {
        new CommonObject(object).cone(1, 1, 1024, -1)
    }, function(shader, time) {
        defaultModelViewProjection(shader, function(model) {
            mat4.translate(model, model, vec3.fromValues(-2, 0.5, 2))
        })

        phongUniforms(shader, {
            lightAmbient: [0.5, 0.5, 0.5, 1],
            lightDiffuse: [0.5, 0.5, 0.5, 1],
            lightSpecular: [1, 1, 1, 1],

            matEmissive: [0, 0, 0, 1],
            matAmbient: [0.25, 0.21, 0.21, 0.9],
            matDiffuse: [0.99, 0.83, 0.83, 0.9],
            matSpecular: [0.30, 0.30, 0.30, 0.9],
            matShininess: [11.3],
        })
    }))

    // Create static cube
    vbo.addObject(new RenderObject(shaders.get("phong"), function(object) {
        new CommonObject(object).cube(0.5, -1)
    }, function(shader, time) {
        defaultModelViewProjection(shader, function(model) {
            mat4.translate(model, model, vec3.fromValues(2, 0.5, -2))
        })

        phongUniforms(shader, {
            lightAmbient: [0.5, 0.5, 0.5, 1],
            lightDiffuse: [0.5, 0.5, 0.5, 1],
            lightSpecular: [1, 1, 1, 1],

            matEmissive: [0, 0, 0, 1],
            matAmbient: [0.25, 0.25, 0.25, 1],
            matDiffuse: [0.40, 0.40, 0.40, 1],
            matSpecular: [0.77, 0.77, 0.77, 1],
            matShininess: [76.8],
        })
    }))

    // Create static sphere
    vbo.addObject(new RenderObject(shaders.get("phong-sphere"), function(object) {
        new CommonObject(object).cube(0.5, 3)
    }, function(shader, time) {
        defaultModelViewProjection(shader, function(model) {
            mat4.translate(model, model, vec3.fromValues(-2, 0.5, -2))
            mat4.scale(model, model, vec3.fromValues(0.5, 0.5, 0.5))
        })

        phongUniforms(shader, {
            lightAmbient: [0.5, 0.5, 0.5, 1],
            lightDiffuse: [0.5, 0.5, 0.5, 1],
            lightSpecular: [1, 1, 1, 1],

            matEmissive: [0, 0, 0, 1],
            matAmbient: [0.25, 0.21, 0.21, 0.9],
            matDiffuse: [0.99, 0.83, 0.83, 0.9],
            matSpecular: [0.30, 0.30, 0.30, 0.9],
            matShininess: [11.3],
        })
    }))

    // Create sphere that will be rendered after camera animation is ready
    vbo.addObject(new RenderObject(shaders.get("phong-sphere"), function(object) {
        new CommonObject(object).cube(0.5, 3)
    }, function(shader, time) {
        defaultModelViewProjection(shader, function(model) {
            mat4.scale(model, model, vec3.fromValues(0.5, 0.2, 0.5))
            
            let factor = time
            let upDown = Math.cos(factor / 800) * 3

            mat4.translate(model, model, vec3.fromValues(0, upDown + 4, 0))
            mat4.rotate(model, model, upDown, vec3.fromValues(1, 0, 0))
        })

        phongUniforms(shader, {
            lightAmbient: [0.5, 0.5, 0.5, 1],
            lightDiffuse: [0.5, 0.5, 0.5, 1],
            lightSpecular: [1, 1, 1, 1],

            matEmissive: [0, 0, 0, 1],
            matAmbient: [0.25, 0.22, 0.06, 1],
            matDiffuse: [0.35, 0.31, 0.9, 1],
            matSpecular: [0.8, 0.72, 0.21, 1],
            matShininess: [83.2],
        })
    }))

    // Create rotating triangle
    vbo.addObject(new RenderObject(shaders.get("toon"), function(object) {
        new CommonObject(object).triangle(vec3.fromValues(-1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(1, 0, 0))
    }, function(shader, time) {
        defaultModelViewProjection(shader, function(model) {          
            let factor = time
            mat4.translate(model, model, vec3.fromValues(2, 1, 2))
            mat4.rotate(model, model, factor / 1000, vec3.fromValues(0, 1, 0))
        })
    }))

    // Create rotating triangle
    vbo.addObject(new RenderObject(shaders.get("toon"), function(object) {
        new CommonObject(object).triangle(vec3.fromValues(-1, 1, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 0))
    }, function(shader, time) {
        defaultModelViewProjection(shader, function(model) {          
            let factor = time
            mat4.translate(model, model, vec3.fromValues(-2, 1, 2))
            mat4.rotate(model, model, factor / 1000, vec3.fromValues(0, 1, 0))
        })
    }))

    // Create rocket
    vbo.addObject(new RenderObject(shaders.get("phong"), function(object) {
        new CommonObject(object).cube(0.5, -1)
    }, function(shader, time) {
        defaultModelViewProjection(shader, function(model) {          
            let factor = time
            let upDown = Math.cos(factor / 1500) * 3
            mat4.translate(model, model, vec3.fromValues(0, upDown + 4, 0))
            mat4.rotate(model, model, upDown, vec3.fromValues(0, 1, 0))
            mat4.translate(model, model, vec3.fromValues(0, 2, 6))

            mat4.translate(model, model, vec3.fromValues(1, 0.75, 0))
            mat4.rotate(model, model, glMatrix.toRadian(45), vec3.fromValues(0, 1, 0))
            mat4.scale(model, model, vec3.fromValues(0.5, 0.5, 0.5))
        })

        phongUniforms(shader, {
            lightAmbient: [0.5, 0.5, 0.5, 1],
            lightDiffuse: [0.5, 0.5, 0.5, 1],
            lightSpecular: [1, 1, 1, 1],

            matEmissive: [0, 0, 0, 1],
            matAmbient: [0.25, 0.25, 0.25, 1],
            matDiffuse: [0.40, 0.40, 0.40, 1],
            matSpecular: [0.77, 0.77, 0.77, 1],
            matShininess: [76.8],
        })
    }))

    vbo.addObject(new RenderObject(shaders.get("phong"), function(object) {
        new CommonObject(object).cylinder(1, 2, 128, -1)
    }, function(shader, time) {
        defaultModelViewProjection(shader, function(model) {          
            let factor = time
            let upDown = Math.cos(factor / 1500) * 3
            mat4.translate(model, model, vec3.fromValues(0, upDown + 4, 0))
            mat4.rotate(model, model, upDown, vec3.fromValues(0, 1, 0))
            mat4.translate(model, model, vec3.fromValues(0, 2, 6))

            mat4.translate(model, model, vec3.fromValues(1, 0, 0))
            mat4.scale(model, model, vec3.fromValues(0.5, 0.5, 0.5))
        })

        phongUniforms(shader, {
            lightAmbient: [0.5, 0.5, 0.5, 1],
            lightDiffuse: [0.5, 0.5, 0.5, 1],
            lightSpecular: [1, 1, 1, 1],

            matEmissive: [0, 0, 0, 1],
            matAmbient: [0.25, 0.21, 0.21, 0.9],
            matDiffuse: [0.99, 0.83, 0.83, 0.9],
            matSpecular: [0.30, 0.30, 0.30, 0.9],
            matShininess: [11.3],
        })
    }))

    vbo.addObject(new RenderObject(shaders.get("phong"), function(object) {
        new CommonObject(object).cone(1, 3, 128, -1)
    }, function(shader, time) {
        defaultModelViewProjection(shader, function(model) {          
            let factor = time
            let upDown = Math.cos(factor / 1500) * 3
            mat4.translate(model, model, vec3.fromValues(0, upDown + 4, 0))
            mat4.rotate(model, model, upDown, vec3.fromValues(0, 1, 0))
            mat4.translate(model, model, vec3.fromValues(0, 2, 6))

            mat4.translate(model, model, vec3.fromValues(1, 1, 0))
            mat4.rotate(model, model, glMatrix.toRadian(180), vec3.fromValues(1, 0, 1))
            mat4.scale(model, model, vec3.fromValues(0.5, 0.5, 0.5))
        })

        phongUniforms(shader, {
            lightAmbient: [0.5, 0.5, 0.5, 1],
            lightDiffuse: [0.5, 0.5, 0.5, 1],
            lightSpecular: [1, 1, 1, 1],

            matEmissive: [0, 0, 0, 1],
            matAmbient: [0.21, 0.13, 0.05, 1],
            matDiffuse: [0.71, 0.43, 0.18, 1],
            matSpecular: [0.39, 0.27, 0.17, 1],
            matShininess: [25.6],
        })
    }))

    vbo.addObject(new RenderObject(shaders.get("phong"), function(object) {
        new CommonObject(object).cone(1, 3, 128, -1)
    }, function(shader, time) {
        defaultModelViewProjection(shader, function(model) {          
            let factor = time
            let upDown = Math.cos(factor / 1500) * 3
            mat4.translate(model, model, vec3.fromValues(0, upDown + 4, 0))
            mat4.rotate(model, model, upDown, vec3.fromValues(0, 1, 0))
            mat4.translate(model, model, vec3.fromValues(0, 2, 6))

            mat4.translate(model, model, vec3.fromValues(1, -0.65, 0))
            mat4.rotate(model, model, glMatrix.toRadian(180), vec3.fromValues(1, 0, 1))
            mat4.scale(model, model, vec3.fromValues(0.5, 0.1, 0.5))
        })

        phongUniforms(shader, {
            lightAmbient: [0.5, 0.5, 0.5, 1],
            lightDiffuse: [0.5, 0.5, 0.5, 1],
            lightSpecular: [1, 1, 1, 1],

            matEmissive: [0, 0, 0, 1],
            matAmbient: [0.05, 0.05, 0.07, 0.8],
            matDiffuse: [0.18, 0.17, 0.23, 0.8],
            matSpecular: [0.33, 0.33, 0.35, 0.8],
            matShininess: [38.4],
        })
    }))
}