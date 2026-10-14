/**
 * Shared WebGL pieces for the two halftone canvases (hero metal, about
 * figure). Both render a luminance field at one texel per halftone cell into
 * a framebuffer, then print it as dots with HALFTONE.
 */

export const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/*
 * Each cell reads its texel of the field and draws one dot sized by it,
 * capped below half a cell so dots never merge. uSquare morphs the dots into
 * square pixels; uClear 1 leaves empty cells transparent (for a figure on the
 * page) instead of black.
 */
export const HALFTONE = `
precision highp float;
uniform sampler2D uField;
uniform vec2 uGrid;
uniform float uCell;
uniform float uSquare;
uniform float uTime;
uniform float uFill;
uniform float uGrain;
// 1: empty cells are transparent, so the figure sits on the page itself.
uniform float uClear;

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 cellId = floor(frag / uCell);
  vec2 center = (cellId + 0.5) * uCell;
  float L = texture2D(uField, (cellId + 0.5) / uGrid).r;

  float radius = sqrt(L) * uCell * uFill;
  vec2 delta = abs(frag - center);
  float dist = mix(length(delta), max(delta.x, delta.y), uSquare);
  float dotMask = 1.0 - smoothstep(radius - 1.0, radius, dist);
  float shade = 0.85 * dotMask * (0.3 + 0.7 * L);
  shade += (hash(frag + fract(uTime) * 100.0) - 0.5) * uGrain;
  // Premultiplied: shade already carries dotMask, so it doubles as alpha.
  gl_FragColor = vec4(vec3(shade), mix(1.0, dotMask, uClear));
}
`;

export const compile = (
  gl: WebGLRenderingContext,
  type: number,
  src: string,
) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "shader compile failed");
  }
  return shader;
};

export const link = (gl: WebGLRenderingContext, frag: string) => {
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "link failed");
  }
  return program;
};

/** A full-screen quad, bound to a program's aPos. */
export const quad = (gl: WebGLRenderingContext) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  return (program: WebGLProgram) => {
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  };
};

/** A cols×rows texture with a framebuffer that renders into it. */
export const fieldTarget = (gl: WebGLRenderingContext) => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  const fbo = gl.createFramebuffer();

  const resize = (cols: number, rows: number) => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      cols,
      rows,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  return { texture, fbo, resize };
};
