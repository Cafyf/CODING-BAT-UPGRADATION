<style lang="css" scoped src="./question.css"></style>
<script src="./questionsPrb.js" ></script>
<template>
  <div class="question-section">
    {{problemContainer.problemQuestion}}
    <div class="input-desc">
       <span v-for="(inputDesc,index) in problemContainer.sampleInputDesc" :key="index">
         {{inputDesc.desc+" "+inputDesc.ans}} <br> 
         </span> 
    </div>
  </div>
</template>



