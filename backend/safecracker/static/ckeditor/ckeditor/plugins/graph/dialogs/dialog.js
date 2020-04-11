CKEDITOR.dialog.add('graphDialog', function(editor) {
  return {
    title: 'Graph Properties',
    minWidth: 400,
    minHeight: 200,
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
            type: 'text',
            id: 'height',
            label: 'Height (e.g. in %)',
            validate: CKEDITOR.dialog.validate.notEmpty('Height field cannot be empty.')
          }
        ]
      }
    ],
    onOk: function() {
      let dialog = this;
      let filename = dialog.getValueOf('tab-basic', 'filename');
      let width = dialog.getValueOf('tab-basic', 'width');
      let height = dialog.getValueOf('tab-basic', 'height');

      let el = editor.document.createElement('div');
      el.setStyle('width', width);
      el.setStyle('margin-left', 'auto');
      el.setStyle('margin-right', 'auto');
      el.setStyle('padding-bottom', height);
      el.setStyle('border', '1px black solid');
      el.setAttribute('data-graphurl', filename);
      el.setText('Graph: ' + filename);

      editor.insertElement(el);
    }
  };
});
