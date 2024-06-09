const PinchToZoom = require('../src/main.js');

describe('PinchToZoom', () => {
  let pinchToZoom;
  let img;

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';  // Add a container to the document
    img = document.createElement('img');
    img.width = 800;  // Set image width for testing
    img.height = 600; // Set image height for testing
    document.getElementById('root').appendChild(img);
    pinchToZoom = new PinchToZoom(img);
  });

  afterEach(() => {
    pinchToZoom.destroy();
  });

  describe('touchMoveHandler', () => {

    it('should handle zooming when two fingers are used', () => {
      // Initial touches closer together
      const initialEvent = {
        targetTouches: [
          { pageX: 100, pageY: 200 },
          { pageX: 120, pageY: 220 }
        ]
      };

      pinchToZoom.touchMoveHandler(initialEvent); // Initialize distance

      // Zoom touches farther apart
      const zoomEvent = {
        targetTouches: [
          { pageX: 100, pageY: 200 },
          { pageX: 300, pageY: 400 }
        ]
      };

      pinchToZoom.touchMoveHandler(zoomEvent);

      // Assert the expected changes in scale and distance
      expect(pinchToZoom.scale).toBeGreaterThan(1);
      expect(pinchToZoom.distance).toBeGreaterThan(0);
    });

    it('should handle dragging when one finger is used and scale is greater than 1', () => {
      // Initial touch event to start dragging
      pinchToZoom.scale = 2; // Set scale greater than 1 to enable dragging
      const initialEvent = {
        targetTouches: [
          { pageX: 100, pageY: 200 }
        ]
      };

      pinchToZoom.touchMoveHandler(initialEvent);

      // Simulate dragging
      const dragEvent = {
        targetTouches: [
          { pageX: 120, pageY: 220 }
        ]
      };

      pinchToZoom.touchMoveHandler(dragEvent);

      // Assert the expected changes in trackedXPosition and trackedYPosition
      expect(pinchToZoom.trackedXPosition).toBe(120);
      expect(pinchToZoom.trackedYPosition).toBe(220);
    });

    it('should not handle dragging when scale is less than or equal to 1', () => {
      pinchToZoom.scale = 1;

      const event = {
        targetTouches: [
          { pageX: 100, pageY: 200 }
        ]
      };

      pinchToZoom.touchMoveHandler(event);

      // Assert that trackedXPosition and trackedYPosition remain unchanged
      expect(pinchToZoom.trackedXPosition).toBe(0);
      expect(pinchToZoom.trackedYPosition).toBe(0);
    });
    
  });

  describe('touchStartHandler', () => {
    it('should set the initial position and zooming state when one finger is used', () => {
      pinchToZoom.scale = 2; // Set scale greater than 1 to enable dragging
      const event = {
        targetTouches: [
          { pageX: 100, pageY: 200 }
        ]
      };

      pinchToZoom.touchStartHandler(event);

      // Assert the expected changes in xPosition, yPosition, and isZooming
      expect(pinchToZoom.xPosition).toBe(100);
      expect(pinchToZoom.yPosition).toBe(200);
      expect(pinchToZoom.isZooming).toBe(false);
    });

    it('should not set the initial position and zooming state when more than one finger is used', () => {
      const event = {
        targetTouches: [
          { pageX: 100, pageY: 200 },
          { pageX: 300, pageY: 400 }
        ]
      };

      pinchToZoom.touchStartHandler(event);

      // Assert that xPosition, yPosition, and isZooming remain unchanged
      expect(pinchToZoom.xPosition).toBe(0);
      expect(pinchToZoom.yPosition).toBe(0);
      expect(pinchToZoom.isZooming).toBe(false);
    });
  });

  describe('touchEndHandler', () => {
    it('should reset the distance and tracked positions when scale is less than or equal to 1', () => {
      pinchToZoom.scale = 1;
      pinchToZoom.trackedXPosition = 100;
      pinchToZoom.trackedYPosition = 200;

      const event = {};

      pinchToZoom.touchEndHandler(event);

      // Assert that distance, trackedXPosition, and trackedYPosition are reset
      expect(pinchToZoom.distance).toBe(0);
      expect(pinchToZoom.trackedXPosition).toBe(0);
      expect(pinchToZoom.trackedYPosition).toBe(0);
    });

    it('should not reset the tracked positions when scale is greater than 1', () => {
      pinchToZoom.scale = 2;
      pinchToZoom.trackedXPosition = 100;
      pinchToZoom.trackedYPosition = 200;

      const event = {};

      pinchToZoom.touchEndHandler(event);

      // Assert that distance remains unchanged and trackedXPosition, trackedYPosition are not reset
      expect(pinchToZoom.distance).toBe(0);
      expect(pinchToZoom.trackedXPosition).toBe(100);
      expect(pinchToZoom.trackedYPosition).toBe(200);
    });
  });

});