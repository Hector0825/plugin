Draw.loadPlugin(function(ui){
	if (ui.sidebar != null){
	    mxResources.parse('Descargar=Descargar código Chowlk');
	    mxResources.parse('Visualizar=Visualizar código');

	    ui.actions.addAction('Descargar', function() {
	    	var graph = ui.editor.graph;
			var encoder = new mxCodec(mxUtils.createXmlDocument());
			var node = encoder.encode(graph.getModel());
			var str1 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<mxfile>\n<diagram>\n";
			var str2 = "</diagram>\n</mxfile>";
			var xml = mxUtils.getPrettyXml(node);
			var final = str1 + xml + str2;

			function download(filename, text) {
			  var element = document.createElement('a');
			  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
			  element.setAttribute('download', filename);

			  element.style.display = 'none';
			  document.body.appendChild(element);

			  element.click();

			  document.body.removeChild(element);
			}
			
			download("diagrama.xml", final);
			mxUtils.popup(final, true);

			//Llamada a Chowlk
			// var req = new mxXmlRequest('https://chowlk.linkeddata.es/api', final, 'POST', false);
			// req.send();
			// mxUtils.alert(req.getDocumentElement());
			// mxUtils.popup(req.getText(), true);

			const exec = require('child_process').exec;

			function execute(command, callback) {
				mxUtils.popup(final, true);
			    var a = exec("curl 'final' https://chowlk.linkeddata.es/api", (error, stdout, stderr) => {
			        callback(stdout);			        
			    });
			};

			// call the function
			execute('ping -c 4 0.0.0.0', (a) => {			    
			        mxUtils.popup(a,true);			   
			});
			download("a.owl", a);
	    });
	    ui.actions.addAction('Visualizar', function(){

			function download(filename, text){
					  var element = document.createElement('a');
					  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
					  element.setAttribute('download', filename);

					  element.style.display = 'none';
					  document.body.appendChild(element);

					  element.click();

					  document.body.removeChild(element);
					}

			const exec = require('child_process').exec;
			function execute(command, callback) {
			    var a = exec('curl -F data=@/"diagrama.xml" https://chowlk.linkeddata.es/api', (error, stdout, stderr) => {
			        callback(stdout);
			    });
			};

			// call the function
			execute('ping -c 4 0.0.0.0', (a) => {    
			        mxUtils.popup(a,true);
			   		download("a.owl", a);
			});
		});

	// Adds menu
	    ui.menubar.addMenu('Chowlk', function(menu, parent) {
	    	ui.menus.addMenuItem(menu, 'Descargar');
	    	ui.menus.addMenuItem(menu, 'Visualizar');
	    });
	}
	
});


	//https://chowlk.linkeddata.es/api