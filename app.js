// 必须，支持node_modules中的装饰器等语法
require("@babel/register")({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  ignore: [],
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ["@babel/plugin-proposal-private-methods", { "loose": true }],
    ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
  ]
});

const express = require('express')
const app = express()
const port = 4000
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// การกำหนดค่า
const myconfig = require('config-lite')({
  filename: 'default',
  config_basedir: __dirname,
  config_dir: 'config'
});

// เปิดตัวโดยอัตโนมัติ
var fs = require("fs");
var checkDir = fs.existsSync("uiadmin-core");
let uiadminAlias = './uiadmin-core';
if (!checkDir) {
  uiadminAlias = 'uiadmin-express'
}
const {
  Controller, Get, RootUrl, Post, MenuItem, UiAdmin, config, XyBuilderList, XyBuilderForm
} = require(uiadminAlias)

//โอนย้ายuiadmin
app.use(new UiAdmin())
config.configs = myconfig


// ตัวควบคุมเริ่มต้น
@Controller
class IndexController {
  // หน้าแรก
  @Get('/')
  home(req, res) {
    res.send("<div style='text-align:center'><a href='/xyadmin/'>คลิกเพื่อเปิดพื้นหลังทั่วไปของ UiAdmin</a>，รหัสผ่านผู้ดูแลระบบบัญชี uiadmin。</div><iframe style='width: 100%;height: calc(100vh - 20px)' src='/xyadmin/'></iframe>")
  }
}
app.use(new IndexController())

// ตัวควบคุมพื้นหลังการจัดการบทความ (สาธิต DEMO)
@Controller
class DemoController {
  @RootUrl('/api')
  url() {}

  @MenuItem({title: "รายการบทความ", path: "/demo/lists", pmenu: "/content", menuType: 1,
    routeType: "list", apiSuffix: "", apiParams: "", apiMethod: "GET", sortnum: 0})
  @Get('/v1/admin/demo/lists')
  lists(req, res) {
    let dataList = [
      {
        "title": "ทดสอบบทความที่ 1",
        "cate": "พัฒนา",
        "cover": "https://ts2.cn.mm.bing.net/th?id=ORMS.11d30098d0f4a79a42c6352014e0f066&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=2&p=0",
        "level": 1,
        "progress": 50,
        "updateTime": "2023-02-01 20:16:19",
        "createTime": "2023-02-01 09:07:40",
        "status": 1
      },
      {
        "title": "ทดสอบบทความที่ 2",
        "cate": "พัฒนา",
        "cover": "https://ts2.cn.mm.bing.net/th?id=ORMS.ed34ae135a326a834ca9d3379be134d3&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=2&p=0",
        "level": 2,
        "progress": 80,
        "updateTime": "2023-02-01 20:16:19",
        "createTime": "2023-02-01 09:07:40",
        "status": 1
      },
      {
        "title": "ทดสอบบทความที่ 13",
        "cate": "พัฒนา",
        "cover": "https://ts2.cn.mm.bing.net/th?id=ORMS.ed34ae135a326a834ca9d3379be134d3&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=2&p=0",
        "level": 3,
        "progress": 90,
        "updateTime": "2023-02-01 20:16:19",
        "createTime": "2023-02-01 09:07:40",
        "status": 1
      },
    ]
    let xyBuilderList = new XyBuilderList();
    xyBuilderList
      .init()
      .addColumn("title", "ชื่อ", {
        type: "text"
      })
      .addColumn("cover", "ปก", {
        type: "image",
      })
      .addColumn("cate", "การจัดหมวดหมู่", {
        type: "tag",
        prefixType: "dot",
        options: []
      })
      .addColumn("progress", "กำหนดการ", {
        type: "progress"
      })
      .addColumn("level", "คะแนน", {
        type: "rate"
      })
      .addColumn("level", "ลำดับความสำคัญ", {
        prefixType: "dot",
        useOptions: true,
        options: [
          {title: "ต่ำ", value: 1, color: "#c6cdd4"},
          {title: "กลาง", value: 2, color: "#0488de"},
          {title: "สูง", value: 3, color: "#ff9d28"}
        ]
      })
      .addColumn("createTime", "เวลาสร้าง", {
        type: "time",
      })
      .addColumn("updateTime", "เวลาอัพเดตล่าสุด", {
        type: "time",
      })
      .addTopButton("add", "เพิ่ม", {
        title: "เพิ่ม",
        pageType: "modal",
        modalType: "form",
        api: "/v1/admin/demo/add",
        width: "1000px"
      })
      .addColumn("rightButtonList",  "ดำเนินงาน", {
        type: "rightButtonList",
        minWidth: "120px"
      })
      .addRightButton("edit", "แก้ไข", {
        title: "แก้ไข",
        pageType: "modal",
        modalType: "form",
        api: "/v1/admin/demo/edit",
        width: "1000px"
      })
      .setDataList(dataList)

    res.json({
      code: 200,
      msg: 'ความสำเร็จ',
      data: {
        listData: xyBuilderList.getData()
      }
    });
  }

  @MenuItem({title: "บทความใหม่", path: "/demo/add", pmenu: "/demo/lists", menuType: 2,
    routeType: "form", apiSuffix: "", apiParams: "", apiMethod: "GET", sortnum: 0})
  @Get('/v1/admin/demo/add')
  add(req, res) {
    let xyBuilderForm = new XyBuilderForm();
    xyBuilderForm.init()
      .addFormItem("name", "ชื่อบทความ", "text", "", {})
      .addFormItem("content", "เนื้อหาบทความ", "html", "", {})
      .addFormItem("level", "เพื่อลงทะเบียน", "select", "", {
        options:[
          {'title': "ต่ำ", value: 1},
          {'title': "กลาง", value: 2},
          {'title': "สูง", value: 3},
        ]
      })

    res.json({
      code: 200,
      msg: 'ความสำเร็จ',
      data: {
        formData: xyBuilderForm.getData()
      }
    });
  }

  @MenuItem({title: "การปรับเปลี่ยนบทความ", path: "/demo/edit", pmenu: "/demo/lists", menuType: 2,
    routeType: "form", apiSuffix: "", apiParams: "", apiMethod: "GET", sortnum: 0})
  @Get('/v1/admin/demo/edit/:id')
  edit(req, res) {
    let xyBuilderForm = new XyBuilderForm();
    xyBuilderForm.init()
      .addFormItem("id", "ID", "text", "", {
        disabled: true
      })
      .addFormItem("name", "文章标题", "text", "", {})
      .addFormItem("content", "文章内容", "html", "", {})
      .addFormItem("level", "登记", "select", "", {
        options:[
          {'title': "低", value: 1},
          {'title': "中", value: 2},
          {'title': "高", value: 3},
        ]
      })
      .setFormValues({
        id: 123123,
        name: "text",
        content: "测试",
        level: 2
      })

    res.json({
      code: 200,
      msg: '成功',
      data: {
        formData: xyBuilderForm.getData()
      }
    });
  }

}
app.use(new DemoController())


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})



