
export default function Animation(option) {
  this.animate = this.animate.bind(this);
  this.start = this.start.bind(this);
  this.option = option;
}

Animation.prototype.animate = function (now) {
  const {
    start,             // top值
    end,              
    duration,          //时长
    onAnimationFrame,
    onAnimationEnd,
    easingFunc = this.defaultEasing
  } = this.option;

  let currentDuration = now - this.startTime;

  if (currentDuration >= duration) {
    onAnimationFrame(end);
    onAnimationEnd();

  }else {

    let value;
    if (start > end) {
      value = start - (start - end) * easingFunc(currentDuration / duration);
    } else {
      value = start + (end - start) * easingFunc(currentDuration / duration);
    }

    onAnimationFrame(value);
    //window.requestAnimationFrame
    requestAnimationFrame(this.animate);
  }

};

Animation.prototype.start = function (time) {
  this.startTime = new Date();
  this.animate(time || this.startTime);
};

Animation.prototype.defaultEasing = t => t;
