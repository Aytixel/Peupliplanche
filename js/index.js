if (!NodeList.forEach) NodeList.prototype.forEach = function (callback, thisArg) {
    if (thisArg === undefined) thisArg = this
    array = this
    for (var index = 0; index < thisArg.length; ++index) callback(thisArg[index], index, array)
}

var menu_mobile = document.querySelector('.menu-mobile')
var menu_mobile_text = document.querySelector('.menu-mobile .button-mobile h2')
var menu = document.querySelector('.menu')
var menu_button = document.querySelectorAll('.menu .button')
var menu_mask = document.querySelector('.menu-mask')
var sections = document.querySelectorAll('.section')
var last_id = 0
var scrollBehavior = 'scrollBehavior' in document.documentElement.style

var open_menu = function () {
    menu_mobile.classList.add('hide')
    menu.classList.remove('hide')
    menu_mask.classList.remove('hide')
    if (navigator.vibrate) navigator.vibrate(50)
}

var close_menu = function () {
    menu_mask.classList.add('hide')
    menu.classList.add('hide')
    menu_mobile.classList.remove('hide')
    if (navigator.vibrate) navigator.vibrate([30, 15, 30])
}

menu_button.forEach(function (button) {
    button.onclick = function (e) {
        e.preventDefault()
        var id = button.getAttribute('id')
        var scroll_to = document.querySelector('.section[id="' + id + '"]')
        if (scrollBehavior) window.scrollTo({ 
          top: scroll_to.offsetTop - (scroll_to.querySelector('.title').classList.contains('right') ? 225 : 175),
          left: 0, 
          behavior: 'smooth' 
        })
        else window.scrollTo(0, scroll_to.offsetTop - (scroll_to.querySelector('.title').classList.contains('right') ? 225 : 175))
        document.querySelector('.menu .button.focus').classList.remove('focus')
        button.classList.add('focus')
        close_menu()
        last_id = id
        setTimeout(function () {last_id = 0}, 1000)
        return false
    }
})

window.onscroll = function (e) {
    var scroll_top = window.pageYOffset
    var id = 1
    if (scroll_top < 45) {
        menu.classList.remove('transparent')
        menu_mobile.classList.remove('transparent')
    } else {
        menu.classList.add('transparent')
        menu_mobile.classList.add('transparent')
    }
    sections.forEach(function (section) {if (section.offsetTop - window.innerHeight / 2 <= scroll_top) id = section.getAttribute('id')}.bind(this))
    if (last_id == 0) {
        document.querySelector('.menu .button.focus').classList.remove('focus')
        document.querySelector('.menu .button[id="' + id + '"]').classList.add('focus')
        menu_mobile_text.textContent = document.querySelector('.menu .button[id="' + id + '"] h2').textContent
    }
    if (id == last_id) last_id = 0
}

menu_mobile.onclick = open_menu
menu_mask.onclick = menu.onclick = close_menu

var slide_show = document.querySelectorAll('.slide-show')

slide_show.forEach(function (slide_show, index) {
    var button_next = slide_show.querySelector('.next')
    var button_back = slide_show.querySelector('.back')
    var max = slide_show.querySelectorAll('.slide').length
    var infinite = slide_show.hasAttribute('infinite')
    var slide_selected = 1
    var change = function (id) {
        slide_show.querySelector('.slide.focus').classList.remove('focus')
        slide_show.querySelector('.slide[id="' + id + '"]').classList.add('focus')
    }
    var next = function () {change(slide_selected = slide_selected + 1 == max + 1 ? infinite == true ? 1 : max : ++slide_selected)}
    var back = function () {change(slide_selected = slide_selected - 1 == 0 ? infinite == true ? max : 1 : --slide_selected)}
    if (button_next) button_next.onclick = !navigator.vibrate ? next : function () {
        navigator.vibrate([20, 5, 40])
        next()
    }
    if (button_back) button_back.onclick = !navigator.vibrate ? back : function () {
        navigator.vibrate([40, 5, 20])
        back()
    }
    if (slide_show.hasAttribute('auto')) {
        var time = parseInt(slide_show.getAttribute('auto'))
        setInterval(next, time >= 1000 ? time : 1000)
    }
})

if (window.DeviceOrientationEvent && (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1)) {
    document.querySelector('.home .image').classList.add('motion')
    var slides = document.querySelectorAll('.home .image.motion .slide')
    var portrait = true
    var throttle = function (callback, delay) {
        var last
        var timer
        return function () {
            var context = this
            var now = +new Date
            if (last && now < last + delay) {
                clearTimeout(timer)
                timer = setTimeout(function () {
                    last = now
                    callback.apply(context, arguments)
                }, delay)
            } else {
                last = now
                callback.apply(context, arguments)
            }
        }
    }
    var orientationupdate = function () {
        var orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type
        if (orientation == 'landscape-primary' || orientation == 'landscape-secondary') portrait = false
        else portrait = true
    }
    orientationupdate()
    window.addEventListener('deviceorientation', throttle(function(e) {
        slides.forEach(function (slide) {
            var x = (-e.beta / 36 + 5)
            var y = (-e.gamma / 18 + 5)
            if (portrait) {
                if (x < 9 && x > -1) slide.style.top = '-' + x + '%'
                if (y < 9 && y > -1) slide.style.left = '-' + y + '%'
            } else {
                if (y < 9 && y > -1) slide.style.top = '-' + y + '%'
                if (x < 9 && x > -1) slide.style.left = '-' + x + '%'
            }
        })
    }, 25))
    window.addEventListener('orientationchange', orientationupdate)
}