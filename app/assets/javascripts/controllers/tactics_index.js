$(document).on("turbolinks:load", function() {
  if ($("#tactics-index-app").length > 0) {
    initTacticsIndexVue();
  }
  if($(".swiper-container--tacticsIndex").length > 0){
    initTacticSwiper();
  }
});

function initTacticsIndexVue() {
  new Vue({
    el: "#tactics-index-app",
    data: {
      shouldLeftSidebarFixed: false
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
      }
    }
  });
}

function initTacticSwiper() {
  new Swiper('.swiper-container--tacticsIndex', {
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
