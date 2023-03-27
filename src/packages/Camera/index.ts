import * as twgl from 'twgl.js'

function radiansToAngle(radian: number){
	return 180 / Math.PI * radian
}
function angleToRadians(angle: number){
	return Math.PI/180 * angle
}
type Num3Ary = [number, number, number]
class Camera {
	_up: twgl.v3.Vec3
	_right: twgl.v3.Vec3
	_direction: twgl.v3.Vec3
	_positionWC: twgl.v3.Vec3
	_target: twgl.v3.Vec3
	_position: twgl.v3.Vec3
	_viewMatrix: twgl.m4.Mat4 // view
	_invViewMatrix: twgl.m4.Mat4 // camera matrix
	_cameraChanged: boolean
	constructor(cameraPos: twgl.v3.Vec3, target: twgl.v3.Vec3, up: twgl.v3.Vec3){
		this._up = up || twgl.v3.create()
		this._right = twgl.v3.create()
		this._direction = twgl.v3.create()
		this._positionWC = cameraPos || twgl.v3.create()
		this._target = target || twgl.v3.create()
		this._position = twgl.v3.create()
		this._viewMatrix = twgl.m4.identity()
		this._invViewMatrix = twgl.m4.identity() // inverse of viewMatrix
		this._cameraChanged = false
		this.updateViewMatrix()
		this.registerEvent()
	}
	get up(){
		return this._up
	}
	set up(val: twgl.v3.Vec3){
		this._up = val
		this.updateViewMatrix()
	}
	get right(){
		return this._right
	}
	set right(val: twgl.v3.Vec3){
		this._right = val
		this.updateViewMatrix()
	}
	get direction(){
		return this._direction
	}
	set direction(val: twgl.v3.Vec3){
		this._direction = val
		this.updateViewMatrix()
	}
	get positionWC(){
		return this._positionWC
	}
	set positionWC(val: twgl.v3.Vec3){
		this._positionWC = val
		this.updateViewMatrix()
	}
	get position(){
		return this._position
	}
	set position(val: twgl.v3.Vec3){
		this._positionWC = val
		this.updateViewMatrix()
	}
	get viewMatrix(){
		return this._viewMatrix
	}
	set viewMatrix(val: twgl.m4.Mat4){
		this._viewMatrix = val
		this.viewMatrixIsUpdated()
	}
	get invViewMatrix(){
		return this._invViewMatrix
	}
	set invViewMatrix(val: twgl.m4.Mat4){
		this._invViewMatrix = val
	}
	updateViewMatrix(){
		// up right direction and position changed calc new view matrix
		const direction = twgl.v3.subtract(this.positionWC, this._target)
		this.direction = twgl.v3.normalize(direction)
		const cameraMatrix = twgl.m4.lookAt(this.positionWC, this._target, this.up)
		this.invViewMatrix = cameraMatrix
		this.viewMatrix = twgl.m4.inverse(cameraMatrix)
	}
	viewMatrixIsUpdated(){
		// calculate up direction right and position from view matrix

	}
	registerEvent(){
		// zoom in zoom out
		// move front back left right
		// rotate 

	}
	setViewMatrix(viewMatrix: twgl.m4.Mat4){
		this.viewMatrix = viewMatrix
	}
	setTransform(){

	}
	rotate(){

	}
	zoomIn(){

	}
	zoomOut(){

	}
	move(){

	}
	cameraChanged(){
		return this._cameraChanged
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

export {
	PerspectiveFrustum,
	OrthographicFrustum,
	radiansToAngle,
	angleToRadians
}

export default Camera