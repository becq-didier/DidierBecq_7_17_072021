<template>
  <div class="home">
    <MessageAll />
    <div class="logo">
      <img alt="Vue logo" src="../assets/logo.png">
    </div>
  </div>
</template>
<script lang="ts">

import MessageAll from '../components/MessageAll.vue'
export default {
  components: {
   MessageAll
  }
}
</script>
<style scoped lang="scss">
.logo img{
  width: 85%;
  padding:  10px;
}
.home{
  text-align: center;
}

</style>


