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

> Sometimes may need to change space for special calculations
* eye space => world space
* clipping space => eye space 

* clipping space => eye space



### In fragment sader 
all position in screen space