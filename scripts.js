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
	if (host_num >=2) {
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

function ip_class(subnet) {
	if (subnet < 8) {
		return '-';
	} else if (subnet < 16) {
		return 'A';
	} else if (subnet < 24) {
		return 'B'
	} else {
		return 'C';
	}
}

function find_start_ip(network_addr, ipclass , char) {
	var network_list = network_addr.split('.');
	if (ipclass === 'C') {
		return network_list[0] + "." + network_list[1] + "." + network_list[2] + "." + char;
	} else if (ipclass === 'B') {
		return network_list[0] + "." + network_list[1] + "." + char + "." + char;
	} else if (ipclass === 'A') {
		return network_list[0] + "." + char + "." + char + "." + char;
	} else {
		if (char === '*') {
			return "";
		} else {
			return char + "." + char + "." + char + "." + char;
		}
	}
}


for (var i = 1; i <= 32; i++) {
	$('select#subnet').append("<option value="+i+">"+ bi_to_deci(make_bi_maskip(i)) +'/'+i+"</option>");
}

$('form').submit(function(e) {
	e.preventDefault();
	var ip = $('input#Inputip').val();
	var subnet = $('select#subnet').val();
	var network_addr = find_network_ip(ip, subnet);
	var host_num = find_host_num(subnet);
	var usable_range = find_usable_range(network_addr, host_num);
	var broadcast = plus_ip(network_addr, host_num-1);
	var usable_host = find_usable_host(host_num);
	var bin_subnet = make_bi_maskip(subnet);
	var subnet_mask = bi_to_deci(bin_subnet);
	var wildcard = find_wildcard(subnet);
	var ipclass = ip_class(subnet);
	var cidr = '/'+subnet;
	var ip_type = private_ip(network_addr);
	var short = ip + cidr;
	var bin_id = bi_ip(ip).split('.').join('');
	var int_id = parseInt(bin_id, 2);
	var hex_id = int_id.toString(16);
	$('h2#res').empty();
	$('h2#res').append("Result");
	var head_li = ['IP Address', 'Network Address', 'Usable Host IP Range', 'Broadcast Address', 'Total Number of Hosts', 'Number of Usable Hosts', 'Subnet Mask', 'Wildcard Mask', 'Binary Subnet Mask', 'IP Class', 'CIDR Notation', 'IP Type', 'Short', 'Binary ID', 'Integer ID', 'Hex ID'];
	var res_li = [ip, network_addr, usable_range, broadcast, host_num, usable_host, subnet_mask, wildcard, bin_subnet, ipclass, cidr, ip_type, short, bin_id, int_id, hex_id];
	$('tbody#res1').empty();
	for (var i = 0; i < res_li.length; i++) {
		$('tbody#res1').append("<tr><td>" + head_li[i] + ":</td><td>"+ res_li[i] +"</td></tr>");
	}

	$('thead#res2').empty();
	$('tbody#res2').empty();
	$('h4#res2').empty();

	if (subnet%8 !== 0) {
		var star_ip = find_start_ip(network_addr, ipclass, '*');
		var start_ip = find_start_ip(network_addr, ipclass, '0');
		var end_broadcast_ip = find_start_ip(network_addr, ipclass, '255');
		$('h4#res2').append("All Possible /" + subnet + " Networks" + star_ip);
		$('thead#res2').append("<tr><td>Network Address</td><td>Usable Host Range</td><td>Broadcast Address</td></tr>");
		while (true) {
			var broadcast_ip = plus_ip(start_ip, host_num-1);
			var sta_use_range = plus_ip(start_ip, 1);
			var end_use_range = plus_ip(start_ip, host_num-2);
			$('tbody#res2').append("<tr><td>" + start_ip + "</td><td>" + sta_use_range + "-" + end_use_range + "</td><td>" + broadcast_ip + "</td></tr>");
			if (broadcast_ip === end_broadcast_ip) {
				break;
			}
			start_ip = plus_ip(start_ip, host_num);
		}
	}
});