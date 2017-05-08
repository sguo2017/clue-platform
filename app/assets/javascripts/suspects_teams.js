 
/* 
Instructions:
-------------
1. Select a user
2. Try to change Name or Nickname property
3. Press "Send message to user" button and watch the nice popup window
4. Select an other user too
5. Try the multiple property edit (e.g. change status)
6. Watch the "Add new user" button hover effect
 */


/* 
Pictures: 
	http://rapsag.deviantart.com/art/Walter-White-396773756
	http://ignis-vitae.deviantart.com/art/Jesse-Pinkman-Breaking-Bad-343381256
	http://jkim34.deviantart.com/art/Saul-Goodman-369909575
 */

function suspects_teams_init(){
  if($(".suspects_teams").length==0) return;


  var propertiesSchema, showUsers, users;

  users = [
    {
      id: 1,
      name: "张三丰",
      userName: "张三",
      realName: "张丹峰",
      email: "zhangsanfeng@qq.com",
      born: "广东广州",
      dob: "1956-03-07",
      photo: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/102308/walter_white_by_rapsag.d6k88l8_(1).jpg",
      status: true,
      created: "2015-03-30 22:49:32",
      skills: ["贩毒", "走私", "枪支"],
      settings: {
        themeColor: "#fab000",
        motto: "过往的犯罪历史"
      }
    }, {
      id: 2,
      name: "李思",
      userName: "李四",
      realName: "李斯",
      email: "lisi@qq.com",
      born: "四川成都",
      dob: "1979-08-27",
      photo: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/102308/jesse_pinkman___breaking_bad_by_ignis_vitae.d5ofuo8.jpg",
      status: true,
      created: "2015-03-30 23:50:11",
      skills: ["走私", "贩毒", "枪支"],
      settings: {
        themeColor: "#000",
        motto: "过往的犯罪历史..."
      }
    }, {
      id: 3,
      name: "王屋",
      userName: "王五",
      realName: "王武",
      email: "wangwu@qq.com",
      born: "新疆乌鲁木齐",
      dob: "1962-10-22",
      photo: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/102308/saul_goodman_by_jkim34.d648g1z.jpg",
      status: false,
      created: "2015-03-31 13:42:50",
      skills: ["贩毒", "枪支", "走私"],
      settings: {
        themeColor: "Red",
        motto: "过往的犯罪历史"
      }
    }
  ];

  showUsers = function() {
    var container, tpl;
    container = $(".users");
    container.html("");
    $.each(users, function(i, user) {
      var tpl, userDiv;
      tpl = Handlebars.compile($("#user-template").html());
      userDiv = $(tpl(user)).data("object", user).appendTo(container);
      if (!user.status) {
        return userDiv.addClass("inactive");
      }
    });
    tpl = Handlebars.compile($("#new-user-template").html());
    return $(tpl({})).appendTo(container);
  };

  $(function() {
    var getUserDivs, tl;
    showUsers();
    tl = new TimelineLite();
    tl.staggerTo(".user", 1, {
      opacity: 0.6,
      y: 0
    }, 0.2);
    $(".user .icon.status").on("click", function(e) {
      var userDiv;
      toastr.info("修改嫌疑人状态");
      userDiv = $(e.target).closest(".user");
      userDiv.toggleClass("inactive");
      userDiv.data("object").status = !userDiv.data("object").status;
      return e.stopPropagation();
    });
    $(".user .icon.delete").on("click", function(e) {
      toastr.info("删除嫌疑人");
      return e.stopPropagation();
    });
    $(".user .icon.clone").on("click", function(e) {
      toastr.info("复制嫌疑人");
      return e.stopPropagation();
    });
    $(".user .icon.send").on("click", function(e) {
      $(".popup").addClass("show");
      return e.stopPropagation();
    });
    $(".popup .icon i").on("click", function() {
      $(".popup").removeClass("show");
      return toastr.info("添加嫌疑人备注信息");
    });
    getUserDivs = function() {
      return $(".user.selected");
    };
    $(".user:not(.new)").on("click", function() {
      var $this, pjs, selectedCount, selectedObjs;
      $this = $(this);
      $this.toggleClass("selected");
      selectedCount = $(".user.selected").length;
      if (selectedCount > 0) {
        selectedObjs = [];
        $(".user.selected").each(function(i, user) {
          return selectedObjs.push($(user).data("object"));
        });
        pjs = new PJS(".propertyEditor", propertiesSchema, selectedObjs);
        pjs.on("changed", function(editor, value, objects) {
          var divs;
          divs = getUserDivs(objects);
          switch (editor.fieldName) {
            case "name":
              return $(divs).find(".info .name").text(value);
            case "userName":
              return $(divs).find(".info .nickName").text(value);
            case "born":
              return $(divs).find("dl dd:eq(0)").text(value);
            case "dob":
              return $(divs).find("dl dd:eq(1)").text(value);
            case "email":
              return $(divs).find("dl dd:eq(2)").text(value);
            case "status":
              if (value) {
                return $(divs).removeClass("inactive");
              } else {
                return $(divs).addClass("inactive");
              }
          }
        });
        pjs.on("function-sendMessage", function(editor, objects) {
          return $(".popup").addClass("show");
        });
        TweenLite.to(".editorBox", 0.8, {
          right: 0,
          ease: Power4.easeOut
        });
        return TweenLite.to(".users", 1.9, {
          "margin-right": "350px",
          ease: Power2.easeOut
        });
      } else {
        TweenLite.to(".editorBox", 0.8, {
          right: "-350px",
          ease: Power4.easeOut
        });
        return TweenLite.to(".users", 1.8, {
          "margin-right": "0px",
          ease: Power2.easeOut
        });
      }
    });
    return $(".user.new").on("click", function() {
      return toastr.success("添加新的嫌疑团伙成员");
    });
  });

  propertiesSchema = {
    editors: [
      {
        field: "name",
        title: "姓名",
        type: "text",
        required: true,
        multiEdit: true,
        featured: true
      }, {
        field: "userName",
        title: "外号",
        type: "text",
        required: true,
        multiEdit: false,
        featured: true
      }, {
        field: "realName",
        title: "曾用名",
        toolTip: "曾经使用过的名字",
        type: "text",
        required: false,
        multiEdit: false
      }, {
        field: "email",
        title: "邮箱",
        type: "email",
        required: false,
        multiEdit: false,
      }, {
        field: "password",
        title: "密码",
        type: "password",
        placeHolder: "Password",
        required: true,
        multiEdit: true,
        featured: true,
        toolTip: "输入嫌疑犯密码",
        hint: "最少6个字符",
        validate: function(value, objs) {
          if (value.length < 6) {
            return "密码太短了！必须6个字符以上";
          }
        }
      }, {
        field: "phone",
        title: "照片",
        type: "text",
        required: false,
        multiEdit: true,
        pattern: "^[0-9]{3}-[0-9]{4}$",
        hint: "Format: 000-0000"
      }, {
        field: "born",
        title: "出生地",
        type: "text",
        required: false,
        multiEdit: true
      }, {
        field: "dob",
        title: "出生日期",
        type: "date",
        format: "YYYY-MM-DD",
        required: false,
        multiEdit: true,
        validate: function(value, objs) {
          if (value === "1963-03-07") {
            return "非法日期";
          }
        }
      }, {
        field: "settings.isActor",
        title: "是否为主犯?",
        type: "boolean",
        required: true,
        "default": false,
        multiEdit: true
      }, {
        field: "status",
        title: "已落网",
        type: "boolean",
        required: true,
        "default": false,
        multiEdit: true
      }, {
        field: "created",
        title: "记录时间",
        type: "timestamp",
        format: "YYYY-MM-DD HH:mm:ss",
        required: false,
        readonly: true
      }, {
        field: "skills",
        title: "涉及犯罪",
        type: "checklist",
        multiEdit: true,
        listBox: false,
        required: true,
        rows: 6,
        values: ["走私", "贩毒", "枪支"]
      }, {
        field: "settings.motto",
        title: "备用信息",
        type: "textarea",
        required: false,
        multiEdit: true,
        placeHolder: "您想记录下来的什么内容?",
        rows: 3
      }, {
        field: "settings.nativeLang",
        title: "母语",
        type: "select",
        required: true,
        multiEdit: true,
        values: [
          {
            id: "en",
            name: "英文"
          }, {
            id: "de",
            name: "德语"
          }, {
            id: "it",
            name: "意大利"
          }, {
            id: "es",
            name: "西班牙"
          }, {
            id: "fr",
            name: "法语"
          }
        ]
      }, {
        field: "sendMessage",
        title: "添加备注信息",
        styleClass: "fa fa-envelope",
        type: "button",
        multiEdit: true,
        schemaFunction: true
      }, {
        field: "clone",
        title: "复制嫌疑人",
        styleClass: "fa fa-copy",
        type: "button",
        schemaFunction: true,
        multiEdit: false,
        onclick: function(objs) {
          return toastr.info("复制了 " + objs.length + " 个嫌疑犯");
        }
      }, {
        field: "delete",
        title: "删除嫌疑人",
        styleClass: "fa fa-trash",
        type: "button",
        schemaFunction: true,
        multiEdit: true,
        onclick: function(objs) {
          return toastr.info("删除了 " + objs.length + " 个嫌疑犯");
        }
      }
    ]
  };

}

document.addEventListener("turbolinks:load", suspects_teams_init);