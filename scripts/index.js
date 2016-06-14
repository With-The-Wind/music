$(function(){
  var pcc;
  var xxx;
  var audio = $('audio').get(0);
  var flag=true;
  var flag1=true;
  var detabase;
  //渲染数据
  var render = function(){
    $.each(detabase,function(k,v){
      $('<li>')
      .html('<strong class="music_name"title="'+v.title+'">'+v.title+'</strong><strong class="singer_name" title="'+v.artist+'">'+v.artist+'</strong><strong class="play_time">'+v.duration+'</strong><div class="list_cp"><strong class="btn_like" title="喜欢" name="myfav_000P8peU0HhORi" mid="000P8peU0HhORi"><span>我喜欢</span></strong><strong class="btn_share" title="分享"><span>分享</span></strong><strong class="btn_fav" title="收藏到歌单"><span>收藏</span></strong><strong class="btn_del" title="从列表中删除"><span>删除</span></strong></div>')
      .appendTo('#cc');
    })
  }
  //渲染数据
  //请求数据
  $.getJSON('/database.json').done(function(data){
    detabase = data;
    render()
    $('#cc li:first').addClass('play_current');
    $('#music_name').html(detabase[0].album);
    $('#singer_name').html(detabase[0].artist);
    $('#ptime').html(detabase[0].duration);
    $('#musicop').css('display','block');
    $("#spansongnum1 span").html(detabase.length);
    $('#divplayframe').css('opacity',1);
  });
  //请求数据
  //控制播放
  var onchange=function(x){
    $('#cc li').removeClass('play_current');
    $('#cc li:eq('+x+')').addClass('play_current');
    audio.play();
    $('#music_name').html(detabase[x].album);
    $('#singer_name').html(detabase[x].artist);
    $('#ptime').html(detabase[x].duration);
  }
  $('#cc').on('click','li',function(){
    var m = $(this).index();
    audio.src=detabase[$(this).index()].filename;
    onchange(m);
  })
  $('.next_bt').on('click',function(){
    var m;
    if($('#btnPlayway').hasClass('unordered_bt')){
      m = Math.floor(Math.random()*detabase.length);
    }else{
      m = $('.play_current').index()+1;
    }
    if(m===detabase.length){
      m=0;
    }
    audio.src=detabase[m].filename;
    onchange(m);
  })
  $('.prev_bt').on('click',function(){
    var m;
    if($('#btnPlayway').hasClass('unordered_bt')){
      m = Math.floor(Math.random()*detabase.length);
    }else{
      m = $('.play_current').index()-1;
    }
    if(m<0){
      m=detabase.length-1;
    }
    audio.src=detabase[m].filename;
    onchange(m);
  })
  //控制播放
  //当前播放完毕之后
  $(audio).on('ended',function(){
    if($('#btnPlayway').hasClass('unordered_bt')){
      m = Math.floor(Math.random()*detabase.length);
    }else if($('#btnPlayway').hasClass('ordered_bt')){
      m = $('.play_current').index()+1;
      if(m===detabase.length){
        audio.pause();
        return;
      }
    }else if($('#btnPlayway').hasClass('cycle_single_bt')){
      m = $('.play_current').index();
    }else if($('#btnPlayway').hasClass('cycle_bt')){
      m = $('.play_current').index()+1;
    }
    if(m===detabase.length){
      m=0;
    }
    audio.src=detabase[m].filename;
    onchange(m);
  })
  //当前播放完毕之后
  //播放顺序
  $('#btnPlayway').on('click',function(){
    $('.playbar_cp_select').css('display','block');
    $('.playbar_cp_select').on('click','strong',function(){
      if($(this).hasClass('unordered_bt')){
        $('#btnPlayway').removeClass().addClass('unordered_bt')
      }else if($(this).hasClass('ordered_bt')){
        $('#btnPlayway').removeClass().addClass('ordered_bt')
      }else if($(this).hasClass('cycle_single_bt')){
        $('#btnPlayway').removeClass().addClass('cycle_single_bt')
      }else if($(this).hasClass('cycle_bt')){
        $('#btnPlayway').removeClass().addClass('cycle_bt')
      }
      $('.playbar_cp_select').css('display','none');
    })
  })
  //播放顺序
  //开始播放
  $('#btnplay').on('click',function(){
    if(audio.paused){
      audio.play();
    }else{
      audio.pause();
    }
  })
  $(audio).on('play',function(){
      $('#btnplay').removeClass('play_bt').addClass('pause_bt');
  })
  $(audio).on('pause',function(){
    $('#btnplay').removeClass('pause_bt').addClass('play_bt');
  })
  //播放
  //音量控制
  $('#divsong_gai').on('click',function(e){
    pcc = audio.volume =  e.offsetX/this.offsetWidth;
  })
  $(audio).on('volumechange',function(e){
    var pc = audio.volume.toFixed(2)* 100 + '%';
    $('.volume_op').css("left",pc);
    $('.volume_bar').css("width",pc);
  })
  $('#spanmute').on('click',function(){
    if(audio.volume!==0){
      audio.volume=0;
      $('#spanmute').removeClass('volume_icon').addClass('volume_mute');
    }else{
      console.log(1);
      audio.volume = pcc;
      $('#spanmute').removeClass('volume_mute').addClass('volume_icon');
    }
  })
  $('#divsong_gai').on('mousedown',function(){
    $('#divsong_gai').on('mousemove',function(e){
      pcc = audio.volume =  e.offsetX/this.offsetWidth;
    })
  })
  $('#divsong_gai').on('mouseup',function(){
    $('#divsong_gai').off('mousemove');
  })
  //音量控制
  //进度控制
  $('#divplay_gai').on('click',function(e){
    var mm = (e.offsetX/this.offsetWidth)*audio.duration;
    audio.currentTime = mm;
  })
  $(audio).on('timeupdate',function(){
    var xx = audio.currentTime/audio.duration.toFixed(2)*100 + '%';
    $('.progress_op').css('left',xx);
    $('#spanplaybar').css('width',xx);
  })
  $('#divplay_gai').on('mousedown',function(){
    $('#divplay_gai').on('mousemove',function(e){
      var mm = (e.offsetX/this.offsetWidth)*audio.duration;
      audio.currentTime = mm;
    })
  })
  $('#divplay_gai').on('mouseup',function(){
    $('#divplay_gai').off('mousemove');
  })
  //进度控制
  //收起列表
  $('#spansongnum1').on('click',function(){
      if(flag){
        flag=false;
        $('#divplayframe').animate({opacity:0},200,function(){
          $('#divplayframe').css('display','none');
        })
      }else{
        flag=true;
        $('#divplayframe').css('display','block')
        .animate({opacity:1},200)
      }
  })
  $('#btnclose').on('click',function(){
    flag=false;
    $('#divplayframe').animate({opacity:0},200,function(){
      $('#divplayframe').css('display','none');
    })
  })
  //收起列表
  //收起全部
  $('#btnfold').on('click',function(){
      if(flag1){
        flag=false;
        flag1=false;
        $('#divplayframe').css('display','none')
        $('#divplayer').addClass('m_player_folded').animate({left:"-=540"},200);
      }else{
        flag1=true;
        $('#divplayer').removeClass('m_player_folded').animate({left:'+=540'},200);
      }
  })
  //收起全部
  //列表信息
  $('#cc').on('mouseenter','li',function(){
    $(this).addClass('play_hover');
    $(this).children().last().css('display','block');
  })
  $('#cc').on('mouseleave','li',function(){
    $(this).removeClass('play_hover');
    $(this).children().last().css('display','none');
  })
  //列表信息
  //删除信息
  $('ul').on('click','.btn_del',function(){
    console.log(1)
    detabase = $.grep(detabase,function(v,k){
      return k!==$('.play_hover').index();
    })
    $(this).closest('li').remove();
    $('#spansongnum1 span').html(detabase.length)
    return false;
  })
  //删除信息
})
