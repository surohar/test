
$(document).ready(function(){
    
    var countOption = $('.old-select option').size();
    
    function openSelect(){
        var heightSelect = $('.new-select').height();
        var j=1;
        $('.new-select .new-option').each(function(){
            $(this).addClass('reveal');
            $(this).css({
                'box-shadow':'0 1px 1px rgba(0,0,0,0.1)',
                'left':'0',
                'right':'0',
                'top': j*(heightSelect+1)+'px'
            });
            j++;
        });
    }
    
    function closeSelect(){
        var i=0;
        $('.new-select .new-option').each(function(){
            $(this).removeClass('reveal');
            if(i<countOption-3){
                $(this).css('top',0);
                $(this).css('box-shadow','none');
            }
            else if(i===countOption-3){
                $(this).css('top','3px');
            }
            else if(i===countOption-2){
                $(this).css({
                    'top':'7px',
                    'left':'2px',
                    'right':'2px'
                });
            }
            else if(i===countOption-1){
                $(this).css({
                    'top':'11px',
                    'left':'4px',
                    'right':'4px'
                });
            }
            i++;
        });
    }
    
    // Initialisation
    if($('.old-select option[selected]').size() === 1){
        $('.selection p span').html($('.old-select option[selected]').html());
    }
    else{
        $('.selection p span').html($('.old-select option:first-child').html());
    }
    
    $('.old-select option').each(function(){
        newValue = $(this).val();
        newHTML = $(this).html();
        $('.new-select').append('<div class="new-option" data-value="'+newValue+'"><p>'+newHTML+'</p></div>');
    });
    
    var reverseIndex = countOption;
    $('.new-select .new-option').each(function(){
        $(this).css('z-index',reverseIndex);
        reverseIndex = reverseIndex-1;        
    });
    
    closeSelect();
    
    
    // Ouverture / Fermeture
    $('.selection').click(function(){
        $(this).toggleClass('open');
        if($(this).hasClass('open')===true){openSelect();}
        else{closeSelect();}
    });
    
    
    // Selection 
    $('.new-option').click(function(){
        var newValue = $(this).data('value');
        
        // Selection New Select
        $('.selection p span').html($(this).find('p').html());
        $('.selection').click();
        
        // Selection Old Select
        $('.old-select option[selected]').removeAttr('selected');
        $('.old-select option[value="'+newValue+'"]').attr('selected','');
        
        // Visuellement l'option dans le old-select ne change pas
        // mais la value selectionnée est bien pris en compte lors 
        // de l'envoi du formulaire. Test à l'appui.
        
    });
  });
  
  
  
  
  $('.select').each(function() {
      const _this = $(this),
          selectOption = _this.find('option'),
          selectOptionLength = selectOption.length,
          selectedOption = selectOption.filter(':selected'),
          duration = 450; // длительность анимации 
  
      _this.hide();
      _this.wrap('<div class="select"></div>');
      $('<div>', {
          class: 'new-select',
          text: _this.children('option:disabled').text()
      }).insertAfter(_this);
  
      const selectHead = _this.next('.new-select');
      $('<div>', {
          class: 'new-select__list'
      }).insertAfter(selectHead);
  
      const selectList = selectHead.next('.new-select__list');
      for (let i = 1; i < selectOptionLength; i++) {
          $('<div>', {
              class: 'new-select__item',
              html: $('<span>', {
                  text: selectOption.eq(i).text()
              })
          })
          .attr('data-value', selectOption.eq(i).val())
          .appendTo(selectList);
      }
  
      const selectItem = selectList.find('.new-select__item');
      selectList.slideUp(0);
      selectHead.on('click', function() {
          if ( !$(this).hasClass('on') ) {
              $(this).addClass('on');
              selectList.slideDown(duration);
  
              selectItem.on('click', function() {
                  let chooseItem = $(this).data('value');
  
                  $('select').val(chooseItem).attr('selected', 'selected');
                  selectHead.text( $(this).find('span').text() );
  
                  selectList.slideUp(duration);
                  selectHead.removeClass('on');
              });
  
          } else {
              $(this).removeClass('on');
              selectList.slideUp(duration);
          }
      });
  });
  
  
  var radius = 240; // how big of the radius
  var autoRotate = true; // auto rotate or not
  var rotateSpeed = -60; // unit: seconds/360 degrees
  var imgWidth = 120; // width of images (unit: px)
  var imgHeight = 170; // height of images (unit: px)
  
  
  
  /*
       NOTE:
         + imgWidth, imgHeight will work for video
         + if imgWidth, imgHeight too small, play/pause button in <video> will be hidden
         + Music link are taken from: https://hoangtran0410.github.io/Visualyze-design-your-own-/?theme=HauMaster&playlist=1&song=1&background=28
         + Custom from code in tiktok video  https://www.facebook.com/J2TEAM.ManhTuan/videos/1353367338135935/
  */
  
  
  // ===================== start =======================
  // animation start after 1000 miliseconds
  setTimeout(init, 9000);
  
  var odrag = document.getElementById('drag-container');
  var ospin = document.getElementById('spin-container');
  var aImg = ospin.getElementsByTagName('img');
  var aVid = ospin.getElementsByTagName('video');
  var aEle = [...aImg, ...aVid]; // combine 2 arrays
  
  // Size of images
  ospin.style.width = imgWidth + "px";
  ospin.style.height = imgHeight + "px";
  
  var ground = document.getElementById('ground');
  ground.style.width = radius * 3 + "px";
  ground.style.height = radius * 3 + "px";
  
  function init(delayTime) {
    for (var i = 0; i < aEle.length; i++) {
      aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
      aEle[i].style.transition = "transform 1s";
      aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    }
  }
  
  function applyTranform(obj) {
    // Constrain the angle of camera (between 0 and 180)
    if(tY > 180) tY = 180;
    if(tY < 0) tY = 0;
  

    obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
  }
  
  function playSpin(yes) {
    ospin.style.animationPlayState = (yes?'running':'paused');
  }
  
  var sX, sY, nX, nY, desX = 0,
      desY = 0,
      tX = 0,
      tY = 10;
  
  // auto spin
  if (autoRotate) {
    var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
    ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
  }
  
  // add background music
  if (bgMusicURL) {
    document.getElementById('music-container').innerHTML += `
  <audio src="${bgMusicURL}" ${bgMusicControls? 'controls': ''} autoplay loop>    
  <p>If you are reading this, it is because your browser does not support the audio element.</p>
  </audio>
  `;
  }
  
  // setup events
  document.onpointerdown = function (e) {
    clearInterval(odrag.timer);
    e = e || window.event;
    var sX = e.clientX,
        sY = e.clientY;
  
    this.onpointermove = function (e) {
      e = e || window.event;
      var nX = e.clientX,
          nY = e.clientY;
      desX = nX - sX;
      desY = nY - sY;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      sX = nX;
      sY = nY;
    };
  
    this.onpointerup = function (e) {
      odrag.timer = setInterval(function () {
        desX *= 0.95;
        desY *= 0.95;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTranform(odrag);
        playSpin(false);
        if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
          clearInterval(odrag.timer);
          playSpin(true);
        }
      }, 17);
      this.onpointermove = this.onpointerup = null;
    };
  
    return false;
  };
  
  var words = ['Hi i like HTML', 'I also like css', 'Lorem ipsum dolor sit amet', ' consectetur adipiscing elit', 'sed do eiusmod tempor incididunt'],
      part,
      i = 0,
      offset = 0,
      len = words.length,
      forwards = true,
      skip_count = 0,
      skip_delay = 15,
      speed = 150;
  var wordflick = function () {
    setInterval(function () {
      if (forwards) {
        if (offset >= words[i].length) {
          ++skip_count;
          if (skip_count == skip_delay) {
            forwards = false;
            skip_count = 0;
          }
        }
      }
      else {
        if (offset == 0) {
          forwards = true;
          i++;
          offset = 0;
          if (i >= len) {
            i = 0;
          }
        }
      }
      part = words[i].substr(0, offset);
      if (skip_count == 0) {
        if (forwards) {
          offset++;
        }
        else {
          offset--;
        }
      }
      $('.word').text(part);
    },speed);
  };
  
  $(document).ready(function () {
    wordflick();
  });
  
  