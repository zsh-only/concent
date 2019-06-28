
import { MODULE_GLOBAL } from '../../support/constant';
import * as util from '../../support/util';

export default function (specModule, key, stateModule, connectSpecLike, moduleStateKeys, globalStateKeys, ctx, writeRefComputedWhenRefIsCfrag = false) {
  let skip = false;
  let keyModule = '';
  let stateKey = key;

  if (key.includes('/')) {// moduledKey : 'foo/f1'
    let [tmpKeyModule, unmoduledKey] = key.split('/');

    if (tmpKeyModule === '') {// '/f1'，观察实例所属模块的key
      tmpKeyModule = specModule;
      stateKey = specModule + key;
    }

    keyModule = tmpKeyModule;
    //这个key的模块不是提交state所属的模块，也不属于global模块, 对应的watch就需要排除掉
    //因为setState只提交自己模块的数据，所以如果tmpKeyModule是其他模块，这里并不会被触发
    //dispatch调用如果指定了其他模块，是会触发这里的逻辑的
    if (keyModule !== MODULE_GLOBAL && keyModule !== stateModule) {
      skip = true;
    } else if (!connectSpecLike[stateModule]) {//key的模块没有在connect里定义过
      //??? need strict
      skip = true;
    } else if (!moduleStateKeys.includes(unmoduledKey) && !globalStateKeys.includes(unmoduledKey)) {
      //??? need strict
      util.justWarning(`moduled key[${key}] is invalid`);
      skip = true;
    } else {
      stateKey = unmoduledKey;
    }
  } else {
    //如果是CcFragment实例调用watch，写无模块的key
    if (ctx && ctx.isCcFragment) {
      //必需强制为true，才会写state;
      if (writeRefComputedWhenRefIsCfrag !== true) skip = true;
    }
  }

  return { skip, stateKey, keyModule };
} 