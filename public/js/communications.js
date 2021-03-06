// The WebSocket-Object (with resource + fallback)
var serverWS = new WebSocket ('ws://' + window.location.host + '/');

// WebSocket onerror event triggered also in fallback
serverWS.onerror = (e) => {
  console.log ('Error with WebSocket uid: ' + e.target.uid);
};

serverWS.onopen = () => {
  var progressWidget;
  console.log('WebSocket connection opened');

  serverWS.onmessage = (message) => {
    var msg = JSON.parse(message.data);
    switch(msg.fn) {
    case 'elvanto_to_db': {
      switch(msg.action){
      case 'started':{
        progressWidget = new ProgressWidget('#list-group-progress',
                                            '.dropdown .dropdown-menu .panel .list-group',
                                            {text: 'Import process started', small_text: 'at: ' + new Date(), progress: 0});
        notificationContiner.add.call(notificationContiner, progressWidget);
      };break;
      case 'finished': {
        progressWidget.done({
          text: 'DB Update completed',
        });
      };break;
      case 'progress':
        progressWidget.update({
          text: 'Updating records(' + msg.page + ')',
          progress: parseInt(msg.page) * msg.page_size/msg.total*100,
        });
      }
    };break;
    case 'db_to_google': {
      switch(msg.action){
      case 'started':{
        progressWidget = new ProgressWidget('#list-group-progress',
                                            '.dropdown .dropdown-menu .panel .list-group',
                                            {text: 'Export process started', small_text: 'at: ' + new Date(), progress: 0});
        notificationContiner.add.call(notificationContiner, progressWidget);
      };break;
      case 'finished': {
        progressWidget.done({
          text: 'Google Contacts update completed',
        });
      };break;
      case 'progress':
        progressWidget.update({
          text: 'Updating contact (' + msg.page + ')',
          progress: parseInt(msg.page) * msg.page_size/msg.total*100,
        });
      }
    };break;

    }
  }
};
