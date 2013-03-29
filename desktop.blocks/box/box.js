$(function() {

    var photoWrap = $('.box__photo-wrapper'),
        photoBig = $('.box__photo-item img'),
        dfdTitle = $.Deferred(),
        album = $('.album'),
        scrollBar = $('.box__thumbs-list'),
        speed = 450,
        scrollLength = 0,
        photoThumb = $('.box__mini'),
        loader = $('.loading'),
        activePhoto = $('.stateActive'),
        progressbar = $('.progressbar__loading'),
        counterPhotos = $('.album__current-photo'),
        autoplay = $('.autoplay'),
        setActive = 0,
        activeImg = $('.stateActive');

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
               loader.hide();
            }, 1000);
    });

    function scrollItems(elem, length) {
        ($(elem).hasClass('box__thumb-arrow_direction_right')) ?
            scrollLength += length : scrollLength -= length;
            scrollBar.animate({'scrollLeft': '+' + scrollLength}, speed);
    }

        function disableArrow() {
            if ( $('.box__mini_state_active').index() === 0 ) {
                $('.box__control_direction_left').addClass('box__control_visibility_hidden');
            }
            else if ( $('.box__mini_state_active').index() === 99 ) {
                $('.box__control_direction_right').addClass('box__control_visibility_hidden');
            }
            else {
                $('.box__control_direction_left, .box__control_direction_right').removeClass('box__control_visibility_hidden');            }
        }

    function slider(param) {
            var photoBig = $('.box__photo-item img'),
                boxCtrlRight = (param.hasClass('box__control_direction_right'));

                if(boxCtrlRight) {
                    param.addClass('box__control_disabled_yes');
                        activeImg.css({
                                'right': '',
                                'left':  photoWrap.width()/2 - activeImg.width()/2
                            });
                } else {
                    $('.box__mini').addClass('box__mini_disabled_yes');
                }

                var _thisHash = boxCtrlRight ?
                    $('.box__mini_state_active').next().attr('hash') :
                    param.attr('hash');
                    setActive = Number(_thisHash);
                    localStorage.setItem('active', setActive);

                    counterPhotos.text(setActive + 1);

                boxCtrlRight && $('.box__mini_state_active')
                                .removeClass('box__mini_state_active')
                                .next()
                                .addClass('box__mini_state_active');

                var newActiveImg = $('.stateActive');
            if (newActiveImg.attr('id') !== _thisHash) {

                newActiveImg.animate({'left': '-' + newActiveImg.width()}, speed);
                    setTimeout(function() {
                        newActiveImg.removeAttr('style').removeAttr('class');
                    }, speed + 50);

                    activePhoto = $('.box__photo-item ').find('#'+_thisHash);
                    activePhoto
                        .addClass('stateActive')
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

                if(!boxCtrlRight) {
                    photoThumb.removeClass('box__mini_state_active');
                    param.addClass('box__mini_state_active');
                }
            }

            setTimeout(function() {
                boxCtrlRight ? param.removeClass('box__control_disabled_yes') :
                               $('.box__mini').removeClass('box__mini_disabled_yes');
            }, speed);
            disableArrow();
        }

    $('.box__control_direction_right').on('click', function(){
            var controlRight = $(this);
            if(!controlRight.hasClass('box__control_disabled_yes')) {
                slider($(this));
            }
        });

        $('.box__control_direction_left').on('click', function(){
            var controlLeft = $(this);
        if(!controlLeft.hasClass('box__control_disabled_yes')) {

            controlLeft.addClass('box__control_disabled_yes');
            activeImg.css({
                        'left': '',
                        'right':  photoWrap.width()/2 - activeImg.width()/2
                    });

            var photoBig = $('.box__photo-item img'),
                _thisHash = $('.box__mini_state_active').prev().attr('hash');

                setActive = Number(_thisHash);
                localStorage.setItem('active', setActive);

                counterPhotos.text(setActive + 1);

                $('.box__mini_state_active')
                    .removeClass('box__mini_state_active')
                    .prev()
                    .addClass('box__mini_state_active');

            var newActiveImg = $('.stateActive');

            if (newActiveImg.attr('id') !== _thisHash) {

                newActiveImg.animate({'right': '-' + newActiveImg.width()}, speed);
                setTimeout(function() {
                    newActiveImg.removeAttr('style').removeAttr('class');
                }, speed + 50);
                activePhoto = $('.box__photo-item ').find('#'+_thisHash);
                activePhoto
                    .addClass('stateActive')
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

function getAllPhotos(url) {
    $.getJSON(url, function (data){

        (function getTitle() {
            $('.album__title-name').text(data.title);
            $('.album__count-photos').text(' ' + data.entries.length);

            return dfdTitle.resolve();
        })();

        $.when(dfdTitle).done(function(){
            $('.album').removeClass('album_visibility_hidden');
        });

        var itemActive = localStorage.getItem('active');
        if( itemActive == null ) { itemActive = 0; }

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

            return photoThumb;
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
            photoBig = $('.box__photo-item #'+itemActive);
            photoBig.load(function() {
                    $(this).fadeIn(600).addClass('stateActive');
                     alignPhoto($(this));

                     disableArrow();
                     autoplay.fadeIn(400);
                });
            $(window).resize(function() {
                alignPhoto(photoBig);
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
}
getAllPhotos('http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?');

    $('.box__thumbs-list').on('mousewheel', function(e, delta) {
        this.scrollLeft -= (delta * 100);
        e.preventDefault();
    });

    $('.box__thumb-arrow').on('click', function(){
        scrollItems(this, 154);
    });
});