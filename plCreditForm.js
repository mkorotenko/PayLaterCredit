
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
	if ((year % 4 === 0) || (year % 100 === 0) || (year % 400 === 0)) leap = 1;
	if ((month === 1) && (leap === 1) && (day > 29)) result=false;
	if ((month === 1) && (leap !== 1) && (day > 28)) result=false;
	if (((month === 3) || (month === 5) || (month === 8) || (month === 10)) && (day === 31)) result=false;
	return result;
}

jQuery.validator.addMethod("validateNumber", function(value, element) { 
	if (value==="") return false; 
	var RE = /^[0-9]+$/;
	if (!RE.test(value)) return false; 
	return true; 
}, "Введите корректное число");
	
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
		validClass: "ready",
		rules: {
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
			passerr: {
				required: true
			},
			pas: {
				required: true,
				validateNumber: true
			},
			pass_day: {
				required: true,
				validateNumber: true
			},
			pass_month: {
				required: true,
				validateNumber: true
			},
			pass_year: {
				required: true,
				minlength: 4,
				validateNumber: true
			}
		},
		messages: {
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

		},
    errorPlacement: function(error, element) {
        //error.insertAfter(element)
        //error.addClass('tip');  // add a class to the wrapper
        //$(element[0].parentNode.parentNode).addClass('fail');
    }
	});

	$("#buyInCredit").click(function(){

		if ($("#calcForm").valid()) {
			if (!$('[name="radio-choise"]:checked').val()) {
				alert("Необходимо выбрать вариант рассрочки.");
			} else {
				sendData();
			}
		} else {
			//alert("nok");
		}
		return false;
	});

	function sendData(){
		$("#page_form").hide();
		$("#page_loading").show();
		$("#page_result_ok").hide();
		$("#page_result_error").hide();
		
		var strukt=function(){
			this.provider='online_store';
			this.trade_point=shop||' ';
			this.offer_id=$('[name="radio-choise"]:checked').val()||' ';
			var ei=this.extra_info={};
			var gs=ei.goods_objects={};
			var go=gs.goods_object={};
			go.goods_group=' ';
			go.goods_sub_group=' ';
			go.goods_object=' ';
			go.goods_brand=' ';
			go.goods_model=product_name||' ';
			go.goods_price=price||' ';
			go.goods_invoice=' ';
			go.goods_cash_memo_date=' ';

			var c=this.customer={};
			c.last_name=jQuery("#lastname").val()||' ';
			c.first_name=jQuery("#firstname").val()||' ';
			c.middle_name=jQuery("#secondname").val()||' ';
			c.birth_date='1900-01-01';
			c.sex=' ';
			c.passport_series=jQuery("#passerr").val()||' ';
			c.passport_num=jQuery("#pas").val()||' ';
			c.passport_issue_date=(jQuery("#pass_year").val()||'1900')+'-'+(jQuery("#pass_month").val()||'01')+'-'+(jQuery("#pass_day").val()||'01');
			c.passport_issue_org=' ';
			c.tax_id=jQuery("#inn").val()||' ';
			c.contact_phone=jQuery("#phone").val()||' ';
			c.contact_email=' ';
			c.raddr_country='Украина';
			c.raddr_index=' ';
			c.raddr_region=' ';
			c.raddr_district=' ';
			c.raddr_loc_type=' ';
			c.raddr_loc=' ';
			c.raddr_str_type=' ';
			c.raddr_str=' ';
			c.raddr_build_num=' ';
			c.raddr_build_housing=' ';
			c.raddr_appt=' ';
			c.faddr_equal_raddr_flag=0;
			c.faddr_str=' ';
			c.faddr_phone_num=jQuery("#phone").val()||' ';
			c.family_martial_state=' ';
			c.i_faddr_pers_num='1';
			c.i_family_child_num='0';
			c.edu=' ';
			c.edu_institution=' ';
			c.job_emp_name=' ';
			c.job_emp_str=' ';
			c.job_phone_num=' ';
			c.job_pos=' ';
			c.comment=product_url||' ';
			var fc=c.family_children=[];
			var ca='0';
			if(!!ca){
				ca=ca.replace(' ',',');
				var chAges=ca.split(',');
				for (var i=0;i<chAges.length;i++) {
					fc.push({child:{i_age:(chAges[i])}});
				}
			}
		};

		var makeSoap12=function(){
			var toXML=function(obj){
				res='';
				if((typeof obj === 'object')&&(Object.prototype.toString.call(obj) === '[object Array]')){
					for (var i=0;i<obj.length;i++) res+=toXML(obj[i]);
				}
				else
				for(var f in obj){
					if(typeof obj[f] === 'object') res+='<'+f+'>'+toXML(obj[f])+'</'+f+'>';
					else 
					if((obj[f]||'')==='') res+='<'+f+'/>';
					else res+='<'+f+'>'+obj[f]+'</'+f+'>';
				}
				return res;
			};

			var str=new strukt();
			var data=toXML(str);
			var x='<?xml version="1.0" encoding="UTF-8"?> <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><SOAP-ENV:send_loan_request>'+data+'</SOAP-ENV:send_loan_request></SOAP-ENV:Body></SOAP-ENV:Envelope>';
			return x;
		};

    console.log(makeSoap12());
    
  		jQuery.ajax("http://gw.ks840.in.ua:8083/loanonline.php?partnerid=01c0efd161aad5b68d5780a2183b190d", {
  			type:"POST",
  			data:makeSoap12(),
  			contentType:"text/xml;charset=utf-8",
				success: function(data, textStatus, jqXHR) {
						$("#page_form").hide();
						$("#page_loading").hide();
						$("#page_result_ok").show();
						$("#page_result_error").hide();
				},
  			error:function(e, t, n) {
  						$("#page_form").hide();
  						$("#page_loading").hide();
  						$("#page_result_ok").hide();
  						$("#page_result_error").show();
  			}
		});
		
		return false;
		
	}
	
});
