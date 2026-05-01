import{u,j as e}from"./index-CgU9bVkb.js";import{r as i}from"./vendor-DT3YKpTB.js";import{T as f}from"./ToolLayout-S9I0IlPv.js";import{C as j}from"./ClearButton-CmOWGeBO.js";import{x as w,y as v,M as N,z as y,J as C,O as T}from"./ui-4aLoVveB.js";const c=`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>示例页面</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 10px;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 500;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="card">
        <h1>Hello World</h1>
        <p>这是一个 HTML 预览示例。你可以在左侧编辑代码，实时看到渲染效果。</p>
        <a href="#" class="btn">点击我</a>
    </div>
</body>
</html>`,m={desktop:{width:"100%",icon:N,label:"桌面"},tablet:{width:"768px",icon:v,label:"平板"},mobile:{width:"375px",icon:w,label:"手机"}};function z(){const[s,l]=i.useState(c),[o,x]=i.useState("desktop"),[r,n]=i.useState(!1),{addToast:t}=u(),h=i.useCallback(async()=>{try{await navigator.clipboard.writeText(s),n(!0),t("已复制 HTML 代码","success"),setTimeout(()=>n(!1),2e3)}catch{t("复制失败","error")}},[s,t]),p=i.useCallback(()=>{l(c),t("已重置为默认代码","info")},[t]),b=()=>{l(""),t("已清空","info")};return e.jsx(f,{title:"HTML预览",description:"实时预览 HTML 代码渲染效果",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-3",children:[e.jsx("div",{className:"flex items-center gap-1",children:Object.entries(m).map(([a,d])=>{const g=d.icon;return e.jsxs("button",{onClick:()=>x(a),className:`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${o===a?"bg-primary text-primary-foreground shadow-md":"text-muted-foreground hover:bg-accent hover:text-foreground"}`,children:[e.jsx(g,{className:"h-4 w-4"}),d.label]},a)})}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("button",{onClick:h,className:"btn-ghost inline-flex items-center gap-1.5",children:[r?e.jsx(y,{className:"h-4 w-4 text-green-500"}):e.jsx(C,{className:"h-4 w-4"}),r?"已复制":"复制"]}),e.jsxs("button",{onClick:p,className:"btn-ghost inline-flex items-center gap-1.5",children:[e.jsx(T,{className:"h-4 w-4"}),"重置"]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"HTML 代码"}),e.jsxs("div",{className:"relative",children:[e.jsx("textarea",{value:s,onChange:a=>l(a.target.value),className:"flex-1 min-h-[400px] w-full rounded-lg border border-input bg-background p-4 pr-10 text-sm font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y",placeholder:"输入 HTML 代码...",spellCheck:!1}),e.jsx(j,{onClick:b,visible:s.length>0})]})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"实时预览"}),e.jsx("div",{className:"flex-1 rounded-lg border border-border bg-muted p-2 overflow-auto min-h-[400px]",children:e.jsx("div",{className:"mx-auto transition-all duration-300",style:{width:m[o].width,maxWidth:"100%"},children:e.jsx("iframe",{srcDoc:s,className:"w-full min-h-[500px] rounded-lg border border-border bg-white",sandbox:"allow-scripts",title:"HTML Preview"})})})]})]}),e.jsxs("div",{className:"rounded-xl border border-border bg-muted/50 p-4",children:[e.jsx("h3",{className:"text-sm font-semibold mb-2",children:"使用提示"}),e.jsxs("ul",{className:"text-sm text-muted-foreground space-y-1 list-disc list-inside",children:[e.jsx("li",{children:"支持完整的 HTML、CSS 和 JavaScript 代码"}),e.jsx("li",{children:"可以切换桌面/平板/手机视图预览响应式效果"}),e.jsx("li",{children:"代码修改后会实时更新预览"}),e.jsx("li",{children:"出于安全考虑，部分功能（如弹窗、外部链接）可能受限"})]})]})]})})}export{z as default};
//# sourceMappingURL=HtmlPreviewTool-DZJDsClp.js.map
