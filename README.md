# PinchToZoom
Allows you to pinch and zoom an image inside a container for mobile devices.

PinchToZoom v1.0.0

## Install

Install with npm: `npm install mobile_img_pinch_to_zoom`

Install with Yarn: `yarn add mobile_img_pinch_to_zoom`

## Usage

initialize PinchToZoom with Vanilla Js

``` js
const imgElement = document.getElementById("zoomable-image");
const pinchToZoomInstance = new PinchToZoom(imgElement);
```

## Classes
`.zoomed` added when the user pinch and zoomed the image (When scale is > 1).

## Destroy
### Destroy Method
Unbind the scroll pinchToZoom touch events from the element.
``` js
pinchToZoomInstance.destroy();
```