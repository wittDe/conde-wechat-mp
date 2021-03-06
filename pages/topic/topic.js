import { getTopicDetail } from '../../api/topic'
import { getDateDiff } from '../../lib/util'

const app = getApp();
Page({
    data: {
        topic: null,
        topicContent: null
    },
    onLoad(option) {
        this.setData({ topicId: option.id });
        let timer = setTimeout(() => {
            wx.showLoading({ title: '拼命加载中'})
        }, 500);
        getTopicDetail(this.data.topicId, {
            mdrender: false
        })
            .then(res => {
                // console.log(res)
                clearTimeout(timer)
                let topic = this.topicDataModel(res)
                // 文章markdown处理
                let data = app.towxml.toJson(
                    res.content,               // `markdown`或`html`文本内容
                    'markdown'              // `markdown`或`html`
                );
                data = app.towxml.initData(data, {
                    base: '/',    // 需要解析的内容中相对路径的资源`base`地址
                    app: this     // 传入小程序页面的`this`对象，以用于音频播放器初始化
                });
                // 点击链接，则复制链接到粘贴板
                this['event_bind_tap'] = (event) => {
                    let el = event.target.dataset._el;
                    if (el.tag === 'navigator' && el.attr.href.indexOf('//') !== -1) {
                        wx.setClipboardData({
                            data: el.attr.href,
                            success(res) {
                                wx.showToast({
                                    title: '链接已复制',
                                    icon: 'success',
                                    duration: 1500
                                })
                            }
                        })
                    }
                };
                setTimeout(() => {
                    wx.hideLoading()
                }, 200);
                // console.log(topic)
                this.setData({
                    topicContent: data,
                    topic: topic
                });
            })
            .catch((err) => {  wx.hideLoading() })

    },
    topicDataModel(res) {
        return {
            id: res.id,
            author_id: res.author_id,
            tab: res.tab,
            title: res.title,
            last_reply_at: getDateDiff(res.last_reply_at),
            good: res.good,
            top: res.top,
            reply_count: res.reply_count,
            visit_count: res.visit_count,
            create_at: getDateDiff(res.create_at),
            author: res.author,
            replies: this.formatReplies(res.replies),
            is_collect: res.is_collect
        }
    },
    formatReplies(rep) {
        rep.map(item => {
            let replyContent = item.content.replace(/\/user\//g, '/pages/user/user?name=');
            replyContent = app.towxml.toJson(
                replyContent,               // `markdown`或`html`文本内容
                'markdown'              // `markdown`或`html`
            );
            replyContent = app.towxml.initData(replyContent, {
                base: '/',    // 需要解析的内容中相对路径的资源`base`地址
                app: this
            })
            item.content = replyContent;
            item.create_at = getDateDiff(item.create_at)
            return item
        })
        return rep
    }
})
