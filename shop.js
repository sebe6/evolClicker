function buyItem(key) {
  const costNextItems = getCostNextItem(key)
  if(costNextItems[1] > 0){
    if (rocks >= costNextItems[0]) {
      shop[key]['amount'] += costNextItems[1];
      rocks -= costNextItems[0];
      refreshHTMLElement();
    }
  }
}

function getCostNextItem(key){
  let res = 0;
  let i = 0;
  if(shopMultiplier == 'max'){
    for(i = 0; res < rocks; i++){
      let nextPrice = Math.floor(shop[key]['baseCost'] * Math.pow(shop[key]['costMultiplier'], shop[key]['amount'] + i));
      if(res + nextPrice >= rocks){
        if(i == 0) return [nextPrice,i];
        else return [res, i];
      }
      res += nextPrice;
    }
  }else{
    for(i = 0; i < shopMultiplier; i++){
      res += Math.floor(shop[key]['baseCost'] * Math.pow(shop[key]['costMultiplier'], shop[key]['amount'] + i));
    }
  }
  return [res,i]
}

function changeShopMultiplier(value){
  let selectedMultiplier = document.querySelector('#shop-multiple-items-' + value);
  if(selectedMultiplier){
    document.querySelector('#shop-multiple-items .checked').classList.remove('checked');

    selectedMultiplier.classList.add('checked');
    shopMultiplier = value;
  }
  refreshHTMLElement();
}
