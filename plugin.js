Draw.loadPlugin(function(ui) {
// Sidebar is null in lightbox
	if (ui.sidebar != null)
	{
// Adds resource for action
	    mxResources.parse('Descargar=Descargar código Chowlk');
	    mxResources.parse('Visualizar=Visualizar código');
	// Adds action
		
	    ui.actions.addAction('Descargar', function() {
	    	var graph = ui.editor.graph;
			var encoder = new mxCodec(mxUtils.createXmlDocument());
			var node = encoder.encode(graph.getModel());
			var str1 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<mxfile>\n<diagram>\n";
			// var prueba2 = "<mxfile>\n";
			// var prueba3 = "<diagram>\n";
			var str2 = "</diagram>\n</mxfile>";
			//var prueba5 = "</mxfile>";
			//var final = prueba + prueba2 + prueba3 + node + prueba4 + prueba5;
			var xml = mxUtils.getPrettyXml(node);
			//var final = prueba + prueba2 + prueba3 + node + prueba4 + prueba5;
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

				// Start file download.
			download("diagrama.xml", final);
			mxUtils.popup(final, true);

				//mxUtils.popup(mxUtils.createXmlDocument(node),true);
	    });
	    ui.actions.addAction('Visualizar', function(){
	    	//mxUtils.alert('HOLA')
	    	var req = new mxXmlRequest('https://swapi.dev/api/people/1/', 'GET', false);
			req.send();
			mxUtils.popup(mxUtils.getlPrettyXml(req.getDocumentElement()), true);
			mxUtils.alert(req.getStatus());
			// var sal = req.isBinary();

			// mxUtils.popup(sal, true);
			var onload = function(req)
			{
			if(req.getStatus()=="200"){
				mxUtils.alert('BIEN');
			}
			else{
				mxUtils.alert('MAL');
			}
			  //mxUtils.alert(req.getStatus());
			  //mxUtils.popup(document.writeln(req.responseText), true);
			}

			var onerror = function(req)
			{
			  mxUtils.alert('Error');
			}
			new mxXmlRequest('https://swapi.dev/api/people/1/', null, 'GET').send(onload, onerror);
			//mxUtils.alert(req.getStatus());

			// var xhr = new XMLHttpRequest(),
   //  		method = "GET",
   //  		url = "https://swapi.dev/api/people/1/";

			// xhr.open(method, url, true);
			// xhr.onreadystatechange = function () {
	  //       //if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
	            
	  //           //document.writeln(xhr.responseText);
			// 	//console.log(xhr.status);
			// 	mxUtils.alert(xhr.getStatus);
	  //       //}
		 //    };
			// xhr.send();
			// mxUtils.alert(xhr.getStatus);
		});

	// Adds menu
	    ui.menubar.addMenu('Chowlk', function(menu, parent) {
	    	ui.menus.addMenuItem(menu, 'Descargar');
	    	ui.menus.addMenuItem(menu, 'Visualizar');
	    });
	}
	
});


	//fetch mirar
	//prueba
	//https://chowlk.linkeddata.es/api