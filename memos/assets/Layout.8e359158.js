import{c as x,h as D,a as Y}from"./dom.8684e409.js";import{i as q,k as p,l as O,p as A,c as f,h as g,g as S,m as K,w as H,o as T,n as E,q as U,s as F,r as b,t as I,u as M,v as L,a as Z,_ as ee,x as te,y as ne,z as oe,A as R,f as Q}from"./index.b53cfad9.js";import{g as ie,a as re,b as le,c as _}from"./scroll.66045ea7.js";var ae=x({name:"QPage",props:{padding:Boolean,styleFn:Function},setup(t,{slots:v}){const{proxy:{$q:n}}=S(),e=q(O,p);if(e===p)return console.error("QPage needs to be a deep child of QLayout"),p;if(q(A,p)===p)return console.error("QPage needs to be child of QPageContainer"),p;const l=f(()=>{const c=(e.header.space===!0?e.header.size:0)+(e.footer.space===!0?e.footer.size:0);if(typeof t.styleFn=="function"){const r=e.isContainer.value===!0?e.containerHeight.value:n.screen.height;return t.styleFn(c,r)}return{minHeight:e.isContainer.value===!0?e.containerHeight.value-c+"px":n.screen.height===0?c!==0?`calc(100vh - ${c}px)`:"100vh":n.screen.height-c+"px"}}),s=f(()=>`q-page${t.padding===!0?" q-layout-padding":""}`);return()=>g("main",{class:s.value,style:l.value},D(v.default))}}),se=x({name:"QPageContainer",setup(t,{slots:v}){const{proxy:{$q:n}}=S(),e=q(O,p);if(e===p)return console.error("QPageContainer needs to be child of QLayout"),p;K(A,!0);const a=f(()=>{const l={};return e.header.space===!0&&(l.paddingTop=`${e.header.size}px`),e.right.space===!0&&(l[`padding${n.lang.rtl===!0?"Left":"Right"}`]=`${e.right.size}px`),e.footer.space===!0&&(l.paddingBottom=`${e.footer.size}px`),e.left.space===!0&&(l[`padding${n.lang.rtl===!0?"Right":"Left"}`]=`${e.left.size}px`),l});return()=>g("div",{class:"q-page-container",style:a.value},D(v.default))}});const{passive:N}=F,ce=["both","horizontal","vertical"];var ue=x({name:"QScrollObserver",props:{axis:{type:String,validator:t=>ce.includes(t),default:"vertical"},debounce:[String,Number],scrollTarget:{default:void 0}},emits:["scroll"],setup(t,{emit:v}){const n={position:{top:0,left:0},direction:"down",directionChanged:!1,delta:{top:0,left:0},inflectionPoint:{top:0,left:0}};let e=null,a,l;H(()=>t.scrollTarget,()=>{r(),c()});function s(){e!==null&&e();const m=Math.max(0,re(a)),w=le(a),d={top:m-n.position.top,left:w-n.position.left};if(t.axis==="vertical"&&d.top===0||t.axis==="horizontal"&&d.left===0)return;const $=Math.abs(d.top)>=Math.abs(d.left)?d.top<0?"up":"down":d.left<0?"left":"right";n.position={top:m,left:w},n.directionChanged=n.direction!==$,n.delta=d,n.directionChanged===!0&&(n.direction=$,n.inflectionPoint=n.position),v("scroll",{...n})}function c(){a=ie(l,t.scrollTarget),a.addEventListener("scroll",i,N),i(!0)}function r(){a!==void 0&&(a.removeEventListener("scroll",i,N),a=void 0)}function i(m){if(m===!0||t.debounce===0||t.debounce==="0")s();else if(e===null){const[w,d]=t.debounce?[setTimeout(s,t.debounce),clearTimeout]:[requestAnimationFrame(s),cancelAnimationFrame];e=()=>{d(w),e=null}}}const{proxy:h}=S();return H(()=>h.$q.lang.rtl,s),T(()=>{l=h.$el.parentNode,c()}),E(()=>{e!==null&&e(),r()}),Object.assign(h,{trigger:i,getPosition:()=>n}),U}});function de(){const t=b(!I.value);return t.value===!1&&T(()=>{t.value=!0}),t}const G=typeof ResizeObserver!="undefined",V=G===!0?{}:{style:"display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;",url:"about:blank"};var j=x({name:"QResizeObserver",props:{debounce:{type:[String,Number],default:100}},emits:["resize"],setup(t,{emit:v}){let n=null,e,a={width:-1,height:-1};function l(r){r===!0||t.debounce===0||t.debounce==="0"?s():n===null&&(n=setTimeout(s,t.debounce))}function s(){if(n!==null&&(clearTimeout(n),n=null),e){const{offsetWidth:r,offsetHeight:i}=e;(r!==a.width||i!==a.height)&&(a={width:r,height:i},v("resize",a))}}const{proxy:c}=S();if(G===!0){let r;const i=h=>{e=c.$el.parentNode,e?(r=new ResizeObserver(l),r.observe(e),s()):h!==!0&&M(()=>{i(!0)})};return T(()=>{i()}),E(()=>{n!==null&&clearTimeout(n),r!==void 0&&(r.disconnect!==void 0?r.disconnect():e&&r.unobserve(e))}),U}else{let h=function(){n!==null&&(clearTimeout(n),n=null),i!==void 0&&(i.removeEventListener!==void 0&&i.removeEventListener("resize",l,F.passive),i=void 0)},m=function(){h(),e&&e.contentDocument&&(i=e.contentDocument.defaultView,i.addEventListener("resize",l,F.passive),s())};const r=de();let i;return T(()=>{M(()=>{e=c.$el,e&&m()})}),E(h),c.trigger=l,()=>{if(r.value===!0)return g("object",{style:V.style,tabindex:-1,type:"text/html",data:V.url,"aria-hidden":"true",onLoad:m})}}}}),fe=x({name:"QLayout",props:{container:Boolean,view:{type:String,default:"hhh lpr fff",validator:t=>/^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(t.toLowerCase())},onScroll:Function,onScrollHeight:Function,onResize:Function},setup(t,{slots:v,emit:n}){const{proxy:{$q:e}}=S(),a=b(null),l=b(e.screen.height),s=b(t.container===!0?0:e.screen.width),c=b({position:0,direction:"down",inflectionPoint:0}),r=b(0),i=b(I.value===!0?0:_()),h=f(()=>"q-layout q-layout--"+(t.container===!0?"containerized":"standard")),m=f(()=>t.container===!1?{minHeight:e.screen.height+"px"}:null),w=f(()=>i.value!==0?{[e.lang.rtl===!0?"left":"right"]:`${i.value}px`}:null),d=f(()=>i.value!==0?{[e.lang.rtl===!0?"right":"left"]:0,[e.lang.rtl===!0?"left":"right"]:`-${i.value}px`,width:`calc(100% + ${i.value}px)`}:null);function $(o){if(t.container===!0||document.qScrollPrevented!==!0){const u={position:o.position.top,direction:o.direction,directionChanged:o.directionChanged,inflectionPoint:o.inflectionPoint.top,delta:o.delta.top};c.value=u,t.onScroll!==void 0&&n("scroll",u)}}function J(o){const{height:u,width:y}=o;let z=!1;l.value!==u&&(z=!0,l.value=u,t.onScrollHeight!==void 0&&n("scrollHeight",u),k()),s.value!==y&&(z=!0,s.value=y),z===!0&&t.onResize!==void 0&&n("resize",o)}function X({height:o}){r.value!==o&&(r.value=o,k())}function k(){if(t.container===!0){const o=l.value>r.value?_():0;i.value!==o&&(i.value=o)}}let C=null;const B={instances:{},view:f(()=>t.view),isContainer:f(()=>t.container),rootRef:a,height:l,containerHeight:r,scrollbarWidth:i,totalWidth:f(()=>s.value+i.value),rows:f(()=>{const o=t.view.toLowerCase().split(" ");return{top:o[0].split(""),middle:o[1].split(""),bottom:o[2].split("")}}),header:L({size:0,offset:0,space:!1}),right:L({size:300,offset:0,space:!1}),footer:L({size:0,offset:0,space:!1}),left:L({size:300,offset:0,space:!1}),scroll:c,animate(){C!==null?clearTimeout(C):document.body.classList.add("q-body--layout-animate"),C=setTimeout(()=>{C=null,document.body.classList.remove("q-body--layout-animate")},155)},update(o,u,y){B[o][u]=y}};if(K(O,B),_()>0){let y=function(){o=null,u.classList.remove("hide-scrollbar")},z=function(){if(o===null){if(u.scrollHeight>e.screen.height)return;u.classList.add("hide-scrollbar")}else clearTimeout(o);o=setTimeout(y,300)},P=function(W){o!==null&&W==="remove"&&(clearTimeout(o),y()),window[`${W}EventListener`]("resize",z)},o=null;const u=document.body;H(()=>t.container!==!0?"add":"remove",P),t.container!==!0&&P("add"),Z(()=>{P("remove")})}return()=>{const o=Y(v.default,[g(ue,{onScroll:$}),g(j,{onResize:J})]),u=g("div",{class:h.value,style:m.value,ref:t.container===!0?void 0:a,tabindex:-1},o);return t.container===!0?g("div",{class:"q-layout-container overflow-hidden",ref:a},[g(j,{onResize:X}),g("div",{class:"absolute-full",style:w.value},[g("div",{class:"scroll",style:d.value},[u])])]):u}}});const ve={};function he(t,v){const n=te("router-view");return ne(),oe(fe,{view:"lHh Lpr lFf",style:{"max-width":"600px",margin:"0 auto"}},{default:R(()=>[Q(se,null,{default:R(()=>[Q(ae,null,{default:R(()=>[Q(n)]),_:1})]),_:1})]),_:1})}var ye=ee(ve,[["render",he]]);export{ye as default};