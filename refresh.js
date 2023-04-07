function loadHTMLElement() {
	document.getElementById('rocks').innerHTML = formatNumber(rocks);
	document.getElementById('click-count').innerHTML = clickCount > 0 ? formatNumber(clickCount) : 0;
	document.getElementById('click-value').innerHTML = formatNumber(clickValue());

	const tabShopContentHtml = document.querySelector('#tab-shop-content');
	tabShopContentHtml.innerHTML = '';
	for (const [key, value] of Object.entries(shop)) {	  
		const shopItemHtml = createShopItemHtml(key);
		
		tabShopContentHtml.appendChild(shopItemHtml);
	}

	const tabUpgradesHtml = document.querySelector('#tab-upgrade-content');
	tabUpgradesHtml.innerHTML = '';
	for (const [key, value] of Object.entries(upgrades)) {
		let ownedAmount 
		ownedAmount = shop[key]['amount']
		for (let i = 0; i <= value['require'].length-1; i++) {
			const upgradeItemHtml = createUpgradeItemHtml(key, i);
	
			tabUpgradesHtml.appendChild(upgradeItemHtml);
		}
	}
}

function refreshHTMLElement() {
  document.getElementById('rocks').innerHTML = formatNumber(rocks);
  document.getElementById('click-count').innerHTML = clickCount > 0 ? formatNumber(clickCount) : 0;
  document.getElementById('click-value').innerHTML = formatNumber(clickValue());

  for (const [key, value] of Object.entries(shop)) {	  
	updateShopItemHtml(key)
  }

  for (const [key, value] of Object.entries(upgrades)) {
	for (let i = 0; i <= value['require'].length-1; i++) {
			updateUpgradeItemHtml(key, i);
	}
  }
}

function createShopItemHtml(key){
	const value = shop[key];
	const costNextItem = getCostNextItem(key);

	const shopItemHtml = document.createElement('div');
	shopItemHtml.classList.add('shopItem', 'prevent-select', 'hidden');
	if(costNextItem > rocks)
		shopItemHtml.classList.add('not-buyable');
	if(shop[key]['amount'] == 0)
		shopItemHtml.classList.remove('hidden')
	
	shopItemHtml.setAttribute('id', 'shop_' + key);
	shopItemHtml.addEventListener('click', () => {buyItem(key)});

	const imageHtml = document.createElement('img');
	imageHtml.classList.add('itemImage');
	imageHtml.src = 'images/'+value['image'];

	const shopItemTextHtml = document.createElement('div');
	shopItemTextHtml.classList.add('shopItemText');
	const nameHtml = document.createElement('p');
	nameHtml.classList.add('name');
	nameHtml.innerHTML = value['name'+language];
	
	const shopItemValuesHtml = document.createElement('div');
	shopItemValuesHtml.classList.add('shopItemValue');
	const amountHtml = document.createElement('p');
	amountHtml.classList.add('amount');
	amountHtml.innerHTML = 'Owned : ' + (value['amount'] || 0);
	const prodHtml = document.createElement('p');
	prodHtml.classList.add('prod');
	prodHtml.innerHTML = formatNumber((value['production'] * getTotalMultiplier(key) * getTotalSpecial(key)) * value['amount']) + '/s';
	prodHtml.innerHTML += ' (' + formatNumber((value['production']) * getTotalMultiplier(key) * getTotalSpecial(key)) + '/s/u)';
	const costHtml = document.createElement('p');
	costHtml.classList.add('cost', 'stone-icon-after');
	costHtml.innerHTML = formatNumber(costNextItem);
	
	shopItemTextHtml.appendChild(nameHtml);
	shopItemValuesHtml.appendChild(amountHtml);
	shopItemValuesHtml.appendChild(prodHtml);
	shopItemValuesHtml.appendChild(costHtml);
	
	shopItemHtml.appendChild(imageHtml);
	shopItemTextHtml.appendChild(shopItemValuesHtml);
	shopItemHtml.appendChild(shopItemTextHtml);
	return shopItemHtml;
}

function updateShopItemHtml(key){
	const value = shop[key];
	const costNextItem = getCostNextItem(key);
	let shopItemHtml = document.querySelector('#shop_' + key);
	
	if(costNextItem > rocks)
		shopItemHtml.classList.add('not-buyable');
	else
		shopItemHtml.classList.remove('not-buyable');
	
	if(shop[key]['amount'] == 0)
		shopItemHtml.classList.remove('hidden')
	
	let shopItemValueHtml = shopItemHtml.querySelector('.shopItemValue')
	shopItemValueHtml.querySelector('.amount').innerHTML = 'Owned : ' + (value['amount'] || 0);
	var prodHtml = formatNumber((value['production'] * getTotalMultiplier(key) * getTotalSpecial(key)) * value['amount']) + '/s';
	prodHtml += ' (' + formatNumber((value['production']) * getTotalMultiplier(key) * getTotalSpecial(key)) + '/s/u)';
	shopItemValueHtml.querySelector('.prod').innerHTML = prodHtml;
	shopItemValueHtml.querySelector('.cost').innerHTML = formatNumber(costNextItem);
}

function createUpgradeItemHtml(key, index){
	const value = upgrades[key];

	const upgradesItemHtml = document.createElement('div');
	upgradesItemHtml.classList.add('upgradeItem', 'prevent-select', 'hidden');
	if(value['cost'][index] > rocks)
		upgradesItemHtml.classList.add('not-buyable');
	upgradesItemHtml.setAttribute('id', 'upgrade_' + key + '_' + index);
	upgradesItemHtml.addEventListener('click', () => {buyUpgrade(key, index)});

	const imageHtml = document.createElement('img');
	imageHtml.classList.add('upgradeImage');
	imageHtml.src = 'images/'+value['image'][index];

	const upgradesItemTextHtml = document.createElement('div');
	upgradesItemTextHtml.classList.add('upgradeItemText');
	const nameHtml = document.createElement('p');
	nameHtml.classList.add('name');
	nameHtml.innerHTML = value['name'+language][index];

	const upgradesItemValuesHtml = document.createElement('div');
	upgradesItemValuesHtml.classList.add('upgradeItemValue');
	const bonusHtml = document.createElement('p');
	bonusHtml.classList.add('bonus');
	bonusHtml.innerHTML = 'prod x' + value['multiplier'][index];
	const costHtml = document.createElement('p');
	costHtml.classList.add('cost', 'stone-icon-after');
	costHtml.innerHTML = formatNumber(value['cost'][index]);
	
	upgradesItemTextHtml.appendChild(nameHtml);
	upgradesItemValuesHtml.appendChild(bonusHtml);
	upgradesItemValuesHtml.appendChild(costHtml);
	
	upgradesItemHtml.appendChild(imageHtml);
	upgradesItemTextHtml.appendChild(upgradesItemValuesHtml);
	upgradesItemHtml.appendChild(upgradesItemTextHtml);
	return upgradesItemHtml;
}

function updateUpgradeItemHtml(key, index){
	const value = upgrades[key];
	const upgradesItemHtml = document.querySelector('#upgrade_' + key + '_' + index);
	if(value['enabled'][index]){
		upgradesItemHtml.classList.add('not-buyable', 'hidden')
	}else if(shop[key]['amount'] >= value['require'][index]){
		if(value['cost'][index] > rocks)
			upgradesItemHtml.classList.add('not-buyable');
			else
			upgradesItemHtml.classList.remove('not-buyable');	
		upgradesItemHtml.classList.remove('hidden');
	}else{
		upgradesItemHtml.classList.add('not-buyable');
		upgradesItemHtml.classList.remove('hidden');
	}
}