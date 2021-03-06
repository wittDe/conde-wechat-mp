Component({
  properties: {
    type: {
      type: String,
      value: '',
      observer(sNewVal) {
        this.fnInitTopicTagText(sNewVal);
      }
    }
  },
  data: {
    aTopicTagEnum: [
      {
        key: 'top',
        value: '顶',
        class: 'topic-tag-top'
      },
      {
        key: 'good',
        value: '精',
        class: 'topic-tag-good'
      },
      {
        key: 'share',
        value: '分享',
        class: 'topic-tag-share'
      },
      {
        key: 'ask',
        value: '求助',
        class: 'topic-tag-ask'
      },
      {
        key: 'job',
        value: '招聘',
        class: 'topic-tag-job'
      }
    ],
    oTopicTag: {}
  },
  methods: {
    // 根据主题标签类型，初始化当前主题标签数据
    fnInitTopicTagText(sTopicTagType) {
      this.data.aTopicTagEnum.forEach(oTopicTag => {
        if (oTopicTag.key === sTopicTagType) {
          return this.setData({
            oTopicTag: oTopicTag
          });
        }
      });
    }
  },
  ready() {
    this.fnInitTopicTagText(this.type);
  }
});
