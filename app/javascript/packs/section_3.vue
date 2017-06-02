<template>
	<div>
    <p v-if="greeting">If Hello</p>
    <p v-show="greeting">Show Hello></p>
    <p v-if="ok">我是对的</p>
    <p v-else>我是错的</p>
    <p v-show="isShow">显示</p>
    <p v-show="!isShow">不显示</p>

    <form>
      姓名<input type="text" v-model="user.name" placeholder=""><br/>
      年龄<input v-model.lazy.number="user.age" debounce="5000" placeholder=""><br/>
      {{user.age}}<br/>
      性别
      <input type="radio" id="man" value="One" v-model="user.sex"/>
      <label for="man">男</label>
      <input type="radio" id="lady" value="Two" v-model="user.sex"/>
      <label for="lady">女</label><br/>
      兴趣
      <input type="checkbox" id="book" value="book" v-model="user.interest"/>
      <label for="book">阅读</label>
      <input type="checkbox" id="swim" value="swim" v-model="user.interest"/>
      <label for="swim">游泳</label>
      <input type="checkbox" id="game" value="game" v-model="user.interest"/>
      <label for="game">游戏</label>
      <input type="checkbox" id="song" value="song" v-model="user.interest"/>
      <label for="song">唱歌</label>
      <br/>
      身份
      <select v-model="user.identity">
        <option value="teacher" selected>教师</option>
        <option value="doctor">医生</option>
        <option value="layer">律师</option>
      </select>
      
    </form>
	</div>
</template>

<script>
  export default {
  	data: function(){
  		return {
        greeting: true,
        ok: false,
        isShow: false,
        user: {
          name: '冯焯佳',
          age: 37,
          sex: 'One',
          interest: ['book', 'song'],
          identity: 'doctor'
        }
  		}
  	},
  	methods: {
  	}
  }
</script>