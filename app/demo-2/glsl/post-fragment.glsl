uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uStrength;

varying vec2 vUv;

void main(){
  vec3 color;

  color.r = texture2D(tDiffuse, vec2(vUv.x + uStrength, vUv.y)).r;
  color.g = texture2D(tDiffuse, vUv).g;
  color.b = texture2D(tDiffuse, vec2(vUv.x - uStrength, vUv.y)).b;

  gl_FragColor = texture2D(tDiffuse, vUv);
  gl_FragColor = vec4(color, 1.0);
}