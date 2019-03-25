# platform模块分析

包含一堆全局的公用方法（例如runOnWindowLoad）和js api的扩展（例如promise和map的扩展）， 无外部依赖 ,按理来说他应该叫util

{% code-tabs %}
{% code-tabs-item title="/front\_end/platform/utilities.js" %}
```text
function runOnWindowLoad(callback) {
  /**
   * @suppressGlobalPropertiesCheck
   */
  function windowLoaded() {
    self.removeEventListener('DOMContentLoaded', windowLoaded, false);
    callback();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive')
    callback();
  else
    self.addEventListener('DOMContentLoaded', windowLoaded, false);
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

