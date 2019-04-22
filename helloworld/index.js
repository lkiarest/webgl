/**
 * 完整的入门小栗子
 */
(function() {
  ////////////////////////////// begin GLSL ///////////////////////////
  // 顶点着色器，设置每个点的大小为10
  const VERTEX_SHADER = `
    attribute vec4 a_Position;

    void main() {
      gl_PointSize = 10.0;
      gl_Position = a_Position;
    }
  `

  // 片元着色器，以 rgba 的方式指定为红色
  const FRAGMENT_SHADER = `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
  ////////////////////////////// after GLSL ///////////////////////////

  // 初始化 WebGl 对象
  const initGL = () => {
    const canvas = document.getElementById('canvas')
    const gl = canvas.getContext('webgl')

    if (!gl) {
      throw new Error('当前浏览器不支持 WebGL！')
    }

    gl.viewportWidth = canvas.width
    gl.viewportHeight = canvas.height

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    return gl
  }

  // 创建顶点着色器
  const getVertexShader = (gl) => {
    const vShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vShader, VERTEX_SHADER)
    gl.compileShader(vShader)
    return vShader
  }

  // 创建片元着色器
  const getFragmentShader = (gl) => {
    const fShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fShader, FRAGMENT_SHADER)
    gl.compileShader(fShader)
    return fShader
  }

  // 创建程序对象
  const linkProgram = (gl) => {
    const program = gl.createProgram()
    gl.attachShader(program, getVertexShader(gl))
    gl.attachShader(program, getFragmentShader(gl))
    gl.linkProgram(program)

    console.log(gl.getProgramParameter(program, gl.LINK_STATUS))
  
    gl.useProgram(program)

    return program
  }

  // 开始绘制
  const draw = () => {
    const gl = initGL()
    const program = linkProgram(gl)

    // 获取位置信息存储地址
    const a_Position = gl.getAttribLocation(program, 'a_Position')
    // 定义顶点坐标
    const vertices = new Float32Array([
      0.0, 0.5, -0.5,
      -0.5, 0.5, -0.5
    ])

    const n = 3

    // 创建缓冲区
    const buffer = gl.createBuffer()
    if (!buffer) {
      throw new Error('缓冲区创建失败！')
    }

    // 填充数据到缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    // 将缓存区数据填充到 a_Position
    // 每个顶点传入数组中的两个数据，剩余部分填充 0.0,1.0
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0.0)
    gl.enableVertexAttribArray(a_Position)

    // 清空画布
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 绘制从 0 开始共 n 个点
    gl.drawArrays(gl.POINTS, 0, n)
  }

  draw()
})()
