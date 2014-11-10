var session_id;
var company_name;
var obj;
var location_page;
var action;
var content_type;

$(document).ready(function ()
{
	location_page = location.pathname.split("/").slice(-1)[0];
	company_name = sessionStorage.getItem('company_name');
	content_type = sessionStorage.getItem('content_type');
	session_id = sessionStorage.getItem('session_id');

	if ( location_page == 'main.html' )
	{
		$('#company_name').text(company_name);

		$('button').click(function()
		{
			action = $(this).data('action');

			switch (action)
			{
				case 'order': 
				{
					sessionStorage.setItem('content_type', '2');
					window.open('search.html','_self',false);
				}
				break;
				case 'container': 
				{
					sessionStorage.setItem('content_type', '1');
					window.open('search.html','_self',false);
				}
				break;
				case 'settings': alert('!!'); break;
			}
		});
	}

	if ( location_page == 'search.html' )
	{
		$('button').click(function()
		{
			action = $(this).data('action');

			switch (action)
			{
				case 'search': 
				{
					if ( content_type == '1' )
					{
						window.open('cont_list.html','_self',false);
					}
					if ( content_type == '2' )
					{
						window.open('order_list.html','_self',false);
					}
				}
				break;
			}
		});

		$('.button-center').click(function()
		{
			var first_page = $('.first-page');
			var second_page = $('.second-page');

			if ( first_page.css('display') == 'block' )
			{
				first_page.css('display', 'none');
				second_page.css('display', 'block');
			}
			else if ( second_page.css('display') == 'block' )
			{
				first_page.css('display', 'block');
				second_page.css('display', 'none');
			}
		});
	}

	if ( location_page == 'cont_list.html' )
	{
		getContent(content_type);
	}

	if ( location_page == 'order_list.html' )
	{
		getContent(content_type);
	}
});

function logIn()
{
	login = $('#login').val();
	password = $('#password').val();

	$.ajax({
        crossOrigin: 	true,
        contentType: 	'application/json',
        contentType: 	"application/json; charset=utf-8",
        type: 			"GET",
        url: 			"http://vps-5785.vps-ukraine.com.ua/android/request.php?login="+login+"&pass="+password,
        dataType: 		"json",
        crossDomain: 	true,
        beforeSend: function(response)
        {
        	$("#loader").fadeIn();
        },
        success: function(response)
        {
        	obj = jQuery.parseJSON(response);
	        console.log(obj.session_id);
	        session_id = obj.session_id;
	        company_name = obj.company_name;
	        
	        $("#loader").fadeOut();

			window.open('main.html','_self',false);
			console.log(response);

			sessionStorage.setItem('company_name', company_name);
			sessionStorage.setItem('session_id', session_id);
	    },
	    error: function(response)
	    {
	    	//alert('Error!');
	    	console.log(response);
	    }
  	});
}

function getContent(content_type, by_id)
{
	var column_name;

	if ( by_id != undefined  )
	{
		if ( content_type == 1 ) { column_name = '&cont_no_id='+by_id; };
		if ( content_type == 2 ) { column_name = '&order_no_id='+by_id; };
	}

	$.ajax({
        crossOrigin: 	true,
        contentType: 	'application/json',
        contentType: 	"application/json; charset=utf-8",
        type: 			"GET",
        url: 			"http://vps-5785.vps-ukraine.com.ua/android/request.php?session_id="+session_id+"&contentType="+content_type+column_name,
        dataType: 		"json",
        crossDomain: 	true,
        beforeSend: function(response)
        {
        	$("#loader").fadeIn();
        },
        success: function(response)
        {
        	obj = jQuery.parseJSON(response);
        	console.log(obj);

        	if ( location_page == 'cont_list.html' )
			{
				for ( key in obj.cont_no )
				{
					$('.list').append(
						'<label>'+
						'<div class="row table-style">' +
							'<div class="col-xs-4">'+ obj.order_no[key] +'</div>' +
							'<div class="col-xs-4 col-white">'+ obj.cont_no[key] +'</div>' +
							'<div class="col-xs-4">'+ obj.cargo[key] +'</div>' +
						'</div>'+
						'</label>'
					);
				}
			}

			if ( location_page == 'order_list.html' )
			{
				for ( key in obj.order_no )
				{
					$('.list').append(
						'<label>'+
						'<div class="row table-style-cont">' +
							'<div class="col-xs-4">'+ obj.order_no[key] +'</div>' +
							'<div class="col-xs-4 col-white">'+ obj.eta[key] +'</div>' +
							'<div class="col-xs-4">'+ obj.ports[key] +'</div>' +
						'</div>'+
						'</label>'
					);
				}
			}
			$("#loader").fadeOut();
	    },
	    error: function(response)
	    {
	    	console.log(response);
	    	obj = jQuery.parseJSON(response);
	    }
  	});
}
