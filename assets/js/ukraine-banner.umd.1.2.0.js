(function(d){typeof define=="function"&&define.amd?define(d):d()})(function(){"use strict";function d(){}function A(t){return t()}function S(){return Object.create(null)}function _(t){t.forEach(A)}function T(t){return typeof t=="function"}function X(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function B(t){return Object.keys(t).length===0}function v(t,e){t.appendChild(e)}function H(t,e,n){t.insertBefore(e,n||null)}function N(t){t.parentNode.removeChild(t)}function E(t){return document.createElement(t)}function F(t){return document.createTextNode(t)}function U(){return F(" ")}function b(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function V(t){return Array.from(t.childNodes)}function m(t,e,n,l){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,l?"important":"")}function g(t,e,n){t.classList[n?"add":"remove"](e)}function q(t){const e={};for(const n of t)e[n.name]=n.value;return e}let k;function x(t){k=t}function D(){if(!k)throw new Error("Function called outside component initialization");return k}function G(t){D().$$.on_mount.push(t)}const w=[],O=[],C=[],P=[],I=Promise.resolve();let M=!1;function J(){M||(M=!0,I.then(c))}function $(t){C.push(t)}const L=new Set;let j=0;function c(){const t=k;do{for(;j<w.length;){const e=w[j];j++,x(e),K(e.$$)}for(x(null),w.length=0,j=0;O.length;)O.pop()();for(let e=0;e<C.length;e+=1){const n=C[e];L.has(n)||(L.add(n),n())}C.length=0}while(w.length);for(;P.length;)P.pop()();M=!1,L.clear(),x(t)}function K(t){if(t.fragment!==null){t.update(),_(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach($)}}const Q=new Set;function W(t,e){t&&t.i&&(Q.delete(t),t.i(e))}function Y(t,e,n,l){const{fragment:f,on_mount:h,on_destroy:i,after_update:o}=t.$$;f&&f.m(e,n),l||$(()=>{const a=h.map(A).filter(T);i?i.push(...a):_(a),t.$$.on_mount=[]}),o.forEach($)}function Z(t,e){const n=t.$$;n.fragment!==null&&(_(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function tt(t,e){t.$$.dirty[0]===-1&&(w.push(t),J(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function et(t,e,n,l,f,h,i,o=[-1]){const a=k;x(t);const r=t.$$={fragment:null,ctx:null,props:h,update:d,not_equal:f,bound:S(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(a?a.$$.context:[])),callbacks:S(),dirty:o,skip_bound:!1,root:e.target||a.$$.root};i&&i(r.root);let p=!1;if(r.ctx=n?n(t,e.props||{},(u,y,...z)=>{const s=z.length?z[0]:y;return r.ctx&&f(r.ctx[u],r.ctx[u]=s)&&(!r.skip_bound&&r.bound[u]&&r.bound[u](s),p&&tt(t,u)),y}):[],r.update(),p=!0,_(r.before_update),r.fragment=l?l(r.ctx):!1,e.target){if(e.hydrate){const u=V(e.target);r.fragment&&r.fragment.l(u),u.forEach(N)}else r.fragment&&r.fragment.c();e.intro&&W(t.$$.fragment),Y(t,e.target,e.anchor,e.customElement),c()}x(a)}let R;typeof HTMLElement=="function"&&(R=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:t}=this.$$;this.$$.on_disconnect=t.map(A).filter(T);for(const e in this.$$.slotted)this.appendChild(this.$$.slotted[e])}attributeChangedCallback(t,e,n){this[t]=n}disconnectedCallback(){_(this.$$.on_disconnect)}$destroy(){Z(this,1),this.$destroy=d}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const l=n.indexOf(e);l!==-1&&n.splice(l,1)}}$set(t){this.$$set&&!B(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});function nt(t){let e,n,l,f,h;return{c(){e=E("div"),n=E("a"),l=E("div"),f=U(),h=E("div"),this.c=d,b(l,"class","stripe blue"),b(h,"class","stripe yellow"),b(n,"class","ribbon"),b(n,"href",t[0]),b(n,"title",t[1]),m(n,"--height",t[2]),m(n,"--box-shadow",t[3]),b(e,"class","ukraine-ribbon"),m(e,"--zindex",t[4]),g(e,"top",t[5]),g(e,"bottom",t[6]),g(e,"left",t[7]),g(e,"right",t[8])},m(i,o){H(i,e,o),v(e,n),v(n,l),v(n,f),v(n,h)},p(i,[o]){o&1&&b(n,"href",i[0]),o&2&&b(n,"title",i[1]),o&4&&m(n,"--height",i[2]),o&8&&m(n,"--box-shadow",i[3]),o&16&&m(e,"--zindex",i[4]),o&32&&g(e,"top",i[5]),o&64&&g(e,"bottom",i[6]),o&128&&g(e,"left",i[7]),o&256&&g(e,"right",i[8])},i:d,o:d,d(i){i&&N(e)}}}function it(t,e,n){let{href:l=void 0}=e,{title:f=void 0}=e,{height:h="3vw"}=e,{boxshadow:i="0 0 8px rgb(0 0 0 / 50%)"}=e,{vertical:o="bottom"}=e,{horizontal:a="right"}=e,{zindex:r="999999"}=e,p,u,y,z;return G(()=>{n(9,o=o==="top"?"top":"bottom"),n(10,a=a==="left"?"left":"right"),n(5,p=o==="top"),n(6,u=o==="bottom"),n(7,y=a==="left"),n(8,z=a==="right")}),t.$$set=s=>{"href"in s&&n(0,l=s.href),"title"in s&&n(1,f=s.title),"height"in s&&n(2,h=s.height),"boxshadow"in s&&n(3,i=s.boxshadow),"vertical"in s&&n(9,o=s.vertical),"horizontal"in s&&n(10,a=s.horizontal),"zindex"in s&&n(4,r=s.zindex)},[l,f,h,i,r,p,u,y,z,o,a]}class ot extends R{constructor(e){super();this.shadowRoot.innerHTML="<style>.ukraine-ribbon{position:fixed;top:0;right:0;transform:translateX(45%);z-index:var(--zindex)}.ukraine-ribbon>.ribbon{position:relative;display:block;width:100vw;height:var(--height);transform:rotate(45deg);box-shadow:var(--box-shadow)}.ukraine-ribbon>.ribbon>.stripe{width:100%;height:50%}.ukraine-ribbon>.ribbon>.stripe.blue{background:#275bbb}.ukraine-ribbon>.ribbon>.stripe.yellow{background:#fad503}.ukraine-ribbon.left{left:0;right:auto;transform:translateX(-45%)}.ukraine-ribbon.left.top>.ribbon{transform:rotate(-45deg)}.ukraine-ribbon.left.bottom>.ribbon{transform:rotate(45deg)}.ukraine-ribbon.right{left:auto;right:0;transform:translateX(45%)}.ukraine-ribbon.right.top>.ribbon{transform:rotate(45deg)}.ukraine-ribbon.right.bottom>.ribbon{transform:rotate(-45deg)}.ukraine-ribbon.top{top:0;bottom:auto}.ukraine-ribbon.bottom{top:auto;bottom:0}</style>",et(this,{target:this.shadowRoot,props:q(this.attributes),customElement:!0},it,nt,X,{href:0,title:1,height:2,boxshadow:3,vertical:9,horizontal:10,zindex:4},null),e&&(e.target&&H(e.target,this,e.anchor),e.props&&(this.$set(e.props),c()))}static get observedAttributes(){return["href","title","height","boxshadow","vertical","horizontal","zindex"]}get href(){return this.$$.ctx[0]}set href(e){this.$$set({href:e}),c()}get title(){return this.$$.ctx[1]}set title(e){this.$$set({title:e}),c()}get height(){return this.$$.ctx[2]}set height(e){this.$$set({height:e}),c()}get boxshadow(){return this.$$.ctx[3]}set boxshadow(e){this.$$set({boxshadow:e}),c()}get vertical(){return this.$$.ctx[9]}set vertical(e){this.$$set({vertical:e}),c()}get horizontal(){return this.$$.ctx[10]}set horizontal(e){this.$$set({horizontal:e}),c()}get zindex(){return this.$$.ctx[4]}set zindex(e){this.$$set({zindex:e}),c()}}customElements.define("ukraine-ribbon",ot)});