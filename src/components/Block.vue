<template>
  <div :class="{'BEV-hover': isHover, 'BEV-active': isActive, 'BEV-dragging': $store.state.draggingItem===item}" class="BEV-item BEV-Block">

    <!-- アイテムヘッダ -->
    <ItemHeader 
      @menu-mouseenter="popupMenuName===false ? showItemMenu($event) : false"
      @menu-mouseleave="_hideItemMenuDelay()"
      @label-click="activateItem()"
      @label-dragstart="$emit('item-dragstart', $event)"
      @label-dragend="$emit('item-dragend', $event)"
      @sub-label-click="getConfig('allowCssClass') ? showClassInput($event) : false"
      @moveup-click="doItemCommonAction('moveup')"
      @movedown-click="doItemCommonAction('movedown')"
      :parentWidth="parentWidth ? parentWidth : editorWidth"
      :active="isActive"
      :hover="isHover"
      :item="item"
      :hideConfig="!inited"
      :allowCssClass="getConfig('allowCssClass') && isItemAttrEditable"
      :classes="getConfig('cssClasses')"
    />

    <!-- データがなければ、選択枠を表示 -->
    <div v-if="!inited" class="BEV-block">
      <div class="loader" v-if="!jsonData.length">Loading...</div>
      <div class="BEV-block-size-input" v-else>
        <div v-for="(list,i) in jsonData" class="BEV-jsonData">
          <b>{{list.title}}</b><br />
          <div class="BEV-button">
            <button @click="jsonSelect(i)" class="BEV-save" type="button">選択</button>
          </div>
        </div>
      </div>
      <div class="BEV-buttons">
        <button @click="$emit('item-action', 'delete')" class="BEV-delete" type="button">{{$t('common.delete')}}</button>
      </div>
    </div>
    <!-- データがある場合 -->
    <template v-else>
      <div class="BEV-table-wrap ">
        <!-- ブロック展開 -->
        <div class="BEV-block-input">
          <div><b>{{item.blocks.title}}</b></div>
          <div v-for="(list,index) in item.blocks.data" class="BEV-block-input-for">
            <textarea :value="list.text" :rows="_rows(list.row)" @input="blocksDataInput(index,$event)" v-if="list.type === 'textarea'"></textarea>
            <div class="BEV-ImageEditBlock" v-else-if="list.type === 'img'">
              <!-- 画像編集エリア -->
              <ImageEditBlock v-if="editingImageCheck(index,list.text)" v-model="list.text" @focus="activateItem()" @input="editingImage[index]=null" @cancel="editingImage[index]=null" :settings="{
                    maxImages: 1,
                    maxFileSize: getConfig('maxImageSize'),
                    extensions: getConfig('imageExtensions'),
                  }" class="BEV-item-wrap" />
              <!-- 画像表示エリア -->
              <ImageList v-else :images="list.text" @error="onImageLoad($event,false)" @success="onImageLoad($event,true)" @click.native="_editingImage(index,true)" class="BEV-image" />
            </div>
            <input type="text" :value="list.text" @input="blocksDataInput(index,$event)" v-else />
          </div>
        </div>
        <!-- アクションメニューとクラス -->
        <transition
            @leave="_itemMenuTransitionLeave"
            @after-leave="_itemMenuTransitionAfterLeave"
            name="popup">
            <ActionMenu 
              @item-click="doItemCommonAction($event); doItemAction($event)"
              @mouseenter="!isTouchDevice ? _hideItemMenuDelay(true) : false"
              @mouseleave="!isTouchDevice ? hideItemMenu() : false"
              @cancel-click="isTouchDevice ? hideItemMenu() : false"
              v-show="popupMenuName==='item_menu'"
              ref="actionMenu"
              :actions="actions"
            />
          </transition>
        <transition
            name="popup-move">
            <ClassInput 
              @cancel="hideClassInput()"
              @input="hideClassInput()"
              v-show="popupMenuName==='class'"
              :classes="getConfig('cssClasses')"
              ref="classInput"
              v-model="item.className"
            />
          </transition>
      </div>
    </template>
  </div>
</template>
<script>
  import ItemMixin from '@/components/sub/ItemMixin.vue'
  import ImageEditBlock from '@/components/sub/ImageEditBlock.vue'
  import ImageList from '@/components/sub/ImageList.vue'
  import Util from '@/scripts/Util.js'
  import DOM from '@/scripts/DOM.js'
  import axios from 'axios' // 追記
  let IMAGE_ALIGN_TIMER
  export default {
    mixins: [ItemMixin],
    components: {
      ImageEditBlock,
      ImageList,
    },
    watch: {
      // データ変更検知
      isActive(newVal, oldVal) {
        if (!newVal && oldVal) {
          // アクティブ→アクティブ解除の場合は
          // 画像編集モードは終了
          this.editingImage = []
        }
      }
    },
    computed: {
      // データが選択されているかどうか選択
      inited() {
        return this.item.blocks
      },
    },
    data() {
      return {
        // ポップアップメニューの項目定義
        actions: {
          setClassName: {
            text: this.$t('common.setCssClass'),
            icon: 'IconCssClass'
          },
          moveup: {
            text: this.$t('common.moveUpItem'),
            icon: 'IconMoveup'
          },
          movedown: {
            text: this.$t('common.moveDownItem'),
            icon: 'IconMovedown'
          },
          replicate: {
            text: this.$t('common.replicateItem'),
            icon: 'IconReplicate'
          },
          delete: {
            text: this.$t('common.deleteItem'),
            type: 'danger',
            icon: 'IconDelete'
          },
        },
        historyTargetKeys: ['blocks'],
        editingImage: [], // 画像編集フラグ
        jsonData: []
      }
    },
    created() {
      axios.get(this.getConfig('jsonUrl')).then((response) => {
        // ログアウト時、[object String]でレスポンスが返る
        if (Object.prototype.toString.call(response.data) === '[object Array]') {
          this.jsonData = response.data
        }
      })
    },
    methods: {
      doItemAction(action) {},
      // 選択したデータをitem.blocksに入れる
      jsonSelect(i) {
        this.item.blocks = this.jsonData[i];
      },
      // 変更されたデータをitem.blocks.dataの配列に入れなおす
      blocksDataInput(index, e) {
        this.item.blocks.data[index].text = e.target.value;
      },
      // 画像の読み込みのエラー時イベント
      onImageLoad(image, success) {
        this.flgHistory = false // エラーフラグの付加時、履歴に追加されるのを防ぐ
        if (success) { // 読み込み成功
          if (typeof image.error !== 'undefined') {
            this.$delete(image, 'error')
          }
        } else { // 読み込みエラー
          this.$set(image, 'error', true)
        }
        this.$nextTick(() => {
          this.flgHistory = true
        })
      },
      _setFlgImageAlign(val) {
        if (IMAGE_ALIGN_TIMER) {
          clearTimeout(IMAGE_ALIGN_TIMER)
        }
        if (val) {
          this.flgImageAlign = true
        } else {
          IMAGE_ALIGN_TIMER = setTimeout(() => {
            this.flgImageAlign = false
          }, 0)
        }
      },
      editingImageCheck(index, val) {
        if (val.length == 0) {
          this.editingImage[index] = true;
        }
        return this.editingImage[index];
      },
      _editingImage(index, val) {
        // 配列、オブジェクトの場合、$setを使わないと検知できないため
        this.$set(this.editingImage, index, val)
      },
      _rows(row) {
        if (row) {
          return row
        }
        return 5
      }
    }
  }
  // アイテムデータの解析等を行うクラス
  import ItemBase from '@/scripts/ItemBase.js'
  export class Item extends ItemBase {
    constructor(options) {
      super(options)
      this.name = 'Block'
    }
    // 渡されたHTMLElementが、このコンポーネントで処理可能か判断する 
    matches(element) {
      return DOM.matches(element, `${this.getConfig('tagName')}.${this.getConfig('tagClassName')}`)
    }
    // 渡されたHTMLElementから、コンポーネントで扱えるデータに変換する
    getItem(element) {
      // クラス名の抽出(複数の場合は最初の一つだけ)
      let css_class = null;
      Array.from(element.classList).some(cls => {
        if (cls === this.getConfig('tagClassName')) return
        css_class = cls
        return true
      })
      const item = {
        id: Util.generateID(),
        name: this.name,
        className: this.getConfig('allowCssClass') ? css_class : null,
        blocks: null,
      }
      const def = this.getPreset(item)
      if (def) { // 定義セットに一致するものが見つかった
        item.preset = def
      }
      return item
    }
    // HTMLを返す
    getHtml(item, base_ind) {
      super.getHtml(item, base_ind)
      if (!item.blocks || !item) return null
      const nl = this.getConfig('outputNewLine')
      // クラス名の取得
      let cls_name = ''
      if (this.getConfig('allowCssClass') && item.className) cls_name = ' ' + item.className
      // HTML組み立て
      let tag = `<${this.getConfig('tagName')} class="${this.getConfig('tagClassName')}${cls_name}">`
      tag += item.blocks.html // 置換用のhtml取得
      tag += `</${this.getConfig('tagName')}>`
      for (var i = 0; item.blocks.data.length > i; i++) {
        var data = item.blocks.data[i];
        var html = ''; // 初期化
        if (data.type == 'text') { // テキスト
          html = data.text
          tag = tag.replace(/%replace%/, html); // 置換
        } else if (data.type == 'textarea') { // テキストエリア
          html = '\n' + this._indent(0) + data.text.replace(/\n/g, '<br>\n' + this._indent(0)); // タグ置換
          tag = tag.replace(/%replace%/, html); // 置換
        } else if (data.type == 'img') { // 画像
          if (data.text.length == 0) {
            tag = tag.replace(/%replace%/, ''); // 詰めて置換されるの防止
          } else {
            for (var j = 0; data.text.length > j; j++) {
              var img_data = data.text[j];
              var caption = img_data.caption ? img_data.caption : ''
              if (!data.class) data.class = '';
              html = `<img class="block-img-${img_data.imageAlign} ${data.class}" src="${img_data.src}" alt="${caption}" />${nl}`
              tag = tag.replace(/%replace%/, html); // 置換
            }
          }
        }
      }
      return tag
    }
    // アイテムデータを検証し、不正なデータは置き換える
    normalizeItem(item) {
      if (!item) return this.getEmptyItem()
      if (typeof item.id !== 'string') item.id = Util.generateID()
      if (!item.blocks) item.blocks = []
    }
    // 空のアイテムデータを返す
    getEmptyItem() {
      return {
        id: Util.generateID(),
        name: this.name,
        className: null,
        blocks: null,
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '@/styles/valiables.scss';
  @import '@/styles/components.scss';
  @import '@/styles/animation.scss';

  .BEV-Block {
    .loader {
      margin: 50px auto;
      font-size: 10px;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      position: relative;
      text-indent: -9999em;
      -webkit-animation: load5 1.1s infinite ease;
      animation: load5 1.1s infinite ease;
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
    }

    @-webkit-keyframes load5 {

      0%,
      100% {
        box-shadow: 0em -2.6em 0em 0em #c0c0c0, 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2), 2.5em 0em 0 0em rgba(192, 192, 192, 0.2), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.2), 0em 2.5em 0 0em rgba(192, 192, 192, 0.2), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.2), -2.6em 0em 0 0em rgba(192, 192, 192, 0.5), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.7);
      }

      12.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.7), 1.8em -1.8em 0 0em #c0c0c0, 2.5em 0em 0 0em rgba(192, 192, 192, 0.2), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.2), 0em 2.5em 0 0em rgba(192, 192, 192, 0.2), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.2), -2.6em 0em 0 0em rgba(192, 192, 192, 0.2), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.5);
      }

      25% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.5), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.7), 2.5em 0em 0 0em #c0c0c0, 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.2), 0em 2.5em 0 0em rgba(192, 192, 192, 0.2), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.2), -2.6em 0em 0 0em rgba(192, 192, 192, 0.2), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2);
      }

      37.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.2), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.5), 2.5em 0em 0 0em rgba(192, 192, 192, 0.7), 1.75em 1.75em 0 0em #c0c0c0, 0em 2.5em 0 0em rgba(192, 192, 192, 0.2), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.2), -2.6em 0em 0 0em rgba(192, 192, 192, 0.2), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2);
      }

      50% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.2), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2), 2.5em 0em 0 0em rgba(192, 192, 192, 0.5), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.7), 0em 2.5em 0 0em #c0c0c0, -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.2), -2.6em 0em 0 0em rgba(192, 192, 192, 0.2), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2);
      }

      62.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.2), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2), 2.5em 0em 0 0em rgba(192, 192, 192, 0.2), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.5), 0em 2.5em 0 0em rgba(192, 192, 192, 0.7), -1.8em 1.8em 0 0em #c0c0c0, -2.6em 0em 0 0em rgba(192, 192, 192, 0.2), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2);
      }

      75% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.2), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2), 2.5em 0em 0 0em rgba(192, 192, 192, 0.2), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.2), 0em 2.5em 0 0em rgba(192, 192, 192, 0.5), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.7), -2.6em 0em 0 0em #c0c0c0, -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2);
      }

      87.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.2), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2), 2.5em 0em 0 0em rgba(192, 192, 192, 0.2), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.2), 0em 2.5em 0 0em rgba(192, 192, 192, 0.2), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.5), -2.6em 0em 0 0em rgba(192, 192, 192, 0.7), -1.8em -1.8em 0 0em #c0c0c0;
      }
    }

    @keyframes load5 {

      0%,
      100% {
        box-shadow: 0em -2.6em 0em 0em #c0c0c0, 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2), 2.5em 0em 0 0em rgba(192, 192, 192, 0.2), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.2), 0em 2.5em 0 0em rgba(192, 192, 192, 0.2), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.2), -2.6em 0em 0 0em rgba(192, 192, 192, 0.5), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.7);
      }

      12.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.7), 1.8em -1.8em 0 0em #c0c0c0, 2.5em 0em 0 0em rgba(192, 192, 192, 0.2), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.2), 0em 2.5em 0 0em rgba(192, 192, 192, 0.2), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.2), -2.6em 0em 0 0em rgba(192, 192, 192, 0.2), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.5);
      }

      25% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.5), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.7), 2.5em 0em 0 0em #c0c0c0, 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.2), 0em 2.5em 0 0em rgba(192, 192, 192, 0.2), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.2), -2.6em 0em 0 0em rgba(192, 192, 192, 0.2), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2);
      }

      37.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.2), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.5), 2.5em 0em 0 0em rgba(192, 192, 192, 0.7), 1.75em 1.75em 0 0em #c0c0c0, 0em 2.5em 0 0em rgba(192, 192, 192, 0.2), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.2), -2.6em 0em 0 0em rgba(192, 192, 192, 0.2), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2);
      }

      50% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.2), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2), 2.5em 0em 0 0em rgba(192, 192, 192, 0.5), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.7), 0em 2.5em 0 0em #c0c0c0, -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.2), -2.6em 0em 0 0em rgba(192, 192, 192, 0.2), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2);
      }

      62.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.2), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2), 2.5em 0em 0 0em rgba(192, 192, 192, 0.2), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.5), 0em 2.5em 0 0em rgba(192, 192, 192, 0.7), -1.8em 1.8em 0 0em #c0c0c0, -2.6em 0em 0 0em rgba(192, 192, 192, 0.2), -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2);
      }

      75% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.2), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2), 2.5em 0em 0 0em rgba(192, 192, 192, 0.2), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.2), 0em 2.5em 0 0em rgba(192, 192, 192, 0.5), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.7), -2.6em 0em 0 0em #c0c0c0, -1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2);
      }

      87.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(192, 192, 192, 0.2), 1.8em -1.8em 0 0em rgba(192, 192, 192, 0.2), 2.5em 0em 0 0em rgba(192, 192, 192, 0.2), 1.75em 1.75em 0 0em rgba(192, 192, 192, 0.2), 0em 2.5em 0 0em rgba(192, 192, 192, 0.2), -1.8em 1.8em 0 0em rgba(192, 192, 192, 0.5), -2.6em 0em 0 0em rgba(192, 192, 192, 0.7), -1.8em -1.8em 0 0em #c0c0c0;
      }
    }
  }

  .BEV-block-input-for {
    display: grid;
    margin: 10px;
  }

  .BEV-Block {
    background-color: #FFFFFF;
    border: $item-border;
    color: $item-text-color;
    font-size: 1em;
    line-height: 1.5em;
    padding: 10px;
    outline: none;
    transition: border .2s, color .2s;
    width: 100%;
    box-sizing: border-box;
    resize: none;
  }

  .BEV-Block.BEV-hover .BEV-Block {
    border: $item-hover-border;
    color: $item-hover-text-color;
  }

  .BEV-Block.BEV-active .BEV-Block,
  .BEV-Block .BEV-Block:focus {
    border: $item-active-border;
    color: $item-active-text-color;
  }

  .BEV-buttons {
    display: flex;
    margin: 10px 0 0 0;

    button {
      font-size: .8em;
    }

    button.BEV-cancel {
      @extend %danger-button;
      margin: 0 7px 0 0;
    }

    button.BEV-save {
      @extend %primary-button;
    }

    button.BEV-delete {
      margin: 0 5px 0 0;
      @extend %danger-button;
    }
  }

  .BEV-jsonData {
    display: inline-block;
    margin: 10px;
  }

  .BEV-button {
    display: grid;

    button {
      font-size: .8em;
    }

    button.BEV-save {
      @extend %primary-button;
    }
  }

  textarea {
    border-radius: $item-wrap-border-radius;
  }

</style>
