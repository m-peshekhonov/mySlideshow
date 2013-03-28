$(function() {

    var photoWrap = $('.box__photo-wrapper'),
        photoBig = $('.box__photo-item img'),
        dfdTitle = $.Deferred(),
        dfdFullPhoto = $.Deferred(),
        album = $('.album'),
        scrollBar = $('.box__thumbs-list'),
        speed = 450,
        scrollLength = 0,
        photoThumb = $('.box__mini'),
        loader = $('.loading'),
        activePhoto = $('.stateActive'),
        progressbar = $('.progressbar__loading'),
        counterPhotos = $('.album__current-photo'),
        autoplay = $('.autoplay');
        $('.progressbar').fadeIn(800);

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


$.getJSON('http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?',function(data){

    function disableArrow() {
        if ( $('.box__mini_state_active').index() === 0 ) {
            $('.box__control_direction_left').hide();
        }
        else if ( $('.box__mini_state_active').index() === data.entries.length - 1 ) {
            $('.box__control_direction_right').hide();
        }
        else {
            $('.box__control_direction_left').show();
            $('.box__control_direction_right').show();
        }
    }

    (function getTitle() {
        $('.album__title-name').text(data.title);
        $('.album__count-photos').text(' ' + data.imageCount);

        return dfdTitle.resolve();
    })();

    $.when(dfdTitle).done(function(){
        $('.album').removeClass('album_visibility_hidden');
    });

    (function getFullPhotos() {
        for (var i = 0; i < data.entries.length; i++) {
            $('<img>')
                .attr({
                    id: i,
                    src: data.entries[i].img.XL.href
                })
                .appendTo('.box__photo-item');
        }
        photoBig = $('.box__photo-item img').eq(0);
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

    (function getPhotos() {
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
        photoThumb.eq(0).addClass('box__mini_state_active');

        return photoThumb;
    })();


    function slider(param) {
        var photoBig = $('.box__photo-item img'),
            boxControls = (param.hasClass('box__control_direction_right'));

            if(boxControls) {
            var activeF = $('.stateActive');
                activeF.css({
                            'right': '',
                            'left':  photoWrap.width()/2 - activeF.width()/2
                        });
            }

            var _thisHash = boxControls ?
                $('.box__mini_state_active').next().attr('hash') :
                param.attr('hash');
                counterPhotos.text(_thisHash);

            boxControls && $('.box__mini_state_active')
                            .removeClass('box__mini_state_active')
                            .next()
                            .addClass('box__mini_state_active');

        if ($('.stateActive').attr('id') !== _thisHash) {
            var photoBigActive = $('.stateActive');

            photoBigActive.animate({'left': '-' + photoBigActive.width()}, speed);
                setTimeout(function() {
                    photoBigActive.removeAttr('style').removeAttr('class');
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

            if(!boxControls) {
                photoThumb.bind('click', function(){ return false; });
                photoThumb.removeClass('box__mini_state_active');
                param.addClass('box__mini_state_active');
            }
        }
        disableArrow();
    }

    photoThumb.bind('click', function(){
        slider($(this));
    });

    $('.box__control_direction_right').bind('click', function(){
        slider($(this));
    });

    $('.box__control_direction_left').bind('click', function(){

        var activeF = $('.stateActive');
        activeF.css({
                    'left': '',
                    'right':  photoWrap.width()/2 - activeF.width()/2
                });

        var photoBig = $('.box__photo-item img'),
            _thisHash = $('.box__mini_state_active').prev().attr('hash');
            counterPhotos.text(_thisHash);

            $('.box__mini_state_active')
                .removeClass('box__mini_state_active')
                .prev()
                .addClass('box__mini_state_active');

        if ($('.stateActive').attr('id') !== _thisHash) {
            var photoBigActive = $('.stateActive');

            photoBigActive.animate({'right': '-' + photoBigActive.width()}, speed);
            setTimeout(function() {
                photoBigActive.removeAttr('style').removeAttr('class');
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
        disableArrow();
    });

    $('.box__photo-item img').bind('click', function(){
        if ($('.box__mini_state_active').index() === data.entries.length - 1) {
            return false;
        }
        $('.box__control_direction_right').trigger('click');
    });

    autoplay.bind('click', function(){
        $(this).toggleClass('autoplay_checked_yes');

        if ($(this).hasClass('autoplay_checked_yes')) {
            (function autoPlay(){
                if ($('.box__mini_state_active').index() === data.entries.length - 1) {
                    autoplay.removeClass('autoplay_checked_yes');
                    return false;
                }
                $('.box__control_direction_right').trigger('click',[true]);
                timeOut = setTimeout(autoPlay, 2000);
            })();
        } else {
            clearTimeout(timeOut);
        }
    });

});

    $('.box__thumbs-list').mousewheel(function(event, delta) {
        this.scrollLeft -= (delta * 100);
        event.preventDefault();
    });

    $('.box__thumb-arrow').bind('mousedown', function(){
        ($(this).hasClass('box__thumb-arrow_direction_right')) ?
        scrollLength += 150 : scrollLength -= 150;
        scrollBar.animate({'scrollLeft': '+' + scrollLength}, speed);
    });
});