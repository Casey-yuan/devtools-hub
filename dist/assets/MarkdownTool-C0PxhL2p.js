import{c as L,p as q,u as z,j as e,b as v}from"./index-CgU9bVkb.js";import{r as i}from"./vendor-DT3YKpTB.js";import{T as G}from"./ToolLayout-S9I0IlPv.js";import{Q as K,E as O,U as Q,V as U,Y as V,w as W,e as Y,_ as J}from"./ui-4aLoVveB.js";const X=L()(q((d,o)=>({docs:[],activeDocId:null,addDoc:(s,a)=>{const n=Date.now().toString(36)+Math.random().toString(36).substr(2,5),l={id:n,title:s,content:a,createdAt:Date.now(),updatedAt:Date.now()};return d(g=>({docs:[l,...g.docs],activeDocId:n})),n},updateDoc:(s,a)=>{d(n=>({docs:n.docs.map(l=>l.id===s?{...l,...a,updatedAt:Date.now()}:l)}))},deleteDoc:s=>{d(a=>{var l;const n=a.docs.filter(g=>g.id!==s);return{docs:n,activeDocId:a.activeDocId===s?((l=n[0])==null?void 0:l.id)||null:a.activeDocId}})},setActiveDoc:s=>d({activeDocId:s}),getActiveDoc:()=>{const{docs:s,activeDocId:a}=o();return s.find(n=>n.id===a)}}),{name:"devtools-markdown-docs"}));function Z(d){let o=d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/^### (.*$)/gim,"<h3>$1</h3>").replace(/^## (.*$)/gim,"<h2>$1</h2>").replace(/^# (.*$)/gim,"<h1>$1</h1>").replace(/\*\*\*(.*?)\*\*\*/g,"<strong><em>$1</em></strong>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/___(.*?)___/g,"<strong><em>$1</em></strong>").replace(/__(.*?)__/g,"<strong>$1</strong>").replace(/_(.*?)_/g,"<em>$1</em>").replace(/```(\w+)?\n([\s\S]*?)```/g,"<pre><code>$2</code></pre>").replace(/`([^`]+)`/g,"<code>$1</code>").replace(/^&gt; (.*$)/gim,"<blockquote>$1</blockquote>").replace(/^\- (.*$)/gim,"<li>$1</li>").replace(/^\d+\. (.*$)/gim,"<li>$1</li>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" class="text-primary underline">$1</a>').replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1" class="rounded-lg max-w-full" />').replace(/^---$/gim,"<hr />").replace(/\n/g,"<br />");return o=o.replace(/(<li>.*<\/li>)(<br \/>)?/g,"<ul>$1</ul>"),o}const S=`# 欢迎使用 Markdown 编辑器

这是一个简洁的 Markdown 编辑工具，支持实时预览。

## 功能特点

- **实时预览**: 左侧编辑，右侧即时渲染
- **文档管理**: 支持创建、保存、删除多篇文档
- **本地存储**: 所有文档保存在浏览器本地

## 常用语法

### 文本样式
- **粗体**: 使用两个星号 **粗体**
- *斜体*: 使用一个星号 *斜体*
- ~~删除线~~: 使用波浪线

### 代码
行内代码: \`const x = 1\`

代码块:
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 列表
1. 有序列表项
2. 另一个项
   - 子项
   - 另一个子项

### 引用
> 这是一段引用文字

### 链接和图片
[访问 GitHub](https://github.com)

---

开始编写你的文档吧！
`;function oe(){const{docs:d,activeDocId:o,addDoc:s,updateDoc:a,deleteDoc:n,setActiveDoc:l,getActiveDoc:g}=X(),[f,p]=i.useState(""),[m,x]=i.useState(""),[u,C]=i.useState(!0),[w,T]=i.useState(!0),[_,j]=i.useState(!1),I=i.useRef(null),{addToast:b}=z(),N=g();i.useEffect(()=>{N?(p(N.title),x(N.content)):d.length===0&&(s("未命名文档",S),p("未命名文档"),x(S))},[o]),i.useEffect(()=>{if(!o||!f.trim())return;const t=setTimeout(()=>{a(o,{title:f,content:m})},1e3);return()=>clearTimeout(t)},[f,m,o,a]);const E=i.useCallback(()=>{s("未命名文档",`# 新文档

开始编写...`),p("未命名文档"),x(`# 新文档

开始编写...`),b("新文档已创建","success")},[s,b]),M=i.useCallback((t,c)=>{c.stopPropagation(),window.confirm("确定要删除这篇文档吗？")&&(n(t),b("文档已删除","info"))},[n,b]),A=t=>{const c=new Date(t);return`${c.getMonth()+1}/${c.getDate()} ${c.getHours()}:${c.getMinutes().toString().padStart(2,"0")}`},r=(t,c="")=>{const h=document.getElementById("markdown-editor");if(!h)return;const k=h.selectionStart,D=h.selectionEnd,P=m.substring(k,D),R=m.substring(0,k),B=m.substring(D),$=P||c,F=R+t.replace("{{text}}",$)+B;x(F),setTimeout(()=>{h.focus();const y=k+t.indexOf("{{text}}")+$.length;h.setSelectionRange(y,y)},0)},H=[{label:"H1",action:()=>r(`# {{text}}
`,"标题")},{label:"H2",action:()=>r(`## {{text}}
`,"标题")},{label:"H3",action:()=>r(`### {{text}}
`,"标题")},{label:"B",action:()=>r("**{{text}}**","粗体")},{label:"I",action:()=>r("*{{text}}*","斜体")},{label:"`",action:()=>r("`{{text}}`","代码")},{label:"```",action:()=>r("```\n{{text}}\n```","代码块")},{label:">",action:()=>r(`> {{text}}
`,"引用")},{label:"-",action:()=>r(`- {{text}}
`,"列表项")},{label:"[]",action:()=>r("[{{text}}](url)","链接文本")}];return e.jsx(G,{title:"Markdown编辑器",description:"支持实时预览的 Markdown 文档编辑工具",children:e.jsxs("div",{className:"flex flex-col gap-4 h-[calc(100vh-12rem)]",children:[e.jsxs("div",{className:"flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("button",{onClick:()=>T(!w),className:v("inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all",w?"bg-accent text-foreground":"text-muted-foreground hover:bg-accent"),title:"文档列表",children:e.jsx(K,{className:"h-4 w-4"})}),e.jsx("div",{className:"mx-2 h-4 w-px bg-border"}),H.map(t=>e.jsx("button",{onClick:t.action,className:"inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-xs font-mono font-bold text-muted-foreground transition-all hover:bg-accent hover:text-foreground",children:t.label},t.label))]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("button",{onClick:()=>C(!u),className:v("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",u?"bg-primary text-primary-foreground shadow-md":"text-muted-foreground hover:bg-accent"),children:[u?e.jsx(O,{className:"h-4 w-4"}):e.jsx(Q,{className:"h-4 w-4"}),u?"预览中":"编辑中"]}),e.jsxs("button",{onClick:E,className:"btn-primary inline-flex items-center gap-1.5",children:[e.jsx(U,{className:"h-4 w-4"}),"新建"]})]})]}),e.jsxs("div",{className:"flex flex-1 gap-4 min-h-0",children:[w&&e.jsxs("div",{className:"flex w-56 flex-col gap-2 rounded-xl border border-border bg-background p-3 overflow-hidden",children:[e.jsx("h3",{className:"text-sm font-semibold px-1",children:"文档列表"}),e.jsx("div",{className:"flex flex-col gap-1 overflow-y-auto flex-1",children:d.map(t=>e.jsxs("button",{onClick:()=>{l(t.id),p(t.title),x(t.content)},className:v("group flex flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-all",o===t.id?"bg-primary text-primary-foreground shadow-sm":"hover:bg-accent"),children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(V,{className:"h-3.5 w-3.5 shrink-0"}),e.jsx("span",{className:"text-sm font-medium truncate flex-1",children:t.title}),o===t.id&&e.jsx(W,{className:"h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",onClick:c=>M(t.id,c)})]}),e.jsxs("div",{className:"flex items-center gap-1 text-xs opacity-60",children:[e.jsx(Y,{className:"h-3 w-3"}),A(t.updatedAt)]})]},t.id))})]}),e.jsxs("div",{className:"flex flex-1 gap-4 min-h-0",children:[e.jsxs("div",{className:v("flex flex-col gap-2 min-h-0","flex-1"),children:[e.jsxs("div",{className:"flex items-center gap-2",children:[_?e.jsx("input",{ref:I,type:"text",value:f,onChange:t=>p(t.target.value),onBlur:()=>j(!1),onKeyDown:t=>{t.key==="Enter"&&j(!1)},className:"flex-1 rounded-lg border border-input bg-background px-3 py-2 text-lg font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",autoFocus:!0}):e.jsx("button",{onClick:()=>j(!0),className:"text-lg font-bold hover:text-primary transition-colors",children:f||"点击编辑标题"}),e.jsxs("span",{className:"text-xs text-muted-foreground flex items-center gap-1",children:[e.jsx(J,{className:"h-3 w-3"}),"自动保存"]})]}),e.jsx("textarea",{id:"markdown-editor",value:m,onChange:t=>x(t.target.value),className:"flex-1 rounded-lg border border-input bg-background p-4 text-sm font-mono leading-relaxed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none overflow-y-auto",placeholder:"开始编写 Markdown...",spellCheck:!1})]}),u&&e.jsxs("div",{className:"flex flex-col gap-2 flex-1 min-h-0",children:[e.jsx("div",{className:"flex items-center justify-between px-1",children:e.jsx("span",{className:"text-sm font-medium text-muted-foreground",children:"预览"})}),e.jsx("div",{className:"flex-1 rounded-lg border border-border bg-background p-6 overflow-y-auto prose prose-sm max-w-none",dangerouslySetInnerHTML:{__html:Z(m)}})]})]})]})]})})}export{oe as default};
//# sourceMappingURL=MarkdownTool-C0PxhL2p.js.map
