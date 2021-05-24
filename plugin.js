Draw.loadPlugin(function(ui){
	//FUNCIONES

	function cargar(){
		var graph = ui.editor.graph;
		var encoder = new mxCodec(mxUtils.createXmlDocument());
		var node = encoder.encode(graph.getModel());
		var str1 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<mxfile>\n<diagram>\n";
		var str2 = "</diagram>\n</mxfile>";
		var xml = mxUtils.getPrettyXml(node);
		var final = str1 + xml + str2;
		const path = require('path');

		fs.mkdir(path.join('/', 'DiagramsTmpXml'), (err) => {});
		fs.appendFile('/DiagramsTmpXml/tmpXml.xml', final,(error)=>{});			
	}

	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}			

	const exec = require('child_process').exec;
	const fs = require('fs');
	function execute(command, callback) {				
	    var a = exec('curl -F data=@/DiagramsTmpXml/"tmpXml.xml" https://chowlk.linkeddata.es/api' , (error, stdout, stderr) => {
	    	callback(stdout);			        
	        fs.rm('/DiagramsTmpXml/tmpXml.xml', { recursive:true }, (err) => {})
		});
	};

	function execute_err(command, callback) {				
	    var a = exec('curl -F data=@/DiagramsTmpXml/"tmpXml.xml" https://chowlk.linkeddata.es/errors' , (error, stdout, stderr) => {
	    	callback(stdout);			        
	        fs.rm('/DiagramsTmpXml/tmpXml.xml', { recursive:true }, (err) => {})
		});
	};

	function borrar(){
		fs.rmdir("/DiagramsTmpXml", () => {});
	}

    function agregar_id(dato){
        var arr = dato
        .map(x => x.shape_id)
        .filter((x, index, self) => self.indexOf(x) === index);
        return arr;
    }

    function agregar_msg(dato){
        var arr = dato
        .map(x => x.message)
        .filter((x, index, self) => self.indexOf(x) === index);
        return arr;
    }

    function agregar_value(dato){
        var arr = dato
        .map(x => x.value)
        .filter((x, index, self) => self.indexOf(x) === index);
        return arr;
    }

    borrar();
    //OPCIONES DEL MENU
	if (ui.sidebar != null){
	    mxResources.parse('Descargar=Download OWL code');
	    mxResources.parse('Errores=Error checking');

	    //DESCARGAR CODIGO CHOWLK
	    ui.actions.addAction('Descargar', function() {
	    	cargar();
			
			execute('ping -c 4 0.0.0.0', (a) => {			    
				mxUtils.popup(a,true);
			    download("diagram.ttl", a);
			});
			execute_err('ping -c 4 0.0.0.0', (a) => {			    
				var buscar = "shape_id";	
				var posicion = a.toLowerCase().indexOf(buscar.toLowerCase());
				if (posicion !== -1)
				    mxUtils.alert("There are errors in the diagram, incomplete OWL code, use check error options")			 
				});
	    });	 
		
		//COMPROBAR ERRORES
	    ui.actions.addAction('Errores', function(){	 
			cargar();

	    	var bool = true;
			//Llamada a Curl
			execute_err('ping -c 4 0.0.0.0', (a) => {
				var buscar = "shape_id";	
				var posicion = a.toLowerCase().indexOf(buscar.toLowerCase());
				if (posicion !== -1){
				    mxUtils.alert("There are errors in the diagram");
					
				}
				else{
					bool = false;
					fs.rm('/DiagramsTmpXml/tmpXml.xml', { recursive:true }, (err) => {});
				    mxUtils.alert("There aren't errors in the diagram");

				}

			    var datos = JSON.parse(a);

				var arrows_id = agregar_id(datos.Arrows);
			    var attributes_id = agregar_id(datos.Attributes);
			    var concepts_id = agregar_id(datos.Concepts); 
			    var ellipses_id = agregar_id(datos.Ellipses);
			    var metadata_id = agregar_id(datos.Metadata);
			    var namespaces_id = agregar_id(datos.Namespaces);
			    var rhombuses_id = agregar_id(datos.Rhombuses);

			    var arrows_msg = agregar_msg(datos.Arrows);
			    var attributes_msg = agregar_msg(datos.Attributes);
			    var concepts_msg = agregar_msg(datos.Concepts); 
			    var ellipses_msg = agregar_msg(datos.Ellipses);
			    var metadata_msg = agregar_msg(datos.Metadata);
			    var namespaces_msg = agregar_msg(datos.Namespaces);
			    var rhombuses_msg = agregar_msg(datos.Rhombuses);

			    var arr_id = arrows_id.concat(attributes_id, concepts_id, ellipses_id,
			    	 metadata_id,namespaces_id, rhombuses_id);

			    var arr_msg = arrows_id.concat(attributes_msg, concepts_msg, ellipses_msg, 
			    	metadata_msg, namespaces_msg, rhombuses_msg);
			  	
			  	var err;
			  	var errores = new Array();
				for(var i=0 ; i<arr_id.length; i++){
				err = 'There are errors in the tag with id "'+arr_id[i]+ '" whose error is "'+
						arr_msg[i]+'"\n';
						errores[i] = err;
				}

				errores = errores.toString();
				errores = errores.replaceAll(',','');
				

				if(bool==true){
					mxUtils.alert(errores);
					download("errors.txt",errores);
				}
			});
		});

	// Adds menu
	    ui.menubar.addMenu('Chowlk', function(menu, parent) {
	    	ui.menus.addMenuItem(menu, 'Descargar');
	    	ui.menus.addMenuItem(menu, 'Errores');
	    });
	}
	borrar();
});

	