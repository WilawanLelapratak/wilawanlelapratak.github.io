function make_bi_maskip(mask) {
	var maskstring = '';

	for (var i = 1; i <= 32; i++) {
		if (i <= mask) {
			maskstring += '1';
		} else {
			maskstring += '0';
		}
		if (i % 8 == 0 && i != 32) {
			maskstring += '.';
		}
	}
	
	return maskstring;
}

function bi_to_deci(string) {
	var maskstring_li = string.split('.');
	for (var i = 0; i < maskstring_li.length; i++) {
		maskstring_li[i] = parseInt(maskstring_li[i], 2);
	}

	return maskstring_li.join('.');
}

for (var i = 1; i <= 32; i++) {
	// console.log(bi_to_deci(make_bi_maskip(i)));
	// console.log(i);
	$('select#subnet').append("<option value="+i+">"+ bi_to_deci(make_bi_maskip(i)) +'/'+i+"</option>");
}

$('form').submit(function(e){
	e.preventDefault();
	var ip = $('input#Inputip').val();
	var subnet = $('select#subnet').val();
	console.log(ip);
	console.log(subnet);
});