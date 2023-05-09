#define PI 3.1415926535897932384626433832795

attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform vec2 uViewportSizes;
uniform float uStrength;

varying vec2 vUv;
varying float vStrength;

void main(){
  vec4 newPosition = modelViewMatrix * vec4(position, 1.);

  newPosition.z += -abs(sin(newPosition.x / uViewportSizes.x * PI + PI / 2.) * uStrength);

  vStrength = uStrength;
  vUv = uv;

  gl_Position = projectionMatrix * newPosition;
}