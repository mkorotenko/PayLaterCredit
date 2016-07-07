
$(function(){

	$('input').placeholder();
	jQuery('input[name="radio-choise"]').click(function(){
	  $("p","#credit_text").text($("div.choise-sp-2","label[for='radio-choise-"+$(this).val()+"']").text().replace(" ",""));
	  checkEnableToSend();
	});
	jQuery("div.proc-data-agree").click(function(){
	  $("#process_agree").css("display",dataProcessingAgree()? 'none':'block');
	  checkEnableToSend();
	});
  function dataProcessingAgree() {
    return $("#process_agree").css("display")!=='none';
  }
  function dataReady() {
    var valid = validator,
        result = true;
    $('input', 'div.section-2').each(function(index,element){
      if(result && !$(element.parentNode.parentNode).hasClass('ready')) result = false;
    });
    return result;
  }
  function creditSelected() {
    return !!$('[name="radio-choise"]:checked').val();
  }
  function checkEnableToSend() {
    if(dataProcessingAgree() && dataReady() && creditSelected()) {
      $("#buyInCredit").addClass('ready');
      return true;
    }
    else $("#buyInCredit").removeClass('ready');
    return false;
  }
	$("#phone").mask("+380 (99) 999-99-99");
	
	var validator = $("#creditForm").validate({
    submitHandler: function(form) {
      console.log('FORM READY');
    },
		ignore: ".ignore",
		validClass: "ready",
		rules: {
			phone: {
				required: true,
				minlength: 10
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
			inn: {
				required: true,
				minlength: 10,
				digits: true
			},
		 	passerr: {
		 		required: true,
		 		minlength: 2
		 	},
			pas: {
				required: true,
				minlength: 6,
				digits: true
			},
			pass_day: {
				required: true,
				digits: true
			},
			pass_month: {
				required: true,
				digits: true
			},
			pass_year: {
				required: true,
				minlength: 4,
				digits: true
			}
		},
    errorPlacement: function(error, element) {
      var cont = $(element[0].parentNode.parentNode);
      cont.removeClass('ready').addClass('fail');
    },
    success: function(label, element) {
      if($(element).hasClass('ignore')) return;
      var cont = $(element.parentNode.parentNode),
          needToCheck = !cont.hasClass('ready');
      cont.removeClass('fail').addClass('ready');
      if(needToCheck) checkEnableToSend();
    }
	});

	$("#buyInCredit").click(function(){
    if(!checkEnableToSend()) return false;
		if ($("#creditForm").valid()) {
			if (!creditSelected()) {
				alert("Необходимо выбрать вариант рассрочки.");
			} else 
			if (!dataProcessingAgree()) {
				alert("Нужно дать согласие на обработку личных данных.");
			}
			else {
				sendData();
			}
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
