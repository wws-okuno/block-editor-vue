let options
const merge_cell = {
  content: 'merged cell',
  header: true,
  rowspan: 3,
  colspan: 3
};
const merge_cell2 = {
  content: 'merged cell2',
  header: true,
  rowspan: 1,
  colspan: 2
};
const items = [
  {
    name: 'Heading',
    id: "sampleid",
  },
  {
    "id": "gyFifSy5",
    "name": "Table",
    "className": "",
    "colgroup": [
        {
            "width": null
        },
        {
            "width": null
        },
        {
            "width": null
        }
    ],
    "rows": [
        {
            "cells": [
                {
                    "id": "AZnuxq7S",
                    "content": "<p>1</p>"
                },
                {
                    "id": "a3g8i0lW",
                    "content": "<p>2</p>"
                },
                {
                    "id": "l0NmGVMt",
                    "content": "<p>3</p>"
                }
            ]
        },
        {
            "cells": [
                {
                    "id": "zf4xwpfr",
                    "content": "<p>1</p>"
                },
                {
                    "id": "ADx9GOO0",
                    "content": "<p>2</p>"
                },
                {
                    "id": "wZbmjvs3",
                    "content": "<p>3</p>"
                }
            ]
        }
    ],
    "preset": {
        "className": "",
        "defaultColNum": 3,
        "maxRow": 99,
        "maxCol": 99,
        "dispName": "ﾃｰﾌﾞﾙ"
    },
    "defaultColNum": 3,
    "maxRow": 99,
    "maxCol": 99
},
  
  {
  name: 'Paragraph',
  imageAlign: 'left',
  maxImages: 1,
  className: 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttest',
  images: [{
    src: 'https://placehold.jp/3d4070/ffffff/150x150.png',
    caption: 'caption1'
  }, {
    src: 'https://placehold.jp/c122cc/ffffff/300x200.png',
    caption: 'caption2'
  }],
  content: 'Paragraph<br><a href="https://www.google.com/" target="_blank">externalリンク</a>文章が入ります。<a href="https://www.google.com/">internalリンク</a><span class="ve-bold">太字</span>文章が入ります。<br>文章が入ります。文章が入ります。文章が入ります。文章が入ります。文章が入ります。文章が入ります。文章が入ります。文章が入ります。文章が入ります。文章が入ります。文章が入ります。文章が入ります。'
}, {
  name: 'Html',
  content: '<div>hoge</div>'
}, {
  name: 'Paragraph',
  imageAlign: 'left',
  className: 'test',
  images: [],
  content: ''
}];

options = {
  locale: 'ja',
  items: items,
  // enabledItemNames: ['Html', 'Table'],
  // enabledItemNamesInColumn: ['Html'],
  loadItemsFromInputTag: true,
  allowHistories: true,
  allowStyledText: true,
  allowCssClass: true,
  allowFileBrowser: true,
  itemOrder: [ // メニュー上のアイテムの表示順序
    'Paragraph', 'ParagraphN', 'Heading', 'List', 'ListN', 'Table', 'TableN', 'Column', 'Html'
  ],
  FileBrowser: {
    url: 'http://localhost:8080/demo.html',
    width: '80%',
    height: '80%',
    resizable: true,
  },
  LinkBrowser: {
    url: 'http://localhost:8080/demo_link.html',
    width: '80%',
    height: '80%',
    resizable: true,
  },
  // cssClasses: [
  //   'class1', 'class2',
  //   {class3: 'クラス3'}, {'test-class': 'テストクラス'}
  // ],
  styledTextClasses: [
    'bold', 'link', {
      red: '赤字'
    }, {
      blue: '青字'
    }, {
      green: '緑字'
    }, {
      underline: '下線'
    }, {
      highlight: 'ハイライト'
    }
  ],
  Paragraph: {
    allowImages: false,
    allowCssClass: true,
    cssClasses: [{
        class1: '通常'
      }, // class="class3" displayed "Class name 3" on editor
      {
        class2: '説明1'
      }, // class="class3" displayed "Class name 3" on editor
      {
        class3: '説明2'
      }, // class="class3" displayed "Class name 3" on editor
    ],
    dispName: '自由テキスト',
    presets: [{
        className: 'important',
        dispName: '重要'
      },
      {
        className: 'normal',
        dispName: '通常'
      },
      {
        allowImages: true,
        className: 'box_img',
        imageAlign: 'center',
        dispName: '中央揃え画像'
      }
    ],
  },
  ParagraphN: {
    dispName: '自由テキスト',
  },

  List: {
    allowStyledText: true,
    allowCssClass: true,
    cssClasses: [{
        class1: '通常'
      }, // class="class3" displayed "Class name 3" on editor
      {
        class2: '説明1'
      }, // class="class3" displayed "Class name 3" on editor
      {
        class3: '説明2'
      }, // class="class3" displayed "Class name 3" on editor
    ],
    presets: [{
      className: 'link',
      type: 'unordered',
      dispName: 'リンクリスト'
    }]
  },
  ListN: {
    dispName: '通常リスト',
    // 設定はList内が有効(presets以外)
  },
  Table: {
    maxRow: 10, // テーブルの最大行数
    maxCol: 2, // テーブルの最大列数
    minRow: 1, // テーブルの最小行数
    minCol: 2, // テーブルの最小列数
    presets: [{
        className: 'product',
        defaultColNum: 2,
        maxCol: 10, // テーブルの最大列数
        minCol: 2, // テーブルの最小列数
        dispName: '説明用テーブル'
      },
      {
        className: 'product',
        defaultColNum: 2,
        maxCol: 2, // テーブルの最大列数
        minCol: 2, // テーブルの最小列数
        dispName: '説明用固定テーブル',
        rows: [{
          cells: [{
            content: '見出し１',
            header: true
          }, {
            content: 'C1-2',
            header: false
          }]
        }, {
          cells: [{
            content: '見出し２',
            header: true
          }, {
            content: 'C2-2',
            header: false
          }]
        }],
        colgroup: [{
          width: null
        }, {
          width: null
        }, {
          width: null
        }]
      }
    ]
  },
  TableN: {
    dispName: '自由テーブル',
  },
  Heading: {
    levels: ['h2', 'h3', 'h4', 'h5', 'h6'],
    // levels: ['h3'],

  },
  Column: {
    allowChangeNumColumn: true, // カラム数の変更許可
    defaultNumColumn: 2, // デフォルトのカラム数
    maxColumn: 5, // 段組の最大数
    minColumn: 2, // 段組の最小数
    presets: [{
      className: 'fix',
      dispName: '固定カラム',
      columns: [{
        items: [{
            id: 1, // Warning対策
            name: 'Heading',
            level: 'h3',
            content: 'aa'
          },
          {
            id: 2,
            name: 'Table',
            rows: [{
              cells: [{
                content: 'C1-1',
                header: true
              }, ]
            }],
            colgroup: [{
              width: null
            }, {
              width: null
            }, {
              width: null
            }]
          },
          {
            id: 3,
            name: 'Paragraph',
            imageAlign: 'left',
            className: 'tettest',
            images: [],
            content: ''
          },
        ]
      }]
    }, {
      className: 'normal',
      dispName: '通常カラム'
    }]
  },
  Block: {
    jsonUrl: 'http://localhost:8080/js/test.json' // 一覧選択用のURL jsonで返すこと
  },
  onLoad: function(html) {
    updatePreview(html);
  },
  onUpdate: function(html) {
    // console.log(this.items)
    updatePreview(html);
  }
};

// Update preview
const previewBody = document.querySelector('#preview pre')

function updatePreview(html) {
  previewBody.innerHTML = html;

}
const instance = new BlockEditor('#app1', options);
