const nFormat = [1e3,1e6,1e9,1e12,1e15,1e18,1e21,1e24,1e27,1e30,1e33];
const nLetter = ['K', 'M', 'B', 'T', 'q', 'Q', 's', 'S', 'O', 'N', 'D'];

let mouse = [false, false, false, false, false];
let RC = [false, false, false, false];
let Mi = [false, false, false, false];
let Hunt = [false, false, false, false];
let Hu = [false, false, false, false];
let Camp = [false, false, false, false];
let Ws = [false, false, false, false];
let Ca = [false, false, false, false];
let Do = [false, false, false, false];
let All = [false, false, false, false];

function analytic(){
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-77918956-1', 'auto');
	ga('send', 'pageview');
}

function clickEarning() {
  clickCount = +(clickCount + 1).toFixed(1);
  let click = clickValue();
  rocks += click;
  refreshHTMLElement();
}

function clickValue() {
  let click = 1;
  for (let i = 0; i < mouse.length; i++) {
    if (mouse[i]) {
      click += +(totalProd() / 100).toFixed(1);
    }
  }
  return click;
}

function productionEarning(number, displayTotalProd = false) {
  if(number == 0) return;
  rocks = +(rocks + number).toFixed(1);
  if(displayTotalProd){
    document.querySelector('#total-prod span').innerHTML = formatNumber(number);
  }
  refreshHTMLElement();
}

function totalProd(){
	var prod = 0;
  for (const [key, value] of Object.entries(shop)) {
    prod += value['production'] * value['amount'] * getTotalMultiplier(key);
  }
  return prod;
}

function toggle_visibility(id) {
	var e = document.getElementById('tab-shop');
	var f = document.getElementById('tab-upgrade');
  if(id == 'tabShop'){
		e.style.display = 'block';
		f.style.display = 'none';
	}
	if(id == 'tabUpgrade'){
		e.style.display = 'none';
		f.style.display = 'block';
	}
}

function formatNumber(number) {
  if(number < 10000) return Math.round(number*10)/10;
  let index = Math.floor(Math.log10(number) / 3);
  let formatedNumber = parseFloat(number/nFormat[index-1]).toPrecision(4);
  return formatedNumber + nLetter[index-1];
}

function allLowest(){
  var lowest = 0;
  for (const [key, value] of Object.entries(shop)) {
    if(lowest > value['amount']) lowest = value['amount'];
  }
  return lowest;
}

window.setInterval(function(){
	
	productionEarning(totalProd(), 1);
	
}, 1000);

window.setInterval(function(){
	
	save();
	
}, 60e3);

refreshHTMLElement();