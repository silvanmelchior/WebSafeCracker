CKEDITOR.plugins.add('authimage', {
  icons: 'authimage',
  init: function(editor) {
    editor.addCommand('authimage', new CKEDITOR.dialogCommand('authimageDialog'));
    editor.ui.addButton('AuthImage', {
      label: 'Insert Image',
      command: 'authimage',
      toolbar: 'insert'
    });
    CKEDITOR.dialog.add('authimageDialog', this.path + 'dialogs/dialog.js');
  }
});
