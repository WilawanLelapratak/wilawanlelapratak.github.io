function make_bi_maskip(mask) {
	var maskstring = '';

	for (var i = 1; i <= 32; i++) {
		if (i <= mask) {
			maskstring += '1';
		} else {
			maskstring += '0';
		}
		if (i % 8 === 0 && i != 32) {
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

function find_network_ip(ip, mask) {
	var ip_li = ip.split('.');
	var mask_li = bi_to_deci(make_bi_maskip(mask)).split('.');
	for (var i = 0; i < ip_li.length; i++) {
		ip_li[i] = parseInt(ip_li[i]) & parseInt(mask_li[i]);
	}
	return ip_li.join('.');
}

function find_host_num(mask) {
	return Math.pow(2, 32-mask);
}

function find_usable_host(host) {
	var usable = host-2;
	if (usable < 0) {
		usable = 0;
	}
	return usable;
}

function find_wildcard(mask) {
	mask = make_bi_maskip(mask);
	var invert = '';
	for (var i = 0; i < mask.length; i++) {
		if (mask[i] === '1') {
			invert += '0';
		} else if (mask[i] === '0') {
			invert += '1';
		} else {
			invert += mask[i];
		}
	}
	console.log(invert);
	return bi_to_deci(invert);
}

function bi_ip(network) {
	var network_li = network.split('.');
	for (var i = 0; i < network_li.length; i++) {
		network_li[i] = parseInt(network_li[i]).toString(2);
		while (network_li[i].length < 8) {
			network_li[i] = '0' + network_li[i];
		}
	}

	return network_li.join('.');
}

function plus_ip(network ,host) {
	var bi_network_li = bi_ip(network).split('.').join('');
	var before_change = parseInt(bi_network_li, 2)+host;
	var after_change = before_change.toString(2);
	while (after_change.length < 32) {
			after_change = '0' + after_change;
	}
	var result = ''
	for (var i = 1; i <= 32; i++) {
		result += after_change[i-1];
		if (i % 8 === 0 & i != 32) {
			result += '.';
		}
	}
	return bi_to_deci(result);
}

function find_usable_range(network_addr, host_num) {
	if (host_num >2) {
		var usable_start_range = plus_ip(network_addr, 1);
		var usable_end_range = plus_ip(network_addr, host_num-2);
		return usable_start_range + '-' + usable_end_range;
	} else {
		return 'N/A';
	}
}

function private_ip(network_addr) {
	var network_li = network_addr.split('.');
	if (network_li[0] === '10') {
		return 'Private';
	} else if (network_li[0] === '172') {
		if (parseInt(network_li[1], 10) >= 16 && parseInt(network_li[1], 10) <= 31)
			return 'Private';
	} else if (network_li[0] === '192' && network_li[1] === '168') {
		return 'Private';
	} else {
		return 'Public';
	}
}

for (var i = 1; i <= 32; i++) {
	$('select#subnet').append("<option value="+i+">"+ bi_to_deci(make_bi_maskip(i)) +'/'+i+"</option>");
}

$('form').submit(function(e){
	e.preventDefault();
	var ip = $('input#Inputip').val();
	var subnet = $('select#subnet').val();
	var network_addr = find_network_ip(ip, subnet);
	var host_num = find_host_num(subnet);
	var usable_host = find_usable_host(host_num);
	var wildcard = find_wildcard(subnet);
	var broadcast = plus_ip(network_addr, host_num-1);
	var usable_range = find_usable_range(network_addr, host_num);
	console.log(ip);
	console.log(subnet);
	console.log(network_addr);
	console.log(host_num);
	console.log(usable_host);
	console.log(wildcard);
	console.log(broadcast);
	console.log(usable_range);
	console.log(private_ip(network_addr));
});