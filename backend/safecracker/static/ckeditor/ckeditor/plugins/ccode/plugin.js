CKEDITOR.plugins.add('ccode', {
  icons: 'ccode',
  init: function(editor) {
    editor.addCommand('ccode', {
      exec: function(editor) {
        editor.insertHtml('<pre><code class="language-clike">void f(void) {}</code></pre>');
      }
    });
    editor.ui.addButton('CCode', {
      label: 'Insert C Code',
      command: 'ccode',
      toolbar: 'insert'
    });
  }
});
