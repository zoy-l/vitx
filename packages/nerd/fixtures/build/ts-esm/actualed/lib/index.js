function foo(opts) {
  return opts.foo ? "foo" : "bar";
}
export {
  foo as default
};