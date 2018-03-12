
var listText = new Array();
var listTextBk = new Array();
var listRemove = new Array();	

$(function () {
	
	cargarTextCrud();
	cargarAddTextDialog();
	$(":button" ).button();
	
	$("#addbtn").click(function(e) {
		$("#texto").val("");
		$("#addTextoDialog").dialog("open");
		event.preventDefault();

	});
	
	$("#removebtn").click(function(e) {
		removeTexto();
	});
	
	$("#deshacerbtn").click(function(e) {
		deshacer();
	});
	
	cargarDataTextCrud();
	
});


function cargarTextCrud(){
	
	$("#text-crud").selectable({
    	//distance: 1,  -- Se habilita para el doble click pero no funcina muy bien ya se que encuentra deprecado https://forum.jquery.com/topic/selectable-dosn-t-fire-click-event
    	//cancel: "a,.cancel",
        stop: function() {
          
          listRemove = new Array();
          var result = $( "#select-result" ).empty();
          
          $( ".ui-selected", this ).each(function() {
            var index = $( "#text-crud li" ).index( this );
            	
            	id = $(this).attr('id');
            	listRemove[listRemove.length] = id;
            	result.append( $("#" + id).html() + "," );
          });
        }
    	
    });

            
    $('#text-crud > li').dblclick(function() {
    	$('#text-crud > li').removeClass('ui-selected');
    	$(this).addClass('ui-selected');
    	
    	listRemove[listRemove.length] = $(this).attr('id');
		removeTexto();
    });
    
    $('#text-crud > li').click(function() {
    	$('#text-crud > li').removeClass('ui-selected');
    	$(this).addClass('ui-selected');
    });
    
}

function cargarDataTextCrud(){
	
	$.getJSON("/restful/listText", function(response) {
		  
		if (response.status == "success") {
		   
			$.each(JSON.parse(response.data), function(key, value){
				  $("#text-crud").html($("#text-crud").html() + 
						  "<li id='"+ key +"' class='ui-widget-content'>" + value +"</li>");
				  listText[listText.length] = value;
			});
	  }
	});
}


function cargarAddTextDialog(){
	
	$("#addTextoDialog").dialog({
		autoOpen: false,
		width: 230,
	    show: {
	    	duration: 200
	    },
	    hide: {
	    	duration: 200
	    },
		buttons: {
			"Aceptar" : addTexto,
	        Cancel: function() {
	        	$("#addTextoDialog").dialog( "close" );
	          }
		}
	});
}

function addTexto(){
		
	var texto = $("#texto").val();
	
	if(texto == ""){
		$(".error").css("display","inline");
	}else {
		$(".error").css("display","none");
		
		listTextBk = listText.slice();
		var index = listText.length;
		listText[index] = ($("#texto").val());
		
		$("#text-crud").html($("#text-crud").html() + "<li id='"+ index +"' class='ui-widget-content'>" + $("#texto").val() +"</li>");
		$("#addTextoDialog").dialog( "close" );
	}
	
}

function removeTexto(){
	
	listTextBk = listText.slice();
	
	$.each(listRemove, function(key, value) {
		
		$("#"+value).remove();
		
		listText = new Array();
		$( "#text-crud li" ).each(function(){
			listText[$(this).attr('id')] = $(this).html();
		});
	});	
	
	$( "#select-result" ).empty();
	$("#addTextoDialog").dialog( "close" );
}

function deshacer(){
	
	 $("#text-crud").html("");
		
	$.each(listTextBk, function(key, value){
		  $("#text-crud").html($("#text-crud").html() + 
				  "<li id='"+ key +"' class='ui-widget-content'>" + value +"</li>");
		  
	});
	
	listText = listTextBk.slice();
}


$.mockjax({
  url: "/restful/listText",
  responseText: {
    status: "success",
    data: '["Perú","Chile","España","Alemania","Japon","Estados Unidos"]'
  }
});

