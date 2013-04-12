({
    block: 'b-page',
    title: 'Галерея Яндекс.Фоток | ШРИ: Михаил Пешехонов',
    favicon: 'http://yandex.st/lego/_/eTvq15W3rgkxDlbY83_swCCeaF0.ico',
    head: [
        { elem: 'css', url: '_index.css', ie: false },
        { elem: 'css', url: '_index', ie: true },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: '_index.js' }
    ],
    content:[
        {
            elem: 'inner',
            content: [
                {
                    block: 'album',
                    mods: { visibility: 'hidden' },
                    content: [
                        {
                            elem: 'title',
                            content: [
                                { elem: 'title-name' },
                                { elem: 'current-photo' },
                                { elem: 'count-photos' }
                            ]
                        }
                    ]
                },
                {
                    block: 'autoplay'
                },
                {
                    block: 'progressbar',
                    mods: { theme: 'blue', type: 'load' },
                    content: { elem: 'loading' }
                },
                {
                    block: 'box',
                    content: [
                        {
                            elem: 'photo-wrap',
                            content: [
                                {
                                    elem: 'control',
                                    mods: { direction: 'left' }
                                },
                                {
                                    elem: 'photo',
                                    content: [
                                        {
                                            elem: 'photo-wrapper',
                                            content: [
                                                { block: 'loading' },
                                                { elem: 'photo-item' }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    elem: 'control',
                                    mods: { direction: 'right' }
                                }
                            ]
                        },
                        {
                            elem: 'wrapper-thumbs',
                            content: [
                                {
                                    elem: 'inner',
                                    mods: { position: 'bottom' },
                                    content: { elem: 'thumbs-list' }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
})
