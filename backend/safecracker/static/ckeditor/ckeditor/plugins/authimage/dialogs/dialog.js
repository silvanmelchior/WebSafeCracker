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
            id: 'title',
            label: 'Title',
            validate: CKEDITOR.dialog.validate.notEmpty('Title field cannot be empty.')
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
      let title = dialog.getValueOf('tab-basic', 'title');
      let inline = dialog.getValueOf('tab-basic', 'inline');

      let el = null;
      if(inline) {
        el = editor.document.createElement('span');
        el.setAttribute('data-inlineimg', title);
        el.setText('Inline Image: ' + title);
      }
      else {
        el = editor.document.createElement('div');
        el.setAttribute('data-blockimg', title);
        el.setText('Block Image: ' + title);
      }

      editor.insertElement(el);
    }
  };
});
