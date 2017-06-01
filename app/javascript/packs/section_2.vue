<template>
	<div>
		<span>Text: {{text}}</span><br/>
		<span>html: <span v-html="html"></span></span><br/>
		<div :id="id">ID</div>
		<div>{{cents/100}}</div>
		<div>{{true? 1 : 0}}</div>
		<div>{{example.split(",")}}</div>
		<div v-if="show">Show This</div>
		<div><a :href="url">baidu</a></div>
		<div v-on:click="onclick1">Click 1</div>
	</div>
</template>

<script>
  export default {
  	data: function(){
  		return {
  			id: 5,
  			text: '插值文本',
  			html: '<i>强调的内容</i>',
  			cents: 1000,
  			example: "abc, ABC, aBc",
  			upperCase: 'abcABCaBc',
  			show: true,
  			url: "http://baidu.com"
  		}
  	},
  	methods: {
  		onclick1: function(){
  			alert(1);
  		}
  	}
  }
</script>