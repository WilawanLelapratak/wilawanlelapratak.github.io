// function func_name(input) {
// 	//dosomethings
// 	return ;
// }

for (var i = 1; i <= 32; i++) {
	console.log(i);
	$('select#subnet').append("<option value="+i+">"+i+"</option>");
}

$('form').submit(function(e){
	e.preventDefault();
	var ip = $('input#Inputip').val();
	var subnet = $('select#subnet').val();
	console.log(ip);
	console.log(subnet);
});