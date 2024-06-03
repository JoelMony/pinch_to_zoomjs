class PinchToZoom {
  constructor(img) {
    this.img = img;
    this.distance = 0;
    this.scale = 1;
    this.xPosition = 0;
    this.yPosition = 0;
    this.trackedXPosition = 0;
    this.trackedYPosition = 0;
    this.isZooming = false;
    this.intervalId = null;
    this.maxScale = 4; // Define the maximum scale
    this.minScale = 1; // Define the minimum scale

    this.touchMoveHandler = this.touchMoveHandler.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchEndHandler = this.touchEndHandler.bind(this);

    this.init();
  }

  init() {
    this.img.addEventListener("touchmove", this.touchMoveHandler);
    this.img.addEventListener("touchstart", this.touchStartHandler);
    this.img.addEventListener("touchend", this.touchEndHandler);

    this.intervalId = setInterval(() => {
      this.img.style.transform = `translate3d(${this.trackedXPosition}px, ${this.trackedYPosition}px, 0) scale(${this.scale})`;
    }, 1000 / 60);
  }

  touchMoveHandler(event) {
    if (event.targetTouches.length == 2) {
      // Handle zooming
      this.isZooming = true;
      const dx =
        event.targetTouches[0].pageX - event.targetTouches[1].pageX;
      const dy =
        event.targetTouches[0].pageY - event.targetTouches[1].pageY;
      const newDistance = Math.sqrt(dx * dx + dy * dy);

      if (this.distance > 0) {
        const diff = newDistance - this.distance;
        this.scale += diff * 0.01;
        this.scale = Math.min(this.maxScale, Math.max(this.minScale, this.scale));
      }
      this.distance = newDistance;
    } else if (event.targetTouches.length == 1 && !this.isZooming) {
      // Handle dragging
      if (this.scale > 1) {
        const newXPosition = event.targetTouches[0].pageX;
        const newYPosition = event.targetTouches[0].pageY;

        const xDiff = newXPosition - this.xPosition;
        const yDiff = newYPosition - this.yPosition;

        let maxTranslateX;
        let maxTranslateY;

        if (this.scale >= 3) {
          maxTranslateX = Math.min(
            (this.img.width * this.scale - this.img.width) / 2,
            370
          );
          maxTranslateY = Math.min(
            (this.img.height * this.scale - this.img.height) / 2,
            400
          );
        } else {
          maxTranslateX = (this.img.width * this.scale - this.img.width) / 2;
          maxTranslateY = (this.img.height * this.scale - this.img.height) / 2;
        }

        this.trackedXPosition = Math.min(
          Math.max(this.trackedXPosition + xDiff, -maxTranslateX),
          maxTranslateX
        );
        this.trackedYPosition = Math.min(
          Math.max(this.trackedYPosition + yDiff, -maxTranslateY),
          maxTranslateY
        );

        this.img.style.transform = `translate3d(${this.trackedXPosition}px, ${this.trackedYPosition}px, 0) scale(${this.scale})`;

        this.xPosition = newXPosition;
        this.yPosition = newYPosition;
      }
    }
  }

  touchStartHandler(event) {
    if (event.targetTouches.length == 1) {
      this.xPosition = event.targetTouches[0].pageX;
      this.yPosition = event.targetTouches[0].pageY;
      this.isZooming = false;
    }
  }

  touchEndHandler(event) {
    this.distance = 0;
    if (this.scale <= 1) {
      this.trackedXPosition = 0;
      this.trackedYPosition = 0;
      this.img.style.transform = `translate3d(${this.trackedXPosition}px, ${this.trackedYPosition}px, 0) scale(${this.scale})`;
    }
  }

  destroy() {
    clearInterval(this.intervalId);
    this.img.removeEventListener("touchmove", this.touchMoveHandler);
    this.img.removeEventListener("touchstart", this.touchStartHandler);
    this.img.removeEventListener("touchend", this.touchEndHandler);
  }
}

module.exports = PinchToZoom;