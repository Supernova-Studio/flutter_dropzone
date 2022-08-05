if (typeof FlutterDropzone === 'undefined') {
class FlutterDropzone {
  constructor(container, onLoaded, onError, onHover, onDrop, onDropMultiple, onLeave) {
    this.onError = onError;
    this.onHover = onHover;
    this.onDrop = onDrop;
    this.onDropMultiple = onDropMultiple;
    this.onLeave = onLeave;
    this.dropMIME = null;
    this.dropOperation = 'copy';

    container.addEventListener('dragover', this.dragover_handler.bind(this));
    container.addEventListener('dragleave', this.dragleave_handler.bind(this));
    container.addEventListener('drop', this.drop_handler.bind(this));

    if (onLoaded != null) onLoaded();
  }

  updateHandlers(onLoaded, onError, onHover, onDrop, onDropMultiple, onLeave) {
    this.onError = onError;
    this.onHover = onHover;
    this.onDrop = onDrop;
    this.onDropMultiple = onDropMultiple;
    this.onLeave = onLeave;
    this.dropMIME = null;
    this.dropOperation = 'copy';
  }

  dragover_handler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = this.dropOperation;
    if (this.onHover != null) this.onHover(event);
  }

  dragleave_handler(event) {
    event.preventDefault();
    if (this.onLeave != null) this.onLeave(event);
  }

  drop_handler(event) {
    event.preventDefault();

    // Handle array length and onMultipleDrop callback availability
    if (event.dataTransfer.items.length == 1) {
      // Only one dropped item
      var item = event.dataTransfer.items[0];

      switch (item.kind) {
        case "file":
          if (this.dropMIME == null || this.dropMIME.includes(item.type)) {
            var file = item.getAsFile();
            if (this.onDrop != null) this.onDrop(event, file);
          }
          break;

        case "string":
          const that = this;
          item.getAsString(function (text) {
            if (that.onDrop != null) that.onDrop(event, text);
          });
          break;

        default:
          if (this.onError != null) this.onError("Wrong type: ${item.kind}");
          break;
      }
    } else if (this.onDropMultiple != null) {
      // Multiple items passed and we have onDropMultiple callback
      var files = [];
      var strings = [];

      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        var item = event.dataTransfer.items[i];
        switch (item.kind) {
          case "file":
            if (this.dropMIME == null || this.dropMIME.includes(item.type)) {
              var file = item.getAsFile();
              files.push(file);
            }
            break;

          case "string":
            item.getAsString(function (text) {
              strings.push(text);
            });
            break;

          default:
            if (this.onError != null) this.onError("Wrong type: ${item.kind}");
            break;
        }
      }

      if (files.length > 0) this.onDropMultiple(event, files);
      if (strings.length > 0) this.onDropMultiple(event, strings);
    } else {
      // Multiple items passed and we have no onDropMultiple callback, so call onDrop for each of them
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        var item = event.dataTransfer.items[i];
        switch (item.kind) {
          case "file":
            if (this.dropMIME == null || this.dropMIME.includes(item.type)) {
              var file = item.getAsFile();
              if (this.onDrop != null) this.onDrop(event, file);
            }
            break;

          case "string":
            const that = this;
            item.getAsString(function (text) {
              if (that.onDrop != null) that.onDrop(event, text);
            });
            break;

          default:
            if (this.onError != null) this.onError("Wrong type: ${item.kind}");
            break;
        }
    }

    if (this.onLeave != null) this.onLeave(event);
  }

  setMIME(mime) {
    this.dropMIME = mime;
  }

  setOperation(operation) {
    this.dropOperation = operation;
  }
}

var flutter_dropzone_web = {
  setMIME: function(container, mime) {
    container.FlutterDropzone.setMIME(mime);
    return true;
  },

  setOperation: function(container, operation) {
    container.FlutterDropzone.setOperation(operation);
    return true;
  },

  setCursor: function(container, cursor) {
    container.style.cursor = cursor;
    return true;
  },

  create: function(container, onLoaded, onError, onHover, onDrop, onDropMultiple, onLeave) {
    if (container.FlutterDropzone === undefined)
      container.FlutterDropzone = new FlutterDropzone(container, onLoaded, onError, onHover, onDrop, onDropMultiple, onLeave);
    else
      container.FlutterDropzone.updateHandlers(onLoaded, onError, onHover, onDrop, onDropMultiple, onLeave);
  },
};

window.dispatchEvent(new Event('flutter_dropzone_web_ready'));
}