import * as twgl from 'twgl.js'

function radiansToAngle(radian: number){
	return 180 / Math.PI * radian
}
function angleToRadians(angle: number){
	return Math.PI/180 * angle
}

class Camera {
	up: twgl.v3.Vec3
	right: twgl.v3.Vec3
	direction: twgl.v3.Vec3
	positionWC: twgl.v3.Vec3
	viewMatrix: twgl.m4.Mat4 // view
	invViewMatrix: twgl.m4.Mat4 // camera matrix
	constructor(){
		this.up = twgl.v3.create()
		this.right = twgl.v3.create()
		this.direction = twgl.v3.create()
		this.positionWC = twgl.v3.create()
		this.viewMatrix = twgl.m4.identity()
		this.invViewMatrix = twgl.m4.identity()
	}
	updateViewMatrix(){

	}
}

class Frustum{
	_near: number
	_far: number
	projectionMatrix: twgl.m4.Mat4
	invProjMatrix: twgl.m4.Mat4
	constructor(near: number, far: number) {
		this._near = near || 0.01
		this._far = far || 0.01
		this.projectionMatrix = twgl.m4.identity()
		this.invProjMatrix = twgl.m4.identity()
	}
	get near(){
		return this._near
	}
	set near(val: number){
		this._near = val
		this.updateProjectionMatrix()
	}
	get far(){
		return this._far
	}
	set far(val: number){
		this._far = val
		this.updateProjectionMatrix()
	}
	updateProjectionMatrix(){
		throw "need implement"
	}

	debugFrustum(){
		

	}
}


class PerspectiveFrustum extends Frustum{
	_fov: number // angle in radius 
	_aspect: number
	constructor(opt: {
		near: number
		far: number
		aspect: number
		fov: number
	}) {
		const {near, far, fov, aspect} = opt
		super(near, far)
		this._fov = fov || 30
		this._aspect = aspect
	}
	get fov(){
		return this._fov
	}
	set fov(angle: number){
		this._fov = angle
		this.updateProjectionMatrix()
	}
	get aspect(){
		return this._aspect
	}
	set aspect(val: number){
		this._aspect = val
		this.updateProjectionMatrix()
	}
	updateProjectionMatrix(){
		const radians = angleToRadians(this.fov)
		this.projectionMatrix = twgl.m4.perspective(radians, this.aspect, this.near, this.far)
		this.invProjMatrix = twgl.m4.inverse(this.projectionMatrix)
	}
}

class OrthographicFrustum extends Frustum{
	_left: number
	_right: number
	_top: number
	_bottom: number
	constructor(opts: {
		near: number
		far: number
		left: number
		right: number
		top: number
		bottom: number
	}){
		const {near, far, left, right, top, bottom} = opts
		super(near, far)
		this._left = left || 0
		this._right = right || 0
		this._top = top || 0
		this._bottom = bottom || 0
	}
	get left(){
		return this._left
	}
	set left(val: number){
		this._left = val
	}
	get top(){
		return this._top
	}
	set top(val: number){
		this._top = val
	}
	get right(){
		return this._right
	}
	set right(val: number){
		this._right = val
	}
	get bottom(){
		return this._bottom
	}
	set bottom(val: number){
		this._bottom = val
	}
	updateProjectionMatrix(){
		this.projectionMatrix = twgl.m4.ortho(this.left, this.right, this.bottom, this.top, this.near, this.far)
		this.invProjMatrix = twgl.m4.inverse(this.projectionMatrix)
	}
}

export default Camera