    /**
     *  1:  必须要引入store.js座位依赖
     *  2： 设置值储存的时候必须传2个参数，值对应的key（String），值对应的储存对象（Object） 建议将页面的跳转写入储存完成的回调中
     *  3:  默认的过期时长为60分钟(可自定义传参)
     *  4： 请求储存值的时候，会有一个状态码：默认为status, 0：代表缓存已被清除，200：代表正常请求成功
     */
    
    /**
     * 储存
     * @param {String} key  (储存的数据id)
     * @param {Object} data (需要储存的对象)
     * @param {Function} success (储存完成的回调)
     * @param {Number} time  (储存的时长:单位/分钟)
     */
    function setLocation(key,data,success,time){
        if(!arguments.length) throw new Error('储存失败，请为"setLocation"传入参数: *参数1（String）：储存值的id,  *参数2（Object）：需要储存的对象，参数3（Function）:储存成功的回调。   （*：代表必传）');
        if(Object.prototype.toString.call(key) !== "[object String]") throw new Error('储存失败，key值必须是一个字符串！');
        if(!data || Object.prototype.toString.call(data) !== "[object Object]") throw new Error('储存失败，被储存的数据必须是一个对象（Object）!');
        var time = (+time || 60)*60*1000,//默认储存时长为60分钟
        nowTime = new Date().getTime(); // 当前时间
        data.storeTime = nowTime + time
        clearOVtimeLocation();
        store.set(key,data);
        if(success && Object.prototype.toString.call(success) === "[object Function]") {
            success(key,data);
        }
    }
    
    /**
     * 读取
     * @param {String} key （String）(需要读取的数据id)
     * @param {String} status (String)（自定义标识符,0：代表缓存已经清空，200：代表请求的数据成功）
     */
    function getLocation(key,status){
        if(!arguments.length) throw new Error('请传入参数: *参数1（String）：储存值的id, （*：代表必传）');
        if(Object.prototype.toString.call(key) !== "[object String]") throw new Error('读取失败，key值必须是一个字符串！');
        clearOVtimeLocation();
        var val =  store.get(key);
        if(!val){
            val = {};
            val[status || 'status'] = 0;
        }  else{ 
            val[status || 'status'] = 200; 
        }
        return val;
    }

    /**
     * 清除所有过期缓存
     * 给2秒钟异步，让其不影响页面的加载速度
     */ 
    function clearOVtimeLocation(){
        setTimeout(function(){ 
            var data = store.getAll();
            if(JSON.stringify(data) === '{}') return;
            var nowTime = new Date().getTime();
            for(var key in data){
                if(data[key] && data[key].storeTime && nowTime > data[key].storeTime){
                    store.remove(key)
                }
            }
        },2000)
    }
