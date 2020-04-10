CKEDITOR.dialog.add('authimageDialog', function(editor) {
  return {
    title: 'Image Properties',
    minWidth: 400,
    minHeight: 100,
    contents: [
      {
        id: 'tab-basic',
        label: 'Basic Settings',
        elements: [
          {
            type: 'text',
            id: 'filename',
            label: 'File Name',
            validate: CKEDITOR.dialog.validate.notEmpty('Field cannot be empty.')
          },
          {
            type: 'checkbox',
            id: 'inline',
            label: 'Inline'
          }
        ]
      }
    ],
    onOk: function() {
      let dialog = this;
      let filename = dialog.getValueOf('tab-basic', 'filename');
      let inline = dialog.getValueOf('tab-basic', 'inline');

      let el = null;
      if(inline) {
        el = editor.document.createElement('span');
        el.setAttribute('data-inlineimg', filename);
        el.setText('Inline Image: ' + filename);
      }
      else {
        el = editor.document.createElement('div');
        el.setAttribute('data-blockimg', filename);
        el.setText('Block Image: ' + filename);
      }

      editor.insertElement(el);
    }
  };
});
