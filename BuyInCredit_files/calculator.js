
$(function(){

	$('input').placeholder();
	jQuery("div").on('click','.tip',function(){jQuery(this).fadeOut();});
    $(document).click(function() {
        $(".js-select-list").hide();
      
    });
    function select(el) {
        $(".js-select").each(function(){
            var select_list = $(this).find(".js-select-list");
            var text = select_list.find("li").first().text();

			var curr_text=$(this).find(".js-select-input").val();

            if (curr_text=='' || curr_text=='0') {
				$(this).find(".js-select-text").text(text);
			} else if(curr_text!=text){
				$(this).find(".js-select-input").val(curr_text).change();
			}
			
            $(this).click( function(event){
                if ($(this).hasClass("is-active")) {
                    $(this).removeClass("is-active");
                    select_list.slideUp("fast");
                }
                else {
                    $(".js-select").removeClass("is-active");
                    $(".js-select-list").hide();
                    select_list.slideDown("fast");
                    $(this).addClass("is-active");
                }
                event.stopPropagation();
            });
            select_list.find("li").click(function(event) {
                var id = $(this).attr("data-id");
                var text = $(this).text();
                $(this).parent().parent().find(".js-select-text").text(text);
                $(this).parent().parent().find(".js-select-input").val(id).change();
                $(this).parent().hide();
                $(this).parents(".js-select").removeClass("is-active");
				
                event.stopPropagation();
            });
        });
    }
    $('.js-select').click(function(event){
        event.stopPropagation();
    });
	select();
	
	$("#phone").mask("+380 (99) 999-99-99");
	
	
function checkDate(month,day,year) {
	var result=true;
	var leap = 0;
	if ((year % 4 == 0) || (year % 100 == 0) || (year % 400 == 0)) leap = 1;
	if ((month == 1) && (leap == 1) && (day > 29)) result=false;
	if ((month == 1) && (leap != 1) && (day > 28)) result=false;
	if (((month==3) || (month==5) || (month==8) || (month==10)) && (day==31)) result=false;
	return result;
}


jQuery.validator.addMethod("innBirthDate", function(value, element, params) { 
	var ret=true;
	var id=jQuery("#inn").val();
	var days = id.substr(0,5);
	days=parseInt(days)+1;
	var year = 1900; 
	var day = 1; 
	var month = 0;
	var daysInYear;
	var daysInMonth;
	while (days > 0) {
		daysInYear = (checkDate(1, 29, year)) ? 366 : 365;
		if (days > daysInYear){
			days -= daysInYear;
			year ++;
		} else {
			for (daysInMonth = 31; !checkDate(month, daysInMonth, year); daysInMonth--) ;
			if (days > daysInMonth) {
				days -= daysInMonth;
				month ++;
			} else {
				day = days;
				days = 0;
			}
		}
	}
	month=parseInt(month)+1;
	//if (day.length<2) day='0'+day;
	//var b_date=$("input[name='date1']").val().split(".");
	var b_month=jQuery("#birth_month").val();
	var b_day=jQuery("#birth_day").val();
	var b_year=jQuery("#birth_year").val();
//alert(b_day+"="+day+" | "+b_month+"="+month+" | "+b_year+"="+year+" | ");
	if ((b_month!=month) || (b_day!=day) || (b_year!=year)) ret=false;

	return ret; 
}, jQuery.format("Не совпадает с идентификационным кодом"));


jQuery.validator.addMethod("ageBirthDate", function(value, element, params) { 
	var ret=true;
	var month=Number(jQuery("#birth_month").val())-1;
	var day=Number(jQuery("#birth_day").val());
	var year=Number(jQuery("#birth_year").val());
	
	var today=new Date();
	var age=today.getFullYear()-year;
	if(today.getMonth()<month || (today.getMonth()==month && today.getDate()<day)){age--;}

	if (age>Number(max_age) || age<Number(min_age)) ret=false;

	return ret; 
}, jQuery.format("Возраст может быть от {0} до {1} лет"));

jQuery.validator.addMethod("validateNumber", function(value, element) { 
	if (value=="") return false; 
	var RE = /^[0-9]+$/;
	if (!RE.test(value)) return false; 
	return true; 
}, "Введите корректное число");
	
jQuery.validator.addMethod("validateDecimal", function(value, element) { 
	if (value=="") return false; 
	element.value=value.replace(",",".");
	var RE = /^\d*\.?\d{0,2}$/;
	if (!RE.test(value)) return false; 
	return true; 
}, "Введите стоимость (XXXXX.XX)");

jQuery.validator.addMethod("validateTopay", function(value, element, params) { 
	var ret=true;
	var price=$("#price").val();
	var credit_sum=parseFloat(price)-parseFloat(value);
	var max_topay_val=parseFloat(price)-parseFloat(min_credit_sum);
	if (max_topay_val<0) max_topay_val=0;
	
	var min_topay_val=min_topay;
	if (credit_sum>max_credit_sum) min_topay_val=parseFloat(credit_sum)-parseFloat(max_credit_sum);
	if (min_topay_val<min_topay) min_topay_val=min_topay;
	
	if (value>max_topay_val || value<min_topay_val) ret=false;

	return ret; 
	
}, function(value, element, params) {
	var price=$("#price").val();
	var credit_sum=parseFloat(price)-parseFloat(value);
	var max_topay_val=parseFloat(price)-parseFloat(min_credit_sum);
	if (max_topay_val<0) max_topay_val=0;
	
	var min_topay_val=min_topay;
	if (credit_sum>max_credit_sum) min_topay_val=parseFloat(credit_sum)-parseFloat(max_credit_sum);
	if (min_topay_val<min_topay) min_topay_val=min_topay;
	return jQuery.format("Первоначальный взнос может быть от {0} до {1} грн.",min_topay_val,max_topay_val);
	});

	
	$("#calcForm").validate({
		ignore: ".ignore",
		rules: {
			price: "validateDecimal",
			topay: {
				required: true,
				validateNumber:true,
				validateTopay:true
			},
			firstname: {
				required: true
			},
			secondname: {
				required: true
			},
			lastname: {
				required: true
			},
			phone: {
				required: true
			},
			inn: {
				required: true,
				minlength: 10,
				validateNumber: true
			},
			birth_year: {
				ageBirthDate: true,
				innBirthDate: true
			}
		},
		messages: {
			topay: {
				required: "Введите первоначальный взнос",
				validateNumber: "Введите целое число"
			},
			firstname: {
				required: "Введите Имя"
			},
			secondname: {
				required: "Введите Отчество"
			},
			lastname: {
				required: "Введите Фамилию"
			},
			phone: {
				required: "Введите Телефон"
			},
			inn: {
				required: "Введите идентиф. код",
				minlength: "Некорректный идентиф. код",
				validateNumber: "Некорректный идентиф. код"
			},
			birth_year: {
				ageBirthDate: "Возраст может быть от "+min_age+" до "+max_age+" лет",
				innBirthDate: "Не совпадает с идентиф. кодом"
			},			
			obl: {
				required: "Введите область"
			},			
			city: {
				required: "Введите город"
			}

		},
        errorElement: "div",
        
        errorPlacement: function(error, element) {
            error.insertAfter(element)
            error.addClass('tip');  // add a class to the wrapper
        }
	});

	$("#linkCalcAppSend").click(function(){

		if ($("#calcForm").valid()) {
			if (!jQuery("#agree").is(':checked')) {
				alert("Необходимо согласие с пользовательским соглашением.");
			} else {
				sendData();
			}
		} else {
			//alert("nok");
		}
		return false;
	});
	
	$("#term").add("#topay").add("#price").change(function(){
		recalculate();
	});
	
	function recalculate() {
		var price=parseFloat($("#price").val());
		var topay=parseFloat($("#topay").val());
		var term=parseFloat($("#term").val());
		
		var credit_sum=price-topay;
		credit_sum=credit_sum.toFixed(2)
		if (parseFloat(credit_sum)<=0 || isNaN(credit_sum)) credit_sum="--";
		$("#txt_credit_sum").text(credit_sum);
		
		var insurance=parseFloat(credit_insurance);
		var komis_once=parseFloat(credit_komis_once);
		var komis_month=parseFloat(credit_komis_month);
		
		var komis_month_val=(credit_sum+credit_sum*insurance*term+credit_sum*komis_once)*komis_month;
		var komis_once_val=credit_sum*komis_once/term;
		var insurance_val=credit_sum*insurance;
		var monthbody_val=credit_sum/term+insurance_val+komis_once_val;
		var month_val=monthbody_val+komis_month_val;
		month_val=month_val.toFixed(2);
		if (parseFloat(month_val)<=0 || isNaN(month_val)) month_val="--";
		$("#txt_month_pay").text(month_val);
		
	}
	
	recalculate();
	
	
	function sendData(){
		$("#page_form").hide();
		$("#page_loading").show();
		$("#page_result_ok").hide();
		$("#page_result_error").hide();
		
		var formData = {
			eshopname:eshopname,
			product_id:product_id,
			product_name:product_name,
			product_url:product_url,
			credit_product:credit_product,
			price:jQuery("#price").val(),
			topay:jQuery("#topay").val(),
			credit_sum:jQuery("#txt_credit_sum").text(),
			month_pay:jQuery("#txt_month_pay").text(),
			term:jQuery("#term").val(),
			firstname:jQuery("#firstname").val(),
			secondname:jQuery("#secondname").val(),
			lastname:jQuery("#lastname").val(),
			inn:jQuery("#inn").val(),
			birth_day:jQuery("#birth_day").val(),
			birth_month:jQuery("#birth_month").val(),
			birth_year:jQuery("#birth_year").val(),
			phone:jQuery("#phone").val(),
			obl:jQuery("#obl").val(),
			city:jQuery("#city").val(),
			promocode:jQuery("#promocode").val()
		}; 

		jQuery.ajax({
				url: "save.php",
				type: "POST",
				data: formData,			
				success: function(data, textStatus, jqXHR) {
					if (data=='OK' ) {
						$("#page_form").hide();
						$("#page_loading").hide();
						$("#page_result_ok").show();
						$("#page_result_error").hide();
					} else {
						$("#page_form").hide();
						$("#page_loading").hide();
						$("#page_result_ok").hide();
						$("#page_result_error").show();
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
						$("#page_form").hide();
						$("#page_loading").hide();
						$("#page_result_ok").hide();
						$("#page_result_error").show();
				}
		});
		
		return false;
		
	}
	
})