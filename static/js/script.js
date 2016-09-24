$(function(){
	var registeredSeats = [];
	$.ajax({
		url: '/getUsers',
		type: 'GET',
	})
	.done(function(xhrData) {
		renderView(xhrData);
	})
	.fail(function(err) {
		$('#sysErrorModal').openModal();
	})
	.always(function() {
		//adding all listeners here so that they are attached to only after dom is rendered 
		console.log("complete");
		$('.available').on('click',function(e){
			if($(e.currentTarget).hasClass('selected'))
				$(e.currentTarget).removeClass('selected');
			else{
				if($('.selected').length >= $('#seats_no').val())
					showToast("Can't select seats greater than the seats entered above");
				else
					$(e.currentTarget).addClass('selected');
			}
		});
		var totalSeatsNeeded=0;
		$('.confirm-seats').on('click',function(e){
			var name = $('#user_name').val()
			e.preventDefault();
			totalSeatsNeeded  = $('#seats_no').val();
			$('.error').hide();
			if(totalSeatsNeeded == 0 || totalSeatsNeeded == undefined)
				$('#seat_error').show();
			if(name.trim() == "" || name == undefined)
				$('#name_error').show();
		});

		$('#submitBtn').on('click',function(e){
			var selectedCount = $('.selected').length;
			if( selectedCount === 0)
				showToast('Please select your seats');
			else if(selectedCount !== parseInt($('#seats_no').val())){
				showToast('Selected seats count should be equal to the number of seats entered in the form');
			}
			else{
				var seatNumbers="";
				var userName = $('#user_name').val();
				$('.selected').each((index,item) => {
					var num = $(item).data('item-id');
					seatNumbers = seatNumbers + "," + num;
				})
				seatNumbers = seatNumbers.slice(1);

				data = {
					userName: userName,
					totalSeats: selectedCount,
					selectedSeats: seatNumbers
				}
				$.ajax({
					url: '/',
					type: 'POST',
					data: data,
				})
				.done(function(xhrData) {
					//renderView(xhrData.data);
					$('td div.box.selected').removeClass('selected').addClass('registered');
					var trString = '<tr><td>' + userName + '</td><td>' + selectedCount + '</td><td>' + seatNumbers + '<td></tr>'
					$('.registered-users table').append(trString);
					console.log("success");
				})
				.fail(function(jqXHR, testStatus, error) {
					$('#sysErrorModal').openModal();
				})
				.always(function() {
					console.log("complete");
				});

			}
		});

		var showToast = function(message){
			Materialize.toast(message, 4000)
		}

	});
	var renderView = function(xhrData){
		var template = $('#seat-list').html();
		var templateScript = Handlebars.compile(template);
		var data = {
			row:['','A','B','C','D','E','F','G','H','I','J'],
			column:['','1','2','3','4','5','6','7','8','9','10','11','12']
		};
		registeredSeats =  xhrData.registeredSeats;
		data.users = xhrData.users;
		var html = 	templateScript(data);
		$('.templateContainer').empty().append(html);
		var maxCount = $('.box').length - $('.box.registered').length;
		$("#seats_no").attr('max',maxCount);
	}
	Handlebars.registerHelper('isBooked',function(rowId,columnId){
		if(registeredSeats.indexOf(rowId+columnId)!== -1)
			return "registered";
		else
			return "available";
	});

})