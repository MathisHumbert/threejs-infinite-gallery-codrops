precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uPlaneSizes;
uniform vec2 uImageSizes;

varying vec2 vUv;
varying float vStrength;

vec2 getCorrectUv (vec2 planeSizes, vec2 imageSizes, vec2 uv){
  vec2 ratio = vec2(
    min(((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y)), 1.),
        min(((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x)), 1.)
  );

  return vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

void main(){
  vec2 uv = getCorrectUv(uPlaneSizes, uImageSizes, vUv);
  
  vec4 texture = texture2D(uTexture, uv);

  // vec3 color;
  // color.r = texture2D(uTexture, vec2(uv.x + vStrength, uv.y)).r;
  // color.g = texture2D(uTexture, uv).g;
  // color.b = texture2D(uTexture, vec2(uv.x - vStrength, uv.y)).b;

  gl_FragColor = texture;
  // gl_FragColor = vec4(color, 1.0);
}