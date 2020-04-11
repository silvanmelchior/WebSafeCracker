CKEDITOR.dialog.add('authimageDialog', function(editor) {
  return {
    title: 'Image Properties',
    minWidth: 400,
    minHeight: 150,
    contents: [
      {
        id: 'tab-basic',
        label: 'Basic Settings',
        elements: [
          {
            type: 'text',
            id: 'filename',
            label: 'File Name',
            validate: CKEDITOR.dialog.validate.notEmpty('File name field cannot be empty.')
          },
          {
            type: 'text',
            id: 'width',
            label: 'Width (e.g. in %)',
            validate: CKEDITOR.dialog.validate.notEmpty('Width field cannot be empty.')
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
      let width = dialog.getValueOf('tab-basic', 'width');
      let inline = dialog.getValueOf('tab-basic', 'inline');

      let el = null;
      if(inline) {
        el = editor.document.createElement('span');
        el.setStyle('display', 'inline-block');
        el.setStyle('width', width);
      }
      else {
        el = editor.document.createElement('div');
        el.setStyle('width', width);
        el.setStyle('margin-left', 'auto');
        el.setStyle('margin-right', 'auto');
      }
      el.setAttribute('data-imgurl', filename);
      el.setText('Image: ' + filename);
      el.setStyle('border', '1px black solid');

      editor.insertElement(el);
    }
  };
});
