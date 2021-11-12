import foo1 from 'utils';
import foo2 from './utils';
import foo3 from './utils/foo';
import foo4 from '@utils-b/foo';
import foo5 from 'src/@utils';
import foo6 from './foo';
export { a } from './utils/a';
import('utils');
import('./utils');
import('./utils/foo');
import('@utils-b/foo');
import('src/@utils');
import('./foo');

require('./utils/b');

var b = require('./utils/b');