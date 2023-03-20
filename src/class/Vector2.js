class Vector2 {
    constructor(x, y) {
        this.x = x || 0
        this.y = typeof y === 'number' ? y : this.x
    }

    set(x, y) {
        this.x = x
        this.y = y
        return this
    }

    add(v) {
        this.x += v.x
        this.y += v.y
        return this
    }

    addScalar(s) {
        this.x += s
        this.y += s
        return this
    }

    subtract(v) {
        this.x -= v.x
        this.y -= v.y
        return this
    }

    subtractScalar(s) {
        this.x -= s
        this.y -= s
        return this
    }

    multiply(v) {
        this.x *= v.x
        this.y *= v.y
        return this
    }

    multiplyScalar(s) {
        this.x *= s
        this.y *= s
        return this
    }

    divide(v) {
        this.x /= v.x
        this.y /= v.y
        return this
    }

    divideScalar(s) {
        this.x /= s
        this.y /= s
        return this
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    normalize() {
        return this.divideScalar(this.magnitude())
    }

    reverse() {
        return this.multiplyScalar(-1)
    }

    copy(v) {
        this.x = v.x
        this.y = v.y
        return this
    }

    clone() {
        return new Vector2(this.x, this.y)
    }

    angle() {
        var angle = Math.atan2(this.y, this.x)

        if (angle < 0) angle += 2 * Math.PI

        return angle
    }

    rotate(angle) {
        var x = this.x
        this.x = x * Math.cos(angle) - this.y * Math.sin(angle)
        this.y = x * Math.sin(angle) + this.y * Math.cos(angle)
        return this
    }
}

export default Vector2
