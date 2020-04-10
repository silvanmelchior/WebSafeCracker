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
            id: 'title',
            label: 'Title',
            validate: CKEDITOR.dialog.validate.notEmpty('Title field cannot be empty.')
          }
        ]
      }
    ],
    onOk: function() {
      let dialog = this;
      let title = dialog.getValueOf('tab-basic', 'title');

      let el = editor.document.createElement('div');
      el.setAttribute('data-graph', title);
      el.setText('Graph: ' + title);

      editor.insertElement(el);
    }
  };
});
