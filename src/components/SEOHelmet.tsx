import { useEffect } from 'react'
import { getToolByPath } from '@/config/tools'

interface SEOHelmetProps {
  title?: string
  description?: string
  path?: string
}

const DEFAULT_TITLE = 'DevTools Hub - 开发者工具箱'
const DEFAULT_DESCRIPTION = '一系列实用的在线开发工具，包括 JSON 格式化、编码解码、哈希计算、正则测试等，全部在浏览器本地运行，无需上传数据到服务器。'

// 百度统计 ID（需要替换为你自己的）
const BAIDU_TONGJI_ID = ''

export default function SEOHelmet({ title, description, path }: SEOHelmetProps) {
  useEffect(() => {
    // 如果提供了 path，从工具配置中获取信息
    let pageTitle = title
    let pageDescription = description

    if (path && !title) {
      const tool = getToolByPath(path)
      if (tool) {
        pageTitle = `${tool.name} - DevTools Hub`
        pageDescription = tool.description
      }
    }

    // 设置页面标题
    document.title = pageTitle || DEFAULT_TITLE

    // 设置 meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', pageDescription || DEFAULT_DESCRIPTION)

    // 设置 Open Graph meta 标签
    const setMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('property', property)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    setMetaTag('og:title', pageTitle || DEFAULT_TITLE)
    setMetaTag('og:description', pageDescription || DEFAULT_DESCRIPTION)
    setMetaTag('og:type', 'website')

    // 清理函数
    return () => {
      // 可选：恢复默认标题
      // document.title = DEFAULT_TITLE
    }
  }, [title, description, path])

  return null
}

// 百度统计组件
export function BaiduTongji() {
  useEffect(() => {
    if (!BAIDU_TONGJI_ID) return

    // 插入百度统计代码
    const script = document.createElement('script')
    script.innerHTML = `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?${BAIDU_TONGJI_ID}";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    `
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
