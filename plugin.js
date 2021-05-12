Draw.loadPlugin(function(ui){
	if (ui.sidebar != null){
	    mxResources.parse('Descargar=Descargar código Chowlk');

	    ui.actions.addAction('Descargar', function() {
	    	var graph = ui.editor.graph;
			var encoder = new mxCodec(mxUtils.createXmlDocument());
			var node = encoder.encode(graph.getModel());
			var str1 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<mxfile>\n<diagram>\n";
			var str2 = "</diagram>\n</mxfile>";
			var xml = mxUtils.getPrettyXml(node);
			var final = str1 + xml + str2;

			const fs = require('fs');
			const path = require('path');

			fs.mkdir(path.join('/', 'DiagramsTmpXml'), (err) => {});

			fs.appendFile('/DiagramsTmpXml/tmpXml.xml', final,(error)=>{});

			function download(filename, text) {
				var element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
				element.setAttribute('download', filename);

				element.style.display = 'none';
				document.body.appendChild(element);

				element.click();

				document.body.removeChild(element);
			}	
		
			//Llamada a Curl
			const exec = require('child_process').exec;
			var descarga = true;
			function execute(command, callback) {				
			    var a = exec('curl -F data=@/DiagramsTmpXml/"tmpXml.xml" https://chowlk.linkeddata.es/api' , (error, stdout, stderr) => {
			    	callback(stdout);			        
			        fs.rm('/DiagramsTmpXml/tmpXml.xml', { recursive:true }, (err) => {})
				});
			};

			execute('ping -c 4 0.0.0.0', (a) => {			    
				mxUtils.popup(a,true);
			    download("diagrama.ttl", a);		 
	   
			});
			function borrar(){
				fs.rmdir("/DiagramsTmpXml", () => {
				});
			}
			setTimeout(borrar, 2000);

	    });

	// Adds menu
	    ui.menubar.addMenu('Chowlk', function(menu, parent) {
	    	ui.menus.addMenuItem(menu, 'Descargar');

	    });
	}
	
});


