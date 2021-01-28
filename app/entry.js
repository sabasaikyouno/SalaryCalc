'use strict'
import $ from 'jquery';
const block = $('#block');

import io from 'socket.io-client'
const socket = io('https://fierce-tundra-76379.herokuapp.com/');

import moment from 'moment';

var swiper_wrapper_id = document.getElementById('swiper-wrapper_id');

for(let x = 0; x < 12; x++){
  swiper_wrapper_id.innerHTML += '<div class="swiper-slide"><div id="time'+x+'"></div></div>';
}

//7時間30分働いたとき
var button_7_5 = function button_7_5(ele){
  var date = ele.id;
  socket.emit('button_7_5', date);
}

//15分働いたとき
var button_0_15 = function button_0_15(ele){
  var date = ele.id;
  socket.emit('button_0_15', date);
}

//30分働いたとき
var button_0_5 = function button_0_5(ele){
  var date = ele.id;
  socket.emit('button_0_5', date);
}

//1時間働いたとき
var button_1 = function button_1(ele){
  var date = ele.id;
  socket.emit('button_1', date);
}

//-15分の時
var button_sub_15 = function button_sub_15(ele){
  var date = ele.id;
  socket.emit('button_sub_15', date);
}

//有給の場合
var button_paid = function button_paid(ele){
  var date = ele.id;
  socket.emit('button_paid', date);
}

//削除時
function button_dele(ele){
  var date = ele.id;
  socket.emit('button_dele', date);
}

const swiper = new Swiper('.swiper-container',{
  autoHeight: true
});

//スワイプした時の処理
swiper.on('slideChange',function(swiper){
  let acti = this.activeIndex;
  let pre = this.previousIndex;
  if(acti > pre){//右から左にスワイプした時来月の一覧を表示
    all_update();
  } else {//左から右にスワイプしたとき先月の一覧を表示
    all_update();
  }
});

//月給と月の労働時間　毎日 emit
function all_update(){
  total_salary_dis();
  total_working_dis();
  let abso = swiper.activeIndex
  //URLパラメーターでどこを押したか取得している
  let start = moment(new URL(document.location).searchParams.get('data')).add(abso,'M').format("YYYY-MM-DD");
  socket.emit('get_all_month', start);
}

//表示
socket.on('client_all_month',(data) => {
  let act = swiper.activeIndex;
  let start = moment(new URL(document.location).searchParams.get('data')).add(act,'M').format("YYYY-MM-DD");
  let end = moment(new URL(document.location).searchParams.get('data')).add(act+1,'M').format("YYYY-MM-DD");
  let diff = moment(end).diff(start,'day');
  let salary_lists = data[0];
  let working_lists = data[1];
  //有給表示
  let paid_holiday = data[2];
  document.getElementById('paidholiday').innerHTML = "";
  document.getElementById('paidholiday').innerHTML = "残日数"+paid_holiday;
  let time = document.getElementById('time'+act);
  time.innerHTML = "";
  
  for(let x = 0; x < diff; x++){
    time.innerHTML += '<div id="display"><p>'+moment(start).add(x,'d').format("YYYY-MM-DD")+'</p>'+
                      '<p id="'+moment(start).add(x,'d').format("YYYY-MM-DD")+'_working"><p>労働時間 '+working_lists[x]+'</p></p>'+
                      '<p id="'+moment(start).add(x,'d').format("YYYY-MM-DD")+'_salary"><p>￥'+salary_lists[x].toLocaleString()+'</p></p></div>'+
                      '<input type="button" id="'+moment(start).add(x,'d').format("YYYY-MM-DD")+'" value="7.5" onclick="button_7_5(this)">'+
                      '<input type="button" id="'+moment(start).add(x,'d').format("YYYY-MM-DD")+'" value="15" onclick="button_0_15(this)">'+
                      '<input type="button" id="'+moment(start).add(x,'d').format("YYYY-MM-DD")+'" value="30" onclick="button_0_5(this)">'+
                      '<input type="button" id="'+moment(start).add(x,'d').format("YYYY-MM-DD")+'" value="1" onclick="button_1(this)">'+
                      '<input type="button" id="'+moment(start).add(x,'d').format("YYYY-MM-DD")+'" value="-15" onclick="button_sub_15(this)">'+
                      '<input class="paidbutton" type="button" id="'+moment(start).add(x,'d').format("YYYY-MM-DD")+'" value="有" onclick="button_paid(this)">'+
                      '<input class="button_dele" type="button" id="'+moment(start).add(x,'d').format("YYYY-MM-DD")+'" value="削除" onclick="button_dele(this)">';
  }
  //スワイパーの高さを合わせる
  swiper.updateAutoHeight(1);
});

//ボタンが押されたときに on (絶対に必要、消すとsafariでばぐる)
socket.on('client_button_dis',(data) => {
  all_update();
});

//月給の取得、表示
function total_salary_dis(){
  let act = swiper.activeIndex;
  let start = moment(new URL(document.location).searchParams.get('data')).add(act,'M').format("YYYY-MM-DD");
  socket.emit('one_months_salary', [start, null]);
}

//合計労働時間の取得、表示
function total_working_dis(){
  let act = swiper.activeIndex;
  let start = moment(new URL(document.location).searchParams.get('data')).add(act,'M').format("YYYY-MM-DD");
  socket.emit('get_total_working', [start, null]);
}

//月の労働時間の表示
socket.on('total_working_time', (data) => {
  document.getElementById('allwork').innerHTML = "労働 "+data;
});

//月給の表示
socket.on('get_monthly_salary', (salary) => {
  document.getElementById('allsala').innerHTML = "￥"+salary.toLocaleString();
});

//アクセスがあったとき
window.onload = function(){
  swiper.slideTo(new URL(document.location).searchParams.get('swip'));
  all_update();
}

//safariで戻るボタンを押したときにキャッシュを読みに行くのをキャンセルしてリロード
window.onpageshow = function(event){
  if(event.persisted){
    window.location.reload();
  }
}

window.button_7_5 = button_7_5;
window.button_0_15 = button_0_15;
window.button_0_5 = button_0_5;
window.button_1 = button_1;
window.button_sub_15 = button_sub_15;
window.button_paid = button_paid;
window.button_dele = button_dele;
