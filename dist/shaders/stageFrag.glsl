#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uPointerDown;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

// function for distortion effect
vec2 computeUV(vec2 uv,float k,float kcube){
    vec2 t=uv-.5;
    float r2=t.x*t.x+t.y*t.y;
    float f=0.;
    if(kcube==0.){
        f=1.+r2*k;
    }else{
        f=1.+r2*(k+kcube*sqrt(r2));
    }
    vec2 nUv=f*t+.5;
    nUv.y=1.-nUv.y;
    return nUv;
}
void main(){
    
    // normalize coordinates
    vec2 uv=gl_FragCoord.xy/uResolution.xy;
    
    // settings for the effect
    // multiplied by uPointerDown (value between 0 - 1)
    float k=-1.*uPointerDown;
    float kcube=.5*uPointerDown;
    float offset=.02*uPointerDown;
    
    // get each channel's color using the texture provide by pixi
    // and the computeUV function
    float red=texture2D(uSampler,computeUV(uv,k+offset,kcube)).r;
    float green=texture2D(uSampler,computeUV(uv,k,kcube)).g;
    float blue=texture2D(uSampler,computeUV(uv,k-offset,kcube)).b;
    
    gl_FragColor=vec4(red,green,blue,1.);
    
}