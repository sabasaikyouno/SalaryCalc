'use strict'

var start = new Date(moment().subtract(1, 'M').format("YYYY")+"-12-11");
var end = new Date(moment().format("YYYY")+"-12-11");
var swiper_wrapper_id = document.getElementById('swiper-wrapper_id');
const socket = io();

// swiper-wrapperを現在から前後30年分用意
for(let x = 0; x < 61; x++){
  swiper_wrapper_id.innerHTML += '<div class="swiper-slide"><div id="lists'+x+'"></div></div>';
}
//swiper初期化
const swiper = new Swiper('.swiper-container', {
  initialSlide: 30,
  autoHeight: true
});

//emit
function update_display(act,abso){
  let start = new Date(moment().subtract(1,'M').add(abso,'y').format("YYYY")+"-12-11");
  let end = new Date(moment().add(abso,'y').format("YYYY")+"-12-11");
  socket.emit('get_all', moment(start).format("YYYY-MM-DD"));
}

//表示
socket.on('client_all', (data) => {
  let act = swiper.activeIndex;
  let abso = act - 30;
  let start = new Date(moment().subtract(1,'M').add(abso,'y').format("YYYY")+"-12-11");
  let end = new Date(moment().add(abso,'y').format("YYYY")+"-12-11");
  let salary_lists = data[0];
  let working_lists = data[1];
  //有給残日数の表示
  let paid_holiday = data[2];
  document.getElementById('paidholiday').innerHTML = "";
  document.getElementById('paidholiday').innerHTML = "残日数"+paid_holiday;
  let lists = document.getElementById('lists'+act);
  lists.innerHTML = "";
  lists.innerHTML = '<div id="year">'+moment(end).format("YYYY")+'年</div>'
  for(let x = 0; x < 12; x++){
    lists.innerHTML += '<div id="list"><h4>'+moment(start).add(x,'M').format("MM/DD")+'～'+moment(end).add(x+1,'M').subtract(1,'d').format("MM/DD")+'</h4>'+
                       '<div id="mon_salary"><h5>￥'+salary_lists[x].toLocaleString()+'</h5></div><div id="total_working"><h5>労働'+working_lists[x]+'</h5></div>'+
                       '<div id="listbutton"><input type="button" id="'+moment(start).format("YYYY-MM-DD")+'" value="'+moment(start).add(x+1,'M').format("M")+'月" onclick="page_move(this,'+x+')"></div>'+
                       '</div>';
  }
});

//ボタンを押したとき押した日付のページに移動
function page_move(ele,swip){
  var date = ele.id;
  location.href = 'https://fierce-tundra-76379.herokuapp.com/?data='+date+'&swip='+swip;
}

//スワイプしたときの処理
swiper.on('slideChange',function(swiper){
  if(this.activeIndex > this.previousIndex){//右から左にスワイプした時
    update_display(this.activeIndex,this.activeIndex - 30);
  } else {
    update_display(this.activeIndex, this.activeIndex - 30);
  }
});


//safariで戻るボタンを押したときにキャッシュを読みに行くのをキャンセルしてリロード
window.onpageshow = function(event){
  if(event.persisted){
    window.location.reload();
  }
}

//ページにアクセスがあった時
window.onload = function(){
  update_display(swiper.activeIndex,swiper.activeIndex - 30);
}
