// 引入 wasm 模块，并导出 Game 类
import init, { Game } from "./pkg/game.js";

// 获取 canvas 元素
const canvas = document.getElementById("canvas");

// 记录上一帧的时间戳
let lastFrame = Date.now();

// 初始化 wasm 模块，并在初始化完成后执行回调函数
init().then(() => {
  // 创建 Game 实例
  const game = Game.new();

  // 设置 canvas 尺寸为游戏尺寸
  canvas.width = game.width();
  canvas.height = game.height();

  // 为 canvas 添加点击事件监听器
  canvas.addEventListener("click", (event) => onClick(game, event));

  // 使用 requestAnimationFrame 启动游戏循环
  requestAnimationFrame(() => onFrame(game));
});

/**
 * 游戏循环的回调函数
 * @param {*} game 
 */
function onFrame(game) {
  // 计算帧间隔时间
  const delta = Date.now() - lastFrame;
  lastFrame = Date.now();

  // 更新游戏状态
  game.tick(delta);

  // 渲染游戏画面
  game.render(canvas.getContext("2d"));

  // 使用递归调用 requestAnimationFrame，实现持续的游戏循环
  requestAnimationFrame(() => onFrame(game));
}

/**
 * 处理点击事件的回调函数
 * @param {*} game 
 * @param {*} event 
 */
function onClick(game, event) {
  /**
   * 获取点击位置相对于 canvas 的坐标
   * 1.event.target.getBoundingClientRect() 返回一个 DOMRect 对象，
   *   其中包含了目标元素（这里是 canvas）相对于「视口的位置信息」，包括左上角的坐标 left 和 top
   * 2.通过使用鼠标事件对象 event 中的 clientX 和 clientY 属性，获取了鼠标点击的在视口中的坐标。
   *   然后，通过减去 canvas 左上角的坐标，就得到了鼠标点击位置相对于 canvas 左上角的相对坐标
   * 3.由于 canvas 的尺寸可能与屏幕上的「显示尺寸不同」，需要将相对坐标转换为 canvas 内部的坐标。
   *   通过除以 canvas 的宽度和高度，将相对坐标归一化到 [0, 1] 的范围内。乘以 game.width() 和 game.height() 就得到了相对于游戏坐标系的点击位置
   */
  const rect = event.target.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * game.width();
  const y = ((event.clientY - rect.top) / rect.height) * game.height();

  /**
   * 将点击事件传递给游戏对象处理
   * 这个方法可能会用于处理玩家点击游戏中的某个位置时的逻辑，例如在该位置放置游戏元素或执行其他游戏操作
   */
  game.click(x, y);
}