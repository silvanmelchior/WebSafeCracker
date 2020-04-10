CKEDITOR.dialog.add('graphDialog', function(editor) {
  return {
    title: 'Graph Properties',
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
          }
        ]
      }
    ],
    onOk: function() {
      let dialog = this;
      let filename = dialog.getValueOf('tab-basic', 'filename');

      let el = editor.document.createElement('div');
      el.setAttribute('data-graph', filename);
      el.setText('Graph: ' + filename);

      editor.insertElement(el);
    }
  };
});
