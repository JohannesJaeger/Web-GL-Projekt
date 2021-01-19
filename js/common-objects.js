function CommonObject (object) {
    this.object = object
}

CommonObject.prototype.triangle = function(vec_1, vec_2, vec_3) {
    let vec_1_3 = vec3.subtract(vec3.create(), vec_1, vec_2)
    let vec_2_3 = vec3.subtract(vec3.create(), vec_2, vec_3)

    let normal = vec3.cross(vec_1_3, vec_1_3, vec_2_3)
    vec3.normalize(normal, normal)
    vec3.negate(normal, normal)

    this.object.addVertex(vec_1, normal)
    this.object.addVertex(vec_2, normal)
    this.object.addVertex(vec_3, normal)
}

CommonObject.prototype.tesselateTriangle = function(vec_1, vec_2, vec_3, depth) {
    let vec_1_ = midpoint(vec_2, vec_3) 
    let vec_2_ = midpoint(vec_3, vec_1) 
    let vec_3_ = midpoint(vec_1, vec_2) 

    if(depth > 0) {
        depth--
        this.tesselateTriangle(vec_3_, vec_2, vec_1_, depth)
        this.tesselateTriangle(vec_2_, vec_1, vec_3_, depth)
        this.tesselateTriangle(vec_2_, vec_3_, vec_1_, depth)
        this.tesselateTriangle(vec_3, vec_2_, vec_1_, depth)
    } else {
        this.triangle(vec_3_, vec_2, vec_1_)
        this.triangle(vec_2_, vec_1, vec_3_)
        this.triangle(vec_2_, vec_3_, vec_1_)
        this.triangle(vec_3, vec_2_, vec_1_)
    }
}

CommonObject.prototype.rectangle = function(vec_1, vec_2, depth) {
    let vecMiddle1 = vec3.fromValues(vec_1[0], vec_2[1], vec_1[0] < vec_2[0] ? vec_2[2] : vec_1[2])
    let vecMiddle2 = vec3.fromValues(vec_2[0], vec_1[1], vec_1[1] < vec_2[1] ? vec_2[2] : vec_1[2])

    if(depth == -1) {
        this.triangle(vec_1, vecMiddle1, vec_2)
        this.triangle(vec_2, vecMiddle2, vec_1)
    } else {
        this.tesselateTriangle(vec_1, vecMiddle1, vec_2, depth)
        this.tesselateTriangle(vec_2, vecMiddle2, vec_1, depth)
    }
}

CommonObject.prototype.cuboid = function(vec_1, vec_2, depth) {
    this.rectangle(vec3.fromValues(vec_1[0], vec_1[1], vec_1[2]), vec3.fromValues(vec_1[0], vec_2[1], vec_2[2]), depth)
    this.rectangle(vec3.fromValues(vec_2[0], vec_1[1], vec_2[2]), vec3.fromValues(vec_2[0], vec_2[1], vec_1[2]), depth)

    this.rectangle(vec3.fromValues(vec_1[0], vec_1[1], vec_1[2]), vec3.fromValues(vec_2[0], vec_1[1], vec_2[2]), depth)
    this.rectangle(vec3.fromValues(vec_1[0], vec_2[1], vec_2[2]), vec3.fromValues(vec_2[0], vec_2[1], vec_1[2]), depth)

    this.rectangle(vec3.fromValues(vec_1[0], vec_2[1], vec_1[2]), vec3.fromValues(vec_2[0], vec_1[1], vec_1[2]), depth)
    this.rectangle(vec3.fromValues(vec_1[0], vec_1[1], vec_2[2]), vec3.fromValues(vec_2[0], vec_2[1], vec_2[2]), depth)
}

CommonObject.prototype.cube = function(distance, depth) {
    this.cuboid(vec3.fromValues(-distance, -distance, -distance), vec3.fromValues(distance, distance, distance), depth)
}

CommonObject.prototype.cylinder = function(factor, height, steps, depth) {
    height /= 2
    let step = 2 * Math.PI / steps
    for(let f = 0; f <= 2 * Math.PI + step; f+= step) {
        let x = Math.sin(f)
        let z = Math.cos(f)

        let x_ = Math.sin(f + step)
        let z_ = Math.cos(f + step)

        x *= factor;
        z *= factor;
        x_ *= factor;
        z_ *= factor;

        if(depth == -1) {
            this.triangle(vec3.fromValues(x, -height, z), vec3.fromValues(x, height, z), vec3.fromValues(x_, -height, z_))
            this.triangle(vec3.fromValues(x, height, z), vec3.fromValues(x_, height, z_), vec3.fromValues(x_, -height, z_))

            this.triangle(vec3.fromValues(x, height, z), vec3.fromValues(0, height, 0), vec3.fromValues(x_, height, z_))
            this.triangle(vec3.fromValues(x_, -height, z_), vec3.fromValues(0, -height, 0), vec3.fromValues(x, -height, z))
        } else {
            this.tesselateTriangle(vec3.fromValues(x, -height, z), vec3.fromValues(x, height, z), vec3.fromValues(x_, -height, z_), depth)
            this.tesselateTriangle(vec3.fromValues(x, height, z), vec3.fromValues(x_, height, z_), vec3.fromValues(x_, -height, z_), depth)

            this.tesselateTriangle(vec3.fromValues(x, height, z), vec3.fromValues(0, height, 0), vec3.fromValues(x_, height, z_), depth)
            this.tesselateTriangle(vec3.fromValues(x_, -height, z_), vec3.fromValues(0, -height, 0), vec3.fromValues(x, -height, z), depth)
        }
    }
}

CommonObject.prototype.cone = function(factor, height, steps, depth) {
    height /= 2
    let step = 2 * Math.PI / steps
    for(let f = 0; f <= 2 * Math.PI + step; f+= step) {
        let x = Math.sin(f)
        let z = Math.cos(f)

        let x_ = Math.sin(f + step)
        let z_ = Math.cos(f + step)

        x *= factor;
        z *= factor;
        x_ *= factor;
        z_ *= factor;

        if(depth == -1) {
            this.triangle(vec3.fromValues(x, -height, z), vec3.fromValues(0, height, 0), vec3.fromValues(x_, -height, z_))
            this.triangle(vec3.fromValues(x_, -height, z_), vec3.fromValues(0, -height, 0), vec3.fromValues(x, -height, z))
        } else {
            this.tesselateTriangle(vec3.fromValues(x, -height, z), vec3.fromValues(0, height, 0), vec3.fromValues(x_, -height, z_), depth)
            this.tesselateTriangle(vec3.fromValues(x_, -height, z_), vec3.fromValues(0, -height, 0), vec3.fromValues(x, -height, z), depth)
        }
    }
}

function midpoint(vec_1, vec_2) {
    let x = (vec_1[0] + vec_2[0]) / 2
    let y = (vec_1[1] + vec_2[1]) / 2
    let z = (vec_1[2] + vec_2[2]) / 2
    return vec3.fromValues(x, y, z)
}