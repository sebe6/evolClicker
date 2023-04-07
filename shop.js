function buyItem(item) {
  const cost = Math.floor(shop[item]['baseCost'] * Math.pow(shop[item]['costMultiplier'], shop[item]['amount']));
  if (rocks >= cost) {
    shop[item]['amount']+=1;
    rocks -= cost;
    refreshHTMLElement();
  }
}

function getCostNextItem(key){
	return Math.floor(shop[key]['baseCost'] * Math.pow(shop[key]['costMultiplier'], shop[key]['amount']))
}