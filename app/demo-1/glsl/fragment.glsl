precision highp float;

uniform sampler2D tMap;
uniform vec2 uPlaneSizes;
uniform vec2 uImageSizes;


varying vec2 vUv;
varying float vDistortion;

void main(){
  vec2 ratio = vec2(
    min(((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y)), 1.),
    min(((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x)), 1.)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1. - ratio.x) * 0.5,
    vUv.y * ratio.y + (1. - ratio.y) * 0.5
  );

  uv.y += vDistortion * 0.2;

  vec4 texture = texture2D(tMap, uv);

  gl_FragColor = texture;
}