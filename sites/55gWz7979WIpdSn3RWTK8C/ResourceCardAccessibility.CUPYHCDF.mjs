import{t as e}from"./rolldown-runtime.Bi-D_2cA.mjs";import{L as t,T as n,b as r,c as i,s as a,z as o}from"./react.Dq5lJgOf.mjs";function s({style:e}){return r(()=>{let e=0,t=[`case-studies`,`insights`,`news`,`events`],n=e=>Array.from(document.querySelectorAll(e)).find(e=>e.getClientRects().length>0),r=()=>{e=0;let r=n(`#mechasys-library-nav`);if(!r)return;let i=r.parentElement,a=(parseFloat(getComputedStyle(i??r).top)||0)+(i?.getBoundingClientRect().height??100)+40,s=`library`;for(let e of t){let t=n(`#resources-`+e);t&&t.getBoundingClientRect().top<=a&&(s=e)}for(let e of Array.from(r.querySelectorAll(`a[href]`))){let t=new URL(e.href,o.location.href).hash===`#resources-`+s;(e.closest(`[data-framer-name]`)??e).setAttribute(`data-resource-tab`,t?`active`:`idle`),t?e.setAttribute(`aria-current`,`location`):e.removeAttribute(`aria-current`)}let c=(parseFloat(getComputedStyle(i??r).top)||0)+(i?.getBoundingClientRect().height??100)+24;for(let e of t){let t=n(`#resources-`+e);t&&(t.style.scrollMarginTop=c+`px`)}},i=()=>{e||=requestAnimationFrame(r)};o.addEventListener(`scroll`,i,{passive:!0}),o.addEventListener(`resize`,i);let a=new ResizeObserver(i),s=n(`#resources-library`);return s&&a.observe(s),r(),()=>{cancelAnimationFrame(e),a.disconnect(),o.removeEventListener(`scroll`,i),o.removeEventListener(`resize`,i)}},[]),r(()=>{let e=e=>{if(e.pointerType===`touch`)return;let t=e.target;if(!(t instanceof Element))return;let n=t.closest(`:is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"])`);if(!n||e.relatedTarget instanceof Node&&n.contains(e.relatedTarget))return;let r=n.querySelector(`:is([data-framer-name="Project overview"],[data-framer-name="Resource overview"])`);if(!r)return;let i=r.getBoundingClientRect(),a=Math.max(0,Math.min(i.width,e.clientX-i.left)),o=Math.max(0,Math.min(i.height,e.clientY-i.top)),s=Math.hypot(Math.max(a,i.width-a),Math.max(o,i.height-o))+4;r.style.setProperty(`--card-x`,a+`px`),r.style.setProperty(`--card-y`,o+`px`),r.style.setProperty(`--card-radius`,s+`px`)};return document.addEventListener(`pointerover`,e,{passive:!0}),()=>document.removeEventListener(`pointerover`,e)},[]),/*#__PURE__*/ a(`div`,{"aria-hidden":`true`,style:{...e,width:1,height:1,pointerEvents:`none`},children:/*#__PURE__*/ a(`style`,{children:c})})}var c;function l(){return(l=e((()=>{t(),i(),n(),c=`
#mechasys-library-nav a, #mechasys-library-nav a * { text-decoration: none !important; }
#mechasys-library-nav [data-resource-tab] {
 border-bottom: 2px solid transparent !important;
}
#mechasys-library-nav [data-resource-tab="idle"],
#mechasys-library-nav [data-resource-tab="idle"] * {
 color: #536174 !important;
 --framer-text-color: #536174 !important;
 --framer-link-current-text-color: #536174 !important;
}
#mechasys-library-nav [data-resource-tab="active"] {
 border-bottom-color: #0047BB !important;
}
#mechasys-library-nav [data-resource-tab="active"],
#mechasys-library-nav [data-resource-tab="active"] * {
 color: #0047BB !important;
 --framer-text-color: #0047BB !important;
 --framer-link-current-text-color: #0047BB !important;
}
@media (prefers-reduced-motion: reduce) {
 html { scroll-behavior: auto !important; }
}


:is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]) {
 background: white;
 isolation: isolate;
}
:is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]) :is([data-framer-name="Project overview"],[data-framer-name="Resource overview"]) {
 position: relative;
 isolation: isolate;
 clip-path: polygon(0 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%);
}
:is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]) :is([data-framer-name="Project image"],[data-framer-name="Resource image"]) {
 clip-path: polygon(16px 0,100% 0,100% 100%,0 100%,0 16px);
}
:is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]) :is([data-framer-name="Project overview"],[data-framer-name="Resource overview"])::before {
 content: "";
 position: absolute;
 inset: 0;
 background: var(--token-sJL9Tz1pZ, #0047BB);
 clip-path: circle(0px at var(--card-x,50%) var(--card-y,0px));
 transition: clip-path 1.25s cubic-bezier(.45,0,.2,1);
 pointer-events: none;
 z-index: -1;
}
:is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]) :is([data-framer-name="Project overview"],[data-framer-name="Resource overview"]) * {
 transition: color .35s ease, border-color .35s ease;
}
:is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]) [data-framer-name="Card publication metadata"] {
 align-items: center;
}
:is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]):focus-visible {
 outline: 3px solid #091133 !important;
 outline-offset: 4px !important;
}
:is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]):focus-visible :is([data-framer-name="Project overview"],[data-framer-name="Resource overview"])::before {
 clip-path: circle(var(--card-radius,1500px) at var(--card-x,50%) var(--card-y,0px));
}
:is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]):focus-visible :is([data-framer-name="Project overview"],[data-framer-name="Resource overview"]) * {
 color: #fff !important;
 --framer-text-color: #fff !important;
 --framer-link-text-color: #fff !important;
}
@media (hover: hover) and (pointer: fine) {
 :is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]):hover :is([data-framer-name="Project overview"],[data-framer-name="Resource overview"])::before {
  clip-path: circle(var(--card-radius,1500px) at var(--card-x,50%) var(--card-y,0px));
 }
 :is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]):hover :is([data-framer-name="Project overview"],[data-framer-name="Resource overview"]) * {
  color: #fff !important;
  --framer-text-color: #fff !important;
  --framer-link-text-color: #fff !important;
 }
 :is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]):hover [data-framer-name="Card publication metadata"] {
  border-color: rgba(255,255,255,.3) !important;
 }
}
@media (prefers-reduced-motion: reduce) {
 :is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]) :is([data-framer-name="Project overview"],[data-framer-name="Resource overview"])::before, :is([data-framer-name="Case study entry"],[data-framer-name="Resource entry"],[data-framer-name^="Supporting story /"]) :is([data-framer-name="Project overview"],[data-framer-name="Resource overview"]) * { transition: none !important; }
}

`})))()}export{l as n,s as t};
//# sourceMappingURL=ResourceCardAccessibility.CUPYHCDF.mjs.map