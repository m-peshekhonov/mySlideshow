$(function() {
    var photoWrapper = $('.box__photo-wrapper'),
        photoBig = $('.box__photo-item img'),
        activePhoto = $('.full-photo_state_active'),
        boxControls = $('.box__control'),
        boxControlRight = $('.box__control_direction_right'),
        boxControlLeft = $('.box__control_direction_left'),
        photoThumb = $('.box__mini'),
        dfdTitle = $.Deferred(),
        dfdThumbs = $.Deferred(),
        album = $('.album'),
        scrollBar = $('.box__thumbs-list'),
        progressbar = $('.progressbar__loading'),
        loading = $('.loading'),
        counterPhotos = $('.album__current-photo'),
        autoplay = $('.autoplay'),
        setActive = 0, // активнная фотка
        thumbDataId,
        speed = 450,
        nextImages = 30, // id фоток
        lastImg, //последняя фотка
        nextLink = 'http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?limit=30&format=json';

    function alignPhoto(param) {
        photoWrapper.css('height', $(window).height());
        param.css({
            'margin-top': photoWrapper.height()/2 - param.height()/2,
            'left': photoWrapper.width()/2 - param.width()/2
            });
    }

    $(window).load(function() {
        progressbar.text('Всё готово!');
        setTimeout(function () {
           $('.progressbar').fadeOut(800);
           loading.remove();
        }, 800);
    });

    function slider(param) {
        var boxControlRight = (param.hasClass('box__control_direction_right')),
            boxControlLeft = (param.hasClass('box__control_direction_left')),
            boxControls = (param.hasClass('box__control')),
            activeFullImg = $('.full-photo_state_active'),
            activeThumbImg = $('.box__mini_state_active'),
            alignFullPhoto = photoWrapper.width()/2 - activeFullImg.width()/2,
            _thisDadaId;
            photoThumb = $('.box__mini');

            if (!boxControls) { var lastThisImg = param.index() < activeThumbImg.index(); } // фотки, которые левее, чем активаня фотка

            boxControls ? param.addClass('box__control_disabled_yes') : param.addClass('box__mini_disabled_yes');

            (boxControlLeft || lastThisImg) ? activeFullImg.css({ 'left': '', 'right':  alignFullPhoto }) :
                             activeFullImg.css({ 'right': '', 'left':  alignFullPhoto });

            _thisDadaId = boxControls ?
                (boxControlRight ? ($('.box__mini_state_active').next().attr('data-id')) :
                                   ($('.box__mini_state_active').prev().attr('data-id'))) :
                param.attr('data-id');

                setActive = Number(_thisDadaId);
                localStorage.setItem('active', setActive);

                counterPhotos.text(setActive + 1);

            boxControlRight && $('.box__mini_state_active')
                                .removeClass('box__mini_state_active')
                                .next()
                                .addClass('box__mini_state_active');

            boxControlLeft  && $('.box__mini_state_active')
                                .removeClass('box__mini_state_active')
                                .prev()
                                .addClass('box__mini_state_active');

        if (activeFullImg.attr('id') !== _thisDadaId) {
            activeFullImg = $('.full-photo_state_active');

            (boxControlLeft || lastThisImg) ? activeFullImg.animate({'right': '-' + activeFullImg.width()}, speed) :
                             activeFullImg.animate({'left': '-' + activeFullImg.width()}, speed);

                setTimeout(function() {
                    activeFullImg.removeAttr('style').removeClass('full-photo_state_active');
                }, speed + 50);

                activePhoto = $('.box__photo-item ').find('#'+_thisDadaId);
                activePhoto
                    .addClass('full-photo_state_active')
                    .css('margin-top', photoWrapper.height()/2 - activePhoto.height()/2)
                    .show();

                alignFullPhoto = photoWrapper.width()/2 - activePhoto.width()/2;

            (boxControlLeft || lastThisImg)  ? activePhoto.css({ 'left': '-'+activePhoto.width()+'px' }).animate({ 'left': alignFullPhoto }, speed) :
                             activePhoto.css({ 'right': '-'+activePhoto.width()+'px' }).animate({ 'right': alignFullPhoto}, speed);

                setTimeout(function() {
                    (boxControlLeft || lastThisImg)  ? activePhoto.css({ 'left': '', 'right': alignFullPhoto }) :
                                     activePhoto.css({ 'right': '', 'left': alignFullPhoto });
                }, speed);

            $(window).resize(function() {
                alignPhoto(activePhoto);
            });

            if(!boxControls) {
                photoThumb.removeClass('box__mini_state_active');
                param.addClass('box__mini_state_active');
            }
        }

        setTimeout(function() {
            boxControls ? param.removeClass('box__control_disabled_yes') :
                          photoThumb.removeClass('box__mini_disabled_yes');
        }, speed);
        disableArrow();

        thumbDataId = $('.box__mini_state_active').attr('data-id');
        alignThumb(thumbDataId);
    }

    function alignThumb(imgId) {
        scrollBar.animate({'scrollLeft': '+' + imgId*77 - photoWrapper.width()/2 + 38.5}, speed);
    }

    function disableArrow() {
        var activeThumbPos = $('.box__mini_state_active').index();

        (activeThumbPos === 0) ? boxControlLeft.addClass('box__control_visibility_hidden') :
                                 boxControlLeft.removeClass('box__control_visibility_hidden');

        (activeThumbPos === lastImg) ? boxControlRight.addClass('box__control_visibility_hidden') :
                                       boxControlRight.removeClass('box__control_visibility_hidden');
    }

    boxControls.live('click', function() {
        if(!$(this).hasClass('box__control_disabled_yes')) {
            slider($(this));
        }
    });

    photoThumb.live('click', function() {
        if(!photoThumb.hasClass('box__mini_disabled_yes')) {
            slider($(this));
        }
    });

$.getJSON(nextLink+'&callback=?', function (data){

        function getTitle() {
            $('.album__title-name').text(data.title);
            $('.album__count-photos').text(' ' + data.imageCount);

            return dfdTitle.resolve();
        }

        $.when(getTitle()).done(function() {
            album.removeClass('album_visibility_hidden');
        });

        var itemActive = localStorage.getItem('active');
            itemActive == null && (itemActive = 0); // для первой загрузки
            itemActive > data.entries.length && (itemActive = 0);

        alignThumb(itemActive); // выравниваем активную фотку по центру
        counterPhotos.text(Number(itemActive) + 1);

        function getThumbPhotos() {
            for (var i = 0; i < data.entries.length; i++) {
                $('<div>')
                    .addClass('box__mini')
                    .attr({
                        'data-id': i,
                        title: data.entries[i].title
                    })
                    .css('background-image', 'url(' +data.entries[i].img.XS.href+ ')')
                    .appendTo('.box__thumbs-list');
            }
            photoThumb = $('.box__mini');
            photoThumb.eq(itemActive).addClass('box__mini_state_active');

            return dfdTitle.resolve();
        }

        function getFullPhotos() {
            for (var i = 0; i < data.entries.length; i++) {
                $('<img>')
                    .attr({
                        id: i,
                        src: data.entries[i].img.XL.href
                    })
                    .appendTo('.box__photo-item');
            }
            var photoBigActive = $('.box__photo-item #'+itemActive);
            photoBigActive.load(function() {
                     $(this).fadeIn(600).addClass('full-photo_state_active');

                     alignPhoto($(this));
                     disableArrow();
                     autoplay.fadeIn(600);
                });

            $(window).resize(function() {
                alignPhoto(photoBigActive);
            });
        }

        $.when(getThumbPhotos()).done(function() {
            getFullPhotos();
        });

        photoBig.live('click', function() {
            if ($('.box__mini_state_active').index() === data.imageCount - 1) {
                return false;
            }
            $('.box__control_direction_right').trigger('click');
        });

        autoplay.live('click', function() {
            $(this).toggleClass('autoplay_checked_yes');

            if ($(this).hasClass('autoplay_checked_yes')) {
                (function autoPlay(){
                    if ($('.box__mini_state_active').index() === data.imageCount - 1) {
                        autoplay.removeClass('autoplay_checked_yes');
                        return false;
                    }
                    $('.box__control_direction_right').trigger('click',[true]);
                    timeOut = setTimeout(autoPlay, 3000);
                })();
            } else {
                clearTimeout(timeOut);
            }
        });

        nextLink = data.links.next;
        lastImg = data.imageCount - 1;
    })
    .error(function() {
        $('.progressbar')
            .show()
            .removeClass('progressbar_type_load')
            .addClass('progressbar_type_error');
         progressbar.text('Ошибка! Перезагрузите страницу');
    })
    .complete(function() {
        function loadPicture(count) {
            var countImages  = $('.box__mini').length, // колличество миниаютр всего
                activePic =  $('.box__mini_state_active'), // активая миниатюра
                newPhotos;

            if (activePic.index() >= countImages - count) {

                if (!$('.box__mini').hasClass('disabled_yes') ) {
                    newPhotos = $.getJSON(nextLink+'&callback=?', function (data){
                        for (var i = 0; i < data.entries.length; i++) {
                            $('<div>')
                                .addClass('box__mini')
                                .attr({
                                    'data-id': i + nextImages,
                                    title: data.entries[i].title
                                })
                                .css('background-image', 'url(' +data.entries[i].img.XS.href+ ')')
                                .appendTo('.box__thumbs-list');

                            $('<img>')
                                .attr({
                                    id: i + nextImages,
                                    src: data.entries[i].img.XL.href
                                })
                                .appendTo('.box__photo-item');
                        }
                        nextLink = data.links.next;
                        nextImages += 30;
                    });
                }

                $('.box__mini').addClass('disabled_yes');
                    newPhotos.success(function() {
                        $('.box__mini').removeClass('disabled_yes');
                    });
            }

        }
        $(window).load(function() {
            loadPicture(1); //Если последняя фотка из партии state_active, подгружаем следующую партию из 30 фоток.
        });
        $('.box__mini, .box__control_direction_right').live('click', function() {
            loadPicture(15);
        });
    });

    scrollBar.mousewheel(function(e, delta) {
        this.scrollLeft -= (delta * 77); // 77 - ширина миниатюры с учётом отступов
        e.preventDefault();
    });
});