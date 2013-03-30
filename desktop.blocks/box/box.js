$(function() {

    var photoWrap = $('.box__photo-wrapper'),
        photoBig = $('.box__photo-item img'),
        activePhoto = $('.full-photo_state_active'),
        photoThumb = $('.box__mini'),
        dfdTitle = $.Deferred(),
        album = $('.album'),
        scrollBar = $('.box__thumbs-list'),
        progressbar = $('.progressbar__loading'),
        loading = $('.loading'),
        counterPhotos = $('.album__current-photo'),
        autoplay = $('.autoplay'),
        setActive = 0,
        speed = 450,
        scrollLength = 0;

    function alignPhoto(param) {
        photoWrap.css('height', $(window).height());
        param.css({
            'margin-top': photoWrap.height()/2 - param.height()/2,
            'left': photoWrap.width()/2 - param.width()/2
            });
    }

    $(window).load(function() {
        progressbar.text('Всё готово!');
        setTimeout(function () {
           $('.progressbar').fadeOut(800);
           loading.addClass('loading_visibility_hidden');
        }, 800);
    });

    function scrollItems(elem, length) {
        ($(elem).hasClass('box__thumb-arrow_direction_right')) ?
        scrollLength += length : scrollLength -= length;
        scrollBar.animate({'scrollLeft': '+' + scrollLength}, speed);
    }

    function slider(param) {
        var boxControlRight = (param.hasClass('box__control_direction_right')),
            activeFullImg = $('.full-photo_state_active');

            if(!boxControlRight) {
                $('.box__mini').addClass('box__mini_disabled_yes');
            }
            boxControlRight && param.addClass('box__control_disabled_yes');

            activeFullImg.css({
                    'right': '',
                    'left':  photoWrap.width()/2 - activeFullImg.width()/2
                });

            var _thisHash = boxControlRight ?
                $('.box__mini_state_active').next().attr('hash') :
                param.attr('hash');

                setActive = Number(_thisHash);
                localStorage.setItem('active', setActive);

                counterPhotos.text(setActive + 1);

            boxControlRight && $('.box__mini_state_active')
                            .removeClass('box__mini_state_active')
                            .next()
                            .addClass('box__mini_state_active');

        if (activeFullImg.attr('id') !== _thisHash) {
                activeFullImg = $('.full-photo_state_active');

            activeFullImg.animate({'left': '-' + activeFullImg.width()}, speed);
                setTimeout(function() {
                    activeFullImg.removeAttr('style').removeAttr('class');
                }, speed + 50);

                activePhoto = $('.box__photo-item ').find('#'+_thisHash);
                activePhoto
                    .addClass('full-photo_state_active')
                    .css({
                        'margin-top': photoWrap.height()/2 - activePhoto.height()/2,
                        'right': '-'+activePhoto.width()+'px'
                    })
                    .show()
                    .animate({'right': photoWrap.width()/2 - activePhoto.width()/2}, speed);

                setTimeout(function() {
                        activePhoto.css({
                            'right': '',
                            'left':  photoWrap.width()/2 - activePhoto.width()/2
                        });
                }, speed);

            $(window).resize(function(){
                alignPhoto(activePhoto);
            });

            if(!boxControlRight) {
                photoThumb.removeClass('box__mini_state_active');
                param.addClass('box__mini_state_active');
            }
        }

        setTimeout(function() {
            boxControlRight ? param.removeClass('box__control_disabled_yes') :
                           photoThumb.removeClass('box__mini_disabled_yes');
        }, speed);
        disableArrow();
    }

        function disableArrow() {
            if ( $('.box__mini_state_active').index() === 0 ) {
                $('.box__control_direction_left').addClass('box__control_visibility_hidden');
            }
            else if ( $('.box__mini_state_active').index() === 99 ) {
                $('.box__control_direction_right').addClass('box__control_visibility_hidden');
            }
            else {
                $('.box__control_direction_left, .box__control_direction_right').removeClass('box__control_visibility_hidden');
            }
        }

        $('.box__control_direction_right').on('click', function(){
            var controlRight = $(this);
            if(!controlRight.hasClass('box__control_disabled_yes')) {
                slider($(this));
            }
        });

        $('.box__control_direction_left').on('click', function(){
            var controlLeft = $(this),
                activeFullImg = $('.full-photo_state_active');

        if(!controlLeft.hasClass('box__control_disabled_yes')) {
                controlLeft.addClass('box__control_disabled_yes');

                activeFullImg.css({
                            'left': '',
                            'right':  photoWrap.width()/2 - activeFullImg.width()/2
                        });

            var _thisHash = $('.box__mini_state_active').prev().attr('hash');

                setActive = Number(_thisHash);
                localStorage.setItem('active', setActive);

                counterPhotos.text(setActive + 1);

                $('.box__mini_state_active')
                    .removeClass('box__mini_state_active')
                    .prev()
                    .addClass('box__mini_state_active');

            if ($('.full-photo_state_active').attr('id') !== _thisHash) {
                    activeFullImg = $('.full-photo_state_active');
                    activeFullImg.animate({'right': '-' + activeFullImg.width()}, speed);

                    setTimeout(function() {
                        activeFullImg.removeAttr('style').removeAttr('class');
                    }, speed + 50);

                    activePhoto = $('.box__photo-item ').find('#'+_thisHash);
                    activePhoto
                        .addClass('full-photo_state_active')
                        .css({
                            'margin-top': photoWrap.height()/2 - activePhoto.height()/2,
                            'left': '-'+activePhoto.width()+'px'
                        })
                        .show()
                        .animate({'left': photoWrap.width()/2 - activePhoto.width()/2}, speed);

                    setTimeout(function() {
                            activePhoto.css({
                                'left': '',
                                'right':  photoWrap.width()/2 - activePhoto.width()/2
                            });
                    }, speed);
                }

                setTimeout(function() {
                    controlLeft.removeClass('box__control_disabled_yes');
                }, speed);
                disableArrow();
            }
        });

    $.getJSON('http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?', function (data){

        (function getTitle() {
            $('.album__title-name').text(data.title);
            $('.album__count-photos').text(' ' + data.entries.length);

            return dfdTitle.resolve();
        })();

        $.when(dfdTitle).done(function(){
            $('.album').removeClass('album_visibility_hidden');
        });

        var itemActive = localStorage.getItem('active');
        itemActive == null && (itemActive = 0);

        counterPhotos.text(Number(itemActive) + 1);

        (function getThumbPhotos() {
            for (var i = 0; i < data.entries.length; i++) {
                $('<div class="box__mini">')
                    .attr({
                        hash: i,
                        title: data.entries[i].title
                    })
                    .css('background-image', 'url(' +data.entries[i].img.XS.href+ ')')
                    .appendTo('.box__thumbs-list');
            }
            photoThumb = $('.box__mini');
            photoThumb.eq(itemActive).addClass('box__mini_state_active');
        })();

        (function getFullPhotos() {
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
        })();

        photoThumb.on('click', function(){
            if(!photoThumb.hasClass('box__mini_disabled_yes')) {
                slider($(this));
            }
        });

        $('.box__photo-item img').on('click', function(){
            if ($('.box__mini_state_active').index() === data.entries.length - 1) {
                return false;
            }
            $('.box__control_direction_right').trigger('click');
        });

        autoplay.on('click', function(){
            $(this).toggleClass('autoplay_checked_yes');
            if ($(this).hasClass('autoplay_checked_yes')) {
                (function autoPlay(){
                    if ($('.box__mini_state_active').index() === data.entries.length - 1) {
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

    });

    $('.box__thumbs-list').on('mousewheel', function(e, delta) {
        this.scrollLeft -= (delta * 100);
        e.preventDefault();
    });

    $('.box__thumb-arrow').on('click', function(){
        scrollItems(this, 154);
    });
});