//利用正则匹配解析template生成AST
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

let root = null;
let currentParent;
let stack = []
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

function createASTElement(tagName, attrs){
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }

}

function chars(text){
  text = text.replace(/\s/g,'')
  if (text) {
    currentParent.children.push({
      text,
      type: TEXT_TYPE
    })
  }
}

function start(tagName, attrs){
  let element = createASTElement(tagName, attrs)
  if (!root) {
    root = element
  }
  currentParent = element
  stack.push(element)
}

function end(tagName){
  //弹出最后一个元素 进行匹配
  let element = stack.pop()
  //判断标签闭合是否正确
  if (tagName === element.tag) {
    //判断父节点
    currentParent = stack[stack.length-1]
    //实现树结构的父子关系
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }
}

function parseHTML(html){
  //递归循环解析 html 模板
  while(html){
    let textEnd = html.indexOf('<');
    if (textEnd === 0) {
      //解析开始标签
      let startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        //开始标签匹配完成之后 可以直接进行下一次匹配
        continue
      }
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        //进行下一次匹配
        continue;
      }
    }
    //解析开始标签到下一个标签之间的文本 <div id='app'> xxxxxxxxxx <
    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      chars(text)
      advance(text.length)
    }
  }
  //去除已经解析完的html片段
  function advance(n){
    html = html.substring(n)
  }
  //解析开始标签
  function parseStartTag(){
    let start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      //start[0] 是解析出来的开始标签 <div
      advance(start[0].length)
      //开始解析属性
      //如果直接是结束标签 就不需要解析属性了
      let end, attr;
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
        //将已经匹配好的属性去掉
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        });
      }
      //如果结束了 返回匹配结果
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
  return root
}


export function compileToFunction(template){
  let root = parseHTML(template)
  console.log('root',root)
  return function render(){

  }
}