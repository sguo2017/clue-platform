$(document).on("turbolinks:load", function() {
  if ($("#tactics-index-app").length > 0) {
    initTacticsIndexVue();
  }
  if($(".swiper-container").length > 0){
    initTacticSwiper();
  }
});

function initTacticsIndexVue() {
  var Modal = {
  	template: "#modal-template",
    created: function(){
      this.$emit('show');
    },
    data: function(){
      return {
        modalWidth: "600px"
      }
    }
  };
  new Vue({
    el: "#tactics-index-app",
    components: {
  		"modal": Modal
  	},
    data: {
      shouldLeftSidebarFixed: false,
      showModal: false,
      hasCasesLoaded: false,
      cases: [],
      selectedCase: "",
      selectedCases: [],
      start_time: null
    },
    mounted: function() {
      window.addEventListener('scroll', this.adjustLeftSidebar);
    },
    computed: {
      leftSidebarPosition: function() {
        return this.shouldLeftSidebarFixed ? {
          position: "fixed",
          top: 0,
          marginTop: 0
        } : {
          position: "absolute"
        }
      }
    },
    methods: {
      adjustLeftSidebar: function() {
        var distance = $(window).scrollTop();
        this.shouldLeftSidebarFixed = (distance > 100 ? true : false);
      },
      loadCases: function(){
        if(!this.hasCasesLoaded){
          var outer = this;
          $.ajax({
            url: "/cases/",
            method: "GET",
            dataType: "JSON"
          }).done(function(response){
            if(response["data"]){
              outer.cases = response["data"].map(function(x){return {id: x.id, name: x.name}});
              outer.hasCasesLoaded = true;
            }
          });
        }
      },
      addCase: function(){
        if(this.selectedCases.indexOf(this.selectedCase) < 0){
          this.selectedCases.push(this.selectedCase);
        }
      },
      removeCase: function(c){
        var index = this.selectedCases.indexOf(c);
        if( index >= 0){
          this.selectedCases.splice(index,1);
          if(this.selectedCases.length == 1 && this.selectedCases[0] == ""){
            this.selectedCase = "";
          }
        }
      }
    },
    filters:{
      caseFilter: function(id,cases){
        var result = cases.filter(function(x){return x.id == id;});
        if(result.length > 0){
          return result[0].name;
        }else{
          return null;
        }
      },
      blankFilter: function(array){
        return array.filter(function(x){return x;});
      }
    }
  });
}

function initTacticSwiper() {
  new Swiper('.swiper-container', {
    effect: 'coverflow',
    slidesPerView: 3,
    centeredSlides: true,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    coverflow: {
      rotate: 10, //两边的图片跟y轴的角度，角度越大，视角所见就越小,默认为50
      stretch: 40, //每个slide之间的拉伸值，越大slide靠得越紧。 默认0。
      depth: 50, //slide的位置深度。值越大z轴距离越远，看起来越小。 默认100。
      modifier: 2,
      slideShadows: false //开启slide阴影。默认 true。
    }
  });
}
