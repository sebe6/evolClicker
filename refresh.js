function refreshHTMLElement() {
  document.getElementById('rocks').innerHTML = formatNumber(rocks);
  document.getElementById('click-count').innerHTML = clickCount > 0 ? formatNumber(clickCount) : 0;
  document.getElementById('click-value').innerHTML = formatNumber(clickValue());

  const tabShopContentHtml = document.querySelector('#tab-shop-content');
  tabShopContentHtml.innerHTML = '';
  for (const [key, value] of Object.entries(shop)) {	  
	  //build shop div
	  const shopItemHtml = createShopItemHtml(key);
	  
	  tabShopContentHtml.appendChild(shopItemHtml);
	  if(shop[key]['amount'] == 0){
		break;
	  }
  }

  const tabUpgradesHtml = document.querySelector('#tab-upgrade-content');
  tabUpgradesHtml.innerHTML = '';
  for (const [key, value] of Object.entries(upgrades)) {
	let ownedAmount 
	ownedAmount = shop[key]['amount']
	for (let i = 0; i <= value['require'].length-1; i++) {
		if(value['enabled'][i]) continue;
		if(shop[key]['amount'] >= value['require'][i]){
			const upgradeItemHtml = createUpgradeItemHtml(key, i);
	
			tabUpgradesHtml.appendChild(upgradeItemHtml);
		}
	}
  }
}

function createShopItemHtml(key){
	const value = shop[key];
	const costNextItem = getCostNextItem(key);

	const shopItemHtml = document.createElement('div');
	if(costNextItem > rocks)
		shopItemHtml.classList.add('shopItem', 'prevent-select', 'not-buyable');
	else
		shopItemHtml.classList.add('shopItem', 'prevent-select');
	shopItemHtml.setAttribute('id', key);
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
	costHtml.classList.add('cost');
	costHtml.innerHTML = formatNumber(costNextItem);
	const rocksIconHtml = document.createElement('img');
	rocksIconHtml.src = 'images/stoneIcon.png'
	
	shopItemTextHtml.appendChild(nameHtml);
	shopItemValuesHtml.appendChild(amountHtml);
	shopItemValuesHtml.appendChild(prodHtml);
	costHtml.appendChild(rocksIconHtml);
	shopItemValuesHtml.appendChild(costHtml);
	
	shopItemHtml.appendChild(imageHtml);
	shopItemTextHtml.appendChild(shopItemValuesHtml);
	shopItemHtml.appendChild(shopItemTextHtml);
	return shopItemHtml;
}

function createUpgradeItemHtml(key, index){
	const value = upgrades[key];

	const upgradesItemHtml = document.createElement('div');
	if(value['cost'][index] > rocks)
		upgradesItemHtml.classList.add('upgradeItem', 'prevent-select', 'not-buyable');
	else
		upgradesItemHtml.classList.add('upgradeItem', 'prevent-select');
	upgradesItemHtml.setAttribute('id', key + '_' + index);
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
	costHtml.classList.add('cost');
	costHtml.innerHTML = formatNumber(value['cost'][index]);
	const rocksIconHtml = document.createElement('img');
	rocksIconHtml.src = 'images/stoneIcon.png'
	
	upgradesItemTextHtml.appendChild(nameHtml);
	upgradesItemValuesHtml.appendChild(bonusHtml);
	costHtml.appendChild(rocksIconHtml);
	upgradesItemValuesHtml.appendChild(costHtml);
	
	upgradesItemHtml.appendChild(imageHtml);
	upgradesItemTextHtml.appendChild(upgradesItemValuesHtml);
	upgradesItemHtml.appendChild(upgradesItemTextHtml);
	return upgradesItemHtml;
}