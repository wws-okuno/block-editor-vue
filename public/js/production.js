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
const items = [{
  name: 'Heading',
  className: 'title',
  level: 'h2',
  content: 'hoge'
}, {
  name: 'Table',
  rows: [{
    cells: [{
        content: 'C1-1',
        header: true
      }, {
        content: 'C1-2',
        header: true
      }, {
        content: 'C1-3',
        header: true
      },
      merge_cell2, {
        dummy: true,
        content: '',
        ref: merge_cell2
      }
    ]
  }, {
    cells: [{
        content: 'C2-1',
        header: false
      },
      merge_cell, {
        content: '',
        dummy: true,
        ref: merge_cell
      }, {
        content: '',
        dummy: true,
        ref: merge_cell
      }, {
        content: 'C2-5'
      }
    ]
  }, {
    cells: [{
      content: 'C3-1',
      header: false
    }, {
      content: '',
      dummy: true,
      ref: merge_cell
    }, {
      content: '',
      dummy: true,
      ref: merge_cell
    }, {
      content: '',
      dummy: true,
      ref: merge_cell
    }, {
      content: 'C3-5'
    }]
  }, {
    cells: [{
      content: 'C4-1',
      header: false
    }, {
      content: '',
      dummy: true,
      ref: merge_cell
    }, {
      content: '',
      dummy: true,
      ref: merge_cell
    }, {
      content: '',
      dummy: true,
      ref: merge_cell
    }, {
      content: 'C4-5'
    }]
  }, {
    cells: [{
      content: 'C5-1',
      header: false
    }, {
      content: 'C5-2',
      header: false
    }, {
      content: 'C5-3',
      header: false
    }, {
      content: 'C5-4',
      header: false
    }, {
      content: 'C5-5',
      header: false
    }]
  }],
  colgroup: [{
    width: null
  }, {
    width: null
  }, {
    width: null
  }, {
    width: null
  }, {
    width: null
  }, ]
}, {
  name: 'List',
  // type: 'unordered',
  className: 'test',
  rows: [{
    content: 'リスト1<br><span class="ve-bold">太字</span>テスト'
  }, {
    content: 'リスト2'
  }, {
    content: 'リスト3'
  }, {
    content: 'リスト4'
  }]
}, {
  name: 'Paragraph',
  imageAlign: 'left',
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
  name: 'Column',
  className: 'aaaa',
  columns: [{
    items: [{
      name: 'Paragraph',
      imageAlign: 'left',
      className: 'tettest',
      images: [],
      content: ''
    }, {
      name: 'Paragraph',
      imageAlign: 'right',
      className: null,
      images: [],
      content: ''
    }]
  }, {
    items: [{
      name: 'Html'
    }]
  }, {
    items: [{
      name: 'Paragraph',
      imageAlign: 'left',
      className: null,
      images: [],
      content: ''
    }]
  }]
}, {
  name: 'Column',
  columns: [{
    items: []
  }, {
    items: []
  }]
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
    'Paragraph', 'Heading', 'List', 'Table', 'Column', 'Html'
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
    allowImages: true,
    defaultImageAlign: 'right',
    dispName: 'テキスト',
    presets: [{
      className: 'important',
      dispName: '重要'
    }, {
      className: 'normal',
      dispName: '通常'
    }, {
      imageAlign: 'center',
      dispName: '中央揃え画像'
    }],
  },
  List: {
    maxRows: 10,
    allowStyledText: true,
    presets: [{
      className: 'link',
      type: 'unordered',
      dispName: 'リンクリスト'
    }, {
      type: 'unordered',
      dispName: '通常リスト'
    }, {
      type: 'ordered',
      dispName: '箇条書きリスト'
    }]
  },
  Table: {
    maxRow: 10, // テーブルの最大行数
    maxCol: 10, // テーブルの最大列数
    minRow: 1, // テーブルの最小行数
    minCol: 2, // テーブルの最小列数
    presets: [{
      className: 'product',
      dispName: '商品テーブル'
    }, {
      dispName: '通常テーブル'
    }]
  },
  Heading: {
    levels: ['h2', 'h3', 'h4', 'h5', 'h6'],
    // levels: ['h3'],
    levelNames: {
      h2: '超大見出し',
      h3: '大見出し',
      h4: '中見出し',
      h5: '小見出し',
      h6: '超小見出し'
    },
    defaultLevel: 'h3',
    presets: [{
      className: 'title',
      level: 'h2',
      dispName: 'タイトル'
    }, {
      className: 'sub-title',
      level: 'h3',
      dispName: 'サブタイトル'
    }]
  },
  Column: {
    allowChangeNumColumn: true, // カラム数の変更許可
    defaultNumColumn: 2, // デフォルトのカラム数
    maxColumn: 5, // 段組の最大数
    minColumn: 2, // 段組の最小数
    presets: [{
      className: 'special',
      dispName: '特集カラム'
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
    //console.log(this.items)
    updatePreview(html);
  }
};

// Update preview
const previewBody = document.querySelector('#preview pre')

function updatePreview(html) {
  previewBody.innerHTML = html;

}
const instance = new BlockEditor('#app1', options);


