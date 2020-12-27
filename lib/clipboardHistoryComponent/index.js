const {ipcRenderer, remote} = require('electron')

function createDiv (text, label, index) {
  var div = document.createElement('li')
  div.id = 'clip_' + index
  div.className = 'item'
  div.nodeValue = text
  if(!text.trim()){
    div.style.height = "15px";
  }
  div.onclick = function () {
    ipcRenderer.invoke('setClipboard', text)
  }
  div.appendChild(document.createTextNode(label))
  return div
}

window.onload = function () {

  ipcRenderer.on('clipboardContents', (event, message) => {
    var clipDiv = document.getElementById('clipHistory')
    var clipList = message.copied

    clipLength = clipList.length
    var docFrag = document.createDocumentFragment()
    for (var i = clipList.length - 1; i >= 0; i--) {
      docFrag.appendChild(createDiv(clipList[i].text, clipList[i].label, i))
    }
    clipDiv.appendChild(docFrag)
  })

  document.addEventListener("keydown", event => {
    switch (event.key) {
      case "Escape":
        remote.getCurrentWindow().close()
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        let pos = clipLength - parseInt(event.key)
        let div = document.getElementById(`clip_${pos}`)
        if (div) {
          div.className ="item active"
          ipcRenderer.invoke('setClipboard', div.childNodes[0].nodeValue)
        }
        break;
    }
  })
}
