import { createRouter, createWebHashHistory } from 'vue-router';
export var router = createRouter({
  history: createWebHashHistory(),
  routes: [],
  scrollBehavior: function scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash
      };
    }

    return {
      top: 0
    };
  }
});
export default router;