<template>
	<div id="didi-navigator">
		<ul>
			<li v-for="tab in tabs">
				{{tab.text}}
			</li>
		</ul>
	</div>
</template>

<script>
  export default {
  	data: function() {
  		return {
  			tabs: [
	  			{text: '巴士'},
	  			{text: '快车'},
	  			{text: '专车'},
	  			{text: '顺风车'},
	  			{text: '出租车'},
	  			{text: '代驾'},
	  		]
	  	};
  	}
  }
</script>