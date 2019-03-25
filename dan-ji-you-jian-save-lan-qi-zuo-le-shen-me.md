# 单机右键save浏览器做了什么？

首先罗列一下浏览器有哪些保存到本地的行为

```text
network ->  save as ... [1]
         -> Save all as HAR with content [2]
memory -> heap snapshots -> item (save) [3]

```

以下为修改代码以后network执行save行为以后，在devtools 的html发生的行为

![](.gitbook/assets/image%20%285%29.png)

#### 行为触发以后的方法调用 host/InspectorFrontendHost.js （url作为以下的唯一Map标识）

1、save方法将内容放到\_urlsBeingSaved的map中，set\(url, buffer\),其中上面的\[1\],\[3\]直接将url和内容放入到buffer中，然后调用SavedURL 然后调用3

 2、append 放入内容分段append到buffer中，上面的\[2\]会这没用

 3、close 从\_urlsBeingSaved 读出buffer，然后删除\_urlsBeingSaved中的映射， 在内存中新建a标签，用Blob每次生成一个唯一的id（就算相同的下载每次都生成一个唯一的标识）， 将a的href = URL.createObjectURL\(blob\);触发a的click 下载就弹出来了 （但这里有一个坑就是URL.createObjectURL每次创建的内存默认不会被释放， 因此如果找个资源大的视频网站一直执行\[2\]多次save as 内存就飙升了）

{% code-tabs %}
{% code-tabs-item title="host/InspectorFrontendHost.js " %}
```text
/**
   * @override
   * @param {string} url
   * @param {string} content
   * @param {boolean} forceSaveAs
   * 例如: memory-> profiles ->heap snapshots 中的每一项的save会调用这里
   */
  save(url, content, forceSaveAs) {
    console.log('host File: snapshot save', url, content);
    let buffer = this._urlsBeingSaved.get(url);
    if (!buffer) {
      buffer = [];
      this._urlsBeingSaved.set(url, buffer);
    }
    buffer.push(content);
    this.events.dispatchEventToListeners(InspectorFrontendHostAPI.Events.SavedURL, {url, fileSystemPath: url});
  }

  /**
   * @override
   * @param {string} url
   * @param {string} content
   * 将Heap-20190323T153902.heapsnapshot(blobId)  形式的路径  和内容放到buffer中
   */
  append(url, content) {
    console.log('host File: snapshot append', url, content);
    const buffer = this._urlsBeingSaved.get(url);
    buffer.push(content);
    this.events.dispatchEventToListeners(InspectorFrontendHostAPI.Events.AppendedToURL, url);
  }

  /**
   * @override
   * @param {string} url
   */
  close(url) {
    console.log('host File:  close ')
    const buffer = this._urlsBeingSaved.get(url);
    this._urlsBeingSaved.delete(url);
    const fileName = url ? url.trimURL().removeURLFragment() : '';
    const link = createElement('a');
    link.download = fileName;
    const blob = new Blob([buffer.join('')], {type: 'text/plain'});
    document.body.appendChild(link)
    link.href = URL.createObjectURL(blob); // 这里生成的链接会一直存在直到关闭标签
  }
```
{% endcode-tabs-item %}
{% endcode-tabs %}

