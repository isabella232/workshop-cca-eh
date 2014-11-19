Polymer("core-header-panel",{publish:{mode:{value:"",reflect:true},tallClass:"tall",shadow:false},animateDuration:200,modeConfigs:{shadowMode:{waterfall:1,"waterfall-tall":1},noShadow:{seamed:1,cover:1,scroll:1},tallMode:{"waterfall-tall":1},outerScroll:{scroll:1}},ready:function(){this.scrollHandler=this.scroll.bind(this);this.addListener()},detached:function(){this.removeListener(this.mode)},addListener:function(){this.scroller.addEventListener("scroll",this.scrollHandler)},removeListener:function(mode){var s=this.getScrollerForMode(mode);s.removeEventListener("scroll",this.scrollHandler)},domReady:function(){this.async("scroll")},modeChanged:function(old){var configs=this.modeConfigs;var header=this.header;if(header){if(configs.tallMode[old]&&!configs.tallMode[this.mode]){header.classList.remove(this.tallClass);this.async(function(){header.classList.remove("animate")},null,this.animateDuration)}else{header.classList.toggle("animate",configs.tallMode[this.mode])}}if(configs&&(configs.outerScroll[this.mode]||configs.outerScroll[old])){this.removeListener(old);this.addListener()}this.scroll()},get header(){return this.$.headerContent.getDistributedNodes()[0]},getScrollerForMode:function(mode){return this.modeConfigs.outerScroll[mode]?this.$.outerContainer:this.$.mainContainer},get scroller(){return this.getScrollerForMode(this.mode)},scroll:function(){var configs=this.modeConfigs;var main=this.$.mainContainer;var header=this.header;var sTop=main.scrollTop;var atTop=sTop===0;this.$.dropShadow.classList.toggle("hidden",!this.shadow&&(atTop&&configs.shadowMode[this.mode]||configs.noShadow[this.mode]));if(header&&configs.tallMode[this.mode]){header.classList.toggle(this.tallClass,atTop||header.classList.contains(this.tallClass)&&main.scrollHeight<this.$.outerContainer.offsetHeight)}this.fire("scroll",{target:this.scroller},this,false)}});(function(){Polymer("core-toolbar",{justify:"",middleJustify:"",bottomJustify:"",justifyChanged:function(old){this.updateBarJustify(this.$.topBar,this.justify,old)},middleJustifyChanged:function(old){this.updateBarJustify(this.$.middleBar,this.middleJustify,old)},bottomJustifyChanged:function(old){this.updateBarJustify(this.$.bottomBar,this.bottomJustify,old)},updateBarJustify:function(bar,justify,old){if(old){bar.removeAttribute(this.toLayoutAttrName(old))}if(this.justify){bar.setAttribute(this.toLayoutAttrName(justify),"")}},toLayoutAttrName:function(value){return value==="between"?"justified":value+"-justified"}})})();(function(){var SKIP_ID="meta";var metaData={},metaArray={};Polymer("core-meta",{type:"default",alwaysPrepare:true,ready:function(){this.register(this.id)},get metaArray(){var t=this.type;if(!metaArray[t]){metaArray[t]=[]}return metaArray[t]},get metaData(){var t=this.type;if(!metaData[t]){metaData[t]={}}return metaData[t]},register:function(id,old){if(id&&id!==SKIP_ID){this.unregister(this,old);this.metaData[id]=this;this.metaArray.push(this)}},unregister:function(meta,id){delete this.metaData[id||meta.id];var i=this.metaArray.indexOf(meta);if(i>=0){this.metaArray.splice(i,1)}},get list(){return this.metaArray},byId:function(id){return this.metaData[id]}})})();Polymer("core-iconset",{src:"",width:0,icons:"",iconSize:24,offsetX:0,offsetY:0,type:"iconset",created:function(){this.iconMap={};this.iconNames=[];this.themes={}},ready:function(){if(this.src&&this.ownerDocument!==document){this.src=this.resolvePath(this.src,this.ownerDocument.baseURI)}this.super();this.updateThemes()},iconsChanged:function(){var ox=this.offsetX;var oy=this.offsetY;this.icons&&this.icons.split(/\s+/g).forEach(function(name,i){this.iconNames.push(name);this.iconMap[name]={offsetX:ox,offsetY:oy};if(ox+this.iconSize<this.width){ox+=this.iconSize}else{ox=this.offsetX;oy+=this.iconSize}},this)},updateThemes:function(){var ts=this.querySelectorAll("property[theme]");ts&&ts.array().forEach(function(t){this.themes[t.getAttribute("theme")]={offsetX:parseInt(t.getAttribute("offsetX"))||0,offsetY:parseInt(t.getAttribute("offsetY"))||0}},this)},getOffset:function(icon,theme){var i=this.iconMap[icon];if(!i){var n=this.iconNames[Number(icon)];i=this.iconMap[n]}var t=this.themes[theme];if(i&&t){return{offsetX:i.offsetX+t.offsetX,offsetY:i.offsetY+t.offsetY}}return i},applyIcon:function(element,icon,scale){var offset=this.getOffset(icon);scale=scale||1;if(element&&offset){var icon=element._icon||document.createElement("div");var style=icon.style;style.backgroundImage="url("+this.src+")";style.backgroundPosition=-offset.offsetX*scale+"px"+" "+(-offset.offsetY*scale+"px");style.backgroundSize=scale===1?"auto":this.width*scale+"px";if(icon.parentNode!==element){element.appendChild(icon)}return icon}}});(function(){var meta;Polymer("core-icon",{src:"",icon:"",alt:null,observe:{icon:"updateIcon",alt:"updateAlt"},defaultIconset:"icons",ready:function(){if(!meta){meta=document.createElement("core-iconset")}if(this.hasAttribute("aria-label")){if(!this.hasAttribute("role")){this.setAttribute("role","img")}return}this.updateAlt()},srcChanged:function(){var icon=this._icon||document.createElement("div");icon.textContent="";icon.setAttribute("fit","");icon.style.backgroundImage="url("+this.src+")";icon.style.backgroundPosition="center";icon.style.backgroundSize="100%";if(!icon.parentNode){this.appendChild(icon)}this._icon=icon},getIconset:function(name){return meta.byId(name||this.defaultIconset)},updateIcon:function(oldVal,newVal){if(!this.icon){this.updateAlt();return}var parts=String(this.icon).split(":");var icon=parts.pop();if(icon){var set=this.getIconset(parts.pop());if(set){this._icon=set.applyIcon(this,icon);if(this._icon){this._icon.setAttribute("fit","")}}}if(oldVal){if(oldVal.split(":").pop()==this.getAttribute("aria-label")){this.updateAlt()}}},updateAlt:function(){if(this.getAttribute("aria-hidden")){return}if(this.alt===""){this.setAttribute("aria-hidden","true");if(this.hasAttribute("role")){this.removeAttribute("role")}if(this.hasAttribute("aria-label")){this.removeAttribute("aria-label")}}else{this.setAttribute("aria-label",this.alt||this.icon.split(":").pop());if(!this.hasAttribute("role")){this.setAttribute("role","img")}if(this.hasAttribute("aria-hidden")){this.removeAttribute("aria-hidden")}}}})})();Polymer("core-iconset-svg",{iconSize:24,type:"iconset",created:function(){this._icons={}},ready:function(){this.super();this.updateIcons()},iconById:function(id){return this._icons[id]||(this._icons[id]=this.querySelector('[id="'+id+'"]'))},cloneIcon:function(id){var icon=this.iconById(id);if(icon){var content=icon.cloneNode(true);content.removeAttribute("id");var svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("viewBox","0 0 "+this.iconSize+" "+this.iconSize);svg.style.pointerEvents="none";svg.appendChild(content);return svg}},get iconNames(){if(!this._iconNames){this._iconNames=this.findIconNames()}return this._iconNames},findIconNames:function(){var icons=this.querySelectorAll("[id]").array();if(icons.length){return icons.map(function(n){return n.id})}},applyIcon:function(element,icon){var root=element;var old=root.querySelector("svg");if(old){old.remove()}var svg=this.cloneIcon(icon);if(!svg){return}svg.setAttribute("height","100%");svg.setAttribute("width","100%");svg.setAttribute("preserveAspectRatio","xMidYMid meet");svg.style.display="block";root.insertBefore(svg,root.firstElementChild);return svg},updateIcons:function(selector,method){selector=selector||"[icon]";method=method||"updateIcon";var deep=window.ShadowDOMPolyfill?"":"html /deep/ ";var i$=document.querySelectorAll(deep+selector);for(var i=0,e;e=i$[i];i++){if(e[method]){e[method].call(e)}}}});Polymer("core-icon-button",{src:"",active:false,icon:"",activeChanged:function(){this.classList.toggle("selected",this.active)}});(function(){var waveMaxRadius=150;function waveRadiusFn(touchDownMs,touchUpMs,anim){var touchDown=touchDownMs/1e3;var touchUp=touchUpMs/1e3;var totalElapsed=touchDown+touchUp;var ww=anim.width,hh=anim.height;var waveRadius=Math.min(Math.sqrt(ww*ww+hh*hh),waveMaxRadius)*1.1+5;var duration=1.1-.2*(waveRadius/waveMaxRadius);var tt=totalElapsed/duration;var size=waveRadius*(1-Math.pow(80,-tt));return Math.abs(size)}function waveOpacityFn(td,tu,anim){var touchDown=td/1e3;var touchUp=tu/1e3;var totalElapsed=touchDown+touchUp;if(tu<=0){return anim.initialOpacity}return Math.max(0,anim.initialOpacity-touchUp*anim.opacityDecayVelocity)}function waveOuterOpacityFn(td,tu,anim){var touchDown=td/1e3;var touchUp=tu/1e3;var outerOpacity=touchDown*.3;var waveOpacity=waveOpacityFn(td,tu,anim);return Math.max(0,Math.min(outerOpacity,waveOpacity))}function waveDidFinish(wave,radius,anim){var waveOpacity=waveOpacityFn(wave.tDown,wave.tUp,anim);return waveOpacity<.01&&radius>=Math.min(wave.maxRadius,waveMaxRadius)}function waveAtMaximum(wave,radius,anim){var waveOpacity=waveOpacityFn(wave.tDown,wave.tUp,anim);return waveOpacity>=anim.initialOpacity&&radius>=Math.min(wave.maxRadius,waveMaxRadius)}function drawRipple(ctx,x,y,radius,innerAlpha,outerAlpha){if(outerAlpha!==undefined){ctx.bg.style.opacity=outerAlpha}ctx.wave.style.opacity=innerAlpha;var s=radius/(ctx.containerSize/2);var dx=x-ctx.containerWidth/2;var dy=y-ctx.containerHeight/2;ctx.wc.style.webkitTransform="translate3d("+dx+"px,"+dy+"px,0)";ctx.wc.style.transform="translate3d("+dx+"px,"+dy+"px,0)";ctx.wave.style.webkitTransform="scale("+s+","+s+")";ctx.wave.style.transform="scale3d("+s+","+s+",1)"}function createWave(elem){var elementStyle=window.getComputedStyle(elem);var fgColor=elementStyle.color;var inner=document.createElement("div");inner.style.backgroundColor=fgColor;inner.classList.add("wave");var outer=document.createElement("div");outer.classList.add("wave-container");outer.appendChild(inner);var container=elem.$.waves;container.appendChild(outer);elem.$.bg.style.backgroundColor=fgColor;var wave={bg:elem.$.bg,wc:outer,wave:inner,waveColor:fgColor,maxRadius:0,isMouseDown:false,mouseDownStart:0,mouseUpStart:0,tDown:0,tUp:0};return wave}function removeWaveFromScope(scope,wave){if(scope.waves){var pos=scope.waves.indexOf(wave);scope.waves.splice(pos,1);wave.wc.remove()}}var pow=Math.pow;var now=Date.now;if(window.performance&&performance.now){now=performance.now.bind(performance)}function cssColorWithAlpha(cssColor,alpha){var parts=cssColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);if(typeof alpha=="undefined"){alpha=1}if(!parts){return"rgba(255, 255, 255, "+alpha+")"}return"rgba("+parts[1]+", "+parts[2]+", "+parts[3]+", "+alpha+")"}function dist(p1,p2){return Math.sqrt(pow(p1.x-p2.x,2)+pow(p1.y-p2.y,2))}function distanceFromPointToFurthestCorner(point,size){var tl_d=dist(point,{x:0,y:0});var tr_d=dist(point,{x:size.w,y:0});var bl_d=dist(point,{x:0,y:size.h});var br_d=dist(point,{x:size.w,y:size.h});return Math.max(tl_d,tr_d,bl_d,br_d)}Polymer("paper-ripple",{initialOpacity:.25,opacityDecayVelocity:.8,backgroundFill:true,pixelDensity:2,eventDelegates:{down:"downAction",up:"upAction"},ready:function(){this.waves=[]},downAction:function(e){var wave=createWave(this);this.cancelled=false;wave.isMouseDown=true;wave.tDown=0;wave.tUp=0;wave.mouseUpStart=0;wave.mouseDownStart=now();var rect=this.getBoundingClientRect();var width=rect.width;var height=rect.height;var touchX=e.x-rect.left;var touchY=e.y-rect.top;wave.startPosition={x:touchX,y:touchY};if(this.classList.contains("recenteringTouch")){wave.endPosition={x:width/2,y:height/2};wave.slideDistance=dist(wave.startPosition,wave.endPosition)}wave.containerSize=Math.max(width,height);wave.containerWidth=width;wave.containerHeight=height;wave.maxRadius=distanceFromPointToFurthestCorner(wave.startPosition,{w:width,h:height});wave.wc.style.top=(wave.containerHeight-wave.containerSize)/2+"px";wave.wc.style.left=(wave.containerWidth-wave.containerSize)/2+"px";wave.wc.style.width=wave.containerSize+"px";wave.wc.style.height=wave.containerSize+"px";this.waves.push(wave);if(!this._loop){this._loop=this.animate.bind(this,{width:width,height:height});requestAnimationFrame(this._loop)}},upAction:function(){for(var i=0;i<this.waves.length;i++){var wave=this.waves[i];if(wave.isMouseDown){wave.isMouseDown=false;wave.mouseUpStart=now();wave.mouseDownStart=0;wave.tUp=0;break}}this._loop&&requestAnimationFrame(this._loop)},cancel:function(){this.cancelled=true},animate:function(ctx){var shouldRenderNextFrame=false;var deleteTheseWaves=[];var longestTouchDownDuration=0;var longestTouchUpDuration=0;var lastWaveColor=null;var anim={initialOpacity:this.initialOpacity,opacityDecayVelocity:this.opacityDecayVelocity,height:ctx.height,width:ctx.width};for(var i=0;i<this.waves.length;i++){var wave=this.waves[i];if(wave.mouseDownStart>0){wave.tDown=now()-wave.mouseDownStart}if(wave.mouseUpStart>0){wave.tUp=now()-wave.mouseUpStart}var tUp=wave.tUp;var tDown=wave.tDown;longestTouchDownDuration=Math.max(longestTouchDownDuration,tDown);longestTouchUpDuration=Math.max(longestTouchUpDuration,tUp);var radius=waveRadiusFn(tDown,tUp,anim);var waveAlpha=waveOpacityFn(tDown,tUp,anim);var waveColor=cssColorWithAlpha(wave.waveColor,waveAlpha);lastWaveColor=wave.waveColor;var x=wave.startPosition.x;var y=wave.startPosition.y;if(wave.endPosition){var translateFraction=Math.min(1,radius/wave.containerSize*2/Math.sqrt(2));x+=translateFraction*(wave.endPosition.x-wave.startPosition.x);y+=translateFraction*(wave.endPosition.y-wave.startPosition.y)}var bgFillColor=null;if(this.backgroundFill){var bgFillAlpha=waveOuterOpacityFn(tDown,tUp,anim);bgFillColor=cssColorWithAlpha(wave.waveColor,bgFillAlpha)}drawRipple(wave,x,y,radius,waveAlpha,bgFillAlpha);var maximumWave=waveAtMaximum(wave,radius,anim);var waveDissipated=waveDidFinish(wave,radius,anim);var shouldKeepWave=!waveDissipated||maximumWave;var shouldRenderWaveAgain=wave.mouseUpStart?!waveDissipated:!maximumWave;shouldRenderNextFrame=shouldRenderNextFrame||shouldRenderWaveAgain;if(!shouldKeepWave||this.cancelled){deleteTheseWaves.push(wave)}}if(shouldRenderNextFrame){requestAnimationFrame(this._loop)}for(var i=0;i<deleteTheseWaves.length;++i){var wave=deleteTheseWaves[i];removeWaveFromScope(this,wave)}if(!this.waves.length&&this._loop){this.$.bg.style.backgroundColor=null;this._loop=null;this.fire("core-transitionend")}}})})();Polymer("eh-contact",{contactInfo:null,onTap:function(event,detail,sender){sendEhTo(this.contactInfo);this.contactInfo.lastEhTime=new Date}});Polymer("eh-contact-list",{contacts:[]});