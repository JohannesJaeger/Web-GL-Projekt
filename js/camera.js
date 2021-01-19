function Camera () {
    this.position = vec3.fromValues(0, 0, 0)
    this.target = vec3.fromValues(0, 0, -1)
    this.up = vec3.fromValues(0, 1, 0)
    this.upOrientation = 0;
}

Camera.prototype.adjustUp = function () {
    let left
    let yVec = vec3.fromValues(0, 1, 0)

    let delta = vec3.subtract(vec3.create(), this.target, this.position)
    vec3.normalize(delta, delta)

    if(delta == yVec) {
        this.up = vec3.fromValues(0, 0, 1)
    } else if(delta == -yVec) {
        this.up = vec3.fromValues(0, 0, 1)
    } else {
        left = vec3.cross(vec3.create(), yVec, delta)
        vec3.normalize(left, left)

        this.up = vec3.cross(vec3.create(), delta, left)
        vec3.normalize(this.up, this.up)
    }

    if(this.upOrientation != 0) {
        let axis = vec3.subtract(vec3.create(), this.target, this.position)
        let rotation = mat3.fromRotation(mat3.create(), upOrientation, axis)

        this.up = vec3.transformMat4(this.up, this.up, rotation)
    }
}

Camera.prototype.moveTo = function (position) {
    this.position = position
}

Camera.prototype.moveForward = function (delta) {
    let forward = vec3.subtract(vec3.create(), this.target, this.position)
    
    vec3.scaleAndAdd(this.position, this.position, forward, delta)
    vec3.scaleAndAdd(this.target, this.target, forward, delta)
}

Camera.prototype.moveRight = function (delta) {
    this.adjustUp()
    
    let forward = vec3.subtract(vec3.create(), this.target, this.position)
    let right = vec3.cross(vec3.create(), forward, this.up)

    vec3.scaleAndAdd(this.position, this.position, right, -delta)
    vec3.scaleAndAdd(this.target, this.target, right, -delta)
}

Camera.prototype.setTarget = function (target) {
    this.target = target
}

Camera.prototype.setViewDirection = function (viewDirection) {
    this.target = vec3.add(vec3.create(), this.position, viewDirection)
}

Camera.prototype.setUpOrientation = function (orientation) {
    this.upOrientation = orientation
}

Camera.prototype.getViewMatrix = function () {
    let delta = vec3.subtract(vec3.create(), this.target, this.position)
    vec3.normalize(delta, delta)

    this.adjustUp()

    let s = vec3.cross(vec3.create(), delta, this.up)
    vec3.normalize(s, s)

    let u = vec3.cross(vec3.create(), s, delta)

    let m = mat4.fromValues(
        s[0],
        u[0],
        -delta[0],
        0,

        s[1],
        u[1],
        -delta[1],
        0,

        s[2],
        u[2],
        -delta[2],
        0,

        0,
        0,
        0,
        1
    )

    let t = mat4.create()
    let p = vec3.create()

    vec3.scale(p, this.position, -1)
    mat4.translate(t, t, p)

    mat4.multiply(m, m, t)

    return m
}