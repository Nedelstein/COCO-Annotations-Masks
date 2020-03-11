#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uPointerDiff;

// returns 1 if coord corresponds to a grid line, 0 otherwise
float isGridLine(vec2 coord){
    vec2 pixelsPerGrid=vec2(50.,50.);
    vec2 gridCoords=fract(coord/pixelsPerGrid);
    vec2 gridPixelCoords=gridCoords*pixelsPerGrid;
    vec2 gridLine=step(gridPixelCoords,vec2(1.));
    float isGridLine=max(gridLine.x,gridLine.y);
    return isGridLine;
}

void main(){
    // Coordinates for the current pixel
    vec2 coord=gl_FragCoord.xy-uPointerDiff+vec2(5.);
    // Set color to black
    vec3 color=vec3(0.);
    // If it is a grid line, change blue channel to 0.3
    color.b=isGridLine(coord)*.3;
    // Assing the final rgba color to gl_FragColor
    gl_FragColor=vec4(color,1.);
}
