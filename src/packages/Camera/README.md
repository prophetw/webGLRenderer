## Camera 

1. Position
2. UpVector 
3. Direction 

> viewMatrix4

## Projection
### Perspective

### Orthographic
> projectionMatrix4



## How to use 
viewMatrix4 projectionMatrix4 need update in real-time
in every shader need placeholders for viewMatrix4 and projectionMatrix4

### In vertex shader 
> modelMatrix4 * position  => world space 
> viewMatrix4 * modelMatrix4 * position => eye/view space 
> projectionMatrix4 * viewMatrix4 * modelMatrix4 * position => clipping space 

* clipping space is output of vertex shader


> Sometimes may need to change space for special calculations
* eye space => world space
eye space = viewMatrix4 * modelMatrix4 * position
world space = inverse(viewMatrix4) * eye space

* clipping space => eye space 
clipping space = projectionMatrix4 * viewMatrix4 * modelMatrix4 * position
eye space = inverse(projectionMatrix4) * clipping space

* clipping space => world space
clipping space = projectionMatrix4 * viewMatrix4 * modelMatrix4 * position

world space = inverse(viewMatrix4) * inverse(projectionMatrix4) * clipping space



### In fragment shader 
all position in screen space
screen space = clipping space / w

```glsl

// NDC -1 ~ 1
vec2 NDC = FragPosClipSpace.xy / FragPosClipSpace.w; //归一化设备坐标（Normalized Device Coordinates）

vec2 screenSpace = NDC * 0.5 + 0.5; // [0, 1]

vec2 windowSize = vec2(800, 600); // window size
vec2 windowSpace = screenSpace * windowSize; // [0, windowSize]


```
