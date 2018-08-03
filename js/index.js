window.onload = function () {
    let imgUlTag = document.getElementsByClassName('img_wrap')[0];
    let imgList = imgUlTag.getElementsByTagName('li');
    let activeDot = document.querySelector('.active');
    let next = document.querySelector(".next");
    let pre = document.querySelector('.pre');
    let dotList = document.querySelectorAll('.dot li');
    let wrapDiv = document.querySelector('.wrap');
    //添加第一个图片
    imgUlTag.appendChild(imgUlTag.firstElementChild.cloneNode(true));
    let index = 0;
    let len = imgList.length;
    let timerId
    let time = new Date();
    //统一配置运动时间
    let sportTime = 800;



    //自动轮播
    timerId = setInterval(function () {
        next.click()
    }, sportTime)

    wrapDiv.addEventListener('mouseenter', function () {
        clearInterval(timerId);
    }, false)

    wrapDiv.addEventListener('mouseleave', function () {
        clearInterval(timerId);
        timerId = setInterval(() => {
            next.click()
        }, sportTime)
    }, false)

    let imgWidth = parseInt(getComputedStyle(imgList[0]).width);
    //转化数组，弹出以第一个li
    let dotArr = Array.prototype.slice.call(dotList, 1);
    //圆点点击
    for (let i = 0; i < len - 1; i++) {
        dotArr[i].onclick = function () {
            //圆点运动
            animation(activeDot, {
                left: i * 24 + 2
            }, sportTime);
            //图片运动
            animation(imgUlTag, {
                left: -i * imgWidth
            }, sportTime);
            index = i;
        }
    }
    next.addEventListener('click', nextClickHandler, false);
    pre.addEventListener('click', prelClickHandler, false);
    /**
     * next点击
     */
    function nextClickHandler() {
        //两次有效点击间隔大于sportTime +500, 500是自动轮播的停留时间
        if ((new Date() - time) < sportTime + 500) return false;
        time = new Date();
        index++;
        let DotLeft = index * 24;
        if (index === len - 1) {
            DotLeft = 0;
        }
        animation(activeDot, {
            left: DotLeft
        }, sportTime);
        //图片运动
        animation(imgUlTag, {
            left: -index * imgWidth
        }, sportTime, () => {
            if (index === len - 1) {
                imgUlTag.style.left = '0px';
                index = 0;
            }
        });
    }
    /**
     * pre点击
     */
    function prelClickHandler() {
        if ((new Date() - time) < 1000) return false;
        time = new Date();
        index--;
        if (index < 0) index = len - 2;

        //圆点运动
        animation(activeDot, {
            left: index * 24
        }, sportTime);
        //图片运动
        animation(imgUlTag, {
            left: -index * imgWidth
        }, sportTime);
    }


    /**
     * 
     * @param {target}  执行动画的元素
     * @param {obj}  动画的效果
     * @param {time}  动画运行时间，默认1000ms
     * @param {callBack}
     */
    function animation(target, obj = {}, time = 1000, callBack = () => {}) {
        //obj为空对像，不运动
        if (obj.toString() == '{}') {
            return;
        }

        function getStyle(ele) {
            //window.getComputedStyle(target)的属性值会随着元素的属性改变而动态的更新
            return window.getComputedStyle(ele) || ele.currentStyle;
        }
        let startTime = new Date();
        let changeStyle = {};
        let startStyle = {};
        let originStyle = getStyle(target);
        for (let key in obj) {
            let objVal = parseInt(obj[key])
            if (isNaN(objVal)) {
                throw new Error(`(${key}) this attribute is invalid`);
                return false;
            }
            obj[key] = objVal;
            let originVal = parseInt(originStyle[key])
            startStyle[key] = originVal;
            changeStyle[key] = obj[key] - originVal;
        }

        run()

        function run() {
            let currentTime = new Date();
            let interTime = currentTime - startTime;
            let progress = interTime / time;
            if (interTime >= time) {
                progress = 1;
            } else {
                requestAnimationFrame(run);
            }
            for (var key in obj) {
                target.style[key] = startStyle[key] + changeStyle[key] * progress + 'px';
            }
            if (progress == 1) {
                callBack();
            }
        }
    } //end animation
}