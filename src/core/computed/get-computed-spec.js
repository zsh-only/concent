
export default function (computed, ctx) {
  let computedSpec;
  const computedType = typeof computed;;
  if (computedType === 'function') computedSpec = computed(ctx);
  else if (computedType === 'object' && !Array.isArray(computed)) computedSpec = computed;
  else throw new Error('computed type can only be a function or a plain json object');

  return computedSpec;
}