
<script>
export default {
  name: 'VitxSiteBuiltHeader'
}
</script>

<template>
  <section class="vitx-built-header">
    <a class="vitx-built-header__logo">
      <img src="config.logo" />
      <span>Vitx Site</span>
    </a>
  </section>
</template>

<style lang="less">
@import "vitx-site-common/styles/mixin.less";

.vitx-built-header {
  .vitx-built-row;

  display: flex;
  align-items: center;
  height: var(--vitx-built-header-height);
  padding: 0 var(--vitx-built-padding);

  &__logo {
    display: block;

    img,
    span {
      display: inline-block;
      vertical-align: middle;
    }

    img {
      width: 28px;
      margin-right: 12px;
    }

    span {
      color: #fff;
      font-size: 22px;
    }
  }
}
</style>
