
/**
 * package: https://www.npmjs.com/package/vue-template-es2015-compiler
 * github: https://github.com/vuejs/vue-template-es2015-compiler
 */
declare module 'vue-template-es2015-compiler' {
  function transpile(code: string, options?: any): string;
  export = transpile;
}
