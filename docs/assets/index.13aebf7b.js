var e=Object.defineProperty,t=Object.defineProperties,r=Object.getOwnPropertyDescriptors,n=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,i=(t,r,n)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[r]=n,a=(e,t)=>{for(var r in t||(t={}))o.call(t,r)&&i(e,r,t[r]);if(n)for(var r of n(t))l.call(t,r)&&i(e,r,t[r]);return e};import{R as s,n as c,r as m,c as d,s as p,a as f}from"./vendor.4f85670d.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const r of e)if("childList"===r.type)for(const e of r.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();class u extends m.exports.Component{get children(){const{items:e,template:t}=this.props;return e.map(((r,n)=>t({items:e,item:r,index:n})))}get properties(){const e=this.props,{className:t,nodeName:r,items:i,template:c,children:m,sizeKey:p,allowEmpty:f,forwardedRef:u}=e,y=((e,t)=>{var r={};for(var i in e)o.call(e,i)&&t.indexOf(i)<0&&(r[i]=e[i]);if(null!=e&&n)for(var i of n(e))t.indexOf(i)<0&&l.call(e,i)&&(r[i]=e[i]);return r})(e,["className","nodeName","items","template","children","sizeKey","allowEmpty","forwardedRef"]);return r===s.Fragment?null:a({"data-component":"react-list",ref:u,className:d("react-list",t)},y)}render(){const{nodeName:e,items:t,sizeKey:r,allowEmpty:n}=this.props;return n||t&&t[r]?s.createElement(e,this.properties,this.children):null}}u.displayName="react-list",u.version="__VERSION__",u.defaultProps={items:[],sizeKey:"length",nodeName:s.Fragment,template:c,allowEmpty:!1};var y=s.forwardRef(((e,n)=>{return s.createElement(u,(o=a({},e),t(o,r({ref:n}))));var o}));const g=p.div`
  width: 80%;
  margin: 30px auto 0;
`,E=["item1","item2","item3","item4","item5"];var b=e=>{const t=s.createRef(),r=s.createRef();return s.createElement(g,null,s.createElement(y,{ref:t,forwardedRef:r,as:"ul",items:E,template:({item:e,index:t})=>s.createElement("li",{key:t},e)}),s.createElement("button",{onClick:e=>console.log(t)},"click-instance-ref1"),s.createElement("button",{onClick:e=>console.log(r)},"click-dom-ref2"))};f.render(s.createElement(s.StrictMode,null,s.createElement(b,null)),document.getElementById("root"));