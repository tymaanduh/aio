(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Universe_Graphics_Engine = __MODULE_API;
  root.DictionaryUniverseGraphicsEngine = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function defaultClampNumber(value, min, max) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return min;
    }
    return Math.max(min, Math.min(max, numeric));
  }

  function defaultCleanText(value, maxLength = 1000) {
    if (typeof value !== "string") {
      return "";
    }
    return value.trim().slice(0, maxLength);
  }

  function createUniverseGraphicsEngine(options = {}) {
    const clampNumber = typeof options.clampNumber === "function" ? options.clampNumber : defaultClampNumber;
    const cleanText = typeof options.cleanText === "function" ? options.cleanText : defaultCleanText;
    const recordDiagnosticError =
      typeof options.recordDiagnosticError === "function" ? options.recordDiagnosticError : () => {};
    const ensureFloat32Capacity = options.ensureFloat32Capacity;
    const ensureWebglBufferCapacity = options.ensureWebglBufferCapacity;
    const pushRgbaPair = options.pushRgbaPair;
    const pushRgba = options.pushRgba;
    const pushRgbaFromArray = options.pushRgbaFromArray;
    const getColorRgb = options.getColorRgb;

    const config = {
      interactionActiveMs: Math.max(40, Number(options.interactionActiveMs) || 220),
      interactionEdgeTarget: Math.max(1, Number(options.interactionEdgeTarget) || 5200),
      idleEdgeTarget: Math.max(1, Number(options.idleEdgeTarget) || 12000),
      perfEdgeTargetSoft: Math.max(1, Number(options.perfEdgeTargetSoft) || 8000),
      perfEdgeTargetHard: Math.max(1, Number(options.perfEdgeTargetHard) || 5200),
      minEdgeTarget: Math.max(1, Number(options.minEdgeTarget) || 1200),
      zoomMin: Number(options.zoomMin) || 0.45,
      zoomMax: Number(options.zoomMax) || 4.5,
      clearColor: Array.isArray(options.clearColor) ? options.clearColor : [0.02, 0.04, 0.08, 1],
      lineColorPath: Array.isArray(options.lineColorPath) ? options.lineColorPath : [154 / 255, 228 / 255, 255 / 255, 0.92],
      lineColorDim: Array.isArray(options.lineColorDim) ? options.lineColorDim : [106 / 255, 135 / 255, 179 / 255, 0.06],
      lineColorLabel: Array.isArray(options.lineColorLabel) ? options.lineColorLabel : [170 / 255, 151 / 255, 255 / 255, 0.16],
      lineColorDefault: Array.isArray(options.lineColorDefault) ? options.lineColorDefault : [129 / 255, 168 / 255, 226 / 255, 0.16],
      pointColorPrimary: Array.isArray(options.pointColorPrimary)
        ? options.pointColorPrimary
        : [237 / 255, 248 / 255, 255 / 255, 0.99],
      pointColorSecondary: Array.isArray(options.pointColorSecondary)
        ? options.pointColorSecondary
        : [159 / 255, 210 / 255, 255 / 255, 0.94],
      pointColorHover: Array.isArray(options.pointColorHover)
        ? options.pointColorHover
        : [188 / 255, 226 / 255, 255 / 255, 0.96],
      pointColorPath: Array.isArray(options.pointColorPath)
        ? options.pointColorPath
        : [167 / 255, 233 / 255, 255 / 255, 0.95],
      pointColorHighlight: Array.isArray(options.pointColorHighlight)
        ? options.pointColorHighlight
        : [126 / 255, 197 / 255, 255 / 255, 0.93]
    };

    let interactionActiveUntil = 0;
    let projectionCache = null;
    let canvasContext = null;
    let canvasContextCanvas = null;
    let webglState = null;

    function resetCanvasContext() {
      canvasContext = null;
      canvasContextCanvas = null;
    }

    function getCanvasContext(canvas) {
      if (!(canvas instanceof HTMLCanvasElement)) {
        return null;
      }
      if (canvasContextCanvas === canvas && canvasContext) {
        return canvasContext;
      }
      const context = canvas.getContext("2d");
      if (!context) {
        resetCanvasContext();
        return null;
      }
      canvasContext = context;
      canvasContextCanvas = canvas;
      return context;
    }

    function clearProjectionCache() {
      projectionCache = null;
    }

    function markInteraction(durationMs = config.interactionActiveMs) {
      const until = Date.now() + Math.max(40, Math.floor(Number(durationMs) || 0));
      if (until > interactionActiveUntil) {
        interactionActiveUntil = until;
      }
    }

    function isInteractionActive() {
      return Date.now() < interactionActiveUntil;
    }

    function getEdgeTarget(runtime = {}) {
      let target = isInteractionActive() ? config.interactionEdgeTarget : config.idleEdgeTarget;
      if (runtime.benchmarkRunning) {
        target = Math.min(target, config.interactionEdgeTarget);
      }
      const perfSmoothedMs = Number(runtime.perfSmoothedMs) || 0;
      if (perfSmoothedMs > 13) {
        target = Math.min(target, config.perfEdgeTargetHard);
      } else if (perfSmoothedMs > 9) {
        target = Math.min(target, config.perfEdgeTargetSoft);
      }
      return Math.max(config.minEdgeTarget, target);
    }

    function getEdgeStride(edgeCount, runtime = {}) {
      const target = getEdgeTarget(runtime);
      if (edgeCount <= target) {
        return 1;
      }
      return Math.max(1, Math.ceil(edgeCount / target));
    }

    function getNodeRadius(node) {
      const degree = Math.max(0, Number(node?.degree) || 0);
      const componentSize = Math.max(1, Number(node?.componentSize) || 1);
      const base = 1.7 + Math.sqrt(degree) * 0.48;
      return Math.min(8.2, base + Math.log2(componentSize + 1) * 0.22);
    }

    function getProjectionData(input = {}) {
      const nodes = Array.isArray(input.nodes) ? input.nodes : [];
      const width = Math.max(1, Number(input.width) || 1);
      const height = Math.max(1, Number(input.height) || 1);
      if (nodes.length === 0) {
        return {
          x: new Float32Array(0),
          y: new Float32Array(0),
          radius: new Float32Array(0),
          signature: ""
        };
      }
      const zoom = clampNumber(input.zoom, config.zoomMin, config.zoomMax);
      const panX = clampNumber(input.panX, -1.6, 1.6);
      const panY = clampNumber(input.panY, -1.6, 1.6);
      const cacheToken = cleanText(input.cacheToken, 200);
      const signature = `${nodes.length}|${width}|${height}|${zoom}|${panX}|${panY}|${cacheToken}`;
      if (projectionCache && projectionCache.signature === signature) {
        return projectionCache;
      }

      const xScale = width * zoom;
      const yScale = height * zoom;
      const centerX = width / 2;
      const centerY = height / 2;
      const x = new Float32Array(nodes.length);
      const y = new Float32Array(nodes.length);
      const radius = new Float32Array(nodes.length);
      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        x[index] = centerX + ((Number(node?.x) || 0.5) - 0.5 + panX) * xScale;
        y[index] = centerY + ((Number(node?.y) || 0.5) - 0.5 + panY) * yScale;
        radius[index] = getNodeRadius(node);
      }
      projectionCache = { signature, x, y, radius };
      return projectionCache;
    }

    function findNodeIndexAt(input = {}) {
      const nodes = Array.isArray(input.nodes) ? input.nodes : [];
      if (nodes.length === 0) {
        return -1;
      }
      const projection = getProjectionData(input);
      const canvasX = Number(input.canvasX) || 0;
      const canvasY = Number(input.canvasY) || 0;
      let bestIndex = -1;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (let index = 0; index < nodes.length; index += 1) {
        const radius = projection.radius[index] + 4;
        const dx = projection.x[index] - canvasX;
        const dy = projection.y[index] - canvasY;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSquared = radius * radius;
        if (distanceSquared <= radiusSquared && distanceSquared < bestDistance) {
          bestDistance = distanceSquared;
          bestIndex = index;
        }
      }
      return bestIndex;
    }

    function compileShader(gl, type, source) {
      const shader = gl.createShader(type);
      if (!shader) {
        return null;
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = cleanText(gl.getShaderInfoLog(shader) || "Shader compile failed.", 300);
        gl.deleteShader(shader);
        recordDiagnosticError("universe_webgl_shader_compile", info, "universeWebgl");
        return null;
      }
      return shader;
    }

    function createProgram(gl, vertexSource, fragmentSource, code) {
      const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertexShader || !fragmentShader) {
        return null;
      }
      const program = gl.createProgram();
      if (!program) {
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = cleanText(gl.getProgramInfoLog(program) || "Program link failed.", 300);
        gl.deleteProgram(program);
        recordDiagnosticError(code, info, "universeWebgl");
        return null;
      }
      return program;
    }

    function initializeWebgl(canvas) {
      if (!(canvas instanceof HTMLCanvasElement)) {
        return null;
      }
      if (webglState && webglState.canvas === canvas && webglState.gl && !webglState.gl.isContextLost()) {
        return webglState;
      }
      const gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      });
      if (!gl) {
        return null;
      }

      const lineVertex = `
        attribute vec2 a_position;
        attribute vec4 a_color;
        uniform vec2 u_resolution;
        varying vec4 v_color;
        void main() {
          vec2 zeroToOne = a_position / u_resolution;
          vec2 clip = (zeroToOne * 2.0) - 1.0;
          gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
          v_color = a_color;
        }
      `;
      const pointVertex = `
        attribute vec2 a_position;
        attribute float a_size;
        attribute vec4 a_color;
        uniform vec2 u_resolution;
        varying vec4 v_color;
        void main() {
          vec2 zeroToOne = a_position / u_resolution;
          vec2 clip = (zeroToOne * 2.0) - 1.0;
          gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
          gl_PointSize = a_size;
          v_color = a_color;
        }
      `;
      const commonFragment = `
        precision mediump float;
        varying vec4 v_color;
        void main() {
          gl_FragColor = v_color;
        }
      `;
      const pointFragment = `
        precision mediump float;
        varying vec4 v_color;
        void main() {
          vec2 centered = gl_PointCoord - vec2(0.5, 0.5);
          float dist = dot(centered, centered);
          if (dist > 0.25) {
            discard;
          }
          gl_FragColor = v_color;
        }
      `;

      const lineProgram = createProgram(gl, lineVertex, commonFragment, "universe_webgl_line_link");
      const pointProgram = createProgram(gl, pointVertex, pointFragment, "universe_webgl_point_link");
      if (!lineProgram || !pointProgram) {
        if (lineProgram) {
          gl.deleteProgram(lineProgram);
        }
        if (pointProgram) {
          gl.deleteProgram(pointProgram);
        }
        return null;
      }

      webglState = {
        canvas,
        gl,
        line: {
          program: lineProgram,
          attribPosition: gl.getAttribLocation(lineProgram, "a_position"),
          attribColor: gl.getAttribLocation(lineProgram, "a_color"),
          uniformResolution: gl.getUniformLocation(lineProgram, "u_resolution")
        },
        point: {
          program: pointProgram,
          attribPosition: gl.getAttribLocation(pointProgram, "a_position"),
          attribSize: gl.getAttribLocation(pointProgram, "a_size"),
          attribColor: gl.getAttribLocation(pointProgram, "a_color"),
          uniformResolution: gl.getUniformLocation(pointProgram, "u_resolution")
        },
        buffers: {
          linePosition: gl.createBuffer(),
          lineColor: gl.createBuffer(),
          pointPosition: gl.createBuffer(),
          pointSize: gl.createBuffer(),
          pointColor: gl.createBuffer()
        },
        bufferCapacities: {
          linePosition: 0,
          lineColor: 0,
          pointPosition: 0,
          pointSize: 0,
          pointColor: 0
        },
        scratch: {
          linePositions: new Float32Array(1024),
          lineColors: new Float32Array(2048),
          pathLinePositions: new Float32Array(512),
          pathLineColors: new Float32Array(1024),
          pointPositions: new Float32Array(1024),
          pointSizes: new Float32Array(512),
          pointColors: new Float32Array(2048)
        }
      };

      return webglState;
    }

    function drawWebglLines(glState, width, height, positions, positionCount, colors, colorCount) {
      if (positionCount < 4 || colorCount < 8) {
        return;
      }
      const { gl, line, buffers } = glState;
      gl.useProgram(line.program);
      gl.uniform2f(line.uniformResolution, width, height);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.linePosition);
      ensureWebglBufferCapacity(gl, glState, buffers.linePosition, "linePosition", positionCount);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions.subarray(0, positionCount));
      gl.enableVertexAttribArray(line.attribPosition);
      gl.vertexAttribPointer(line.attribPosition, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.lineColor);
      ensureWebglBufferCapacity(gl, glState, buffers.lineColor, "lineColor", colorCount);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, colors.subarray(0, colorCount));
      gl.enableVertexAttribArray(line.attribColor);
      gl.vertexAttribPointer(line.attribColor, 4, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.LINES, 0, positionCount / 2);
    }

    function drawWebglPoints(glState, width, height, positions, positionCount, sizes, sizeCount, colors, colorCount) {
      if (positionCount < 2 || sizeCount < 1 || colorCount < 4) {
        return;
      }
      const { gl, point, buffers } = glState;
      gl.useProgram(point.program);
      gl.uniform2f(point.uniformResolution, width, height);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pointPosition);
      ensureWebglBufferCapacity(gl, glState, buffers.pointPosition, "pointPosition", positionCount);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions.subarray(0, positionCount));
      gl.enableVertexAttribArray(point.attribPosition);
      gl.vertexAttribPointer(point.attribPosition, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pointSize);
      ensureWebglBufferCapacity(gl, glState, buffers.pointSize, "pointSize", sizeCount);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, sizes.subarray(0, sizeCount));
      gl.enableVertexAttribArray(point.attribSize);
      gl.vertexAttribPointer(point.attribSize, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pointColor);
      ensureWebglBufferCapacity(gl, glState, buffers.pointColor, "pointColor", colorCount);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, colors.subarray(0, colorCount));
      gl.enableVertexAttribArray(point.attribColor);
      gl.vertexAttribPointer(point.attribColor, 4, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, positionCount / 2);
    }

    function renderWebgl(input = {}) {
      const canvas = input.canvas;
      const glState = initializeWebgl(canvas);
      if (!glState) {
        return false;
      }
      const width = Math.max(1, Number(input.width) || 1);
      const height = Math.max(1, Number(input.height) || 1);
      const dpr = Math.max(1, Number(input.dpr) || 1);
      const nodes = Array.isArray(input.nodes) ? input.nodes : [];
      const edges = Array.isArray(input.edges) ? input.edges : [];
      const highlightFlags = input.highlightFlags instanceof Uint8Array ? input.highlightFlags : new Uint8Array(nodes.length);
      const selectedFlags = input.selectedFlags instanceof Uint8Array ? input.selectedFlags : new Uint8Array(nodes.length);
      const pathNodeFlags = input.pathNodeFlags instanceof Uint8Array ? input.pathNodeFlags : new Uint8Array(nodes.length);
      const pathEdgeSet = input.pathEdgeSet instanceof Set ? input.pathEdgeSet : new Set();
      const projection = input.projection || getProjectionData(input);
      const getNodeColor = typeof input.getNodeColor === "function" ? input.getNodeColor : () => "#87a8d7";
      const getEdgeKey = typeof input.getEdgeKey === "function" ? input.getEdgeKey : (a, b, nodeCount) => {
        const left = Math.min(a, b);
        const right = Math.max(a, b);
        return left * Math.max(1, nodeCount) + right;
      };

      const { gl } = glState;
      const pixelWidth = Math.max(1, Math.floor(width * dpr));
      const pixelHeight = Math.max(1, Math.floor(height * dpr));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      gl.viewport(0, 0, pixelWidth, pixelHeight);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(config.clearColor[0], config.clearColor[1], config.clearColor[2], config.clearColor[3]);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const scratch = glState.scratch;
      scratch.linePositions = ensureFloat32Capacity(scratch.linePositions, Math.max(4, edges.length * 4));
      scratch.lineColors = ensureFloat32Capacity(scratch.lineColors, Math.max(8, edges.length * 8));
      scratch.pathLinePositions = ensureFloat32Capacity(scratch.pathLinePositions, Math.max(4, edges.length * 4));
      scratch.pathLineColors = ensureFloat32Capacity(scratch.pathLineColors, Math.max(8, edges.length * 8));
      scratch.pointPositions = ensureFloat32Capacity(scratch.pointPositions, Math.max(2, nodes.length * 2));
      scratch.pointSizes = ensureFloat32Capacity(scratch.pointSizes, Math.max(1, nodes.length));
      scratch.pointColors = ensureFloat32Capacity(scratch.pointColors, Math.max(4, nodes.length * 4));

      const linePositions = scratch.linePositions;
      const lineColors = scratch.lineColors;
      const pathLinePositions = scratch.pathLinePositions;
      const pathLineColors = scratch.pathLineColors;
      const pointPositions = scratch.pointPositions;
      const pointSizes = scratch.pointSizes;
      const pointColors = scratch.pointColors;
      const projectionX = projection.x;
      const projectionY = projection.y;
      const projectionRadius = projection.radius;
      const nodeCount = Math.max(1, nodes.length);

      let linePositionCount = 0;
      let lineColorCount = 0;
      let pathLinePositionCount = 0;
      let pathLineColorCount = 0;
      const edgeStride = getEdgeStride(edges.length, {
        perfSmoothedMs: Number(input.perfSmoothedMs) || 0,
        benchmarkRunning: Boolean(input.benchmarkRunning)
      });
      const hasPathHighlights = pathEdgeSet.size > 0;
      for (let edgeIndex = 0; edgeIndex < edges.length; edgeIndex += 1) {
        const edge = edges[edgeIndex];
        const a = Math.floor(Number(edge?.a));
        const b = Math.floor(Number(edge?.b));
        const left = nodes[a];
        const right = nodes[b];
        if (!left || !right) {
          continue;
        }
        const isPathEdge = hasPathHighlights && pathEdgeSet.has(getEdgeKey(a, b, nodeCount));
        if (!isPathEdge && edgeStride > 1 && edgeIndex % edgeStride !== 0) {
          continue;
        }
        if (isPathEdge) {
          pathLinePositions[pathLinePositionCount] = projectionX[a];
          pathLinePositions[pathLinePositionCount + 1] = projectionY[a];
          pathLinePositions[pathLinePositionCount + 2] = projectionX[b];
          pathLinePositions[pathLinePositionCount + 3] = projectionY[b];
          pathLinePositionCount += 4;
          pathLineColorCount = pushRgbaPair(pathLineColors, pathLineColorCount, config.lineColorPath);
          continue;
        }

        linePositions[linePositionCount] = projectionX[a];
        linePositions[linePositionCount + 1] = projectionY[a];
        linePositions[linePositionCount + 2] = projectionX[b];
        linePositions[linePositionCount + 3] = projectionY[b];
        linePositionCount += 4;

        if (input.filterActive && highlightFlags[a] !== 1 && highlightFlags[b] !== 1) {
          lineColorCount = pushRgbaPair(lineColors, lineColorCount, config.lineColorDim);
          continue;
        }
        if (edge?.hasSameLabel === true) {
          lineColorCount = pushRgbaPair(lineColors, lineColorCount, config.lineColorLabel);
          continue;
        }
        lineColorCount = pushRgbaPair(lineColors, lineColorCount, config.lineColorDefault);
      }
      drawWebglLines(glState, width, height, linePositions, linePositionCount, lineColors, lineColorCount);
      drawWebglLines(glState, width, height, pathLinePositions, pathLinePositionCount, pathLineColors, pathLineColorCount);

      let pointPositionCount = 0;
      let pointSizeCount = 0;
      let pointColorCount = 0;
      const now = Number(input.now) || Date.now();
      const pulseNodeIndex = Math.floor(Number(input.pulseNodeIndex));
      const pulseUntil = Number(input.pulseUntil) || 0;
      const selectedIndex = Math.floor(Number(input.selectedIndex));
      const hoverIndex = Math.floor(Number(input.hoverIndex));
      for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex += 1) {
        const node = nodes[nodeIndex];
        const radius = projectionRadius[nodeIndex];
        const isHighlighted = highlightFlags[nodeIndex] === 1;
        const isHovered = nodeIndex === hoverIndex;
        const isPrimarySelected = nodeIndex === selectedIndex;
        const isSecondarySelected = selectedFlags[nodeIndex] === 1 && !isPrimarySelected;
        const isPathNode = pathNodeFlags[nodeIndex] === 1;
        const isPulsing = nodeIndex === pulseNodeIndex && pulseUntil > now;
        const baseColor = getNodeColor(node);
        let alphaBase = 0.34 + Math.min(0.48, (Number(node.degree) || 0) / 18);
        if (input.filterActive && !isHighlighted && !isPrimarySelected && !isSecondarySelected && !isHovered && !isPathNode) {
          alphaBase *= 0.2;
        }

        pointPositions[pointPositionCount] = projectionX[nodeIndex];
        pointPositions[pointPositionCount + 1] = projectionY[nodeIndex];
        pointPositionCount += 2;

        pointSizes[pointSizeCount] =
          (isHovered || isPrimarySelected || isSecondarySelected || isPathNode ? radius + 1.4 : radius + 0.5) *
          dpr *
          (isPulsing ? 1.18 : 1);
        pointSizeCount += 1;

        if (isPrimarySelected) {
          pointColorCount = pushRgbaFromArray(pointColors, pointColorCount, config.pointColorPrimary);
        } else if (isSecondarySelected) {
          pointColorCount = pushRgbaFromArray(pointColors, pointColorCount, config.pointColorSecondary);
        } else if (isHovered) {
          pointColorCount = pushRgbaFromArray(pointColors, pointColorCount, config.pointColorHover);
        } else if (isPathNode) {
          pointColorCount = pushRgbaFromArray(pointColors, pointColorCount, config.pointColorPath);
        } else if (isHighlighted) {
          pointColorCount = pushRgbaFromArray(pointColors, pointColorCount, config.pointColorHighlight);
        } else {
          const [red, green, blue] = getColorRgb(baseColor);
          pointColorCount = pushRgba(pointColors, pointColorCount, red, green, blue, clampNumber(alphaBase, 0, 1));
        }
      }
      drawWebglPoints(
        glState,
        width,
        height,
        pointPositions,
        pointPositionCount,
        pointSizes,
        pointSizeCount,
        pointColors,
        pointColorCount
      );
      return true;
    }

    function disposeWebgl() {
      if (!webglState || !webglState.gl) {
        webglState = null;
        return;
      }
      const { gl, line, point, buffers } = webglState;
      try {
        if (buffers?.linePosition) {
          gl.deleteBuffer(buffers.linePosition);
        }
        if (buffers?.lineColor) {
          gl.deleteBuffer(buffers.lineColor);
        }
        if (buffers?.pointPosition) {
          gl.deleteBuffer(buffers.pointPosition);
        }
        if (buffers?.pointSize) {
          gl.deleteBuffer(buffers.pointSize);
        }
        if (buffers?.pointColor) {
          gl.deleteBuffer(buffers.pointColor);
        }
        if (line?.program) {
          gl.deleteProgram(line.program);
        }
        if (point?.program) {
          gl.deleteProgram(point.program);
        }
      } catch {
        // Ignore WebGL cleanup errors.
      }
      webglState = null;
    }

    return {
      resetCanvasContext,
      getCanvasContext,
      clearProjectionCache,
      markInteraction,
      isInteractionActive,
      getEdgeTarget,
      getEdgeStride,
      getNodeRadius,
      getProjectionData,
      findNodeIndexAt,
      renderWebgl,
      disposeWebgl
    };
  }

  return {
    createUniverseGraphicsEngine
  };
});
