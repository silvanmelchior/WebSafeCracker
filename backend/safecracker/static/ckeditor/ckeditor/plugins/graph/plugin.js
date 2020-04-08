CKEDITOR.plugins.add('graph', {
  icons: 'graph',
  init: function(editor) {
    editor.addCommand('graph', new CKEDITOR.dialogCommand('graphDialog'));
    editor.ui.addButton('Graph', {
      label: 'Insert Graph',
      command: 'graph',
      toolbar: 'insert'
    });
    CKEDITOR.dialog.add('graphDialog', this.path + 'dialogs/dialog.js');
  }
});
