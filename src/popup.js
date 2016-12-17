document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('goto_server_status').addEventListener('click', function () {
        
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                var tab = tabs[0];
                var tabUrl = tab.url;
                var schemeHost = tabUrl.replace(/^(https?:\/\/[^\/]+).*$/, '$1');
                var newUrl = schemeHost + '/server-status';
                chrome.tabs.update(tab.id, {url: newUrl});
                window.close();
            });
            
    });

});
