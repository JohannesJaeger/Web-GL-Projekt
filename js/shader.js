ShaderProgram.load = function (gl, vertexShaderUrl, fragmentShaderUrl) {
    return Promise.all([loadFile(vertexShaderUrl), loadFile(fragmentShaderUrl)]).then(function (files) {
      let shader = new ShaderProgram(gl, files[0], files[1])
      shader.loadLocs()
      return shader
    })
  
    function loadFile (url) {
        return new Promise(function (resolve) {
            var xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    resolve(xhr.responseText)
                }
            }
            xhr.open("GET", url, true)
            xhr.send(null)
        })
    }
}

function ShaderProgram (gl, vertexShaderSrc, fragmentShaderSrc) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertexShaderSrc)
    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vertexShader))
        throw new Error("Failed to compile vertex shader")
    }
  
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fragmentShaderSrc)
    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fragmentShader))
        throw new Error('Failed to compile fragment shader')
    }
  
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program))
        throw new Error("Failed to link program")
    }

    this.gl = gl
    this.program = program
    this.locs = new Locs()
}
  
ShaderProgram.prototype.getUniformLocation = function (name) {
    return this.gl.getUniformLocation(this.program, name)
}

ShaderProgram.prototype.getAttribLocation = function (name) {
    return this.gl.getAttribLocation(this.program, name)
}

ShaderProgram.prototype.loadLocs = function() {
    this.locs.vertex = this.getAttribLocation("vertex")
    this.locs.normal = this.getAttribLocation("normal")

    this.locs.modelViewProjection = this.getUniformLocation("matrices.mvp")
    this.locs.normalMatrix = this.getUniformLocation("matrices.normal")
    this.locs.modelView = this.getUniformLocation("matrices.mv")
    this.locs.lightPos = this.getUniformLocation("light.lightPos")

    this.locs.matEmissive = this.getUniformLocation("material.emission")
    this.locs.matAmbient = this.getUniformLocation("material.ambient")
    this.locs.matDiffuse = this.getUniformLocation("material.diffuse")
    this.locs.matSpecular = this.getUniformLocation("material.specular")
    this.locs.matShininess = this.getUniformLocation("material.shininess")

    this.locs.lightAmbient = this.getUniformLocation("lightsource.ambient")
    this.locs.lightDiffuse = this.getUniformLocation("lightsource.diffuse")
    this.locs.lightSpecular = this.getUniformLocation("lightsource.specular")

    this.locs.color = this.getUniformLocation("color")
}

ShaderProgram.prototype.use = function () {
    this.gl.useProgram(this.program)
}
  