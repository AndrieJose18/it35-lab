import{i as L,c as A}from"./index-BcqNwpsB.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */class R{constructor(){this.gestureId=0,this.requestedStart=new Map,this.disabledGestures=new Map,this.disabledScroll=new Set}createGesture(t){var r;return new W(this,this.newID(),t.name,(r=t.priority)!==null&&r!==void 0?r:0,!!t.disableScroll)}createBlocker(t={}){return new B(this,this.newID(),t.disable,!!t.disableScroll)}start(t,r,i){return this.canStart(t)?(this.requestedStart.set(r,i),!0):(this.requestedStart.delete(r),!1)}capture(t,r,i){if(!this.start(t,r,i))return!1;const a=this.requestedStart;let n=-1e4;if(a.forEach(c=>{n=Math.max(n,c)}),n===i){this.capturedId=r,a.clear();const c=new CustomEvent("ionGestureCaptured",{detail:{gestureName:t}});return document.dispatchEvent(c),!0}return a.delete(r),!1}release(t){this.requestedStart.delete(t),this.capturedId===t&&(this.capturedId=void 0)}disableGesture(t,r){let i=this.disabledGestures.get(t);i===void 0&&(i=new Set,this.disabledGestures.set(t,i)),i.add(r)}enableGesture(t,r){const i=this.disabledGestures.get(t);i!==void 0&&i.delete(r)}disableScroll(t){this.disabledScroll.add(t),this.disabledScroll.size===1&&document.body.classList.add(I)}enableScroll(t){this.disabledScroll.delete(t),this.disabledScroll.size===0&&document.body.classList.remove(I)}canStart(t){return!(this.capturedId!==void 0||this.isDisabled(t))}isCaptured(){return this.capturedId!==void 0}isScrollDisabled(){return this.disabledScroll.size>0}isDisabled(t){const r=this.disabledGestures.get(t);return!!(r&&r.size>0)}newID(){return this.gestureId++,this.gestureId}}class W{constructor(t,r,i,a,n){this.id=r,this.name=i,this.disableScroll=n,this.priority=a*1e6+r,this.ctrl=t}canStart(){return this.ctrl?this.ctrl.canStart(this.name):!1}start(){return this.ctrl?this.ctrl.start(this.name,this.id,this.priority):!1}capture(){if(!this.ctrl)return!1;const t=this.ctrl.capture(this.name,this.id,this.priority);return t&&this.disableScroll&&this.ctrl.disableScroll(this.id),t}release(){this.ctrl&&(this.ctrl.release(this.id),this.disableScroll&&this.ctrl.enableScroll(this.id))}destroy(){this.release(),this.ctrl=void 0}}class B{constructor(t,r,i,a){this.id=r,this.disable=i,this.disableScroll=a,this.ctrl=t}block(){if(this.ctrl){if(this.disable)for(const t of this.disable)this.ctrl.disableGesture(t,this.id);this.disableScroll&&this.ctrl.disableScroll(this.id)}}unblock(){if(this.ctrl){if(this.disable)for(const t of this.disable)this.ctrl.enableGesture(t,this.id);this.disableScroll&&this.ctrl.enableScroll(this.id)}}destroy(){this.unblock(),this.ctrl=void 0}}const I="backdrop-no-scroll",V=new R;/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const g=(e,t,r,i)=>{const a=F(e)?{capture:!1,passive:!!i.passive}:!1;let n,c;return e.__zone_symbol__addEventListener?(n="__zone_symbol__addEventListener",c="__zone_symbol__removeEventListener"):(n="addEventListener",c="removeEventListener"),e[n](t,r,a),()=>{e[c](t,r,a)}},F=e=>{if(w===void 0)try{const t=Object.defineProperty({},"passive",{get:()=>{w=!0}});e.addEventListener("optsTest",()=>{},t)}catch(t){w=!1}return!!w};let w;const j=2e3,H=(e,t,r,i,a)=>{let n,c,b,u,d,l,S,y=0;const o=h=>{y=Date.now()+j,t(h)&&(!c&&r&&(c=g(e,"touchmove",r,a)),b||(b=g(h.target,"touchend",s,a)),u||(u=g(h.target,"touchcancel",s,a)))},p=h=>{y>Date.now()||t(h)&&(!l&&r&&(l=g(O(e),"mousemove",r,a)),S||(S=g(O(e),"mouseup",v,a)))},s=h=>{m(),i&&i(h)},v=h=>{E(),i&&i(h)},m=()=>{c&&c(),b&&b(),u&&u(),c=b=u=void 0},E=()=>{l&&l(),S&&S(),l=S=void 0},X=()=>{m(),E()},T=(h=!0)=>{h?(n||(n=g(e,"touchstart",o,a)),d||(d=g(e,"mousedown",p,a))):(n&&n(),d&&d(),n=d=void 0,X())};return{enable:T,stop:X,destroy:()=>{T(!1),i=r=t=void 0}}},O=e=>e instanceof Document?e:e.ownerDocument,K=(e,t,r)=>{const i=r*(Math.PI/180),a=e==="x",n=Math.cos(i),c=t*t;let b=0,u=0,d=!1,l=0;return{start(S,y){b=S,u=y,l=0,d=!0},detect(S,y){if(!d)return!1;const o=S-b,p=y-u,s=o*o+p*p;if(s<c)return!1;const v=Math.sqrt(s),m=(a?o:p)/v;return m>n?l=1:m<-n?l=-1:l=0,d=!1,!0},isGesture(){return l!==0},getDirection(){return l}}},N=e=>{let t=!1,r=!1,i=!0,a=!1;const n=Object.assign({disableScroll:!1,direction:"x",gesturePriority:0,passive:!0,maxAngle:40,threshold:10},e),c=n.canStart,b=n.onWillStart,u=n.onStart,d=n.onEnd,l=n.notCaptured,S=n.onMove,y=n.threshold,o=n.passive,p=n.blurOnStart,s={type:"pan",startX:0,startY:0,startTime:0,currentX:0,currentY:0,velocityX:0,velocityY:0,deltaX:0,deltaY:0,currentTime:0,event:void 0,data:void 0},v=K(n.direction,n.threshold,n.maxAngle),m=V.createGesture({name:e.gestureName,priority:e.gesturePriority,disableScroll:e.disableScroll}),E=f=>{const M=z(f);return r||!i||(x(f,s),s.startX=s.currentX,s.startY=s.currentY,s.startTime=s.currentTime=M,s.velocityX=s.velocityY=s.deltaX=s.deltaY=0,s.event=f,c&&c(s)===!1)||(m.release(),!m.start())?!1:(r=!0,y===0?Y():(v.start(s.startX,s.startY),!0))},X=f=>{if(t){!a&&i&&(a=!0,C(s,f),requestAnimationFrame(T));return}C(s,f),v.detect(s.currentX,s.currentY)&&(!v.isGesture()||!Y())&&q()},T=()=>{t&&(a=!1,S&&S(s))},Y=()=>m.capture()?(t=!0,i=!1,s.startX=s.currentX,s.startY=s.currentY,s.startTime=s.currentTime,b?b(s).then(D):D(),!0):!1,h=()=>{if(typeof document<"u"){const f=document.activeElement;f!=null&&f.blur&&f.blur()}},D=()=>{p&&h(),u&&u(s),i=!0},G=()=>{t=!1,r=!1,a=!1,i=!0,m.release()},P=f=>{const M=t,k=i;if(G(),!!k){if(C(s,f),M){d&&d(s);return}l&&l(s)}},_=H(n.el,E,X,P,{passive:o}),q=()=>{G(),_.stop(),l&&l(s)};return{enable(f=!0){f||(t&&P(void 0),G()),_.enable(f)},destroy(){m.destroy(),_.destroy()}}},C=(e,t)=>{if(!t)return;const r=e.currentX,i=e.currentY,a=e.currentTime;x(t,e);const n=e.currentX,c=e.currentY,u=(e.currentTime=z(t))-a;if(u>0&&u<100){const d=(n-r)/u,l=(c-i)/u;e.velocityX=d*.7+e.velocityX*.3,e.velocityY=l*.7+e.velocityY*.3}e.deltaX=n-e.startX,e.deltaY=c-e.startY,e.event=t},x=(e,t)=>{let r=0,i=0;if(e){const a=e.changedTouches;if(a&&a.length>0){const n=a[0];r=n.clientX,i=n.clientY}else e.pageX!==void 0&&(r=e.pageX,i=e.pageY)}t.currentX=r,t.currentY=i},z=e=>e.timeStamp||Date.now();/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const U=(e,t,r,i,a)=>{const n=e.ownerDocument.defaultView;let c=L(e);const b=o=>{const{startX:s}=o;return c?s>=n.innerWidth-50:s<=50},u=o=>c?-o.deltaX:o.deltaX,d=o=>c?-o.velocityX:o.velocityX;return N({el:e,gestureName:"goback-swipe",gesturePriority:101,threshold:10,canStart:o=>(c=L(e),b(o)&&t()),onStart:r,onMove:o=>{const s=u(o)/n.innerWidth;i(s)},onEnd:o=>{const p=u(o),s=n.innerWidth,v=p/s,m=d(o),E=s/2,X=m>=0&&(m>.2||p>E),Y=(X?1-v:v)*s;let h=0;if(Y>5){const D=Y/Math.abs(m);h=Math.min(D,540)}a(X,v<=0?.01:A(0,v,.9999),h)}})};export{U as createSwipeBackGesture};
