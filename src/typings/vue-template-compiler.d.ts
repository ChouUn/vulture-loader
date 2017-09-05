
/**
 * package: https://www.npmjs.com/package/vue-template-compiler
 * github: https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler
 * flow: https://github.com/vuejs/vue/blob/dev/flow/compiler.js
 */
declare module 'vue-template-compiler' {
  type Maybe<T> = T | null | void
  
  type NameValue = { 
    name: string 
    value: string 
  }

  type ICompilerOptions = {
    warn?: Function // allow customizing warning in different environments; e.g. node
    expectHTML?: boolean // only false for non-web builds
    modules?: Array<ModuleOptions> // platform specific modules; e.g. style; class
    staticKeys?: string // a list of AST properties to be considered static; for optimization
    directives?: { [key: string]: Function } // platform specific directives
    isUnaryTag?: (tag: string) => Maybe<boolean> // check if a tag is unary for the platform
    canBeLeftOpenTag?: (tag: string) => Maybe<boolean> // check if a tag can be left opened
    isReservedTag?: (tag: string) => Maybe<boolean> // check if a tag is a native for the platform
    mustUseProp?: (tag: string, type: Maybe<string>, name: string) => boolean // check if an attribute should be bound as a property
    isPreTag?: (attr: string) => Maybe<boolean> // check if a tag needs to preserve whitespace
    getTagNamespace?: (tag: string) => Maybe<string> // check the namespace for a tag
    transforms?: Array<Function> // a list of transforms on parsed AST before codegen
    preserveWhitespace?: boolean
    isFromDOM?: boolean
    shouldDecodeTags?: boolean
    shouldDecodeNewlines?: boolean
  
    // for ssr optimization compiler
    scopeId?: string
  
    // runtime user-configurable
    delimiters?: [string, string] // template delimiters
  
    // allow user kept comments
    comments?: boolean
  }
  
  type ICompiledResult = {
    ast: Maybe<ASTElement>
    render: string
    staticRenderFns: Array<string>
    stringRenderFns?: Array<string>
    errors?: Array<string>
    tips?: Array<string>
  }
  
  type ModuleOptions = {
    preTransformNode: (el: ASTElement) => void
    transformNode: (el: ASTElement) => void // transform an element's AST node
    postTransformNode: (el: ASTElement) => void
    genData: (el: ASTElement) => string // generate extra data string for an element
    transformCode?: (el: ASTElement, code: string) => string // further transform generated code for an element
    staticKeys?: Array<string> // AST properties to be considered static
  }
  
  type ASTModifiers = { [key: string]: boolean }
  type ASTIfConditions = Array<{ 
    exp: Maybe<string>
    block: ASTElement
  }>
  
  type ASTElementHandler = {
    value: string
    modifiers: Maybe<ASTModifiers>
  }
  
  type ASTElementHandlers = {
    [key: string]: ASTElementHandler | Array<ASTElementHandler>
  }
  
  type ASTDirective = {
    name: string
    rawName: string
    value: string
    arg: Maybe<string>
    modifiers: Maybe<ASTModifiers>
  }
  
  type ASTNode = ASTElement | ASTText | ASTExpression
  
  type ASTElement = {
    type: 1
    tag: string
    attrsList: Array<NameValue>
    attrsMap: { [key: string]: string | null }
    parent: ASTElement | void
    children: Array<ASTNode>
  
    static?: boolean
    staticRoot?: boolean
    staticInFor?: boolean
    staticProcessed?: boolean
    hasBindings?: boolean
  
    text?: string
    attrs?: Array<NameValue>
    props?: Array<NameValue>
    plain?: boolean
    pre?: true
    ns?: string
  
    component?: string
    inlineTemplate?: true
    transitionMode?: string | null
    slotName?: Maybe<string>
    slotTarget?: Maybe<string>
    slotScope?: Maybe<string>
    scopedSlots?: { [name: string]: ASTElement }
  
    ref?: string
    refInFor?: boolean
  
    if?: string
    ifProcessed?: boolean
    elseif?: string
    else?: true
    ifConditions?: ASTIfConditions
  
    for?: string
    forProcessed?: boolean
    key?: string
    alias?: string
    iterator1?: string
    iterator2?: string
  
    staticClass?: string
    classBinding?: string
    staticStyle?: string
    styleBinding?: string
    events?: ASTElementHandlers
    nativeEvents?: ASTElementHandlers
  
    transition?: string | true
    transitionOnAppear?: boolean
  
    model?: {
      value: string
      callback: string
      expression: string
    }
  
    directives?: Array<ASTDirective>
  
    forbidden?: true
    once?: true
    onceProcessed?: boolean
    wrapData?: (code: string) => string
    wrapListeners?: (code: string) => string
  
    // 2.4 ssr optimization
    ssrOptimizability?: number
  
    // weex specific
    appendAsTree?: boolean
  }
  
  type ASTExpression = {
    type: 2
    expression: string
    text: string
    static?: boolean
    // 2.4 ssr optimization
    ssrOptimizability?: number
  }
  
  type ASTText = {
    type: 3
    text: string
    static?: boolean
    isComment?: boolean
    // 2.4 ssr optimization
    ssrOptimizability?: number
  }
  
  // SFC-parser related declarations
  
  // an object format describing a single-file component.
  type SFCDescriptor = {
    template: Maybe<SFCBlock>
    script: Maybe<SFCBlock>
    styles: Array<SFCBlock>
    customBlocks: Array<SFCCustomBlock>
  }
  
  type SFCCustomBlock = {
    type: string
    content: string
    start?: number
    end?: number
    src?: string
    attrs: { [attribute: string]: string }
  }
  
  type SFCBlock = {
    type: string
    content: string
    start?: number
    end?: number
    lang?: string
    src?: string
    scoped?: boolean
    module?: string | boolean
  }

  import Vue, { CreateElement, VNode } from 'vue'

  interface ICompiledFunctionsResult {
    render?: <V extends Vue>(this: V, createElement: CreateElement) => VNode,
    staticRenderFns?: ((createElement: CreateElement) => VNode)[],
  }

  /**
   * Compiles a template string and returns compiled JavaScript code.
   * @param template 
   * @param options 
   * @return Note the returned function code uses with and thus cannot be used in strict mode code.
   */
  export function compile(template: string, options?: ICompilerOptions): ICompiledResult
  /**
   * Similar to compiler.compile, but directly returns instantiated functions.
   * @param template 
   */
  export function compileToFunctions(template: string): ICompiledFunctionsResult
  /**
   * Same as compiler.compile but generates SSR-specific render function code by optimizing parts of the template into string concatenation in order to improve SSR performance.
   * This is used by default in vue-loader@>=12 and can be disabled using the optimizeSSR option.
   * @param template 
   * @param options 
   */
  export function ssrCompile(template: string, options?: ICompilerOptions): ICompiledResult
  /**
   * Same as compiler.compileToFunction but generates SSR-specific render function code by optimizing parts of the template into string concatenation in order to improve SSR performance.
   * @param template 
   */
  export function ssrCompileToFunctions(template: string): ICompiledFunctionsResult
  /**
   * Parse a SFC (single-file component, or *.vue file) into a descriptor (refer to the SFCDescriptor type in flow declarations). This is used in SFC build tools like vue-loader and vueify.
   * @param template 
   * @param options 
   */
  export function parseComponent(template: string, options?: { pad?: string }): SFCDescriptor
}
