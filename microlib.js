/**
 *  @author hawlim(http://www.hawklim.com)
 *  @description
 */

// 之后想下封装实现 
var $ = function() {
    function $(elem) {
        this.elem = elem;
    }
    
    $.prototype = {
        constructor : $,
        children : function() {
            return this.sibling( this.elem.firstChild );
        },
        siblings : function() {
            return this.sibling( (this.elem.parentNode || {}).firstChild, this.elem );
        },
        sibling : function( n, elem ) {
            var r = [];
            for(; n; n = n.nextSibling) 
                if( n.nodeType === 1 && n !== elem)
                    r.push(n);
            return r;
        },
        getStyle : function() {
            if(this.elem.currentStyle)
                return this.elem.currentStyle;
            else return document.defaultView.getComputedStyle(this.elem, null);	
        },
        initAnimate : function( speed, step ) {
            return new Animate( this.elem, speed, step,this.getStyle());
        }
    };
    
    // 动画
    function Animate(elem, speed, step, style) {
        this.elem = elem;
        this.speed = speed;
        this.step = step;
        this.style = style;
        //this.width = this.style.width;
        //this.height = this.style.height;    
        this.elem.style.overflow = 'hidden';
    }
    
    Animate.prototype = {
        constructor : Animate,			
        show : function(callback) {
            this.elem.className = 'show_ul';
            var height = this.elem.offsetHeight;
            if(!parseInt(height)) 
                return;
            this.elem.style.height = 0 + 'px';
            var self = this;
            var timer = setInterval(function(){self.toShow(timer, height, callback);}, this.speed);

        },
        toShow : function(timer, height, callback) {
            this.elem.style.height = parseInt(this.elem.style.height,10)+this.step + 'px';
            var cHeight = parseInt(this.elem.style.height,10);
            if( cHeight == height || cHeight>height) {
                clearInterval(timer);
                callback();
            }	        
        },
        hide : function(callback) {       
            var height = this.elem.offsetHeight;
            if(!parseInt(height)) {
                this.elem.className = 'hide_ul';
                return;
            }
            this.elem.style.height = height + 'px';
            var self = this;
            var timer = setInterval(function(){self.toHide(timer,callback)}, this.speed);			
        },
        toHide : function(timer,callback) {
            var h = parseInt(this.elem.style.height,10)>this.step?parseInt(this.elem.style.height,10):this.step;
            this.elem.style.height = h-this.step + 'px';
            var cHeight = parseInt(this.elem.style.height,10);
            if( cHeight == 0) {
                clearInterval(timer);
                callback();
                this.elem.className = 'hide_ul';
                this.elem.style.cssText = '';					
            }        
        }       
    };

    return function(elem) {
        return new $(elem);
    }
}();