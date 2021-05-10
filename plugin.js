Draw.loadPlugin(function(ui){
	if (ui.sidebar != null){
	    mxResources.parse('Descargar=Descargar código Chowlk');
	    mxResources.parse('Visualizar=Visualizar código');
	    mxResources.parse('Pruebas=Pruebass');

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
			download("diagrama.xml", final);
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
			//download("a.owl", a);
			// call the function
			execute('ping -c 4 0.0.0.0', (a) => {    
			        mxUtils.popup(a,true);
			   		download("a.owl", a);
			});
		});


		ui.actions.addAction('Pruebas', function(){
function function1() {
    // stuff you want to happen right away
    mxUtils.alert('Welcome to My Console,');
}

function function2() {
    // all the stuff you want to happen after that pause
    mxUtils.alert('Blah blah blah blah extra-blah');
}

// call the first chunk of code right away
function1();

// call the rest of the code and have it execute after 3 seconds
setTimeout(function2, 8000);

		});


	// Adds menu
	    ui.menubar.addMenu('Chowlk', function(menu, parent) {
	    	ui.menus.addMenuItem(menu, 'Descargar');
	    	ui.menus.addMenuItem(menu, 'Visualizar');
	    	ui.menus.addMenuItem(menu, 'Pruebas');
	    });
	}
	
});


	//https://chowlk.linkeddata.es/api
	//install jquery y node

	//curl -F data=@/"diagrama.xml" https://chowlk.linkeddata.es/api
